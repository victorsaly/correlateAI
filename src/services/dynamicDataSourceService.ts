/**
 * Dynamic Data Source Service
 * 
 * Provides real-time information about available data sources,
 * including dynamically collected data from NASA, USGS, and EIA
 */

export interface DataSourceInfo {
  name: string
  description: string
  url: string
  datasets: number
  category: string
  icon?: string
  lastUpdated?: string
}

export class DynamicDataSourceService {
  private cachedSources: Map<string, DataSourceInfo> = new Map()
  private lastUpdate: Date | null = null
  private readonly CACHE_DURATION = 2 * 60 * 1000 // 2 minutes

  /**
   * Get all available data sources with real-time dataset counts
   */
  async getDataSources(): Promise<Map<string, DataSourceInfo>> {
    // Check cache
    if (this.lastUpdate && Date.now() - this.lastUpdate.getTime() < this.CACHE_DURATION) {
      return this.cachedSources
    }

    const sources = new Map<string, DataSourceInfo>()

    // Static sources (always available)
    sources.set('FRED', {
      name: 'FRED',
      description: 'Federal Reserve Economic Data - St. Louis Fed',
      url: 'https://fred.stlouisfed.org/',
      datasets: 16, // Static count from realDatasets
      category: 'economics',
      icon: 'bank'
    })

    sources.set('WorldBank', {
      name: 'World Bank Open Data',
      description: 'Global development data and statistics',
      url: 'https://data.worldbank.org/',
      datasets: 11, // Static count from realDatasets
      category: 'global',
      icon: 'globe'
    })

    sources.set('AlphaVantage', {
      name: 'Alpha Vantage',
      description: 'Real-time and historical financial market data',
      url: 'https://www.alphavantage.co/',
      datasets: 7, // Static count from realDatasets
      category: 'finance',
      icon: 'chart'
    })

    sources.set('OpenWeather', {
      name: 'OpenWeather',
      description: 'Weather and climate data from around the world',
      url: 'https://openweathermap.org/',
      datasets: 6, // Static count from realDatasets
      category: 'climate',
      icon: 'cloud'
    })

    // Dynamic sources (check availability and count)
    await this.checkDynamicSource(sources, 'NASA', {
      name: 'NASA',
      description: 'Space weather and astronomical data',
      url: 'https://api.nasa.gov/',
      category: 'space',
      icon: 'rocket',
      dataPath: '/data/nasa/'
    })

    await this.checkDynamicSource(sources, 'USGS', {
      name: 'USGS',
      description: 'Geological and seismic activity data',
      url: 'https://earthquake.usgs.gov/',
      category: 'geology',
      icon: 'mountain',
      dataPath: '/data/usgs/'
    })

    await this.checkDynamicSource(sources, 'EIA', {
      name: 'EIA',
      description: 'U.S. energy sector data and statistics',
      url: 'https://www.eia.gov/',
      category: 'energy',
      icon: 'lightning',
      dataPath: '/data/eia/'
    })

    await this.checkDynamicSource(sources, 'BLS', {
      name: 'BLS',
      description: 'Bureau of Labor Statistics - Employment and economic data',
      url: 'https://www.bls.gov/',
      category: 'economics',
      icon: 'briefcase',
      dataPath: '/data/bls/'
    })

    await this.checkDynamicSource(sources, 'CDC', {
      name: 'CDC',
      description: 'Centers for Disease Control - Health and vital statistics',
      url: 'https://data.cdc.gov/',
      category: 'health',
      icon: 'heart',
      dataPath: '/data/cdc/'
    })

    await this.checkDynamicSource(sources, 'Nasdaq', {
      name: 'Nasdaq Data Link',
      description: 'Financial markets and economic data platform',
      url: 'https://data.nasdaq.com/',
      category: 'financial',
      icon: 'chart',
      dataPath: '/data/nasdaq/'
    })

    // AI-generated datasets (check for AI data)
    const aiCount = await this.countAIDatasets()
    if (aiCount > 0) {
      sources.set('AI', {
        name: 'AI-Generated Datasets',
        description: 'Synthetic datasets based on real-world patterns',
        url: '',
        datasets: aiCount,
        category: 'synthetic',
        icon: 'robot'
      })
    }

    this.cachedSources = sources
    this.lastUpdate = new Date()
    
    return sources
  }

  /**
   * Check for dynamic data source and add to sources map
   */
  private async checkDynamicSource(
    sources: Map<string, DataSourceInfo>, 
    sourceKey: string, 
    sourceInfo: any
  ): Promise<void> {
    try {
      const metadataResponse = await fetch(`${sourceInfo.dataPath}metadata.json`)
      
      if (metadataResponse.ok) {
        const metadata = await metadataResponse.json()
        
        // Handle different metadata structures
        let datasetCount = 0
        if (metadata.datasets && Array.isArray(metadata.datasets)) {
          // EIA style: array of dataset objects
          datasetCount = metadata.datasets.length
        } else if (metadata.collectionsSuccessful) {
          // NASA/USGS style: collectionsSuccessful number
          datasetCount = metadata.collectionsSuccessful
        } else if (metadata.dataTypes && Array.isArray(metadata.dataTypes)) {
          // Fallback: count dataTypes array
          datasetCount = metadata.dataTypes.length
        }
        
        sources.set(sourceKey, {
          name: sourceInfo.name,
          description: sourceInfo.description,
          url: sourceInfo.url,
          datasets: datasetCount,
          category: sourceInfo.category,
          icon: sourceInfo.icon,
          lastUpdated: metadata.lastUpdated || metadata.generatedAt
        })
        
        console.log(`✅ ${sourceKey}: Found ${datasetCount} datasets`)
      } else {
        console.log(`ℹ️ ${sourceKey}: Data not yet available (${metadataResponse.status})`)
        
        // Fallback: try to count JSON files directly
        const fallbackCount = await this.countJSONFiles(sourceInfo.dataPath)
        if (fallbackCount > 0) {
          sources.set(sourceKey, {
            name: sourceInfo.name,
            description: sourceInfo.description,
            url: sourceInfo.url,
            datasets: fallbackCount,
            category: sourceInfo.category,
            icon: sourceInfo.icon
          })
          console.log(`✅ ${sourceKey}: Found ${fallbackCount} datasets (fallback count)`)
        }
      }
    } catch (error) {
      console.log(`ℹ️ ${sourceKey}: Not available yet (will be added during data collection)`)
      
      // Fallback: try to count JSON files directly
      const fallbackCount = await this.countJSONFiles(sourceInfo.dataPath)
      if (fallbackCount > 0) {
        sources.set(sourceKey, {
          name: sourceInfo.name,
          description: sourceInfo.description,
          url: sourceInfo.url,
          datasets: fallbackCount,
          category: sourceInfo.category,
          icon: sourceInfo.icon
        })
        console.log(`✅ ${sourceKey}: Found ${fallbackCount} datasets (fallback count)`)
      }
    }
  }

  /**
   * Count AI-generated datasets
   */
  private async countAIDatasets(): Promise<number> {
    try {
      // Try enhanced AI datasets first
      const fileListResponse = await fetch('/ai-data/file_list.json')
      if (fileListResponse.ok) {
        const fileList = await fileListResponse.json()
        return fileList.length
      }

      // Fallback to legacy format
      const indexResponse = await fetch('/ai-data/datasets_index.json')
      if (indexResponse.ok) {
        const index = await indexResponse.json()
        return Array.isArray(index) ? index.length : 0
      }
    } catch (error) {
      console.log('AI datasets not available')
    }
    
    return 0
  }

  /**
   * Count JSON files in a data directory (fallback method)
   */
  private async countJSONFiles(dataPath: string): Promise<number> {
    try {
      // We can't directly list directory contents in a browser,
      // so we'll try to fetch known patterns or use a simpler approach
      
      // For our specific use case, let's try fetching metadata first
      // and if that fails, we'll return 0 rather than guessing
      
      // Actually, let's implement a simple counting method
      // by trying to fetch a few common file patterns
      const sourceKey = dataPath.split('/').filter(p => p).pop() || ''
      let count = 0
      
      if (sourceKey === 'nasa') {
        // Known NASA files
        const knownFiles = [
          'nasa_neo_count.json',
          'nasa_space_weather.json', 
          'nasa_apod_trends.json',
          'nasa_earth_observation.json',
          'nasa_mars_weather.json'
        ]
        
        for (const file of knownFiles) {
          try {
            const response = await fetch(`${dataPath}${file}`)
            if (response.ok) count++
          } catch (e) {
            // Ignore fetch errors
          }
        }
      } else if (sourceKey === 'usgs') {
        // Known USGS files
        const knownFiles = [
          'usgs_daily_earthquakes.json',
          'usgs_seismic_magnitude.json',
          'usgs_significant_earthquakes.json',
          'usgs_seismic_activity_index.json'
        ]
        
        for (const file of knownFiles) {
          try {
            const response = await fetch(`${dataPath}${file}`)
            if (response.ok) count++
          } catch (e) {
            // Ignore fetch errors
          }
        }
      } else if (sourceKey === 'eia') {
        // Known EIA files
        const knownFiles = [
          'eia_crude_oil_prices.json',
          'eia_natural_gas_prices.json',
          'eia_electricity_generation.json',
          'eia_renewable_energy.json',
          'eia_petroleum_consumption.json'
        ]
        
        for (const file of knownFiles) {
          try {
            const response = await fetch(`${dataPath}${file}`)
            if (response.ok) count++
          } catch (e) {
            // Ignore fetch errors
          }
        }
      } else if (sourceKey === 'bls') {
        // Known BLS files
        const knownFiles = [
          'bls_consumer_price_index.json',
          'bls_producer_price_index.json'
        ]
        
        for (const file of knownFiles) {
          try {
            const response = await fetch(`${dataPath}${file}`)
            if (response.ok) count++
          } catch (e) {
            // Ignore fetch errors
          }
        }
      } else if (sourceKey === 'cdc') {
        // Known CDC files
        const knownFiles = [
          'cdc_covid_deaths.json'
        ]
        
        for (const file of knownFiles) {
          try {
            const response = await fetch(`${dataPath}${file}`)
            if (response.ok) count++
          } catch (e) {
            // Ignore fetch errors
          }
        }
      } else if (sourceKey === 'nasdaq') {
        // Known Nasdaq files
        const knownFiles = [
          'nasdaq_composite_index.json',
          'nasdaq_tech_etf.json',
          'nasdaq_bond_index.json',
          'nasdaq_emerging_markets.json',
          'nasdaq_commodities.json'
        ]
        
        for (const file of knownFiles) {
          try {
            const response = await fetch(`${dataPath}${file}`)
            if (response.ok) count++
          } catch (e) {
            // Ignore fetch errors
          }
        }
      }
      
      return count
    } catch (error) {
      return 0
    }
  }

  /**
   * Get total dataset count across all sources
   */
  async getTotalDatasetCount(): Promise<number> {
    const sources = await this.getDataSources()
    return Array.from(sources.values()).reduce((total, source) => total + source.datasets, 0)
  }

  /**
   * Get dataset count by category
   */
  async getDatasetsByCategory(): Promise<{ [category: string]: number }> {
    const sources = await this.getDataSources()
    const categories: { [category: string]: number } = {}
    
    for (const source of sources.values()) {
      categories[source.category] = (categories[source.category] || 0) + source.datasets
    }
    
    return categories
  }

  /**
   * Get sources that are currently available (have datasets)
   */
  async getAvailableSources(): Promise<Map<string, DataSourceInfo>> {
    const allSources = await this.getDataSources()
    const availableSources = new Map<string, DataSourceInfo>()
    
    for (const [key, source] of allSources.entries()) {
      if (source.datasets > 0) {
        availableSources.set(key, source)
      }
    }
    
    return availableSources
  }

  /**
   * Clear cache to force refresh
   */
  clearCache(): void {
    this.cachedSources.clear()
    this.lastUpdate = null
  }
}

export const dynamicDataSourceService = new DynamicDataSourceService()