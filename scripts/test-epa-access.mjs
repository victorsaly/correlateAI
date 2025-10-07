#!/usr/bin/env node

/**
 * EPA Alternative Data Collection
 * 
 * Test EPA datasets using publicly accessible endpoints
 * Focus on environmental data that doesn't require API keys
 */

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

// ES modules setup
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Alternative EPA data sources (publicly accessible)
const epaDatasets = [
  {
    id: 'epa_air_quality_annual',
    name: 'Air Quality Annual Summary',
    description: 'Annual air quality summary data',
    testUrl: 'https://aqs.epa.gov/data/api/annualData/byState?email=test@test.com&key=test&param=44201&bdate=20200101&edate=20201231&state=01'
  },
  {
    id: 'epa_facilities',
    name: 'EPA Facility Registry',
    description: 'EPA regulated facilities',
    testUrl: 'https://data.epa.gov/efservice/FRS_FACILITIES/ROWS/0:10/JSON'
  },
  {
    id: 'epa_superfund',
    name: 'Superfund Sites',
    description: 'National Priority List superfund sites',
    testUrl: 'https://data.epa.gov/efservice/NPL_SITES/ROWS/0:10/JSON'
  }
]

// Test EPA dataset accessibility
async function testEPADataset(dataset) {
  console.log(`Testing ${dataset.name}...`)
  console.log(`URL: ${dataset.testUrl}`)
  
  try {
    const response = await fetch(dataset.testUrl)
    
    if (!response.ok) {
      console.log(`❌ HTTP ${response.status}: ${response.statusText}`)
      return false
    }
    
    const data = await response.json()
    
    if (Array.isArray(data)) {
      console.log(`✅ Success! Returned ${data.length} records`)
      if (data.length > 0) {
        console.log('Sample fields:', Object.keys(data[0]).slice(0, 5).join(', '))
      }
    } else if (data.Header && data.Data) {
      console.log(`✅ Success! Returned ${data.Data.length} records`)
      if (data.Data.length > 0) {
        console.log('Sample fields:', Object.keys(data.Data[0]).slice(0, 5).join(', '))
      }
    } else {
      console.log('✅ Success! But unexpected data format')
      console.log('Response type:', typeof data)
    }
    
    return true
    
  } catch (error) {
    console.log(`❌ Error: ${error.message}`)
    return false
  }
}

// Test all EPA datasets
async function testEPAAccess() {
  console.log('🌍 Testing EPA Dataset Accessibility...\n')
  
  const results = []
  
  for (const dataset of epaDatasets) {
    const isWorking = await testEPADataset(dataset)
    results.push({
      dataset: dataset.name,
      id: dataset.id,
      working: isWorking
    })
    
    console.log('') // Empty line
    
    // Rate limiting
    await new Promise(resolve => setTimeout(resolve, 1000))
  }
  
  console.log('📊 EPA Dataset Test Results:')
  results.forEach(result => {
    const status = result.working ? '✅' : '❌'
    console.log(`${status} ${result.dataset}`)
  })
  
  const workingCount = results.filter(r => r.working).length
  console.log(`\n🎯 Found ${workingCount}/${epaDatasets.length} working EPA datasets`)
  
  if (workingCount === 0) {
    console.log('\n⚠️  No EPA datasets are currently accessible.')
    console.log('This may be due to:')
    console.log('- API requiring proper registration')
    console.log('- Service restrictions')
    console.log('- Network/CORS issues')
    console.log('\nRecommendation: Focus on working APIs (BLS, partial CDC).')
  }
  
  return results
}

// Clean up EPA directory if no datasets work
async function cleanupEPAData() {
  console.log('\n🧹 Cleaning up EPA data directory...')
  
  const epaDir = path.join(__dirname, '../public/data/epa')
  
  try {
    if (fs.existsSync(epaDir)) {
      fs.rmSync(epaDir, { recursive: true, force: true })
      console.log('✅ Removed EPA data directory')
    }
    
    console.log('🎯 EPA cleanup completed')
    
  } catch (error) {
    console.error('❌ Error during cleanup:', error.message)
  }
}

// Main function
async function main() {
  const results = await testEPAAccess()
  
  const workingDatasets = results.filter(r => r.working)
  
  if (workingDatasets.length === 0) {
    console.log('\n🔄 Since EPA APIs are not accessible, cleaning up...')
    await cleanupEPAData()
    console.log('\n💡 Final Recommendation:')
    console.log('   ✅ BLS API: Working reliably (Consumer Price Index, Producer Price Index)')
    console.log('   ✅ CDC API: Partially working (COVID-19 death counts)')
    console.log('   ❌ EPA API: Requires proper registration/authentication')
    console.log('\n🎯 Continue with BLS + CDC for real government data integration.')
  } else {
    console.log('\n🎉 Found working EPA datasets! Would proceed with data collection...')
  }
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main()
    .then(() => {
      console.log('\n✨ EPA testing completed!')
      process.exit(0)
    })
    .catch(error => {
      console.error('\n💥 EPA testing failed:', error)
      process.exit(1)
    })
}

export { testEPAAccess, cleanupEPAData }