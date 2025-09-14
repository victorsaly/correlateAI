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
    source: 'FRED',
    seriesId: 'GDP',
    category: 'economics',
    description: 'Gross Domestic Product'
  },
  {
    id: 'unemployment',
    name: 'Unemployment Rate',
    unit: 'percent',
    source: 'FRED',
    seriesId: 'UNRATE',
    category: 'economics',
    description: 'Unemployment Rate'
  },
  {
    id: 'inflation',
    name: 'Consumer Price Index',
    unit: 'index',
    source: 'FRED',
    seriesId: 'CPIAUCSL',
    category: 'economics',
    description: 'Consumer Price Index for All Urban Consumers'
  },
  {
    id: 'interest_rate',
    name: 'Federal Funds Rate',
    unit: 'percent',
    source: 'FRED',
    seriesId: 'FEDFUNDS',
    category: 'economics',
    description: 'Effective Federal Funds Rate'
  },
  {
    id: 'housing_starts',
    name: 'Housing Starts',
    unit: 'thousands',
    source: 'FRED',
    seriesId: 'HOUST',
    category: 'economics',
    description: 'Housing Starts: Total: New Privately Owned Housing Units Started'
  },
  {
    id: 'personal_income',
    name: 'Personal Income',
    unit: 'billions USD',
    source: 'FRED',
    seriesId: 'PI',
    category: 'economics',
    description: 'Personal Income'
  },
  {
    id: 'retail_sales',
    name: 'Retail Sales',
    unit: 'millions USD',
    source: 'FRED',
    seriesId: 'RSAFS',
    category: 'economics',
    description: 'Advance Retail Sales: Retail and Food Services'
  },
  {
    id: 'consumer_sentiment',
    name: 'Consumer Sentiment',
    unit: 'index',
    source: 'FRED',
    seriesId: 'UMCSENT',
    category: 'economics',
    description: 'University of Michigan: Consumer Sentiment'
  },
  {
    id: 'industrial_production',
    name: 'Industrial Production',
    unit: 'index',
    source: 'FRED',
    seriesId: 'INDPRO',
    category: 'economics',
    description: 'Industrial Production: Total Index'
  },
  {
    id: 'stock_market',
    name: 'S&P 500',
    unit: 'index',
    source: 'FRED',
    seriesId: 'SP500',
    category: 'finance',
    description: 'S&P 500 Stock Price Index'
  },
  {
    id: 'oil_price',
    name: 'Oil Price',
    unit: 'USD per barrel',
    source: 'FRED',
    seriesId: 'DCOILWTICO',
    category: 'commodities',
    description: 'Crude Oil Prices: West Texas Intermediate'
  },
  {
    id: 'gold_price',
    name: 'Gold Price',
    unit: 'USD per ounce',
    source: 'FRED',
    seriesId: 'GOLDAMGBD228NLBM',
    category: 'commodities',
    description: 'Gold Fixing Price 10:30 A.M. (London time)'
  },
  {
    id: 'labor_force_participation',
    name: 'Labor Force Participation',
    unit: 'percent',
    source: 'FRED',
    seriesId: 'CIVPART',
    category: 'demographics',
    description: 'Labor Force Participation Rate'
  },
  {
    id: 'median_household_income',
    name: 'Median Household Income',
    unit: 'USD',
    source: 'FRED',
    seriesId: 'MEHOINUSA646N',
    category: 'demographics',
    description: 'Real Median Household Income'
  },
  {
    id: 'exports',
    name: 'US Exports',
    unit: 'billions USD',
    source: 'FRED',
    seriesId: 'EXPGS',
    category: 'trade',
    description: 'Exports of Goods and Services'
  },
  {
    id: 'imports',
    name: 'US Imports',
    unit: 'billions USD',
    source: 'FRED',
    seriesId: 'IMPGS',
    category: 'trade',
    description: 'Imports of Goods and Services'
  },
  {
    id: 'government_debt',
    name: 'Federal Debt',
    unit: 'millions USD',
    source: 'FRED',
    seriesId: 'GFDEBTN',
    category: 'economics',
    description: 'Federal Debt: Total Public Debt'
  },
  {
    id: 'money_supply',
    name: 'Money Supply M2',
    unit: 'billions USD',
    source: 'FRED',
    seriesId: 'M2SL',
    category: 'finance',
    description: 'M2 Money Stock'
  },
  {
    id: 'manufacturing_employment',
    name: 'Manufacturing Employment',
    unit: 'thousands',
    source: 'FRED',
    seriesId: 'MANEMP',
    category: 'economics',
    description: 'All Employees, Manufacturing'
  },
  {
    id: 'construction_spending',
    name: 'Construction Spending',
    unit: 'millions USD',
    source: 'FRED',
    seriesId: 'TTLCONS',
    category: 'economics',
    description: 'Total Construction Spending'
  },

  // World Bank Data - Global Indicators
  {
    id: 'wb_gdp_per_capita',
    name: 'GDP Per Capita (World Bank)',
    unit: 'USD',
    source: 'WorldBank',
    seriesId: 'NY.GDP.PCAP.CD',
    category: 'economics',
    description: 'GDP per capita (current US$)'
  },
  {
    id: 'wb_population',
    name: 'Population (World Bank)',
    unit: 'people',
    source: 'WorldBank',
    seriesId: 'SP.POP.TOTL',
    category: 'demographics',
    description: 'Population, total'
  },
  {
    id: 'wb_life_expectancy',
    name: 'Life Expectancy (World Bank)',
    unit: 'years',
    source: 'WorldBank',
    seriesId: 'SP.DYN.LE00.IN',
    category: 'demographics',
    description: 'Life expectancy at birth, total (years)'
  },
  {
    id: 'wb_co2_emissions',
    name: 'CO2 Emissions (World Bank)',
    unit: 'metric tons per capita',
    source: 'WorldBank',
    seriesId: 'EN.ATM.CO2E.PC',
    category: 'environment',
    description: 'CO2 emissions (metric tons per capita)'
  },
  {
    id: 'wb_internet_users',
    name: 'Internet Users (World Bank)',
    unit: 'percent of population',
    source: 'WorldBank',
    seriesId: 'IT.NET.USER.ZS',
    category: 'technology',
    description: 'Individuals using the Internet (% of population)'
  },
  {
    id: 'wb_mobile_subscriptions',
    name: 'Mobile Subscriptions (World Bank)',
    unit: 'per 100 people',
    source: 'WorldBank',
    seriesId: 'IT.CEL.SETS.P2',
    category: 'technology',
    description: 'Mobile cellular subscriptions (per 100 people)'
  },
  {
    id: 'wb_urban_population',
    name: 'Urban Population (World Bank)',
    unit: 'percent of total',
    source: 'WorldBank',
    seriesId: 'SP.URB.TOTL.IN.ZS',
    category: 'demographics',
    description: 'Urban population (% of total population)'
  },
  {
    id: 'wb_energy_use',
    name: 'Energy Use (World Bank)',
    unit: 'kg of oil equivalent per capita',
    source: 'WorldBank',
    seriesId: 'EG.USE.PCAP.KG.OE',
    category: 'environment',
    description: 'Energy use (kg of oil equivalent per capita)'
  },
  {
    id: 'wb_trade_balance',
    name: 'Trade Balance (World Bank)',
    unit: 'percent of GDP',
    source: 'WorldBank',
    seriesId: 'NE.RSB.GNFS.ZS',
    category: 'trade',
    description: 'External balance on goods and services (% of GDP)'
  },
  {
    id: 'wb_foreign_investment',
    name: 'Foreign Direct Investment (World Bank)',
    unit: 'percent of GDP',
    source: 'WorldBank',
    seriesId: 'BX.KLT.DINV.WD.GD.ZS',
    category: 'economics',
    description: 'Foreign direct investment, net inflows (% of GDP)'
  },
  {
    id: 'wb_school_enrollment',
    name: 'School Enrollment (World Bank)',
    unit: 'percent gross',
    source: 'WorldBank',
    seriesId: 'SE.TER.ENRR',
    category: 'education',
    description: 'School enrollment, tertiary (% gross)'
  },
  {
    id: 'wb_inflation_rate',
    name: 'Inflation Rate (World Bank)',
    unit: 'annual percent',
    source: 'WorldBank',
    seriesId: 'FP.CPI.TOTL.ZG',
    category: 'economics',
    description: 'Inflation, consumer prices (annual %)'
  }
]

// All datasets are now real data sources
export const allDatasets: RealDataset[] = realDatasets

class StaticDataService {
  private cache = new Map<string, RealDataPoint[]>()

  // Load data from static JSON files
  async fetchDataset(dataset: RealDataset): Promise<RealDataPoint[]> {
    console.log(`📂 Loading static data for: ${dataset.name}`)

    if (this.cache.has(dataset.id)) {
      console.log(`📋 Using cached data for: ${dataset.name}`)
      return this.cache.get(dataset.id)!
    }

    try {
      const response = await fetch(`/data/${dataset.id}.json`)
      
      if (!response.ok) {
        throw new Error(`Failed to load data file: ${response.status} ${response.statusText}`)
      }

      const data: RealDataPoint[] = await response.json()
      
      if (!Array.isArray(data)) {
        throw new Error('Invalid data format: expected array of data points')
      }

      console.log(`✅ Loaded ${data.length} data points for ${dataset.name}`)
      
      // Cache the data
      this.cache.set(dataset.id, data)
      return data

    } catch (error) {
      console.error(`❌ Failed to load data for ${dataset.name}:`, error)
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
    const filteredDatasets = category 
      ? allDatasets.filter(d => d.category === category)
      : allDatasets

    if (filteredDatasets.length < 2) {
      return [allDatasets[0], allDatasets[1]]
    }

    const shuffled = [...filteredDatasets].sort(() => Math.random() - 0.5)
    return [shuffled[0], shuffled[1]]
  }
}

export const dataService = new StaticDataService()