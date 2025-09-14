// Real data service for fetching data from various APIs
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

// Realistic AI-generated dataset based on real-world patterns
export interface RealisticDataset extends RealDataset {
  isRealistic: true
  dataGenerator: () => RealDataPoint[]
}

export interface FredResponse {
  observations: Array<{
    date: string
    value: string
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

// Helper function to build World Bank API URLs
const buildWorldBankUrl = (indicator: string, country: string = 'US') =>
  `/api/worldbank/v2/country/${country}/indicator/${indicator}?format=json&date=2014:2024&per_page=1000`

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
    id: 'retail_sales',
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
  private cache: Map<string, RealDataPoint[]> = new Map()
  private readonly CACHE_DURATION = 1000 * 60 * 60 // 1 hour

  async fetchDataset(dataset: RealDataset): Promise<RealDataPoint[]> {
    // Check cache first
    const cacheKey = dataset.id
    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey)!
    }

    try {
      console.log(`Fetching real data for: ${dataset.name}`)
      console.log(`URL: ${dataset.fetchUrl}`)
      
      const response = await fetch(dataset.fetchUrl, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
      })
      
      if (!response.ok) {
        const errorText = await response.text()
        console.error(`HTTP ${response.status}: ${errorText}`)
        throw new Error(`HTTP error! status: ${response.status} - ${errorText}`)
      }

      const data: FredResponse = await response.json()
      
      if (!data.observations) {
        console.error('No observations in response:', data)
        throw new Error('Invalid response format from FRED API')
      }
      
      console.log(`Received ${data.observations.length} observations for ${dataset.name}`)
      
      // Process FRED data format
      const processedData: RealDataPoint[] = data.observations
        .filter(obs => obs.value !== '.' && obs.value !== '') // Filter out missing values
        .map(obs => ({
          year: parseInt(obs.date.split('-')[0]),
          value: parseFloat(obs.value)
        }))
        .filter(point => !isNaN(point.value) && point.year >= 2014 && point.year <= 2023) // Only recent complete years
        .sort((a, b) => a.year - b.year)

      console.log(`Processed ${processedData.length} data points for ${dataset.name}`)

      // Cache the result
      this.cache.set(cacheKey, processedData)
      
      // Clear cache after duration
      setTimeout(() => {
        this.cache.delete(cacheKey)
      }, this.CACHE_DURATION)

      return processedData
    } catch (error) {
      console.error(`Failed to fetch data for ${dataset.name}:`, error)
      // Return empty array on error - the app can fall back to synthetic data
      return []
    }
  }

  // Get datasets by category
  getDatasetsByCategory(category: string): RealDataset[] {
    if (category === 'all') return realDatasets
    return realDatasets.filter(d => d.category === category)
  }

  // Get random datasets for correlation
  getRandomDatasets(category?: string): [RealDataset, RealDataset] {
    const availableDatasets = category && category !== 'all' 
      ? this.getDatasetsByCategory(category)
      : realDatasets

    if (availableDatasets.length < 2) {
      // Fallback to all datasets if category has too few
      const allDatasets = realDatasets
      const dataset1 = allDatasets[Math.floor(Math.random() * allDatasets.length)]
      let dataset2 = allDatasets[Math.floor(Math.random() * allDatasets.length)]
      while (dataset2.id === dataset1.id && allDatasets.length > 1) {
        dataset2 = allDatasets[Math.floor(Math.random() * allDatasets.length)]
      }
      return [dataset1, dataset2]
    }

    const dataset1 = availableDatasets[Math.floor(Math.random() * availableDatasets.length)]
    let dataset2 = availableDatasets[Math.floor(Math.random() * availableDatasets.length)]
    while (dataset2.id === dataset1.id) {
      dataset2 = availableDatasets[Math.floor(Math.random() * availableDatasets.length)]
    }
    return [dataset1, dataset2]
  }

  // Calculate correlation between two datasets
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

    // Calculate Pearson correlation coefficient
    const n = values1.length
    const mean1 = values1.reduce((a, b) => a + b, 0) / n
    const mean2 = values2.reduce((a, b) => a + b, 0) / n

    const numerator = values1.reduce((sum, val1, i) => {
      return sum + (val1 - mean1) * (values2[i] - mean2)
    }, 0)

    const denominator = Math.sqrt(
      values1.reduce((sum, val) => sum + Math.pow(val - mean1, 2), 0) *
      values2.reduce((sum, val) => sum + Math.pow(val - mean2, 2), 0)
    )

    return denominator === 0 ? 0 : numerator / denominator
  }
}

export const dataService = new DataService()