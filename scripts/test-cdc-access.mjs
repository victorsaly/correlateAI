#!/usr/bin/env node

/**
 * CDC WONDER API Alternative Data Collection
 * 
 * Uses simpler CDC datasets that are publicly accessible
 * Focus on basic health statistics that don't require complex authentication
 */

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

// ES modules setup
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Alternative approach: Use CDC's more accessible datasets
const cdcDatasets = [
  {
    id: 'cdc_weekly_deaths',
    name: 'Weekly Deaths from All Causes',
    unit: 'deaths per week',
    datasetId: 'muzy-jte6', // Weekly counts of deaths by jurisdiction and age group
    description: 'Weekly counts of deaths from all causes'
  },
  {
    id: 'cdc_provisional_covid_deaths',
    name: 'Provisional COVID-19 Death Counts',
    unit: 'total deaths',
    datasetId: '9bhg-hcku', // COVID-19 death counts by state
    description: 'Provisional death counts involving COVID-19'
  },
  {
    id: 'cdc_chronic_disease_indicators',
    name: 'Chronic Disease Indicators',
    unit: 'rate per 100k',
    datasetId: 'g4ie-h725', // Chronic Disease Indicators
    description: 'Chronic disease indicators including heart disease, diabetes, cancer'
  }
]

// Create directories
const dataDir = path.join(__dirname, '../public/data/cdc')
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true })
  console.log('Created CDC data directory')
}

// Test CDC dataset accessibility
async function testCDCDataset(dataset) {
  const url = `https://data.cdc.gov/resource/${dataset.datasetId}.json?$limit=10`
  
  console.log(`Testing ${dataset.name}...`)
  console.log(`URL: ${url}`)
  
  try {
    const response = await fetch(url)
    
    if (!response.ok) {
      console.log(`❌ HTTP ${response.status}: ${response.statusText}`)
      return false
    }
    
    const data = await response.json()
    console.log(`✅ Success! Returned ${data.length} sample records`)
    
    if (data.length > 0) {
      console.log('Sample fields:', Object.keys(data[0]).slice(0, 5).join(', '))
    }
    
    return true
    
  } catch (error) {
    console.log(`❌ Error: ${error.message}`)
    return false
  }
}

// Find working CDC datasets
async function findWorkingCDCDatasets() {
  console.log('🏥 Testing CDC Dataset Accessibility...\n')
  
  const results = []
  
  for (const dataset of cdcDatasets) {
    const isWorking = await testCDCDataset(dataset)
    results.push({
      dataset: dataset.name,
      id: dataset.id,
      datasetId: dataset.datasetId,
      working: isWorking
    })
    
    console.log('') // Empty line
    
    // Rate limiting
    await new Promise(resolve => setTimeout(resolve, 1000))
  }
  
  console.log('📊 CDC Dataset Test Results:')
  results.forEach(result => {
    const status = result.working ? '✅' : '❌'
    console.log(`${status} ${result.dataset} (${result.datasetId})`)
  })
  
  const workingCount = results.filter(r => r.working).length
  console.log(`\n🎯 Found ${workingCount}/${cdcDatasets.length} working CDC datasets`)
  
  if (workingCount === 0) {
    console.log('\n⚠️  No CDC datasets are currently accessible.')
    console.log('This may be due to:')
    console.log('- API rate limiting')
    console.log('- Dataset access restrictions')
    console.log('- Temporary service issues')
    console.log('\nRecommendation: Focus on BLS data which is working reliably.')
  }
  
  return results
}

// Clean up failed CDC attempts
async function cleanupCDCData() {
  console.log('\n🧹 Cleaning up failed CDC data attempts...')
  
  try {
    // Remove CDC directory and contents
    if (fs.existsSync(dataDir)) {
      fs.rmSync(dataDir, { recursive: true, force: true })
      console.log('✅ Removed CDC data directory')
    }
    
    console.log('🎯 CDC cleanup completed')
    
  } catch (error) {
    console.error('❌ Error during cleanup:', error.message)
  }
}

// Main function
async function main() {
  const results = await findWorkingCDCDatasets()
  
  const workingDatasets = results.filter(r => r.working)
  
  if (workingDatasets.length === 0) {
    console.log('\n🔄 Since CDC APIs are not accessible, cleaning up...')
    await cleanupCDCData()
    console.log('\n💡 Recommendation: Continue with the successful BLS integration.')
    console.log('   BLS provides excellent economic/employment data that complements your existing APIs.')
  } else {
    console.log('\n🎉 Found working CDC datasets! Proceeding with data collection...')
    // Here we would implement the actual data collection for working datasets
  }
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main()
    .then(() => {
      console.log('\n✨ CDC testing completed!')
      process.exit(0)
    })
    .catch(error => {
      console.error('\n💥 CDC testing failed:', error)
      process.exit(1)
    })
}

export { findWorkingCDCDatasets, cleanupCDCData }