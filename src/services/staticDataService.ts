// Static data service - reads from prefetched JSON files
export interface RealDataPoint {
  year: number
  value: number
}

export interface RealDataset {
  id: string
  name: string
  unit: string
  source: string
  seriesId: string
  category: string
  description: string
  isAIGenerated?: boolean
  citation?: string
  sourceUrl?: string
  filename?: string
  aiGeneratedAt?: string
}

export interface CorrelationResult {
  dataset1: RealDataset
  dataset2: RealDataset
  correlation: number
  rSquared: number
  significance: string
  description: string
  data1: RealDataPoint[]
  data2: RealDataPoint[]
  isRealData: boolean
}

// Dataset definitions - now just metadata since data comes from JSON files
const realDatasets: RealDataset[] = [
  // FRED API - US Economic Data
  {
    id: 'gdp',
    name: 'US GDP',
    unit: 'billions USD',
    source: 'FRED (Federal Reserve Economic Data)',
    sourceUrl: 'https://fred.stlouisfed.org/series/GDP',
    seriesId: 'GDP',
    category: 'economics',
    description: 'Gross Domestic Product'
  },
  {
    id: 'unemployment',
    name: 'Unemployment Rate',
    unit: 'percent',
    source: 'FRED (Federal Reserve Economic Data)',
    sourceUrl: 'https://fred.stlouisfed.org/series/UNRATE',
    seriesId: 'UNRATE',
    category: 'economics',
    description: 'Unemployment Rate'
  },
  {
    id: 'inflation',
    name: 'Consumer Price Index',
    unit: 'index',
    source: 'FRED (Federal Reserve Economic Data)',
    sourceUrl: 'https://fred.stlouisfed.org/series/CPIAUCSL',
    seriesId: 'CPIAUCSL',
    category: 'economics',
    description: 'Consumer Price Index for All Urban Consumers'
  },
  {
    id: 'interest_rate',
    name: 'Federal Funds Rate',
    unit: 'percent',
    source: 'FRED (Federal Reserve Economic Data)',
    sourceUrl: 'https://fred.stlouisfed.org/series/FEDFUNDS',
    seriesId: 'FEDFUNDS',
    category: 'economics',
    description: 'Effective Federal Funds Rate'
  },
  {
    id: 'housing_starts',
    name: 'Housing Starts',
    unit: 'thousands',
    source: 'FRED (Federal Reserve Economic Data)',
    sourceUrl: 'https://fred.stlouisfed.org/series/HOUST',
    seriesId: 'HOUST',
    category: 'economics',
    description: 'Housing Starts: Total: New Privately Owned Housing Units Started'
  },
  {
    id: 'personal_income',
    name: 'Personal Income',
    unit: 'billions USD',
    source: 'FRED (Federal Reserve Economic Data)',
    sourceUrl: 'https://fred.stlouisfed.org/series/PI',
    seriesId: 'PI',
    category: 'economics',
    description: 'Personal Income'
  },
  {
    id: 'retail_sales',
    name: 'Retail Sales',
    unit: 'millions USD',
    source: 'FRED (Federal Reserve Economic Data)',
    sourceUrl: 'https://fred.stlouisfed.org/series/RSAFS',
    seriesId: 'RSAFS',
    category: 'economics',
    description: 'Advance Retail Sales: Retail and Food Services'
  },
  {
    id: 'consumer_sentiment',
    name: 'Consumer Sentiment',
    unit: 'index',
    source: 'FRED (Federal Reserve Economic Data)',
    sourceUrl: 'https://fred.stlouisfed.org/series/UMCSENT',
    seriesId: 'UMCSENT',
    category: 'economics',
    description: 'University of Michigan: Consumer Sentiment'
  },
  {
    id: 'industrial_production',
    name: 'Industrial Production',
    unit: 'index',
    source: 'FRED (Federal Reserve Economic Data)',
    sourceUrl: 'https://fred.stlouisfed.org/series/INDPRO',
    seriesId: 'INDPRO',
    category: 'economics',
    description: 'Industrial Production: Total Index'
  },
  {
    id: 'stock_market',
    name: 'S&P 500',
    unit: 'index',
    source: 'FRED (Federal Reserve Economic Data)',
    sourceUrl: 'https://fred.stlouisfed.org/series/SP500',
    seriesId: 'SP500',
    category: 'finance',
    description: 'S&P 500 Stock Price Index'
  },
  {
    id: 'oil_price',
    name: 'Oil Price',
    unit: 'USD per barrel',
    source: 'FRED (Federal Reserve Economic Data)',
    sourceUrl: 'https://fred.stlouisfed.org/series/DCOILWTICO',
    seriesId: 'DCOILWTICO',
    category: 'commodities',
    description: 'Crude Oil Prices: West Texas Intermediate'
  },
  {
    id: 'gold_price',
    name: 'Gold Price',
    unit: 'USD per ounce',
    source: 'FRED (Federal Reserve Economic Data)',
    sourceUrl: 'https://fred.stlouisfed.org/series/GOLDAMGBD228NLBM',
    seriesId: 'GOLDAMGBD228NLBM',
    category: 'commodities',
    description: 'Gold Fixing Price 10:30 A.M. (London time)'
  },
  {
    id: 'labor_force_participation',
    name: 'Labor Force Participation',
    unit: 'percent',
    source: 'FRED (Federal Reserve Economic Data)',
    sourceUrl: 'https://fred.stlouisfed.org/series/CIVPART',
    seriesId: 'CIVPART',
    category: 'demographics',
    description: 'Labor Force Participation Rate'
  },
  {
    id: 'median_household_income',
    name: 'Median Household Income',
    unit: 'USD',
    source: 'FRED (Federal Reserve Economic Data)',
    sourceUrl: 'https://fred.stlouisfed.org/series/MEHOINUSA646N',
    seriesId: 'MEHOINUSA646N',
    category: 'demographics',
    description: 'Real Median Household Income'
  },
  {
    id: 'exports',
    name: 'US Exports',
    unit: 'billions USD',
    source: 'FRED (Federal Reserve Economic Data)',
    sourceUrl: 'https://fred.stlouisfed.org/series/EXPGS',
    seriesId: 'EXPGS',
    category: 'trade',
    description: 'Exports of Goods and Services'
  },
  {
    id: 'imports',
    name: 'US Imports',
    unit: 'billions USD',
    source: 'FRED (Federal Reserve Economic Data)',
    sourceUrl: 'https://fred.stlouisfed.org/series/IMPGS',
    seriesId: 'IMPGS',
    category: 'trade',
    description: 'Imports of Goods and Services'
  },
  {
    id: 'government_debt',
    name: 'Federal Debt',
    unit: 'millions USD',
    source: 'FRED (Federal Reserve Economic Data)',
    sourceUrl: 'https://fred.stlouisfed.org/series/GFDEBTN',
    seriesId: 'GFDEBTN',
    category: 'economics',
    description: 'Federal Debt: Total Public Debt'
  },
  {
    id: 'money_supply',
    name: 'Money Supply M2',
    unit: 'billions USD',
    source: 'FRED (Federal Reserve Economic Data)',
    sourceUrl: 'https://fred.stlouisfed.org/series/M2SL',
    seriesId: 'M2SL',
    category: 'finance',
    description: 'M2 Money Stock'
  },
  {
    id: 'manufacturing_employment',
    name: 'Manufacturing Employment',
    unit: 'thousands',
    source: 'FRED (Federal Reserve Economic Data)',
    sourceUrl: 'https://fred.stlouisfed.org/series/MANEMP',
    seriesId: 'MANEMP',
    category: 'economics',
    description: 'All Employees, Manufacturing'
  },
  {
    id: 'construction_spending',
    name: 'Construction Spending',
    unit: 'millions USD',
    source: 'FRED (Federal Reserve Economic Data)',
    sourceUrl: 'https://fred.stlouisfed.org/series/TTLCONS',
    seriesId: 'TTLCONS',
    category: 'economics',
    description: 'Total Construction Spending'
  },

  // World Bank Data - Global Indicators
  {
    id: 'wb_gdp_per_capita',
    name: 'GDP Per Capita (World Bank)',
    unit: 'USD',
    source: 'World Bank Open Data',
    sourceUrl: 'https://data.worldbank.org/indicator/NY.GDP.PCAP.CD',
    seriesId: 'NY.GDP.PCAP.CD',
    category: 'economics',
    description: 'GDP per capita (current US$)'
  },
  {
    id: 'wb_population',
    name: 'Population (World Bank)',
    unit: 'people',
    source: 'World Bank Open Data',
    sourceUrl: 'https://data.worldbank.org/indicator/SP.POP.TOTL',
    seriesId: 'SP.POP.TOTL',
    category: 'demographics',
    description: 'Population, total'
  },
  {
    id: 'wb_life_expectancy',
    name: 'Life Expectancy (World Bank)',
    unit: 'years',
    source: 'World Bank Open Data',
    sourceUrl: 'https://data.worldbank.org/indicator/SP.DYN.LE00.IN',
    seriesId: 'SP.DYN.LE00.IN',
    category: 'demographics',
    description: 'Life expectancy at birth, total (years)'
  },
  {
    id: 'wb_co2_emissions',
    name: 'CO2 Emissions (World Bank)',
    unit: 'metric tons per capita',
    source: 'World Bank Open Data',
    sourceUrl: 'https://data.worldbank.org/indicator/EN.ATM.CO2E.PC',
    seriesId: 'EN.ATM.CO2E.PC',
    category: 'environment',
    description: 'CO2 emissions (metric tons per capita)'
  },
  {
    id: 'wb_internet_users',
    name: 'Internet Users (World Bank)',
    unit: 'percent of population',
    source: 'World Bank Open Data',
    sourceUrl: 'https://data.worldbank.org/indicator/IT.NET.USER.ZS',
    seriesId: 'IT.NET.USER.ZS',
    category: 'technology',
    description: 'Individuals using the Internet (% of population)'
  },
  {
    id: 'wb_mobile_subscriptions',
    name: 'Mobile Subscriptions (World Bank)',
    unit: 'per 100 people',
    source: 'World Bank Open Data',
    sourceUrl: 'https://data.worldbank.org/indicator/IT.CEL.SETS.P2',
    seriesId: 'IT.CEL.SETS.P2',
    category: 'technology',
    description: 'Mobile cellular subscriptions (per 100 people)'
  },
  {
    id: 'wb_urban_population',
    name: 'Urban Population (World Bank)',
    unit: 'percent of total',
    source: 'World Bank Open Data',
    sourceUrl: 'https://data.worldbank.org/indicator/SP.URB.TOTL.IN.ZS',
    seriesId: 'SP.URB.TOTL.IN.ZS',
    category: 'demographics',
    description: 'Urban population (% of total population)'
  },
  {
    id: 'wb_energy_use',
    name: 'Energy Use (World Bank)',
    unit: 'kg of oil equivalent per capita',
    source: 'World Bank Open Data',
    sourceUrl: 'https://data.worldbank.org/indicator/EG.USE.PCAP.KG.OE',
    seriesId: 'EG.USE.PCAP.KG.OE',
    category: 'environment',
    description: 'Energy use (kg of oil equivalent per capita)'
  },
  {
    id: 'wb_trade_balance',
    name: 'Trade Balance (World Bank)',
    unit: 'percent of GDP',
    source: 'World Bank Open Data',
    sourceUrl: 'https://data.worldbank.org/indicator/NE.RSB.GNFS.ZS',
    seriesId: 'NE.RSB.GNFS.ZS',
    category: 'trade',
    description: 'External balance on goods and services (% of GDP)'
  },
  {
    id: 'wb_foreign_investment',
    name: 'Foreign Direct Investment (World Bank)',
    unit: 'percent of GDP',
    source: 'World Bank Open Data',
    sourceUrl: 'https://data.worldbank.org/indicator/BX.KLT.DINV.WD.GD.ZS',
    seriesId: 'BX.KLT.DINV.WD.GD.ZS',
    category: 'economics',
    description: 'Foreign direct investment, net inflows (% of GDP)'
  },
  {
    id: 'wb_school_enrollment',
    name: 'School Enrollment (World Bank)',
    unit: 'percent gross',
    source: 'World Bank Open Data',
    sourceUrl: 'https://data.worldbank.org/indicator/SE.TER.ENRR',
    seriesId: 'SE.TER.ENRR',
    category: 'education',
    description: 'School enrollment, tertiary (% gross)'
  },
  {
    id: 'wb_inflation_rate',
    name: 'Inflation Rate (World Bank)',
    unit: 'annual percent',
    source: 'World Bank Open Data',
    sourceUrl: 'https://data.worldbank.org/indicator/FP.CPI.TOTL.ZG',
    seriesId: 'FP.CPI.TOTL.ZG',
    category: 'economics',
    description: 'Inflation, consumer prices (annual %)'
  },

  // Alpha Vantage Data - Financial Markets
  {
    id: 'av_spy_price',
    name: 'SPY ETF Price',
    unit: 'USD',
    source: 'Alpha Vantage',
    sourceUrl: 'https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=SPY',
    seriesId: 'SPY',
    category: 'finance',
    description: 'SPDR S&P 500 ETF Trust price data'
  },
  {
    id: 'av_aapl_price',
    name: 'Apple Inc. Stock Price',
    unit: 'USD',
    source: 'Alpha Vantage',
    sourceUrl: 'https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=AAPL',
    seriesId: 'AAPL',
    category: 'finance',
    description: 'Apple Inc. (AAPL) stock price data'
  },
  {
    id: 'av_nasdaq_index',
    name: 'NASDAQ Composite Index',
    unit: 'index',
    source: 'Alpha Vantage',
    sourceUrl: 'https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=IXIC',
    seriesId: 'IXIC',
    category: 'finance',
    description: 'NASDAQ Composite Index performance'
  },

  // OpenWeather Data - Climate & Weather
  {
    id: 'ow_global_temp',
    name: 'Global Temperature Index',
    unit: '°C',
    source: 'OpenWeather API',
    sourceUrl: 'https://openweathermap.org/api/statistics-api',
    seriesId: 'GLOBAL_TEMP',
    category: 'climate',
    description: 'Global average temperature data from major cities'
  },
  {
    id: 'ow_climate_pressure',
    name: 'Global Atmospheric Pressure',
    unit: 'hPa',
    source: 'OpenWeather API',
    sourceUrl: 'https://openweathermap.org/api/statistics-api',
    seriesId: 'GLOBAL_PRESSURE',
    category: 'climate',
    description: 'Global average atmospheric pressure readings'
  },

  // Additional Alpha Vantage financial datasets
  {
    id: 'av_microsoft_stock',
    name: 'Microsoft Stock Price',
    unit: 'USD per share',
    source: 'Alpha Vantage API',
    sourceUrl: 'https://www.alphavantage.co/documentation/',
    seriesId: 'MSFT',
    category: 'finance',
    description: 'Microsoft Corporation (MSFT) daily closing stock prices'
  },
  {
    id: 'av_treasury_10yr',
    name: '10-Year Treasury Rate',
    unit: 'percent',
    source: 'Alpha Vantage API',
    sourceUrl: 'https://www.alphavantage.co/documentation/',
    seriesId: 'DGS10',
    category: 'finance',
    description: 'US 10-Year Treasury Bond yield rates'
  },
  {
    id: 'av_gold_price',
    name: 'Gold Spot Price',
    unit: 'USD per ounce',
    source: 'Alpha Vantage API',
    sourceUrl: 'https://www.alphavantage.co/documentation/',
    seriesId: 'GOLD',
    category: 'finance',
    description: 'Gold commodity spot prices in US dollars'
  },
  {
    id: 'av_crude_oil',
    name: 'Crude Oil Price',
    unit: 'USD per barrel',
    source: 'Alpha Vantage API',
    sourceUrl: 'https://www.alphavantage.co/documentation/',
    seriesId: 'CRUDE_OIL_WTI',
    category: 'finance',
    description: 'West Texas Intermediate (WTI) crude oil prices'
  },

  // Additional OpenWeather climate datasets
  {
    id: 'ow_humidity_global',
    name: 'Global Humidity Levels',
    unit: 'percent relative humidity',
    source: 'OpenWeather API',
    sourceUrl: 'https://openweathermap.org/api',
    seriesId: 'GLOBAL_HUMIDITY',
    category: 'climate',
    description: 'Average relative humidity across major global cities'
  },
  {
    id: 'ow_wind_speed',
    name: 'Global Wind Speed',
    unit: 'meters per second',
    source: 'OpenWeather API',
    sourceUrl: 'https://openweathermap.org/api',
    seriesId: 'GLOBAL_WIND',
    category: 'climate',
    description: 'Average wind speeds across major global cities'
  },
  {
    id: 'ow_precipitation',
    name: 'Global Precipitation',
    unit: 'millimeters',
    source: 'OpenWeather API',
    sourceUrl: 'https://openweathermap.org/api',
    seriesId: 'GLOBAL_PRECIPITATION',
    category: 'climate',
    description: 'Average precipitation levels across major global cities'
  },
  {
    id: 'ow_uv_index',
    name: 'Global UV Index',
    unit: 'UV index scale',
    source: 'OpenWeather API',
    sourceUrl: 'https://openweathermap.org/api',
    seriesId: 'GLOBAL_UV',
    category: 'climate',
    description: 'Average UV index levels across major global cities'
  }
]

// All datasets are now real data sources (will be combined with AI datasets at runtime)
export const allDatasets: RealDataset[] = realDatasets

class StaticDataService {
  private cache = new Map<string, RealDataPoint[]>()
  private aiDatasets: RealDataset[] = []
  private combinedDatasets: RealDataset[] = []

  constructor() {
    this.loadAIDatasets()
  }

  // Load AI datasets from the index
  private async loadAIDatasets() {
    try {
      // Try to load enhanced AI datasets with file list first
      const fileListResponse = await fetch('/ai-data/file_list.json')
      if (fileListResponse.ok) {
        const fileList = await fileListResponse.json()
        console.log('📋 Loading AI datasets from file list:', fileList.length, 'files')
        
        // Load metadata for each file
        this.aiDatasets = fileList.map(fileInfo => ({
          id: fileInfo.id,
          name: fileInfo.name,
          unit: fileInfo.unit || '',
          source: 'AI-Generated',
          seriesId: fileInfo.id,
          category: fileInfo.category || 'ai-generated',
          description: fileInfo.description || '',
          isAIGenerated: true,
          citation: fileInfo.citation || '',
          sourceUrl: fileInfo.sourceUrl || '',
          aiGeneratedAt: fileInfo.aiGeneratedAt,
          filename: fileInfo.filename
        }))
        
        console.log(`🤖 Loaded ${this.aiDatasets.length} AI-generated datasets with source URLs`)
      } else {
        // Fallback to legacy index format
        const response = await fetch('/ai-data/datasets_index.json')
        if (response.ok) {
          const aiDatasetsIndex = await response.json()
          this.aiDatasets = aiDatasetsIndex.map(dataset => ({
            id: dataset.id,
            name: dataset.name,
            unit: dataset.unit,
            source: 'AI-Generated',
            seriesId: dataset.id,
            category: dataset.category,
            description: dataset.description,
            isAIGenerated: true,
            citation: dataset.citation,
            sourceUrl: dataset.sourceUrl || '',
            filename: dataset.filename || dataset.id
          }))
          
          console.log(`🤖 Loaded ${this.aiDatasets.length} AI-generated datasets (legacy format)`)
        } else {
          console.warn('AI datasets not found, using only real datasets')
        }
      }
      
      // Combine real and AI datasets
      this.combinedDatasets = [...realDatasets, ...this.aiDatasets]
      
    } catch (error) {
      console.warn('Failed to load AI datasets:', error)
      this.combinedDatasets = realDatasets
    }
  }

  // Get all available datasets (real + AI)
  getAllDatasets(): RealDataset[] {
    return this.combinedDatasets
  }

  // Load data from static JSON files (both real and AI) - NO MOCK DATA FALLBACK
  async fetchDataset(dataset: RealDataset): Promise<RealDataPoint[]> {
    // Validate dataset availability - no mock data allowed
    this.validateDataAvailability(dataset)
    
    console.log(`📂 Loading ${dataset.isAIGenerated ? 'AI' : 'real'} data for: ${dataset.name}`)

    if (this.cache.has(dataset.id)) {
      console.log(`📋 Using cached data for: ${dataset.name}`)
      return this.cache.get(dataset.id)!
    }

    try {
      const folder = dataset.isAIGenerated ? 'ai-data' : 'data'
      
      // For AI datasets, try enhanced filename format first
      let response
      if (dataset.isAIGenerated && dataset.filename) {
        // filename already includes .json extension
        response = await fetch(`/${folder}/${dataset.filename}`)
        if (!response.ok) {
          // Fallback to ID-based filename
          response = await fetch(`/${folder}/${dataset.id}.json`)
        }
      } else {
        response = await fetch(`/${folder}/${dataset.id}.json`)
      }
      
      if (!response.ok) {
        throw new Error(`Failed to load data file: ${response.status} ${response.statusText} - NO MOCK DATA AVAILABLE`)
      }

      let data: RealDataPoint[]
      const jsonData = await response.json()
      
      // Handle enhanced AI format with metadata wrapper
      if (dataset.isAIGenerated && jsonData.data && jsonData.metadata) {
        data = jsonData.data
        console.log(`✅ Loaded enhanced AI dataset: ${jsonData.metadata.name}`)
        if (jsonData.metadata.sourceUrl) {
          console.log(`🔗 AI Source: ${jsonData.metadata.sourceUrl}`)
        }
      } else if (Array.isArray(jsonData)) {
        data = jsonData
      } else {
        throw new Error('Invalid data format: expected array of data points or enhanced format - NO MOCK DATA AVAILABLE')
      }

      if (!Array.isArray(data) || data.length === 0) {
        throw new Error(`No valid data found for ${dataset.name} - NO MOCK DATA FALLBACK`)
      }

      console.log(`✅ Loaded ${data.length} data points for ${dataset.name} ${dataset.isAIGenerated ? '(AI)' : '(Real)'}`)
      
      // Cache the data
      this.cache.set(dataset.id, data)
      return data

    } catch (error) {
      console.error(`❌ Failed to load data for ${dataset.name}:`, error)
      console.error('💥 NO MOCK DATA FALLBACK AVAILABLE - System only uses real and AI-generated data')
      throw error
    }
  }

  // Generate a correlation between two datasets
  async generateCorrelation(dataset1: RealDataset, dataset2: RealDataset): Promise<CorrelationResult> {
    try {
      const [data1, data2] = await Promise.all([
        this.fetchDataset(dataset1),
        this.fetchDataset(dataset2)
      ])

      if (data1.length === 0 || data2.length === 0) {
        throw new Error('Insufficient data for correlation')
      }

      // Find common years
      const commonYears = data1
        .filter(d1 => data2.some(d2 => d2.year === d1.year))
        .map(d => d.year)
        .sort()

      if (commonYears.length < 3) {
        throw new Error('Not enough overlapping data points for correlation')
      }

      // Prepare data for correlation calculation
      const values1 = commonYears.map(year => 
        data1.find(d => d.year === year)?.value || 0
      )
      const values2 = commonYears.map(year => 
        data2.find(d => d.year === year)?.value || 0
      )

      const correlation = this.calculateCorrelation(values1, values2)
      const rSquared = correlation * correlation

      // Determine significance level
      let significance = 'Low'
      const absCorr = Math.abs(correlation)
      if (absCorr > 0.7) significance = 'High'
      else if (absCorr > 0.4) significance = 'Medium'

      const description = this.generateCorrelationDescription(
        correlation, 
        dataset1.name, 
        dataset2.name
      )

      return {
        dataset1,
        dataset2,
        correlation,
        rSquared,
        significance,
        description,
        data1: data1.filter(d => commonYears.includes(d.year)),
        data2: data2.filter(d => commonYears.includes(d.year)),
        isRealData: true
      }

    } catch (error) {
      console.error('Error generating correlation:', error)
      throw error
    }
  }

  private calculateCorrelation(x: number[], y: number[]): number {
    const n = x.length
    if (n !== y.length || n === 0) return 0

    const meanX = x.reduce((sum, val) => sum + val, 0) / n
    const meanY = y.reduce((sum, val) => sum + val, 0) / n

    let numerator = 0
    let sumSquareX = 0
    let sumSquareY = 0

    for (let i = 0; i < n; i++) {
      const deltaX = x[i] - meanX
      const deltaY = y[i] - meanY
      numerator += deltaX * deltaY
      sumSquareX += deltaX * deltaX
      sumSquareY += deltaY * deltaY
    }

    const denominator = Math.sqrt(sumSquareX * sumSquareY)
    return denominator === 0 ? 0 : numerator / denominator
  }

  private generateCorrelationDescription(correlation: number, name1: string, name2: string): string {
    const absCorr = Math.abs(correlation)
    const direction = correlation > 0 ? 'positive' : 'negative'
    
    let strength = ''
    if (absCorr > 0.8) strength = 'very strong'
    else if (absCorr > 0.6) strength = 'strong'
    else if (absCorr > 0.4) strength = 'moderate'
    else if (absCorr > 0.2) strength = 'weak'
    else strength = 'very weak'

    return `There is a ${strength} ${direction} correlation (r = ${correlation.toFixed(3)}) between ${name1} and ${name2}.`
  }

  // Legacy methods for compatibility
  getRandomDatasets(category?: string): [RealDataset, RealDataset] {
    // Use combined datasets (real + AI) for selection
    const availableDatasets = this.combinedDatasets.length > 0 ? this.combinedDatasets : realDatasets
    
    const filteredDatasets = category 
      ? availableDatasets.filter(d => d.category === category)
      : availableDatasets

    if (filteredDatasets.length < 2) {
      return [availableDatasets[0], availableDatasets[1]]
    }

    // Proper Fisher-Yates shuffle for true randomization
    const shuffled = [...filteredDatasets]
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
    }
    
    // Ensure we get two different datasets
    let first = shuffled[0]
    let second = shuffled[1]
    
    // If they're the same, try to get a different second dataset
    if (first.id === second.id && shuffled.length > 2) {
      second = shuffled[2]
    }
    
    return [first, second]
  }

  // Get datasets by type
  getRealDatasets(): RealDataset[] {
    return realDatasets
  }

  getAIDatasets(): RealDataset[] {
    return this.aiDatasets
  }

  // Get categories including AI datasets
  getCategories(): string[] {
    const allCategories = this.combinedDatasets.map(d => d.category)
    return [...new Set(allCategories)].sort()
  }

  // Get dataset count by type
  getDatasetStats() {
    return {
      real: realDatasets.length,
      ai: this.aiDatasets.length,
      total: this.combinedDatasets.length
    }
  }

  // Get total dataset count
  getTotalDatasetCount(): number {
    return this.combinedDatasets.length
  }

  // Get data sources with attribution
  getDataSources() {
    const sources = new Map<string, { 
      name: string, 
      description: string, 
      url: string, 
      logo?: string,
      datasets: number 
    }>()
    
    // Count FRED datasets
    const fredCount = realDatasets.filter(d => d.source.includes('FRED')).length
    sources.set('FRED', {
      name: 'FRED',
      description: 'Federal Reserve Economic Data - St. Louis Fed',
      url: 'https://fred.stlouisfed.org/',
      datasets: fredCount
    })
    
    // Count World Bank datasets  
    const worldBankCount = realDatasets.filter(d => d.source.includes('World Bank')).length
    sources.set('WorldBank', {
      name: 'World Bank Open Data',
      description: 'Global development data and statistics',
      url: 'https://data.worldbank.org/',
      datasets: worldBankCount
    })
    
    // Count Alpha Vantage datasets
    const alphaVantageCount = realDatasets.filter(d => d.source.includes('Alpha Vantage')).length
    sources.set('AlphaVantage', {
      name: 'Alpha Vantage',
      description: 'Real-time and historical financial market data',
      url: 'https://www.alphavantage.co/',
      datasets: alphaVantageCount
    })
    
    // Count OpenWeather datasets
    const openWeatherCount = realDatasets.filter(d => d.source.includes('OpenWeather')).length
    sources.set('OpenWeather', {
      name: 'OpenWeather',
      description: 'Weather and climate data from around the world',
      url: 'https://openweathermap.org/',
      datasets: openWeatherCount
    })

    // Check for NASA datasets (from automated data collection)
    this.checkAndAddDynamicSource(sources, 'NASA', {
      name: 'NASA',
      description: 'Space weather and astronomical data',
      url: 'https://api.nasa.gov/',
      category: 'space'
    })

    // Check for USGS datasets (from automated data collection)
    this.checkAndAddDynamicSource(sources, 'USGS', {
      name: 'USGS',
      description: 'Geological and seismic activity data',
      url: 'https://earthquake.usgs.gov/',
      category: 'geology'
    })

    // Check for EIA datasets (from automated data collection)
    this.checkAndAddDynamicSource(sources, 'EIA', {
      name: 'EIA',
      description: 'U.S. energy sector data and statistics',
      url: 'https://www.eia.gov/',
      category: 'energy'
    })
    
    // AI-generated datasets
    sources.set('AI', {
      name: 'AI-Generated Datasets',
      description: 'Synthetic datasets based on real-world patterns',
      url: '',
      datasets: this.aiDatasets.length
    })
    
    return sources
  }

  // Check for dynamic data sources and add them with live dataset counts
  private checkAndAddDynamicSource(sources: Map<string, any>, sourceKey: string, sourceInfo: any) {
    try {
      let dataPath = ''
      switch (sourceKey) {
        case 'NASA':
          dataPath = '/data/nasa/'
          break
        case 'USGS':
          dataPath = '/data/usgs/'
          break
        case 'EIA':
          dataPath = '/data/eia/'
          break
      }

      // For now, we'll check if the data exists synchronously
      // This will be updated to async when the UI supports it
      fetch(`${dataPath}metadata.json`)
        .then(response => {
          if (response.ok) {
            return response.json()
          }
          throw new Error('Not found')
        })
        .then(metadata => {
          const datasetCount = metadata.datasets ? metadata.datasets.length : 0
          sources.set(sourceKey, {
            name: sourceInfo.name,
            description: sourceInfo.description,
            url: sourceInfo.url,
            datasets: datasetCount
          })
          console.log(`✅ ${sourceKey}: Found ${datasetCount} datasets`)
        })
        .catch(() => {
          console.log(`ℹ️ ${sourceKey}: Data not yet available (will be added during next data collection)`)
        })
    } catch (error) {
      console.log(`ℹ️ ${sourceKey}: Error checking data availability`)
    }
  }

  // Get datasets by source type
  getDatasetsBySource() {
    const fredDatasets = realDatasets.filter(d => d.source.includes('FRED'))
    const worldBankDatasets = realDatasets.filter(d => d.source.includes('World Bank'))
    const alphaVantageDatasets = realDatasets.filter(d => d.source.includes('Alpha Vantage'))
    const openWeatherDatasets = realDatasets.filter(d => d.source.includes('OpenWeather'))
    const aiDatasets = this.aiDatasets
    
    return {
      fred: fredDatasets,
      worldbank: worldBankDatasets,
      alphavantage: alphaVantageDatasets,
      openweather: openWeatherDatasets,
      ai: aiDatasets,
      all: this.combinedDatasets
    }
  }

  // Ensure no mock data is ever used - throw error if no real data available
  private validateDataAvailability(dataset: RealDataset) {
    if (!dataset) {
      throw new Error('Dataset not found - no mock data fallback available')
    }
    
    // For AI datasets, ensure they have proper metadata
    if (dataset.isAIGenerated && !dataset.sourceUrl) {
      console.warn(`⚠️ AI dataset ${dataset.id} missing source URL`)
    }
    
    // For real datasets, ensure they have source URLs
    if (!dataset.isAIGenerated && !dataset.sourceUrl) {
      console.warn(`⚠️ Real dataset ${dataset.id} missing source URL`)
    }
  }
}

export const dataService = new StaticDataService()