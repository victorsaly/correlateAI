#!/usr/bin/env node

/**
 * CDC Working Datasets Collection Script
 * 
 * Collects data from verified working CDC datasets
 */

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

// ES modules setup
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Working CDC datasets (verified accessible)
const workingCDCDatasets = [
  {
    id: 'cdc_weekly_deaths',
    name: 'Weekly Deaths from All Causes',
    unit: 'deaths per week',
    datasetId: 'muzy-jte6',
    description: 'Weekly counts of deaths from all causes by jurisdiction',
    yearField: 'mmwryear',
    dataField: 'number_of_deaths',
    jurisdictionField: 'jurisdiction_of_occurrence'
  },
  {
    id: 'cdc_covid_deaths',
    name: 'COVID-19 Death Counts',
    unit: 'total deaths',
    datasetId: '9bhg-hcku',
    description: 'Provisional death counts involving COVID-19 by state',
    dateField: 'start_date',
    dataField: 'covid_19_deaths',
    stateField: 'state'
  }
]

// Create directories
const dataDir = path.join(__dirname, '../public/data/cdc')
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true })
  console.log('Created CDC data directory')
}

// Fetch and process CDC data
async function fetchCDCDataset(dataset) {
  const url = `https://data.cdc.gov/resource/${dataset.datasetId}.json?$limit=5000&$order=${dataset.yearField || dataset.dateField}%20ASC`
  
  console.log(`Fetching ${dataset.name} from CDC...`)
  console.log(`URL: ${url}`)
  
  try {
    const response = await fetch(url)
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`)
    }
    
    const rawData = await response.json()
    console.log(`Raw data length: ${rawData.length}`)
    
    let processedData = []
    
    if (dataset.id === 'cdc_weekly_deaths') {
      // Process weekly deaths - aggregate by year for national totals
      const nationalData = rawData.filter(item => 
        item.jurisdiction_of_occurrence === 'United States' && 
        item.number_of_deaths && 
        !isNaN(parseInt(item.number_of_deaths))
      )
      
      // Group by year and calculate annual totals
      const yearlyTotals = {}
      nationalData.forEach(item => {
        const year = parseInt(item.mmwryear)
        const deaths = parseInt(item.number_of_deaths)
        
        if (year >= 2014 && year <= 2024) {
          if (!yearlyTotals[year]) {
            yearlyTotals[year] = 0
          }
          yearlyTotals[year] += deaths
        }
      })
      
      processedData = Object.entries(yearlyTotals)
        .map(([year, totalDeaths]) => ({
          year: parseInt(year),
          value: totalDeaths
        }))
        .sort((a, b) => a.year - b.year)
      
    } else if (dataset.id === 'cdc_covid_deaths') {
      // Process COVID deaths - get US total by year
      const usData = rawData.filter(item => 
        item.state === 'United States' &&
        item.covid_19_deaths && 
        !isNaN(parseInt(item.covid_19_deaths))
      )
      
      // Group by year
      const yearlyData = {}
      usData.forEach(item => {
        if (item.start_date) {
          const year = new Date(item.start_date).getFullYear()
          const deaths = parseInt(item.covid_19_deaths)
          
          if (year >= 2020 && year <= 2024) { // COVID data starts in 2020
            if (!yearlyData[year]) {
              yearlyData[year] = []
            }
            yearlyData[year].push(deaths)
          }
        }
      })
      
      // Calculate annual averages/totals
      processedData = Object.entries(yearlyData)
        .map(([year, values]) => ({
          year: parseInt(year),
          value: Math.max(...values) // Use maximum reported for the year
        }))
        .sort((a, b) => a.year - b.year)
    }
    
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
    category: 'health',
    description: dataset.description,
    source: 'Centers for Disease Control and Prevention (CDC)',
    sourceUrl: `https://data.cdc.gov/resource/${dataset.datasetId}`,
    citation: `Centers for Disease Control and Prevention. ${dataset.name}. CDC Open Data Portal.`,
    methodology: "Official CDC health statistics from government surveillance systems",
    isAIGenerated: false,
    isRealData: true,
    dataQuality: "Official Government Data - CDC",
    updateFrequency: "Updated when new CDC data is available",
    geographicScope: "United States",
    timePeriod: data.length > 0 ? `${Math.min(...data.map(d => d.year))}-${Math.max(...data.map(d => d.year))}` : "No data",
    dataPoints: data.length,
    lastUpdated: new Date().toISOString(),
    apiProvider: "CDC Open Data Portal",
    filename: `cdc_${dataset.id.replace('cdc_', '')}`,
    tags: [
      "health",
      "government-data",
      "real-data",
      "cdc",
      "official-statistics",
      "public-health"
    ]
  }
}

// Main collection function
async function collectWorkingCDCData() {
  console.log('🏥 Starting CDC Data Collection (Working Datasets)...\n')
  
  const results = []
  
  for (const dataset of workingCDCDatasets) {
    try {
      const data = await fetchCDCDataset(dataset)
      
      if (data.length > 0) {
        // Save data file
        const dataFile = path.join(dataDir, `cdc_${dataset.id.replace('cdc_', '')}.json`)
        const dataContent = {
          metadata: generateMetadata(dataset, data),
          data: data
        }
        
        fs.writeFileSync(dataFile, JSON.stringify(dataContent, null, 2))
        
        // Save metadata file
        const metadataFile = path.join(dataDir, `cdc_${dataset.id.replace('cdc_', '')}_metadata.json`)
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
      
      // Rate limiting delay
      await new Promise(resolve => setTimeout(resolve, 1000))
      
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
  console.log('📊 CDC Data Collection Summary:')
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
  console.log(`\n🎯 Successfully collected ${successCount}/${workingCDCDatasets.length} CDC datasets`)
  
  return results
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  collectWorkingCDCData()
    .then(() => {
      console.log('\n✨ CDC data collection completed!')
      process.exit(0)
    })
    .catch(error => {
      console.error('\n💥 CDC data collection failed:', error)
      process.exit(1)
    })
}

export { collectWorkingCDCData }