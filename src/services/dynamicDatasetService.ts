import { DATA_SOURCE_REGISTRY, DataSourceConfig } from '@/config/dataSources'

export interface DynamicDataset {
  name: string
  unit: string
  baseValue: number
  trend: number
  seasonal: boolean
  category: string
  dataSource: string
  sourceKey: string
  fileName: string
}

export interface DatasetMetadata {
  title: string
  description: string
  unit: string
  category: string
  source: string
  lastUpdated: string
  seasonal?: boolean
  trend?: number
  baseValue?: number
}

/**
 * Service to dynamically discover and create datasets from actual data files
 */
export class DynamicDatasetService {
  private cachedDatasets: DynamicDataset[] | null = null
  private cacheTimestamp: number = 0
  private readonly CACHE_DURATION = 5 * 60 * 1000 // 5 minutes

  /**
   * Check if cached datasets are still valid
   */
  private isCacheValid(): boolean {
    return this.cachedDatasets !== null && (Date.now() - this.cacheTimestamp) < this.CACHE_DURATION
  }

  /**
   * Discover all available datasets from actual data files
   */
  async discoverDatasets(): Promise<DynamicDataset[]> {
    if (this.isCacheValid()) {
      return this.cachedDatasets!
    }

    const datasets: DynamicDataset[] = []

    // Process each source from the registry
    for (const config of DATA_SOURCE_REGISTRY) {
      if (config.key === 'AI') continue // Skip AI source
      
      try {
        const sourceDatasets = await this.discoverDatasetsForSource(config)
        datasets.push(...sourceDatasets)
      } catch (error) {
        console.warn(`Failed to discover datasets for ${config.key}:`, error)
      }
    }

    this.cachedDatasets = datasets
    this.cacheTimestamp = Date.now()
    return datasets
  }

  /**
   * Discover datasets for a specific data source by scanning actual files
   */
  private async discoverDatasetsForSource(config: DataSourceConfig): Promise<DynamicDataset[]> {
    const datasets: DynamicDataset[] = []
    
    if (!config.dataPath) {
      return datasets
    }

    try {
      // Get known files for this source - but only try files that might exist
      const knownFiles = this.getKnownFilesForSource(config.key)
      
      // For efficiency, only try a subset of files if there are many
      const filesToTry = knownFiles.length > 20 ? knownFiles.slice(0, 10) : knownFiles
      
      for (const fileName of filesToTry) {
        try {
          // Try to load the actual data file
          const response = await fetch(`${config.dataPath}${fileName}`)
          if (!response.ok) {
            // Silently skip missing files - no need to log every 404
            continue
          }

          // Check if response is actually JSON
          const contentType = response.headers.get('content-type')
          if (!contentType || !contentType.includes('application/json')) {
            // Skip non-JSON responses (likely HTML error pages)
            continue
          }

          const data = await response.json()
          
          // Skip metadata loading - files don't exist and aren't needed
          // Metadata is optional and can be generated from the data itself
          const metadata: DatasetMetadata | null = null

          // Create dataset from actual file data
          const dataset = this.createDatasetFromFile(fileName, data, metadata, config)
          if (dataset) {
            datasets.push(dataset)
          }
        } catch (error) {
          // Only log actual errors, not missing files
          if (error instanceof SyntaxError && error.message.includes('Unexpected token')) {
            // This is likely an HTML page returned instead of JSON - skip silently
            continue
          }
          // Suppress most errors to reduce console noise
          // console.warn(`Failed to process file ${fileName} for ${config.key}:`, error)
        }
      }
    } catch (error) {
      console.warn(`Failed to discover datasets for source ${config.key}:`, error)
    }

    return datasets
  }

  /**
   * Create a dataset object from actual file data
   */
  private createDatasetFromFile(
    fileName: string, 
    data: any, 
    metadata: DatasetMetadata | null, 
    config: DataSourceConfig
  ): DynamicDataset | null {
    try {
      // Extract dataset name from filename or metadata
      const baseName = fileName.replace('.json', '')
      const datasetName = metadata?.title || this.formatDatasetName(baseName)
      
      // Analyze actual data to extract characteristics
      const analysis = this.analyzeDataFile(data)
      
      if (!analysis) {
        return null
      }

      // Map source category to dataset category
      const categoryMap: Record<string, string> = {
        'economics': 'economics',
        'financial': 'finance', 
        'climate': 'climate',
        'space': 'space',
        'geology': 'geology',
        'energy': 'energy',
        'health': 'health',
        'synthetic': 'technology',
        'cryptocurrency': 'finance',
        'international': 'trade',
        'environmental': 'environment',
        'retail': 'economics',
        'demographics': 'demographics',
        'crime': 'social',
        'education': 'education',
        'housing': 'economics',
        'social': 'social'
      }

      return {
        name: datasetName,
        unit: metadata?.unit || analysis.unit || 'units',
        baseValue: metadata?.baseValue || analysis.baseValue,
        trend: metadata?.trend || analysis.trend,
        seasonal: metadata?.seasonal || analysis.seasonal,
        category: metadata?.category || categoryMap[config.category] || 'economics',
        dataSource: config.name,
        sourceKey: config.key,
        fileName: fileName
      }
    } catch (error) {
      console.warn(`Failed to create dataset from file ${fileName}:`, error)
      return null
    }
  }

  /**
   * Analyze actual data file to extract characteristics
   */
  private analyzeDataFile(data: any): { baseValue: number; trend: number; seasonal: boolean; unit: string } | null {
    try {
      if (!Array.isArray(data) || data.length === 0) {
        return null
      }

      // Find numeric values in the data
      const values: number[] = []
      
      for (const item of data) {
        if (typeof item === 'object' && item !== null) {
          // Look for common value fields
          const valueFields = ['value', 'price', 'rate', 'index', 'count', 'amount', 'level', 'percentage']
          
          for (const field of valueFields) {
            if (typeof item[field] === 'number' && !isNaN(item[field])) {
              values.push(item[field])
            }
          }
          
          // Also check for any numeric field
          for (const [key, val] of Object.entries(item)) {
            if (typeof val === 'number' && !isNaN(val) && key !== 'year' && key !== 'date') {
              values.push(val)
              break // Take first numeric field found
            }
          }
        }
      }

      if (values.length === 0) {
        return {
          baseValue: 100,
          trend: 0.02,
          seasonal: false,
          unit: 'units'
        }
      }

      // Calculate characteristics from actual data
      const baseValue = values[0] || 100
      const lastValue = values[values.length - 1] || baseValue
      
      // Calculate trend from first to last value
      const yearSpan = Math.max(1, values.length - 1)
      const totalChange = (lastValue - baseValue) / baseValue
      const trend = totalChange / yearSpan

      // Detect seasonality by checking for cyclical patterns
      const seasonal = this.detectSeasonality(values)

      // Guess unit based on value ranges
      const unit = this.guessUnit(baseValue)

      return {
        baseValue: Math.abs(baseValue),
        trend: isNaN(trend) ? 0.02 : Math.max(-0.5, Math.min(0.5, trend)),
        seasonal,
        unit
      }
    } catch (error) {
      return {
        baseValue: 100,
        trend: 0.02,
        seasonal: false,
        unit: 'units'
      }
    }
  }

  /**
   * Detect seasonality in data
   */
  private detectSeasonality(values: number[]): boolean {
    if (values.length < 4) return false
    
    try {
      // Simple seasonality detection: check if there's a cyclical pattern
      const midPoint = Math.floor(values.length / 2)
      const firstHalf = values.slice(0, midPoint)
      const secondHalf = values.slice(midPoint)
      
      // Check if patterns repeat
      const firstAvg = firstHalf.reduce((a, b) => a + b, 0) / firstHalf.length
      const secondAvg = secondHalf.reduce((a, b) => a + b, 0) / secondHalf.length
      
      // If the variation is significant, it might be seasonal
      const variation = Math.abs(firstAvg - secondAvg) / firstAvg
      return variation > 0.1
    } catch {
      return false
    }
  }

  /**
   * Guess appropriate unit based on value range
   */
  private guessUnit(value: number): string {
    const absValue = Math.abs(value)
    
    if (absValue >= 1000000000) return 'billions'
    if (absValue >= 1000000) return 'millions'
    if (absValue >= 1000) return 'thousands'
    if (absValue >= 100) return 'index'
    if (absValue >= 1) return 'percentage'
    return 'ratio'
  }

  /**
   * Format dataset name from filename
   */
  private formatDatasetName(baseName: string): string {
    // Enhanced mapping for real dataset names to more descriptive titles
    const datasetNameMap: Record<string, string> = {
      // NASA datasets
      'asteroid_count': 'Near-Earth Asteroid Count',
      'earth_temperature': 'Global Earth Temperature',
      'solar_activity': 'Solar Activity Index',
      'space_missions': 'Active Space Missions',
      'mars_data': 'Mars Atmospheric Data',
      'nasa_neo_count': 'NASA Near-Earth Objects',
      'nasa_space_weather': 'Space Weather Events',
      'nasa_apod_trends': 'Astronomy Picture Trends',
      'nasa_earth_observation': 'Earth Observation Data',
      'nasa_mars_weather': 'Mars Weather Monitoring',
      
      // USGS datasets
      'earthquake_data': 'Earthquake Activity',
      'volcano_activity': 'Volcanic Activity Index',
      'groundwater_levels': 'Groundwater Level Measurements',
      'mineral_production': 'Mineral Production Statistics',
      'usgs_daily_earthquakes': 'Daily Earthquake Count',
      'usgs_seismic_magnitude': 'Seismic Magnitude Readings',
      'usgs_significant_earthquakes': 'Significant Earthquakes',
      'usgs_seismic_activity_index': 'Seismic Activity Index',
      
      // EIA datasets
      'eia_crude_oil_prices': 'Crude Oil Prices',
      'eia_natural_gas_prices': 'Natural Gas Prices',
      'eia_electricity_generation': 'Electricity Generation',
      'eia_renewable_energy': 'Renewable Energy Production',
      'eia_petroleum_consumption': 'Petroleum Consumption',
      
      // BLS datasets
      'employment_stats': 'Employment Statistics',
      'wage_data': 'Wage and Salary Data',
      'bls_consumer_price_index': 'Consumer Price Index',
      'bls_producer_price_index': 'Producer Price Index',
      
      // CDC datasets
      'health_statistics': 'Public Health Statistics',
      'cdc_covid_deaths': 'COVID-19 Death Statistics',
      
      // Nasdaq datasets
      'nasdaq_composite_index': 'NASDAQ Composite Index',
      'nasdaq_tech_etf': 'Technology ETF Performance',
      'nasdaq_bond_index': 'Bond Index Performance',
      'nasdaq_emerging_markets': 'Emerging Markets Index',
      'nasdaq_commodities': 'Commodities Index',
      
      // FRED datasets
      'gdp': 'Gross Domestic Product',
      'unemployment': 'Unemployment Rate',
      'inflation': 'Inflation Rate',
      'interest_rate': 'Federal Interest Rate',
      'housing_starts': 'Housing Construction Starts',
      'personal_income': 'Personal Income Growth',
      'retail_sales': 'Retail Sales Volume',
      'consumer_sentiment': 'Consumer Sentiment Index',
      'industrial_production': 'Industrial Production Index',
      'labor_force_participation': 'Labor Force Participation Rate',
      'median_household_income': 'Median Household Income',
      'exports': 'Export Volume',
      'imports': 'Import Volume',
      'government_debt': 'Government Debt Levels',
      'money_supply': 'Money Supply (M2)',
      'construction_spending': 'Construction Spending',
      'manufacturing_employment': 'Manufacturing Employment',
      
      // WorldBank datasets
      'wb_gdp_per_capita': 'GDP Per Capita',
      'wb_population': 'World Population',
      'wb_life_expectancy': 'Life Expectancy',
      'wb_co2_emissions': 'CO2 Emissions',
      'wb_energy_use': 'Energy Consumption',
      'wb_internet_users': 'Internet Users Percentage',
      'wb_mobile_subscriptions': 'Mobile Phone Subscriptions',
      'wb_school_enrollment': 'School Enrollment Rate',
      'wb_urban_population': 'Urban Population Percentage',
      'wb_inflation_rate': 'Inflation Rate (World Bank)',
      'wb_trade_balance': 'Trade Balance',
      'wb_foreign_investment': 'Foreign Direct Investment',
      
      // AlphaVantage datasets
      'av_aapl_price': 'Apple Stock Price',
      'av_nasdaq_index': 'NASDAQ Index',
      'av_spy_price': 'S&P 500 ETF Price',
      'stock_market': 'Stock Market Index',
      'oil_price': 'Oil Price',
      'gold_price': 'Gold Price',
      
      // OpenWeather datasets
      'ow_global_temp': 'Global Temperature',
      'ow_climate_pressure': 'Atmospheric Pressure',
      'ow_humidity': 'Global Humidity Levels',
      'ow_precipitation': 'Precipitation Patterns',
      'ow_uv_index': 'UV Index Measurements',
      'ow_wind_patterns': 'Wind Pattern Analysis',
      
      // Crypto datasets
      'bitcoin_price': 'Bitcoin Price',
      'ethereum_price': 'Ethereum Price',
      'cardano_price': 'Cardano Price',
      'solana_price': 'Solana Price',
      'global_market_cap': 'Global Crypto Market Cap',
      'trending_coins': 'Trending Cryptocurrencies',
      'defi_data': 'DeFi Protocol Data',
      
      // OECD datasets
      'gdp_data': 'OECD GDP Data',
      'inflation_data': 'OECD Inflation Data',
      'unemployment_data': 'OECD Unemployment Data',
      'economic_outlook': 'OECD Economic Outlook',
      'leading_indicators': 'OECD Leading Indicators',
      'trade_transport': 'OECD Trade & Transport',
      
      // Air Quality datasets
      'beijing_aqi': 'Beijing Air Quality Index',
      'london_aqi': 'London Air Quality Index',
      'newyork_aqi': 'New York Air Quality Index',
      'tokyo_aqi': 'Tokyo Air Quality Index',
      'losangeles_aqi': 'Los Angeles Air Quality Index',
      'paris_aqi': 'Paris Air Quality Index',
      'mumbai_aqi': 'Mumbai Air Quality Index',
      'global_summary': 'Global Air Quality Summary'
    }
    
    // Check if we have a specific mapping for this dataset
    const fileName = baseName.toLowerCase().replace('.json', '')
    if (datasetNameMap[fileName]) {
      return datasetNameMap[fileName]
    }
    
    // Fallback: format the base name nicely
    return baseName
      .split(/[_-\s]+/)
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ')
  }

  /**
   * Get known files for each data source
   */
  private getKnownFilesForSource(sourceKey: string): string[] {
    const fileMap: Record<string, string[]> = {
      'FRED': [
        'gdp.json',
        'unemployment.json',
        'inflation.json',
        'interest_rate.json',
        'housing_starts.json',
        'personal_income.json',
        'retail_sales.json',
        'consumer_sentiment.json',
        'industrial_production.json',
        'labor_force_participation.json',
        'median_household_income.json',
        'exports.json',
        'imports.json',
        'government_debt.json',
        'money_supply.json',
        'manufacturing_employment.json',
        'construction_spending.json'
      ],
      'WorldBank': [
        'wb_gdp_per_capita.json',
        'wb_population.json',
        'wb_life_expectancy.json',
        'wb_co2_emissions.json',
        'wb_internet_users.json',
        'wb_mobile_subscriptions.json',
        'wb_urban_population.json',
        'wb_energy_use.json',
        'wb_trade_balance.json',
        'wb_foreign_investment.json',
        'wb_school_enrollment.json',
        'wb_inflation_rate.json'
      ],
      'AlphaVantage': [
        'stock_market.json',
        'av_spy_price.json',
        'oil_price.json',
        'gold_price.json',
        'av_aapl_price.json',
        'av_nasdaq_index.json'
      ],
      'OpenWeather': [
        'ow_global_temp.json',
        'ow_climate_pressure.json',
        'ow_humidity.json',
        'ow_precipitation.json',
        'ow_uv_index.json',
        'ow_wind_patterns.json'
      ],
      'CoinGecko': [
        'bitcoin_price.json',
        'ethereum_price.json',
        'cardano_price.json',
        'solana_price.json',
        'trending_coins.json',
        'defi_data.json',
        'global_market_cap.json'
      ],
      'OECD': [
        'gdp_data.json',
        'inflation_data.json',
        'unemployment_data.json',
        'economic_outlook.json',
        'leading_indicators.json',
        'trade_transport.json'
      ],
      'WorldAirQuality': [
        'beijing_aqi.json',
        'london_aqi.json',
        'losangeles_aqi.json',
        'mumbai_aqi.json',
        'newyork_aqi.json',
        'paris_aqi.json',
        'tokyo_aqi.json',
        'global_summary.json'
      ],
      'NCHS': [
        // Only include files that actually exist
        'covid_deaths_state.json'
      ],
      'Census': [
        // Reduce to essential files only - most don't exist
      ],
      'FBI': [
        // Reduce to essential files only - most don't exist
      ],
      'NCES': [
        // Reduce to essential files only - most don't exist
      ],
      'HUD': [
        // Reduce to essential files only - most don't exist
      ],
      'Pew': [
        // Reduce to essential files only - most don't exist
      ],
      'BEA': [
        // Reduce to essential files only - most don't exist
      ],
      'DOT': [
        // Reduce to essential files only - most don't exist
      ],
      'NASA': [
        'asteroid_count.json',
        'earth_temperature.json',
        'mars_data.json',
        'nasa_apod_trends.json',
        'nasa_earth_observation.json',
        'nasa_mars_weather.json',
        'nasa_neo_count.json',
        'nasa_space_weather.json',
        'solar_activity.json',
        'space_missions.json'
      ],
      'USGS': [
        'earthquake_data.json',
        'groundwater_levels.json',
        'mineral_production.json',
        'usgs_daily_earthquakes.json',
        'usgs_seismic_activity_index.json',
        'usgs_seismic_magnitude.json',
        'usgs_significant_earthquakes.json',
        'volcano_activity.json'
      ],
      'EIA': [
        'eia_crude_oil_prices.json',
        'eia_natural_gas_prices.json',
        'eia_electricity_generation.json',
        'eia_renewable_energy.json',
        'eia_petroleum_consumption.json'
      ],
      'BLS': [
        'employment_stats.json',
        'wage_data.json',
        'bls_consumer_price_index.json',
        'bls_producer_price_index.json'
      ],
      'CDC': [
        'health_statistics.json',
        'cdc_covid_deaths.json'
      ],
      'Nasdaq': [
        'nasdaq_composite_index.json',
        'nasdaq_bond_index.json',
        'nasdaq_commodities.json',
        'nasdaq_emerging_markets.json',
        'nasdaq_tech_etf.json'
      ]
    }

    return fileMap[sourceKey] || []
  }

  /**
   * Get datasets by category
   */
  async getDatasetsByCategory(category: string): Promise<DynamicDataset[]> {
    const allDatasets = await this.discoverDatasets()
    return allDatasets.filter(dataset => dataset.category === category)
  }

  /**
   * Get all available categories
   */
  async getAvailableCategories(): Promise<string[]> {
    const allDatasets = await this.discoverDatasets()
    const categories = new Set(allDatasets.map(dataset => dataset.category))
    return Array.from(categories)
  }

  /**
   * Clear cache to force re-discovery
   */
  clearCache(): void {
    this.cachedDatasets = null
    this.cacheTimestamp = 0
  }
}