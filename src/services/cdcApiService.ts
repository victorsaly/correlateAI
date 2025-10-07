/**
 * CDC Data API Service
 * 
 * Integrates with CDC's Open Data API to fetch real health statistics
 * Replaces AI-generated health datasets with authentic government data
 * 
 * CDC Open Data Portal: https://data.cdc.gov/
 * API Documentation: https://dev.socrata.com/foundry/data.cdc.gov/
 */

export interface CDCDataPoint {
  year: number
  value: number
  state?: string
  category?: string
}

export interface CDCDataset {
  id: string
  name: string
  unit: string
  source: string
  category: string
  description: string
  cdcDatasetId: string
  apiEndpoint: string
  dataField: string
  yearField: string
  filterField?: string
  filterValue?: string
}

// CDC API Response interface (Socrata format)
export interface CDCResponse {
  [key: string]: string | number
}

// Detect environment for CORS handling
const isDevelopment = import.meta.env.DEV

// CORS proxy services for production
const CORS_PROXIES = [
  'https://api.allorigins.win/get?url=',
  'https://corsproxy.io/?',
  'https://api.codetabs.com/v1/proxy?quest='
]

// Helper function to build CDC API URLs
const buildCDCUrl = (dataset: CDCDataset, limit: number = 1000) => {
  const baseUrl = `https://data.cdc.gov/resource/${dataset.cdcDatasetId}.json`
  const params = new URLSearchParams({
    '$limit': limit.toString(),
    '$order': `${dataset.yearField} ASC`
  })
  
  // Add filter if specified
  if (dataset.filterField && dataset.filterValue) {
    params.append(dataset.filterField, dataset.filterValue)
  }
  
  const fullUrl = `${baseUrl}?${params.toString()}`
  
  if (isDevelopment) {
    // Development: Use Vite proxy
    return `/api/cdc/${dataset.cdcDatasetId}?${params.toString()}`
  } else {
    // Production: Return original URL for CORS proxying
    return fullUrl
  }
}

// CDC REAL HEALTH DATASETS
export const cdcDatasets: CDCDataset[] = [
  {
    id: 'cdc_drug_overdose_deaths',
    name: 'Drug Overdose Deaths',
    unit: 'deaths per 100k population',
    source: 'CDC WONDER',
    category: 'health',
    description: 'Annual drug overdose death rates in the United States',
    cdcDatasetId: 'xkb8-kh2a', // CDC WONDER: Underlying Cause of Death
    apiEndpoint: 'https://data.cdc.gov/resource/xkb8-kh2a.json',
    dataField: 'age_adjusted_rate',
    yearField: 'year',
    filterField: 'cause_name',
    filterValue: 'Drug overdose'
  },
  {
    id: 'cdc_life_expectancy',
    name: 'Life Expectancy at Birth',
    unit: 'years',
    source: 'CDC National Vital Statistics',
    category: 'health',
    description: 'Life expectancy at birth by year',
    cdcDatasetId: 'w9j2-ggv5', // Life Expectancy at Birth by Race/Ethnicity
    apiEndpoint: 'https://data.cdc.gov/resource/w9j2-ggv5.json',
    dataField: 'average_life_expectancy',
    yearField: 'year',
    filterField: 'race_ethnicity',
    filterValue: 'All Races'
  },
  {
    id: 'cdc_infant_mortality',
    name: 'Infant Mortality Rate',
    unit: 'deaths per 1k live births',
    source: 'CDC National Vital Statistics',
    category: 'health',
    description: 'Infant mortality rate (deaths under 1 year per 1,000 live births)',
    cdcDatasetId: '6q9t-4w8q', // Infant Mortality Rates by State
    apiEndpoint: 'https://data.cdc.gov/resource/6q9t-4w8q.json',
    dataField: 'rate',
    yearField: 'year'
  },
  {
    id: 'cdc_suicide_rates',
    name: 'Suicide Death Rate',
    unit: 'deaths per 100k population',
    source: 'CDC WONDER',
    category: 'health',
    description: 'Age-adjusted suicide death rates',
    cdcDatasetId: 'ya6t-8j8b', // Suicide mortality by state
    apiEndpoint: 'https://data.cdc.gov/resource/ya6t-8j8b.json',
    dataField: 'rate',
    yearField: 'year'
  },
  {
    id: 'cdc_heart_disease_mortality',
    name: 'Heart Disease Mortality',
    unit: 'deaths per 100k population',
    source: 'CDC Heart Disease and Stroke Prevention',
    category: 'health',
    description: 'Age-adjusted heart disease death rates',
    cdcDatasetId: 'i2vk-mgdh', // Heart Disease Mortality Data
    apiEndpoint: 'https://data.cdc.gov/resource/i2vk-mgdh.json',
    dataField: 'data_value',
    yearField: 'year'
  }
]

// Fetch data from CDC API with fallback CORS proxies
async function fetchWithFallback(url: string): Promise<CDCResponse[]> {
  if (isDevelopment) {
    // Development: Direct fetch through Vite proxy
    const response = await fetch(url)
    if (!response.ok) {
      throw new Error(`CDC API request failed: ${response.status} ${response.statusText}`)
    }
    return response.json()
  } else {
    // Production: Try CORS proxies
    const proxiedUrls = CORS_PROXIES.map(proxy => `${proxy}${encodeURIComponent(url)}`)
    
    for (const proxiedUrl of proxiedUrls) {
      try {
        const response = await fetch(proxiedUrl)
        if (response.ok) {
          const data = await response.json()
          // Handle allorigins wrapper
          return data.contents ? JSON.parse(data.contents) : data
        }
      } catch (error) {
        console.warn(`CORS proxy failed: ${proxiedUrl}`, error)
        continue
      }
    }
    
    throw new Error('All CORS proxies failed for CDC API request')
  }
}

// Transform CDC data to our standard format
export function transformCDCData(rawData: CDCResponse[], dataset: CDCDataset): CDCDataPoint[] {
  return rawData
    .filter(item => {
      // Filter out null/undefined values
      const year = item[dataset.yearField]
      const value = item[dataset.dataField]
      return year && value && !isNaN(Number(year)) && !isNaN(Number(value))
    })
    .map(item => ({
      year: parseInt(item[dataset.yearField] as string),
      value: parseFloat(item[dataset.dataField] as string),
      ...(item.state && { state: item.state as string }),
      ...(item.category && { category: item.category as string })
    }))
    .sort((a, b) => a.year - b.year)
}

// Fetch and process CDC dataset
export async function fetchCDCDataset(dataset: CDCDataset): Promise<CDCDataPoint[]> {
  try {
    console.log(`Fetching CDC data for: ${dataset.name}`)
    
    const url = buildCDCUrl(dataset)
    const rawData = await fetchWithFallback(url)
    
    const transformedData = transformCDCData(rawData, dataset)
    
    console.log(`Successfully fetched ${transformedData.length} data points for ${dataset.name}`)
    return transformedData
    
  } catch (error) {
    console.error(`Error fetching CDC dataset ${dataset.id}:`, error)
    throw error
  }
}

// Fetch all CDC datasets
export async function fetchAllCDCData(): Promise<Record<string, CDCDataPoint[]>> {
  const results: Record<string, CDCDataPoint[]> = {}
  
  for (const dataset of cdcDatasets) {
    try {
      results[dataset.id] = await fetchCDCDataset(dataset)
      // Add delay to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 100))
    } catch (error) {
      console.error(`Failed to fetch ${dataset.id}:`, error)
      results[dataset.id] = []
    }
  }
  
  return results
}

// Generate metadata for CDC datasets
export function generateCDCMetadata(dataset: CDCDataset, data: CDCDataPoint[]) {
  return {
    id: dataset.id,
    name: dataset.name,
    unit: dataset.unit,
    category: dataset.category,
    description: dataset.description,
    source: dataset.source,
    sourceUrl: dataset.apiEndpoint,
    citation: `Centers for Disease Control and Prevention. ${dataset.name}. Retrieved from CDC Open Data Portal.`,
    methodology: "Real-time data from CDC's Open Data API using official government health statistics",
    isAIGenerated: false,
    isRealData: true,
    dataQuality: "Official Government Data - High Accuracy",
    updateFrequency: "Updated when new CDC data is published",
    geographicScope: "United States",
    timePeriod: data.length > 0 ? `${Math.min(...data.map(d => d.year))}-${Math.max(...data.map(d => d.year))}` : "No data",
    dataPoints: data.length,
    lastUpdated: new Date().toISOString(),
    apiProvider: "CDC Open Data Portal",
    tags: [
      "health",
      "government-data",
      "real-data",
      "cdc",
      "official-statistics",
      "public-health"
    ],
    disclaimer: "This data is sourced directly from the Centers for Disease Control and Prevention (CDC) and represents official U.S. health statistics."
  }
}

export default {
  cdcDatasets,
  fetchCDCDataset,
  fetchAllCDCData,
  transformCDCData,
  generateCDCMetadata
}