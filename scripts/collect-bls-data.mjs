#!/usr/bin/env node

/**
 * Bureau of Labor Statistics (BLS) Data Collection Script
 * 
 * Fetches real employment and economic data from the BLS API
 * Replaces AI-generated labor/employment datasets with authentic government data
 * 
 * BLS API Documentation: https://www.bls.gov/developers/api_signature_v2.htm
 * No registration required for basic usage (25 requests/day)
 */

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

// ES modules setup
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// BLS API configuration
const BLS_BASE_URL = 'https://api.bls.gov/publicAPI/v2'

// BLS datasets to collect (using popular series IDs)
const blsDatasets = [
  {
    id: 'bls_unemployment_rate',
    name: 'Unemployment Rate',
    unit: 'percent',
    seriesId: 'LNS14000000', // Unemployment Rate - 16 years & over
    description: 'Civilian unemployment rate for persons 16 years and over'
  },
  {
    id: 'bls_labor_force_participation',
    name: 'Labor Force Participation Rate',
    unit: 'percent',
    seriesId: 'LNS11300000', // Labor Force Participation Rate
    description: 'Civilian labor force participation rate'
  },
  {
    id: 'bls_employment_population_ratio',
    name: 'Employment-Population Ratio',
    unit: 'percent',
    seriesId: 'LNS12300000', // Employment-Population Ratio
    description: 'Employment as a percentage of the civilian noninstitutional population'
  },
  {
    id: 'bls_nonfarm_employment',
    name: 'Total Nonfarm Employment',
    unit: 'thousands of jobs',
    seriesId: 'CES0000000001', // Total Nonfarm Employment
    description: 'Total nonfarm payroll employment'
  },
  {
    id: 'bls_average_hourly_earnings',
    name: 'Average Hourly Earnings',
    unit: 'dollars per hour',
    seriesId: 'CES0500000003', // Average Hourly Earnings - Total Private
    description: 'Average hourly earnings of production and nonsupervisory employees in total private sector'
  },
  {
    id: 'bls_consumer_price_index',
    name: 'Consumer Price Index',
    unit: 'index (1982-84=100)',
    seriesId: 'CUUR0000SA0', // CPI-U All Items
    description: 'Consumer Price Index for All Urban Consumers (CPI-U): All Items'
  },
  {
    id: 'bls_producer_price_index',
    name: 'Producer Price Index',
    unit: 'index (Nov 2009=100)',
    seriesId: 'WPUFD49207', // Producer Price Index - Final Demand
    description: 'Producer Price Index by Commodity for Final Demand'
  }
]

// Create directories
const dataDir = path.join(__dirname, '../public/data/bls')
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true })
  console.log('Created BLS data directory')
}

// Fetch data from BLS API
async function fetchBLSData(dataset) {
  const startYear = 2014
  const endYear = 2024
  
  const requestBody = {
    seriesid: [dataset.seriesId],
    startyear: startYear.toString(),
    endyear: endYear.toString(),
    catalog: false,
    calculations: false,
    annualaverage: true
  }
  
  console.log(`Fetching ${dataset.name} from BLS...`)
  console.log(`Series ID: ${dataset.seriesId}`)
  
  try {
    const response = await fetch(`${BLS_BASE_URL}/timeseries/data/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(requestBody)
    })
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`)
    }
    
    const rawData = await response.json()
    
    if (rawData.status !== 'REQUEST_SUCCEEDED') {
      throw new Error(`BLS API Error: ${rawData.message || 'Unknown error'}`)
    }
    
    if (!rawData.Results || !rawData.Results.series || rawData.Results.series.length === 0) {
      console.log('No series data available')
      return []
    }
    
    const series = rawData.Results.series[0]
    if (!series.data || series.data.length === 0) {
      console.log('No data points available')
      return []
    }
    
    console.log(`Raw data length: ${series.data.length}`)
    
    // Filter and transform data (get annual averages only)
    const processedData = series.data
      .filter(item => {
        const year = parseInt(item.year)
        const period = item.period
        const value = parseFloat(item.value)
        
        // Only include annual averages (period M13) and valid values
        return period === 'M13' && !isNaN(value) && year >= startYear && year <= endYear
      })
      .map(item => ({
        year: parseInt(item.year),
        value: parseFloat(item.value)
      }))
      .sort((a, b) => a.year - b.year)
    
    console.log(`Processed ${processedData.length} annual data points`)
    return processedData
    
  } catch (error) {
    console.error(`Error fetching ${dataset.name}:`, error.message)
    return []
  }
}

// Generate metadata
function generateMetadata(dataset, data) {
  return {
    id: dataset.id,
    name: dataset.name,
    unit: dataset.unit,
    category: 'economics',
    description: dataset.description,
    source: 'U.S. Bureau of Labor Statistics (BLS)',
    sourceUrl: `https://data.bls.gov/timeseries/${dataset.seriesId}`,
    citation: `U.S. Bureau of Labor Statistics. ${dataset.name}, retrieved from BLS Data Portal.`,
    methodology: "Official labor statistics from the U.S. Bureau of Labor Statistics using government employment and economic surveys",
    isAIGenerated: false,
    isRealData: true,
    dataQuality: "Official Government Data - BLS",
    updateFrequency: "Updated monthly by BLS",
    geographicScope: "United States",
    timePeriod: data.length > 0 ? `${Math.min(...data.map(d => d.year))}-${Math.max(...data.map(d => d.year))}` : "No data",
    dataPoints: data.length,
    lastUpdated: new Date().toISOString(),
    apiProvider: "Bureau of Labor Statistics API",
    seriesId: dataset.seriesId,
    filename: `bls_${dataset.id.replace('bls_', '')}`,
    tags: [
      "economics",
      "employment",
      "government-data",
      "real-data",
      "bls",
      "labor-statistics",
      "economic-indicators"
    ]
  }
}

// Main collection function
async function collectBLSData() {
  console.log('💼 Starting BLS Labor Statistics Data Collection...\n')
  
  const results = []
  
  for (const dataset of blsDatasets) {
    try {
      const data = await fetchBLSData(dataset)
      
      if (data.length > 0) {
        // Save data file
        const dataFile = path.join(dataDir, `bls_${dataset.id.replace('bls_', '')}.json`)
        const dataContent = {
          metadata: generateMetadata(dataset, data),
          data: data
        }
        
        fs.writeFileSync(dataFile, JSON.stringify(dataContent, null, 2))
        
        // Save metadata file
        const metadataFile = path.join(dataDir, `bls_${dataset.id.replace('bls_', '')}_metadata.json`)
        fs.writeFileSync(metadataFile, JSON.stringify(generateMetadata(dataset, data), null, 2))
        
        console.log(`✅ Saved ${dataset.name}: ${data.length} data points`)
        results.push({
          dataset: dataset.name,
          dataPoints: data.length,
          status: 'success'
        })
      } else {
        console.log(`❌ No data available for ${dataset.name}`)
        results.push({
          dataset: dataset.name,
          dataPoints: 0,
          status: 'no_data'
        })
      }
      
      // Rate limiting delay (BLS has 25 requests/day limit for unregistered users)
      await new Promise(resolve => setTimeout(resolve, 2000))
      
    } catch (error) {
      console.error(`❌ Failed to collect ${dataset.name}:`, error.message)
      results.push({
        dataset: dataset.name,
        error: error.message,
        status: 'error'
      })
    }
    
    console.log('') // Empty line for readability
  }
  
  // Generate summary
  console.log('📊 BLS Data Collection Summary:')
  results.forEach(result => {
    if (result.status === 'success') {
      console.log(`✅ ${result.dataset}: ${result.dataPoints} data points`)
    } else if (result.status === 'no_data') {
      console.log(`⚠️  ${result.dataset}: No data available`)
    } else {
      console.log(`❌ ${result.dataset}: ${result.error}`)
    }
  })
  
  const successCount = results.filter(r => r.status === 'success').length
  console.log(`\n🎯 Successfully collected ${successCount}/${blsDatasets.length} BLS datasets`)
  
  return results
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  collectBLSData()
    .then(() => {
      console.log('\n✨ BLS data collection completed!')
      process.exit(0)
    })
    .catch(error => {
      console.error('\n💥 BLS data collection failed:', error)
      process.exit(1)
    })
}

export { collectBLSData, blsDatasets }