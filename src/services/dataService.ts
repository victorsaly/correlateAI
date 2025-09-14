// Real data service for fetching data from FREE APIs ONLY
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
  fetchUrl: string
}

// API Response interfaces
export interface FredResponse {
  observations: Array<{
    date: string
    value: string
  }>
}

export interface WorldBankResponse {
  [1]: Array<{
    date: string
    value: number | null
  }>
}

// Your registered FRED API key from environment
const FRED_API_KEY = import.meta.env.VITE_FRED_API_KEY

if (!FRED_API_KEY) {
  console.error('FRED API key not found. Please add VITE_FRED_API_KEY to your .env file')
}

// Helper function to build FRED API URLs (using proxy to avoid CORS issues)
const buildFredUrl = (seriesId: string) => 
  `/api/fred/series/observations?series_id=${seriesId}&api_key=${FRED_API_KEY}&file_type=json&frequency=a&observation_start=2014-01-01`

// Helper function to build World Bank API URLs (completely free, no key needed)
const buildWorldBankUrl = (indicator: string, country: string = 'US') =>
  `/api/worldbank/v2/country/${country}/indicator/${indicator}?format=json&date=2014:2024&per_page=1000`

// COMPREHENSIVE REAL DATA SOURCES - ALL FREE APIs
export const realDatasets: RealDataset[] = [
  // FRED API - US Economic Data (Expanded)
  {
    id: 'gdp',
    name: 'US GDP',
    unit: 'billions USD',
    source: 'FRED',
    seriesId: 'GDP',
    category: 'economics',
    description: 'Gross Domestic Product',
    fetchUrl: buildFredUrl('GDP')
  },
  {
    id: 'unemployment',
    name: 'Unemployment Rate',
    unit: 'percent',
    source: 'FRED',
    seriesId: 'UNRATE',
    category: 'economics',
    description: 'Unemployment Rate',
    fetchUrl: buildFredUrl('UNRATE')
  },
  {
    id: 'inflation',
    name: 'Consumer Price Index',
    unit: 'index',
    source: 'FRED',
    seriesId: 'CPIAUCSL',
    category: 'economics',
    description: 'Consumer Price Index for All Urban Consumers',
    fetchUrl: buildFredUrl('CPIAUCSL')
  },
  {
    id: 'interest_rate',
    name: 'Federal Funds Rate',
    unit: 'percent',
    source: 'FRED',
    seriesId: 'FEDFUNDS',
    category: 'economics',
    description: 'Effective Federal Funds Rate',
    fetchUrl: buildFredUrl('FEDFUNDS')
  },
  {
    id: 'housing_starts',
    name: 'Housing Starts',
    unit: 'thousands',
    source: 'FRED',
    seriesId: 'HOUST',
    category: 'economics',
    description: 'Housing Starts: Total: New Privately Owned Housing Units Started',
    fetchUrl: buildFredUrl('HOUST')
  },
  {
    id: 'personal_income',
    name: 'Personal Income',
    unit: 'billions USD',
    source: 'FRED',
    seriesId: 'PI',
    category: 'economics',
    description: 'Personal Income',
    fetchUrl: buildFredUrl('PI')
  },
  {
    id: 'retail_sales',
    name: 'Retail Sales',
    unit: 'millions USD',
    source: 'FRED',
    seriesId: 'RSAFS',
    category: 'economics',
    description: 'Advance Retail Sales: Retail and Food Services',
    fetchUrl: buildFredUrl('RSAFS')
  },
  {
    id: 'consumer_sentiment',
    name: 'Consumer Sentiment',
    unit: 'index',
    source: 'FRED',
    seriesId: 'UMCSENT',
    category: 'economics',
    description: 'University of Michigan: Consumer Sentiment',
    fetchUrl: buildFredUrl('UMCSENT')
  },
  {
    id: 'industrial_production',
    name: 'Industrial Production',
    unit: 'index',
    source: 'FRED',
    seriesId: 'INDPRO',
    category: 'economics',
    description: 'Industrial Production: Total Index',
    fetchUrl: buildFredUrl('INDPRO')
  },
  {
    id: 'stock_market',
    name: 'S&P 500',
    unit: 'index',
    source: 'FRED',
    seriesId: 'SP500',
    category: 'finance',
    description: 'S&P 500 Stock Price Index',
    fetchUrl: buildFredUrl('SP500')
  },
  {
    id: 'oil_price',
    name: 'Oil Price',
    unit: 'USD per barrel',
    source: 'FRED',
    seriesId: 'DCOILWTICO',
    category: 'commodities',
    description: 'Crude Oil Prices: West Texas Intermediate',
    fetchUrl: buildFredUrl('DCOILWTICO')
  },
  {
    id: 'gold_price',
    name: 'Gold Price',
    unit: 'USD per ounce',
    source: 'FRED',
    seriesId: 'GOLDAMGBD228NLBM',
    category: 'commodities',
    description: 'Gold Fixing Price 10:30 A.M. (London time)',
    fetchUrl: buildFredUrl('GOLDAMGBD228NLBM')
  },
  {
    id: 'labor_force_participation',
    name: 'Labor Force Participation',
    unit: 'percent',
    source: 'FRED',
    seriesId: 'CIVPART',
    category: 'demographics',
    description: 'Labor Force Participation Rate',
    fetchUrl: buildFredUrl('CIVPART')
  },
  {
    id: 'median_household_income',
    name: 'Median Household Income',
    unit: 'USD',
    source: 'FRED',
    seriesId: 'MEHOINUSA646N',
    category: 'demographics',
    description: 'Real Median Household Income',
    fetchUrl: buildFredUrl('MEHOINUSA646N')
  },
  {
    id: 'exports',
    name: 'US Exports',
    unit: 'billions USD',
    source: 'FRED',
    seriesId: 'EXPGS',
    category: 'trade',
    description: 'Exports of Goods and Services',
    fetchUrl: buildFredUrl('EXPGS')
  },
  {
    id: 'imports',
    name: 'US Imports',
    unit: 'billions USD',
    source: 'FRED',
    seriesId: 'IMPGS',
    category: 'trade',
    description: 'Imports of Goods and Services',
    fetchUrl: buildFredUrl('IMPGS')
  },
  {
    id: 'government_debt',
    name: 'Federal Debt',
    unit: 'millions USD',
    source: 'FRED',
    seriesId: 'GFDEBTN',
    category: 'economics',
    description: 'Federal Debt: Total Public Debt',
    fetchUrl: buildFredUrl('GFDEBTN')
  },
  {
    id: 'money_supply',
    name: 'Money Supply M2',
    unit: 'billions USD',
    source: 'FRED',
    seriesId: 'M2SL',
    category: 'finance',
    description: 'M2 Money Stock',
    fetchUrl: buildFredUrl('M2SL')
  },
  {
    id: 'manufacturing_employment',
    name: 'Manufacturing Employment',
    unit: 'thousands',
    source: 'FRED',
    seriesId: 'MANEMP',
    category: 'economics',
    description: 'All Employees, Manufacturing',
    fetchUrl: buildFredUrl('MANEMP')
  },
  {
    id: 'construction_spending',
    name: 'Construction Spending',
    unit: 'millions USD',
    source: 'FRED',
    seriesId: 'TTLCONS',
    category: 'economics',
    description: 'Total Construction Spending',
    fetchUrl: buildFredUrl('TTLCONS')
  },

  // World Bank Data - Global Indicators (Free API, no key required)
  {
    id: 'wb_gdp_per_capita',
    name: 'GDP Per Capita (World Bank)',
    unit: 'USD',
    source: 'WorldBank',
    seriesId: 'NY.GDP.PCAP.CD',
    category: 'economics',
    description: 'GDP per capita (current US$)',
    fetchUrl: buildWorldBankUrl('NY.GDP.PCAP.CD')
  },
  {
    id: 'wb_population',
    name: 'Population (World Bank)',
    unit: 'people',
    source: 'WorldBank',
    seriesId: 'SP.POP.TOTL',
    category: 'demographics',
    description: 'Population, total',
    fetchUrl: buildWorldBankUrl('SP.POP.TOTL')
  },
  {
    id: 'wb_life_expectancy',
    name: 'Life Expectancy (World Bank)',
    unit: 'years',
    source: 'WorldBank',
    seriesId: 'SP.DYN.LE00.IN',
    category: 'health',
    description: 'Life expectancy at birth, total (years)',
    fetchUrl: buildWorldBankUrl('SP.DYN.LE00.IN')
  },
  {
    id: 'wb_co2_emissions',
    name: 'CO2 Emissions (World Bank)',
    unit: 'metric tons per capita',
    source: 'WorldBank',
    seriesId: 'EN.ATM.CO2E.PC',
    category: 'environment',
    description: 'CO2 emissions (metric tons per capita)',
    fetchUrl: buildWorldBankUrl('EN.ATM.CO2E.PC')
  },
  {
    id: 'wb_energy_use',
    name: 'Energy Use (World Bank)',
    unit: 'kg of oil equivalent per capita',
    source: 'WorldBank',
    seriesId: 'EG.USE.PCAP.KG.OE',
    category: 'environment',
    description: 'Energy use (kg of oil equivalent per capita)',
    fetchUrl: buildWorldBankUrl('EG.USE.PCAP.KG.OE')
  },
  {
    id: 'wb_urban_population',
    name: 'Urban Population (World Bank)',
    unit: 'percent of total',
    source: 'WorldBank',
    seriesId: 'SP.URB.TOTL.IN.ZS',
    category: 'demographics',
    description: 'Urban population (% of total population)',
    fetchUrl: buildWorldBankUrl('SP.URB.TOTL.IN.ZS')
  },
  {
    id: 'wb_internet_users',
    name: 'Internet Users (World Bank)',
    unit: 'percent of population',
    source: 'WorldBank',
    seriesId: 'IT.NET.USER.ZS',
    category: 'technology',
    description: 'Individuals using the Internet (% of population)',
    fetchUrl: buildWorldBankUrl('IT.NET.USER.ZS')
  },
  {
    id: 'wb_mobile_subscriptions',
    name: 'Mobile Subscriptions (World Bank)',
    unit: 'per 100 people',
    source: 'WorldBank',
    seriesId: 'IT.CEL.SETS.P2',
    category: 'technology',
    description: 'Mobile cellular subscriptions (per 100 people)',
    fetchUrl: buildWorldBankUrl('IT.CEL.SETS.P2')
  },
  {
    id: 'wb_renewable_energy',
    name: 'Renewable Energy (World Bank)',
    unit: 'percent of total',
    source: 'WorldBank',
    seriesId: 'EG.FEC.RNEW.ZS',
    category: 'environment',
    description: 'Renewable energy consumption (% of total final energy consumption)',
    fetchUrl: buildWorldBankUrl('EG.FEC.RNEW.ZS')
  },
  {
    id: 'wb_school_enrollment',
    name: 'School Enrollment (World Bank)',
    unit: 'percent gross',
    source: 'WorldBank',
    seriesId: 'SE.TER.ENRR',
    category: 'education',
    description: 'School enrollment, tertiary (% gross)',
    fetchUrl: buildWorldBankUrl('SE.TER.ENRR')
  },
  {
    id: 'wb_inflation_rate',
    name: 'Inflation Rate (World Bank)',
    unit: 'annual percent',
    source: 'WorldBank',
    seriesId: 'FP.CPI.TOTL.ZG',
    category: 'economics',
    description: 'Inflation, consumer prices (annual %)',
    fetchUrl: buildWorldBankUrl('FP.CPI.TOTL.ZG')
  }
]

// All datasets are now real data sources
export const allDatasets: RealDataset[] = realDatasets

class DataService {
  private cache = new Map<string, RealDataPoint[]>()

  async fetchDataset(dataset: RealDataset): Promise<RealDataPoint[]> {
    console.log(`Fetching real data for: ${dataset.name}`)
    console.log(`URL: ${dataset.fetchUrl}`)

    if (this.cache.has(dataset.id)) {
      console.log(`Using cached data for: ${dataset.name}`)
      return this.cache.get(dataset.id)!
    }

    try {
      const response = await fetch(dataset.fetchUrl)
      
      if (!response.ok) {
        console.error(`HTTP ${response.status}: ${response.statusText}`)
        throw new Error(`HTTP error! status: ${response.status} - ${response.statusText}`)
      }

      const data = await response.json()
      console.log(`Raw API response for ${dataset.name}:`, data)

      let transformedData: RealDataPoint[] = []

      // Handle different API response formats
      if (dataset.source === 'FRED') {
        transformedData = this.transformFredData(data)
      } else if (dataset.source === 'WorldBank') {
        transformedData = this.transformWorldBankData(data)
      }

      // Filter to get annual data from 2014-2024
      const filteredData = transformedData
        .filter(point => point.year >= 2014 && point.year <= 2024)
        .sort((a, b) => a.year - b.year)

      console.log(`Transformed data for ${dataset.name}:`, filteredData)

      if (filteredData.length > 0) {
        this.cache.set(dataset.id, filteredData)
        return filteredData
      } else {
        throw new Error('No valid data points found in date range')
      }

    } catch (error) {
      console.error(`Failed to fetch data for ${dataset.name}:`, error)
      throw error
    }
  }

  private transformFredData(fredResponse: FredResponse): RealDataPoint[] {
    if (!fredResponse.observations) {
      console.error('Invalid FRED response format:', fredResponse)
      return []
    }

    return fredResponse.observations
      .map(obs => {
        const year = parseInt(obs.date.substring(0, 4))
        const value = parseFloat(obs.value)
        
        if (isNaN(value) || obs.value === '.') {
          return null
        }
        
        return { year, value }
      })
      .filter((point): point is RealDataPoint => point !== null)
  }

  private transformWorldBankData(wbResponse: WorldBankResponse): RealDataPoint[] {
    if (!Array.isArray(wbResponse) || wbResponse.length < 2) {
      console.error('Invalid World Bank response format:', wbResponse)
      return []
    }

    const dataArray = wbResponse[1]
    if (!Array.isArray(dataArray)) {
      console.error('World Bank data array not found:', wbResponse)
      return []
    }

    return dataArray
      .map(item => {
        const year = parseInt(item.date)
        const value = item.value
        
        if (isNaN(year) || value === null || isNaN(value)) {
          return null
        }
        
        return { year, value }
      })
      .filter((point): point is RealDataPoint => point !== null)
  }

  // Generate a correlation between two datasets
  async generateCorrelation(dataset1: RealDataset, dataset2: RealDataset) {
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

      // Calculate Pearson correlation coefficient
      const correlation = this.calculateCorrelation(values1, values2)

      // Prepare data for visualization
      const chartData = commonYears.map(year => ({
        year,
        value1: data1.find(d => d.year === year)?.value || 0,
        value2: data2.find(d => d.year === year)?.value || 0
      }))

      return {
        correlation,
        dataset1,
        dataset2,
        data: chartData,
        commonYears: commonYears.length,
        description: this.generateCorrelationDescription(correlation, dataset1.name, dataset2.name)
      }

    } catch (error) {
      console.error('Error generating correlation:', error)
      throw error
    }
  }

  private calculateCorrelation(x: number[], y: number[]): number {
    const n = x.length
    if (n !== y.length || n === 0) return 0

    const sumX = x.reduce((a, b) => a + b, 0)
    const sumY = y.reduce((a, b) => a + b, 0)
    const sumXY = x.reduce((sum, xi, i) => sum + xi * y[i], 0)
    const sumX2 = x.reduce((sum, xi) => sum + xi * xi, 0)
    const sumY2 = y.reduce((sum, yi) => sum + yi * yi, 0)

    const numerator = n * sumXY - sumX * sumY
    const denominator = Math.sqrt((n * sumX2 - sumX * sumX) * (n * sumY2 - sumY * sumY))

    return denominator === 0 ? 0 : numerator / denominator
  }

  private generateCorrelationDescription(correlation: number, name1: string, name2: string): string {
    const absCorr = Math.abs(correlation)
    let strength = ''
    
    if (absCorr >= 0.8) strength = 'very strong'
    else if (absCorr >= 0.6) strength = 'strong' 
    else if (absCorr >= 0.4) strength = 'moderate'
    else if (absCorr >= 0.2) strength = 'weak'
    else strength = 'very weak'

    const direction = correlation > 0 ? 'positive' : 'negative'
    
    return `${strength} ${direction} correlation between ${name1} and ${name2}`
  }

  // Legacy methods for compatibility
  getRandomDatasets(category?: string): [RealDataset, RealDataset] {
    const availableDatasets = realDatasets
    const dataset1 = availableDatasets[Math.floor(Math.random() * availableDatasets.length)]
    let dataset2 = availableDatasets[Math.floor(Math.random() * availableDatasets.length)]
    
    // Make sure we don't pick the same dataset twice
    while (dataset2.id === dataset1.id && availableDatasets.length > 1) {
      dataset2 = availableDatasets[Math.floor(Math.random() * availableDatasets.length)]
    }
    
    return [dataset1, dataset2]
  }
}

export const dataService = new DataService()