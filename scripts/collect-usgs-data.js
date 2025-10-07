#!/usr/bin/env node

/**
 * USGS Earthquake Data Collection Script
 * Collects earthquake and geological event data from USGS APIs
 */

import { writeFile, mkdir } from 'fs/promises'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'
import { config } from 'dotenv'

// Load environment variables
config()

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

// USGS API configuration
const USGS_API_KEY = process.env.VITE_USGS_API_KEY // Optional - USGS APIs are mostly public
const USGS_BASE_URL = 'https://earthquake.usgs.gov/fdsnws/event/1'

// Data output configuration
const OUTPUT_DIR = join(__dirname, '..', 'public', 'data')
const USGS_DATA_DIR = join(OUTPUT_DIR, 'usgs')

class USGSDataCollector {
  constructor() {
    this.baseUrl = USGS_BASE_URL
  }

  async collectAllData() {
    console.log('🌋 Starting USGS earthquake data collection...')
    
    try {
      // Ensure output directory exists
      await mkdir(USGS_DATA_DIR, { recursive: true })

      // Collect different types of earthquake data
      const dataCollectionTasks = [
        this.collectRecentEarthquakes(),     // Past 30 days
        this.collectSignificantEarthquakes(), // Past year significant events
        this.collectSeismicActivity(),       // Daily seismic activity index
      ]

      const results = await Promise.allSettled(dataCollectionTasks)
      
      // Process results
      const successful = results.filter(r => r.status === 'fulfilled').length
      const failed = results.filter(r => r.status === 'rejected').length

      console.log(`🎯 USGS data collection summary:`)
      console.log(`✅ Successful: ${successful}/${results.length}`)
      if (failed > 0) {
        console.log(`❌ Failed: ${failed}/${results.length}`)
        results.forEach((result, index) => {
          if (result.status === 'rejected') {
            console.log(`   - Task ${index + 1}: ${result.reason}`)
          }
        })
      }

      // Generate metadata
      await this.generateMetadata(successful)

      console.log('🎉 USGS data collection complete!')
      return { successful, failed, total: results.length }

    } catch (error) {
      console.error('❌ USGS data collection failed:', error.message)
      throw error
    }
  }

  async collectRecentEarthquakes() {
    try {
      console.log('🌍 Collecting recent earthquake data...')
      
      // Get earthquakes from the past 30 days
      const endTime = new Date().toISOString()
      const startTime = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()
      
      const url = `${this.baseUrl}/query?format=geojson&starttime=${startTime}&endtime=${endTime}&minmagnitude=2.5`
      
      const response = await this.fetchWithRetry(url)
      
      // Process earthquake data into daily counts and average magnitudes
      const processedData = this.processEarthquakeData(response)
      
      await this.saveDataset('usgs_daily_earthquakes', {
        name: 'Daily Earthquake Count',
        description: 'Daily count of earthquakes magnitude 2.5 or greater worldwide',
        unit: 'earthquakes per day',
        category: 'geology',
        source: 'USGS Earthquake API',
        sourceUrl: 'https://earthquake.usgs.gov/fdsnws/event/1/',
        lastUpdated: new Date().toISOString(),
        data: processedData.daily
      })

      await this.saveDataset('usgs_seismic_magnitude', {
        name: 'Average Daily Seismic Magnitude',
        description: 'Daily average magnitude of earthquakes worldwide',
        unit: 'magnitude (Richter scale)',
        category: 'geology',
        source: 'USGS Earthquake API',
        sourceUrl: 'https://earthquake.usgs.gov/fdsnws/event/1/',
        lastUpdated: new Date().toISOString(),
        data: processedData.magnitude
      })

      console.log(`✅ Recent earthquake data: ${processedData.daily.length} daily records`)
      return processedData.daily.length

    } catch (error) {
      console.error(`❌ Failed to collect recent earthquake data: ${error.message}`)
      throw error
    }
  }

  async collectSignificantEarthquakes() {
    try {
      console.log('⚡ Collecting significant earthquake events...')
      
      // Get significant earthquakes from the past year
      const endTime = new Date().toISOString()
      const startTime = new Date(Date.now() - 365 * 24 * 60 * 60 * 1000).toISOString()
      
      const url = `${this.baseUrl}/query?format=geojson&starttime=${startTime}&endtime=${endTime}&minmagnitude=6.0`
      
      const response = await this.fetchWithRetry(url)
      
      // Process significant earthquakes into monthly data
      const processedData = this.processSignificantEarthquakes(response)
      
      await this.saveDataset('usgs_significant_earthquakes', {
        name: 'Monthly Significant Earthquakes',
        description: 'Monthly count of significant earthquakes (magnitude 6.0+)',
        unit: 'significant earthquakes per month',
        category: 'geology',
        source: 'USGS Earthquake API',
        sourceUrl: 'https://earthquake.usgs.gov/fdsnws/event/1/',
        lastUpdated: new Date().toISOString(),
        data: processedData
      })

      console.log(`✅ Significant earthquake data: ${processedData.length} monthly records`)
      return processedData.length

    } catch (error) {
      console.error(`❌ Failed to collect significant earthquake data: ${error.message}`)
      throw error
    }
  }

  async collectSeismicActivity() {
    try {
      console.log('📊 Generating seismic activity index...')
      
      // Get all earthquakes from past 7 days for activity index
      const endTime = new Date().toISOString()
      const startTime = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
      
      const url = `${this.baseUrl}/query?format=geojson&starttime=${startTime}&endtime=${endTime}&minmagnitude=1.0`
      
      const response = await this.fetchWithRetry(url)
      
      // Calculate seismic activity index
      const activityData = this.calculateSeismicActivityIndex(response)
      
      await this.saveDataset('usgs_seismic_activity_index', {
        name: 'Seismic Activity Index',
        description: 'Daily global seismic activity index based on earthquake frequency and magnitude',
        unit: 'activity index (0-100)',
        category: 'geology',
        source: 'USGS Earthquake API',
        sourceUrl: 'https://earthquake.usgs.gov/fdsnws/event/1/',
        lastUpdated: new Date().toISOString(),
        data: activityData
      })

      console.log(`✅ Seismic activity index: ${activityData.length} daily records`)
      return activityData.length

    } catch (error) {
      console.error(`❌ Failed to generate seismic activity index: ${error.message}`)
      throw error
    }
  }

  // Data processing methods
  processEarthquakeData(data) {
    const dailyCounts = {}
    const dailyMagnitudes = {}
    
    if (!data.features) {
      return { daily: [], magnitude: [] }
    }

    // Group earthquakes by day
    data.features.forEach(earthquake => {
      const timestamp = earthquake.properties.time
      const date = new Date(timestamp).toISOString().split('T')[0]
      const magnitude = earthquake.properties.mag || 0
      
      if (!dailyCounts[date]) {
        dailyCounts[date] = 0
        dailyMagnitudes[date] = []
      }
      
      dailyCounts[date]++
      dailyMagnitudes[date].push(magnitude)
    })

    // Convert to array format
    const daily = Object.entries(dailyCounts).map(([date, count]) => ({
      date: date,
      value: count,
      metadata: {
        maxMagnitude: Math.max(...dailyMagnitudes[date]),
        minMagnitude: Math.min(...dailyMagnitudes[date])
      }
    })).sort((a, b) => new Date(a.date) - new Date(b.date))

    const magnitude = Object.entries(dailyMagnitudes).map(([date, mags]) => ({
      date: date,
      value: Math.round((mags.reduce((sum, mag) => sum + mag, 0) / mags.length) * 100) / 100,
      metadata: {
        earthquakeCount: mags.length,
        maxMagnitude: Math.max(...mags)
      }
    })).sort((a, b) => new Date(a.date) - new Date(b.date))

    return { daily, magnitude }
  }

  processSignificantEarthquakes(data) {
    const monthlyCounts = {}
    
    if (!data.features) {
      return []
    }

    // Group significant earthquakes by month
    data.features.forEach(earthquake => {
      const timestamp = earthquake.properties.time
      const date = new Date(timestamp)
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
      const magnitude = earthquake.properties.mag || 0
      
      if (!monthlyCounts[monthKey]) {
        monthlyCounts[monthKey] = {
          count: 0,
          maxMagnitude: 0,
          locations: []
        }
      }
      
      monthlyCounts[monthKey].count++
      monthlyCounts[monthKey].maxMagnitude = Math.max(monthlyCounts[monthKey].maxMagnitude, magnitude)
      monthlyCounts[monthKey].locations.push(earthquake.properties.place || 'Unknown')
    })

    // Convert to array format
    return Object.entries(monthlyCounts).map(([month, data]) => ({
      date: `${month}-01`, // First day of month for consistency
      value: data.count,
      metadata: {
        maxMagnitude: data.maxMagnitude,
        uniqueLocations: [...new Set(data.locations)].length
      }
    })).sort((a, b) => new Date(a.date) - new Date(b.date))
  }

  calculateSeismicActivityIndex(data) {
    const dailyActivity = {}
    
    if (!data.features) {
      return []
    }

    // Calculate activity for each day
    data.features.forEach(earthquake => {
      const timestamp = earthquake.properties.time
      const date = new Date(timestamp).toISOString().split('T')[0]
      const magnitude = earthquake.properties.mag || 0
      
      if (!dailyActivity[date]) {
        dailyActivity[date] = {
          count: 0,
          magnitudeSum: 0,
          maxMagnitude: 0
        }
      }
      
      dailyActivity[date].count++
      dailyActivity[date].magnitudeSum += magnitude
      dailyActivity[date].maxMagnitude = Math.max(dailyActivity[date].maxMagnitude, magnitude)
    })

    // Convert to activity index (0-100)
    return Object.entries(dailyActivity).map(([date, activity]) => {
      // Activity index based on count and magnitude
      // Formula: (earthquake_count * 2) + (max_magnitude * 10) + (avg_magnitude * 5)
      const avgMagnitude = activity.magnitudeSum / activity.count
      const activityIndex = Math.min(100, 
        (activity.count * 2) + 
        (activity.maxMagnitude * 10) + 
        (avgMagnitude * 5)
      )
      
      return {
        date: date,
        value: Math.round(activityIndex * 10) / 10,
        metadata: {
          earthquakeCount: activity.count,
          averageMagnitude: Math.round(avgMagnitude * 100) / 100,
          maxMagnitude: activity.maxMagnitude
        }
      }
    }).sort((a, b) => new Date(a.date) - new Date(b.date))
  }

  async fetchWithRetry(url, retries = 3) {
    for (let i = 0; i < retries; i++) {
      try {
        const response = await fetch(url)
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`)
        }
        return await response.json()
      } catch (error) {
        if (i === retries - 1) throw error
        console.log(`🔄 Retrying USGS request (${i + 1}/${retries}): ${url}`)
        await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1)))
      }
    }
  }

  async saveDataset(filename, dataset) {
    const filePath = join(USGS_DATA_DIR, `${filename}.json`)
    await writeFile(filePath, JSON.stringify(dataset, null, 2))
  }

  async generateMetadata(successfulCollections) {
    const metadata = {
      generatedAt: new Date().toISOString(),
      apiAccess: 'Public (no API key required)',
      collectionsSuccessful: successfulCollections,
      dataTypes: [
        'Daily Earthquake Counts',
        'Seismic Magnitude Averages',
        'Significant Earthquakes',
        'Seismic Activity Index'
      ],
      notes: [
        'USGS provides free access to global earthquake data',
        'Data updated in real-time from global seismic networks',
        'Useful for correlating geological activity with other phenomena',
        'Activity index is calculated based on frequency and magnitude'
      ]
    }

    const metadataPath = join(USGS_DATA_DIR, 'metadata.json')
    await writeFile(metadataPath, JSON.stringify(metadata, null, 2))
  }
}

// Main execution
async function main() {
  const collector = new USGSDataCollector()
  
  try {
    const results = await collector.collectAllData()
    console.log(`\n🎯 Final Results:`)
    console.log(`📊 Successfully collected ${results.successful} USGS datasets`)
    console.log(`📁 Data saved to: ${USGS_DATA_DIR}`)
    
    if (results.failed > 0) {
      console.log(`⚠️  ${results.failed} collections failed - check network connectivity`)
    }
    
    process.exit(0)
  } catch (error) {
    console.error('💥 USGS data collection failed:', error)
    process.exit(1)
  }
}

// Run if this script is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main()
}

export default USGSDataCollector