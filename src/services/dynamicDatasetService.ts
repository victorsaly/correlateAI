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
      // Get known files for this source
      const knownFiles = this.getKnownFilesForSource(config.key)
      
      for (const fileName of knownFiles) {
        try {
          // Try to load the actual data file
          const response = await fetch(`${config.dataPath}${fileName}`)
          if (!response.ok) continue

          const data = await response.json()
          
          // Try to load metadata file
          const metadataFileName = fileName.replace('.json', '_metadata.json')
          let metadata: DatasetMetadata | null = null
          
          try {
            const metadataResponse = await fetch(`${config.dataPath}${metadataFileName}`)
            if (metadataResponse.ok) {
              metadata = await metadataResponse.json()
            }
          } catch (e) {
            // Metadata is optional
          }

          // Create dataset from actual file data
          const dataset = this.createDatasetFromFile(fileName, data, metadata, config)
          if (dataset) {
            datasets.push(dataset)
          }
        } catch (error) {
          console.warn(`Failed to process file ${fileName} for ${config.key}:`, error)
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
      const baseName = fileName.replace('.json', '').replace(/^.*_/, '').replace(/-/g, ' ')
      const datasetName = metadata?.title || this.formatDatasetName(baseName)
      
      // Analyze actual data to extract characteristics
      const analysis = this.analyzeDataFile(data)
      
      if (!analysis) {
        return null
      }

      // Map source category to dataset category
      const categoryMap: Record<string, string> = {
        'economics': 'economics',
        'financial': 'economics', 
        'climate': 'weather',
        'space': 'technology',
        'geology': 'weather',
        'energy': 'economics',
        'health': 'health',
        'synthetic': 'technology'
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
        'ow_climate_pressure.json'
      ],
      'NASA': [
        'nasa/asteroid_count.json',
        'nasa/earth_temperature.json',
        'nasa/solar_activity.json',
        'nasa/space_missions.json',
        'nasa/satellite_data.json'
      ],
      'USGS': [
        'usgs/earthquake_data.json',
        'usgs/volcano_activity.json',
        'usgs/groundwater_levels.json',
        'usgs/mineral_production.json'
      ],
      'EIA': [
        'eia/crude_oil_production.json',
        'eia/natural_gas_prices.json',
        'eia/electricity_generation.json',
        'eia/renewable_capacity.json',
        'eia/energy_consumption.json'
      ],
      'BLS': [
        'bls/employment_stats.json',
        'bls/wage_data.json'
      ],
      'CDC': [
        'cdc/health_statistics.json'
      ],
      'NasdaqDataLink': [
        'nasdaq/nasdaq_composite.json',
        'nasdaq/treasury_rates.json',
        'nasdaq/volatility_index.json',
        'nasdaq/commodity_prices.json',
        'nasdaq/currency_rates.json'
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