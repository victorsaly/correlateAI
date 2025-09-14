// Enhanced Real data service for fetching data from various APIs and realistic datasets
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

// World Bank API response interface
export interface WorldBankResponse {
  [1]: Array<{
    date: string
    value: number | null
  }>
}

export interface FredResponse {
  observations: Array<{
    date: string
    value: string
  }>
}

// Realistic AI-generated dataset based on real-world patterns
export interface RealisticDataset extends Omit<RealDataset, 'fetchUrl'> {
  isRealistic: true
  dataGenerator: () => RealDataPoint[]
  fetchUrl: ''
}

// Your registered FRED API key from environment
const FRED_API_KEY = import.meta.env.VITE_FRED_API_KEY

if (!FRED_API_KEY) {
  console.error('FRED API key not found. Please add VITE_FRED_API_KEY to your .env file')
}

// Helper function to build FRED API URLs (using proxy to avoid CORS issues)
const buildFredUrl = (seriesId: string) => 
  `/api/fred/series/observations?series_id=${seriesId}&api_key=${FRED_API_KEY}&file_type=json&frequency=a&observation_start=2014-01-01`

// Realistic data generators based on real-world patterns
const generateRealisticTrend = (startValue: number, trend: number, volatility: number, years: number[] = [2014, 2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024]): RealDataPoint[] => {
  return years.map((year, index) => {
    const baseValue = startValue + (trend * index)
    const randomVariation = (Math.random() - 0.5) * volatility
    return {
      year,
      value: Math.max(0, baseValue + randomVariation)
    }
  })
}

const generateSeasonalData = (baseValue: number, amplitude: number, phase: number = 0): RealDataPoint[] => {
  return [2014, 2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024].map((year, index) => {
    const seasonal = Math.sin((index + phase) * 0.5) * amplitude
    const trend = baseValue + (index * 2) // slight upward trend
    const noise = (Math.random() - 0.5) * (baseValue * 0.1)
    return {
      year,
      value: Math.max(0, trend + seasonal + noise)
    }
  })
}

const generateExponentialGrowth = (startValue: number, growthRate: number, maxValue?: number): RealDataPoint[] => {
  return [2014, 2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024].map((year, index) => {
    let value = startValue * Math.pow(1 + growthRate, index)
    if (maxValue && value > maxValue) value = maxValue + Math.random() * (maxValue * 0.1)
    return { year, value: Math.round(value * 100) / 100 }
  })
}

// FRED API datasets - these are real economic indicators
export const realDatasets: RealDataset[] = [
  // Economics & Finance
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
  }
]

// Realistic AI-generated datasets based on real-world patterns
export const realisticDatasets: RealisticDataset[] = [
  // Technology Adoption
  {
    id: 'smartphone_penetration',
    name: 'Smartphone Penetration',
    unit: 'percent',
    source: 'Generated',
    seriesId: 'SMARTPHONE_PENETRATION',
    category: 'technology',
    description: 'Percentage of adults owning smartphones',
    fetchUrl: '',
    isRealistic: true,
    dataGenerator: () => generateExponentialGrowth(65, 0.08, 95)
  },
  {
    id: 'internet_users',
    name: 'Internet Users',
    unit: 'percent of population',
    source: 'Generated',
    seriesId: 'INTERNET_USERS',
    category: 'technology',
    description: 'Percentage of population using internet',
    fetchUrl: '',
    isRealistic: true,
    dataGenerator: () => generateExponentialGrowth(78, 0.04, 92)
  },
  {
    id: 'ev_sales',
    name: 'Electric Vehicle Sales',
    unit: 'thousands',
    source: 'Generated',
    seriesId: 'EV_SALES',
    category: 'technology',
    description: 'Annual electric vehicle sales',
    fetchUrl: '',
    isRealistic: true,
    dataGenerator: () => generateExponentialGrowth(120, 0.35)
  },
  {
    id: 'renewable_energy',
    name: 'Renewable Energy Share',
    unit: 'percent',
    source: 'Generated',
    seriesId: 'RENEWABLE_ENERGY',
    category: 'environment',
    description: 'Renewable energy as percentage of total energy consumption',
    fetchUrl: '',
    isRealistic: true,
    dataGenerator: () => generateRealisticTrend(12.5, 1.8, 2)
  },
  
  // Demographics & Social
  {
    id: 'median_age',
    name: 'Median Age',
    unit: 'years',
    source: 'Generated',
    seriesId: 'MEDIAN_AGE',
    category: 'demographics',
    description: 'Median age of population',
    fetchUrl: '',
    isRealistic: true,
    dataGenerator: () => generateRealisticTrend(37.2, 0.3, 0.5)
  },
  {
    id: 'urban_population',
    name: 'Urban Population',
    unit: 'percent',
    source: 'Generated',
    seriesId: 'URBAN_POPULATION',
    category: 'demographics',
    description: 'Percentage of population living in urban areas',
    fetchUrl: '',
    isRealistic: true,
    dataGenerator: () => generateRealisticTrend(80.7, 0.4, 1.2)
  },
  {
    id: 'college_enrollment',
    name: 'College Enrollment',
    unit: 'millions',
    source: 'Generated',
    seriesId: 'COLLEGE_ENROLLMENT',
    category: 'education',
    description: 'Total college enrollment',
    fetchUrl: '',
    isRealistic: true,
    dataGenerator: () => generateSeasonalData(20.2, 1.5, 0)
  },
  
  // Health & Environment
  {
    id: 'life_expectancy',
    name: 'Life Expectancy',
    unit: 'years',
    source: 'Generated',
    seriesId: 'LIFE_EXPECTANCY',
    category: 'health',
    description: 'Average life expectancy at birth',
    fetchUrl: '',
    isRealistic: true,
    dataGenerator: () => generateRealisticTrend(78.9, 0.15, 0.8)
  },
  {
    id: 'co2_emissions',
    name: 'CO2 Emissions',
    unit: 'billion tons',
    source: 'Generated',
    seriesId: 'CO2_EMISSIONS',
    category: 'environment',
    description: 'Annual CO2 emissions',
    fetchUrl: '',
    isRealistic: true,
    dataGenerator: () => generateRealisticTrend(5.4, -0.12, 0.3)
  },
  {
    id: 'forest_coverage',
    name: 'Forest Coverage',
    unit: 'percent of land',
    source: 'Generated',
    seriesId: 'FOREST_COVERAGE',
    category: 'environment',
    description: 'Forest area as percentage of land area',
    fetchUrl: '',
    isRealistic: true,
    dataGenerator: () => generateRealisticTrend(33.2, -0.08, 0.4)
  },
  
  // Economic Indicators (Alternative to FRED)
  {
    id: 'consumer_confidence',
    name: 'Consumer Confidence',
    unit: 'index',
    source: 'Generated',
    seriesId: 'CONSUMER_CONFIDENCE',
    category: 'economics',
    description: 'Consumer Confidence Index',
    fetchUrl: '',
    isRealistic: true,
    dataGenerator: () => generateSeasonalData(95, 15, 1)
  },
  {
    id: 'retail_sales_growth',
    name: 'Retail Sales Growth',
    unit: 'percent',
    source: 'Generated',
    seriesId: 'RETAIL_SALES',
    category: 'economics',
    description: 'Year-over-year retail sales growth',
    fetchUrl: '',
    isRealistic: true,
    dataGenerator: () => generateSeasonalData(4.2, 2.8, 0.5)
  },
  
  // Technology & Innovation
  {
    id: 'ai_job_postings',
    name: 'AI Job Postings',
    unit: 'thousands',
    source: 'Generated',
    seriesId: 'AI_JOB_POSTINGS',
    category: 'technology',
    description: 'Job postings mentioning AI/ML skills',
    fetchUrl: '',
    isRealistic: true,
    dataGenerator: () => generateExponentialGrowth(45, 0.28)
  },
  {
    id: 'cloud_adoption',
    name: 'Cloud Adoption Rate',
    unit: 'percent',
    source: 'Generated',
    seriesId: 'CLOUD_ADOPTION',
    category: 'technology',
    description: 'Percentage of companies using cloud services',
    fetchUrl: '',
    isRealistic: true,
    dataGenerator: () => generateExponentialGrowth(58, 0.12, 88)
  }
]

// Combined datasets for easy access
export const allDatasets: (RealDataset | RealisticDataset)[] = [...realDatasets, ...realisticDatasets]

class DataService {
  private cache = new Map<string, RealDataPoint[]>()

  async fetchDataset(dataset: RealDataset | RealisticDataset): Promise<RealDataPoint[]> {
    console.log(`Fetching data for: ${dataset.name}`)
    
    // Check if it's a realistic dataset (generated data)
    if ('isRealistic' in dataset && dataset.isRealistic) {
      console.log(`Generating realistic data for: ${dataset.name}`)
      const data = dataset.dataGenerator()
      this.cache.set(dataset.id, data)
      return data
    }

    // Handle real API data
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
  async generateCorrelation(dataset1: RealDataset | RealisticDataset, dataset2: RealDataset | RealisticDataset) {
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
  getRandomDatasets(category?: string): [RealDataset | RealisticDataset, RealDataset | RealisticDataset] {
    const availableDatasets = allDatasets
    const dataset1 = availableDatasets[Math.floor(Math.random() * availableDatasets.length)]
    let dataset2 = availableDatasets[Math.floor(Math.random() * availableDatasets.length)]
    
    // Make sure we don't pick the same dataset twice
    while (dataset2.id === dataset1.id && availableDatasets.length > 1) {
      dataset2 = availableDatasets[Math.floor(Math.random() * availableDatasets.length)]
    }
    
    return [dataset1, dataset2]
  }

  calculateCorrelation(data1: RealDataPoint[], data2: RealDataPoint[]): number {
    // Find common years
    const commonYears = data1
      .filter(d1 => data2.some(d2 => d2.year === d1.year))
      .map(d => d.year)
      .sort()

    if (commonYears.length < 3) {
      return 0 // Not enough data points
    }

    // Get values for common years
    const values1 = commonYears.map(year => 
      data1.find(d => d.year === year)!.value
    )
    const values2 = commonYears.map(year => 
      data2.find(d => d.year === year)!.value
    )

    return this.calculateCorrelation(values1, values2)
  }
}

export const dataService = new DataService()