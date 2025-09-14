#!/usr/bin/env node

/**
 * Data Prefetch Script
 * 
 * This script fetches all economic data from FRED and World Bank APIs
 * during build time and stores it as static JSON files.
 * This eliminates CORS issues and makes the app much faster and more reliable.
 */

import { writeFile, mkdir } from 'fs/promises'
import { join } from 'path'
import { config } from 'dotenv'
import fetch from 'node-fetch'
import https from 'https'

// Create an HTTPS agent that accepts self-signed certificates
const httpsAgent = new https.Agent({
  rejectUnauthorized: false
})

// Load environment variables from .env file
config()

// FRED API configuration
const FRED_API_KEY = process.env.VITE_FRED_API_KEY

if (!FRED_API_KEY) {
  console.error('❌ FRED API key not found. Please set VITE_FRED_API_KEY environment variable.')
  process.exit(1)
}

// Delay between requests to respect rate limits
const DELAY_MS = 100

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

// Dataset definitions (same as in dataService.ts)
const datasets = [
  // FRED API - US Economic Data
  { id: 'gdp', name: 'US GDP', source: 'FRED', seriesId: 'GDP' },
  { id: 'unemployment', name: 'Unemployment Rate', source: 'FRED', seriesId: 'UNRATE' },
  { id: 'inflation', name: 'Consumer Price Index', source: 'FRED', seriesId: 'CPIAUCSL' },
  { id: 'interest_rate', name: 'Federal Funds Rate', source: 'FRED', seriesId: 'FEDFUNDS' },
  { id: 'housing_starts', name: 'Housing Starts', source: 'FRED', seriesId: 'HOUST' },
  { id: 'personal_income', name: 'Personal Income', source: 'FRED', seriesId: 'PI' },
  { id: 'retail_sales', name: 'Retail Sales', source: 'FRED', seriesId: 'RSAFS' },
  { id: 'consumer_sentiment', name: 'Consumer Sentiment', source: 'FRED', seriesId: 'UMCSENT' },
  { id: 'industrial_production', name: 'Industrial Production', source: 'FRED', seriesId: 'INDPRO' },
  { id: 'stock_market', name: 'S&P 500', source: 'FRED', seriesId: 'SP500' },
  { id: 'oil_price', name: 'Oil Price', source: 'FRED', seriesId: 'DCOILWTICO' },
  { id: 'gold_price', name: 'Gold Price', source: 'FRED', seriesId: 'GOLDAMGBD228NLBM' },
  { id: 'labor_force_participation', name: 'Labor Force Participation', source: 'FRED', seriesId: 'CIVPART' },
  { id: 'median_household_income', name: 'Median Household Income', source: 'FRED', seriesId: 'MEHOINUSA646N' },
  { id: 'exports', name: 'US Exports', source: 'FRED', seriesId: 'EXPGS' },
  { id: 'imports', name: 'US Imports', source: 'FRED', seriesId: 'IMPGS' },
  { id: 'government_debt', name: 'Federal Debt', source: 'FRED', seriesId: 'GFDEBTN' },
  { id: 'money_supply', name: 'Money Supply M2', source: 'FRED', seriesId: 'M2SL' },
  { id: 'manufacturing_employment', name: 'Manufacturing Employment', source: 'FRED', seriesId: 'MANEMP' },
  { id: 'construction_spending', name: 'Construction Spending', source: 'FRED', seriesId: 'TTLCONS' },

  // World Bank Data - Global Indicators
  { id: 'wb_gdp_per_capita', name: 'GDP Per Capita (World Bank)', source: 'WorldBank', seriesId: 'NY.GDP.PCAP.CD' },
  { id: 'wb_population', name: 'Population (World Bank)', source: 'WorldBank', seriesId: 'SP.POP.TOTL' },
  { id: 'wb_life_expectancy', name: 'Life Expectancy (World Bank)', source: 'WorldBank', seriesId: 'SP.DYN.LE00.IN' },
  { id: 'wb_co2_emissions', name: 'CO2 Emissions (World Bank)', source: 'WorldBank', seriesId: 'EN.ATM.CO2E.PC' },
  { id: 'wb_internet_users', name: 'Internet Users (World Bank)', source: 'WorldBank', seriesId: 'IT.NET.USER.ZS' },
  { id: 'wb_mobile_subscriptions', name: 'Mobile Subscriptions (World Bank)', source: 'WorldBank', seriesId: 'IT.CEL.SETS.P2' },
  { id: 'wb_urban_population', name: 'Urban Population (World Bank)', source: 'WorldBank', seriesId: 'SP.URB.TOTL.IN.ZS' },
  { id: 'wb_energy_use', name: 'Energy Use (World Bank)', source: 'WorldBank', seriesId: 'EG.USE.PCAP.KG.OE' },
  { id: 'wb_trade_balance', name: 'Trade Balance (World Bank)', source: 'WorldBank', seriesId: 'NE.RSB.GNFS.ZS' },
  { id: 'wb_foreign_investment', name: 'Foreign Direct Investment (World Bank)', source: 'WorldBank', seriesId: 'BX.KLT.DINV.WD.GD.ZS' },
  { id: 'wb_school_enrollment', name: 'School Enrollment (World Bank)', source: 'WorldBank', seriesId: 'SE.TER.ENRR' },
  { id: 'wb_inflation_rate', name: 'Inflation Rate (World Bank)', source: 'WorldBank', seriesId: 'FP.CPI.TOTL.ZG' }
]

// Build API URLs
const buildFredUrl = (seriesId) => 
  `https://api.stlouisfed.org/fred/series/observations?series_id=${seriesId}&api_key=${FRED_API_KEY}&file_type=json&frequency=a&observation_start=2014-01-01`

const buildWorldBankUrl = (indicator, country = 'US') => 
  `https://api.worldbank.org/v2/country/${country}/indicator/${indicator}?format=json&date=2014:2024&per_page=1000`

// Data transformation functions
const transformFredData = (fredResponse) => {
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
    .filter(point => point !== null)
    .filter(point => point.year >= 2014 && point.year <= 2024)
    .sort((a, b) => a.year - b.year)
}

const transformWorldBankData = (wbResponse) => {
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
      if (!item || typeof item.date !== 'string' || typeof item.value !== 'number') {
        return null
      }
      
      const year = parseInt(item.date)
      const value = item.value
      
      if (isNaN(year) || isNaN(value) || value === null) {
        return null
      }
      
      return { year, value }
    })
    .filter(point => point !== null)
    .filter(point => point.year >= 2014 && point.year <= 2024)
    .sort((a, b) => a.year - b.year)
}

// Fetch data for a single dataset
const fetchDataset = async (dataset) => {
  console.log(`🔄 Fetching: ${dataset.name}`)
  
  try {
    let url
    if (dataset.source === 'FRED') {
      url = buildFredUrl(dataset.seriesId)
    } else if (dataset.source === 'WorldBank') {
      url = buildWorldBankUrl(dataset.seriesId)
    } else {
      throw new Error(`Unknown data source: ${dataset.source}`)
    }

    const response = await fetch(url, { 
      agent: url.startsWith('https:') ? httpsAgent : undefined 
    })
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`)
    }

    const data = await response.json()
    
    let transformedData
    if (dataset.source === 'FRED') {
      transformedData = transformFredData(data)
    } else if (dataset.source === 'WorldBank') {
      transformedData = transformWorldBankData(data)
    }

    if (transformedData.length === 0) {
      console.warn(`⚠️  No data found for ${dataset.name}`)
      return { ...dataset, data: [] }
    }

    console.log(`✅ ${dataset.name}: ${transformedData.length} data points`)
    return { ...dataset, data: transformedData }

  } catch (error) {
    console.error(`❌ Failed to fetch ${dataset.name}:`, error.message)
    return { ...dataset, data: [], error: error.message }
  }
}

// Main prefetch function
const prefetchAllData = async () => {
  console.log('🚀 Starting data prefetch...')
  console.log(`📊 Fetching ${datasets.length} datasets`)
  
  // Create data directory
  await mkdir('public/data', { recursive: true })
  
  const results = []
  
  for (let i = 0; i < datasets.length; i++) {
    const dataset = datasets[i]
    const result = await fetchDataset(dataset)
    results.push(result)
    
    // Add delay to respect rate limits
    if (i < datasets.length - 1) {
      await delay(DELAY_MS)
    }
  }
  
  // Save individual dataset files
  for (const result of results) {
    const filename = `${result.id}.json`
    const filepath = join('public/data', filename)
    await writeFile(filepath, JSON.stringify(result.data, null, 2))
  }
  
  // Save combined datasets file
  const datasetsInfo = results.map(r => ({
    id: r.id,
    name: r.name,
    source: r.source,
    seriesId: r.seriesId,
    dataPoints: r.data.length,
    error: r.error || null
  }))
  
  await writeFile('public/data/datasets.json', JSON.stringify(datasetsInfo, null, 2))
  
  // Save summary
  const successful = results.filter(r => !r.error).length
  const failed = results.filter(r => r.error).length
  
  const summary = {
    timestamp: new Date().toISOString(),
    total: results.length,
    successful,
    failed,
    datasets: datasetsInfo
  }
  
  await writeFile('public/data/summary.json', JSON.stringify(summary, null, 2))
  
  console.log('\n📈 Prefetch Summary:')
  console.log(`✅ Successful: ${successful}/${results.length}`)
  console.log(`❌ Failed: ${failed}/${results.length}`)
  console.log(`📁 Data saved to: public/data/`)
  
  if (failed > 0) {
    console.log('\n⚠️  Failed datasets:')
    results.filter(r => r.error).forEach(r => {
      console.log(`   - ${r.name}: ${r.error}`)
    })
  }
  
  console.log('\n🎉 Data prefetch complete!')
}

// Run the prefetch
prefetchAllData().catch(error => {
  console.error('💥 Prefetch failed:', error)
  process.exit(1)
})