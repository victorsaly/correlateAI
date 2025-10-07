/**
 * EPA Air Quality API Service
 * 
 * Integrates with EPA's Air Quality System (AQS) API to fetch real environmental data
 * Replaces AI-generated environmental datasets with authentic government data
 * 
 * EPA AQS API Documentation: https://aqs.epa.gov/aqsweb/documents/data_api.html
 * Registration: https://aqs.epa.gov/aqsweb/documents/data_api.html#signup
 */

export interface EPADataPoint {
  year: number
  value: number
  parameter?: string
  units?: string
  site?: string
  county?: string
  state?: string
}

export interface EPADataset {
  id: string
  name: string
  unit: string
  source: string
  category: string
  description: string
  parameterCode: string
  endpoint: string
  geographicLevel: 'national' | 'state' | 'county'
  stateFips?: string
  countyCode?: string
}

// EPA API configuration
const EPA_BASE_URL = 'https://aqs.epa.gov/data/api'
const EPA_API_KEY = import.meta.env.VITE_EPA_API_KEY || 'test@test.com' // EPA allows test email for basic queries
const EPA_API_EMAIL = EPA_API_KEY

// Detect environment for CORS handling
const isDevelopment = import.meta.env.DEV

// CORS proxy services for production
const CORS_PROXIES = [
  'https://api.allorigins.win/get?url=',
  'https://corsproxy.io/?',
  'https://api.codetabs.com/v1/proxy?quest='
]

// Helper function to build EPA API URLs
const buildEPAUrl = (dataset: EPADataset, startYear: number = 2014, endYear: number = 2024) => {
  const baseUrl = `${EPA_BASE_URL}/${dataset.endpoint}`
  const params = new URLSearchParams({
    email: EPA_API_EMAIL,
    key: EPA_API_KEY,
    param: dataset.parameterCode,
    bdate: `${startYear}0101`, // YYYYMMDD format
    edate: `${endYear}1231`,   // YYYYMMDD format
    ...(dataset.stateFips && { state: dataset.stateFips }),
    ...(dataset.countyCode && { county: dataset.countyCode })
  })
  
  const fullUrl = `${baseUrl}?${params.toString()}`
  
  if (isDevelopment) {
    // Development: Use Vite proxy
    return `/api/epa/${dataset.endpoint}?${params.toString()}`
  } else {
    // Production: Return original URL for CORS proxying
    return fullUrl
  }
}

// EPA REAL ENVIRONMENTAL DATASETS
export const epaDatasets: EPADataset[] = [
  {
    id: 'epa_ozone_levels',
    name: 'Ground-level Ozone Concentration',
    unit: 'parts per million (ppm)',
    source: 'EPA Air Quality System',
    category: 'environment',
    description: 'Annual average ground-level ozone concentrations nationwide',
    parameterCode: '44201', // Ozone 8-hour average
    endpoint: 'annualData/byState',
    geographicLevel: 'national'
  },
  {
    id: 'epa_pm25_levels',
    name: 'PM2.5 Particulate Matter',
    unit: 'micrograms per cubic meter',
    source: 'EPA Air Quality System',
    category: 'environment', 
    description: 'Annual average PM2.5 particulate matter concentrations',
    parameterCode: '88101', // PM2.5 Local Conditions
    endpoint: 'annualData/byState',
    geographicLevel: 'national'
  },
  {
    id: 'epa_co_levels',
    name: 'Carbon Monoxide Levels',
    unit: 'parts per million (ppm)',
    source: 'EPA Air Quality System',
    category: 'environment',
    description: 'Annual average carbon monoxide concentrations',
    parameterCode: '42101', // Carbon monoxide 8-hour average
    endpoint: 'annualData/byState', 
    geographicLevel: 'national'
  },
  {
    id: 'epa_so2_levels',
    name: 'Sulfur Dioxide Levels',
    unit: 'parts per billion (ppb)',
    source: 'EPA Air Quality System',
    category: 'environment',
    description: 'Annual average sulfur dioxide concentrations',
    parameterCode: '42401', // Sulfur dioxide 1-hour average
    endpoint: 'annualData/byState',
    geographicLevel: 'national'
  },
  {
    id: 'epa_no2_levels',
    name: 'Nitrogen Dioxide Levels', 
    unit: 'parts per billion (ppb)',
    source: 'EPA Air Quality System',
    category: 'environment',
    description: 'Annual average nitrogen dioxide concentrations',
    parameterCode: '42602', // Nitrogen dioxide 1-hour average
    endpoint: 'annualData/byState',
    geographicLevel: 'national'
  }
]

// EPA API Response interface
export interface EPAResponse {
  Header: Array<{
    status: string
    request_time: string
    url: string
    rows: number
  }>
  Data: Array<{
    state_code: string
    county_code: string
    site_num: string
    parameter_code: string
    poc: string
    latitude: string
    longitude: string
    datum: string
    parameter_name: string
    sample_duration: string
    pollutant_standard: string
    date_local: string
    units_of_measure: string
    event_type: string
    observation_count: string
    observation_percent: string
    arithmetic_mean: string
    first_max_value: string
    first_max_hour: string
    aqi: string
    method_code: string
    method_name: string
    local_site_name: string
    address: string
    state_name: string
    county_name: string
    city_name: string
    cbsa_name: string
    date_of_last_change: string
  }>
}

// Fetch data from EPA API with fallback CORS proxies
async function fetchWithFallback(url: string): Promise<EPAResponse> {
  if (isDevelopment) {
    // Development: Direct fetch through Vite proxy
    const response = await fetch(url)
    if (!response.ok) {
      throw new Error(`EPA API request failed: ${response.status} ${response.statusText}`)
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
    
    throw new Error('All CORS proxies failed for EPA API request')
  }
}

// Transform EPA data to our standard format
export function transformEPAData(rawData: EPAResponse, dataset: EPADataset): EPADataPoint[] {
  if (!rawData.Data || rawData.Data.length === 0) {
    console.warn(`No data available for ${dataset.name}`)
    return []
  }
  
  // Group by year and calculate national averages
  const yearlyData: Record<number, number[]> = {}
  
  rawData.Data.forEach(item => {
    const date = new Date(item.date_local)
    const year = date.getFullYear()
    const value = parseFloat(item.arithmetic_mean)
    
    if (!isNaN(value) && year >= 2014 && year <= 2024) {
      if (!yearlyData[year]) {
        yearlyData[year] = []
      }
      yearlyData[year].push(value)
    }
  })
  
  // Calculate national averages by year
  return Object.entries(yearlyData)
    .map(([year, values]) => ({
      year: parseInt(year),
      value: values.reduce((sum, val) => sum + val, 0) / values.length,
      parameter: dataset.parameterCode,
      units: dataset.unit
    }))
    .sort((a, b) => a.year - b.year)
}

// Fetch and process EPA dataset  
export async function fetchEPADataset(dataset: EPADataset): Promise<EPADataPoint[]> {
  try {
    console.log(`Fetching EPA data for: ${dataset.name}`)
    
    const url = buildEPAUrl(dataset)
    const rawData = await fetchWithFallback(url)
    
    const transformedData = transformEPAData(rawData, dataset)
    
    console.log(`Successfully fetched ${transformedData.length} data points for ${dataset.name}`)
    return transformedData
    
  } catch (error) {
    console.error(`Error fetching EPA dataset ${dataset.id}:`, error)
    throw error
  }
}

// Fetch all EPA datasets
export async function fetchAllEPAData(): Promise<Record<string, EPADataPoint[]>> {
  const results: Record<string, EPADataPoint[]> = {}
  
  for (const dataset of epaDatasets) {
    try {
      results[dataset.id] = await fetchEPADataset(dataset)
      // Add delay to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 1000))
    } catch (error) {
      console.error(`Failed to fetch ${dataset.id}:`, error)
      results[dataset.id] = []
    }
  }
  
  return results
}

// Generate metadata for EPA datasets
export function generateEPAMetadata(dataset: EPADataset, data: EPADataPoint[]) {
  return {
    id: dataset.id,
    name: dataset.name,
    unit: dataset.unit,
    category: dataset.category,
    description: dataset.description,
    source: dataset.source,
    sourceUrl: `https://aqs.epa.gov/aqsweb/documents/data_api.html`,
    citation: `U.S. Environmental Protection Agency. ${dataset.name}. Air Quality System Data Mart.`,
    methodology: "Real-time data from EPA's Air Quality System (AQS) using official government environmental monitoring",
    isAIGenerated: false,
    isRealData: true,
    dataQuality: "Official Government Data - EPA AQS",
    updateFrequency: "Updated when new EPA monitoring data is published",
    geographicScope: "United States",
    timePeriod: data.length > 0 ? `${Math.min(...data.map(d => d.year))}-${Math.max(...data.map(d => d.year))}` : "No data",
    dataPoints: data.length,
    lastUpdated: new Date().toISOString(),
    apiProvider: "EPA Air Quality System API",
    parameterCode: dataset.parameterCode,
    tags: [
      "environment",
      "government-data",
      "real-data", 
      "epa",
      "air-quality",
      "environmental-monitoring"
    ],
    disclaimer: "This data is sourced directly from the U.S. Environmental Protection Agency (EPA) Air Quality System and represents official environmental monitoring data."
  }
}

export default {
  epaDatasets,
  fetchEPADataset,
  fetchAllEPAData,
  transformEPAData,
  generateEPAMetadata
}