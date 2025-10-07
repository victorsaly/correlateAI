import { DATA_SOURCE_REGISTRY, DataSourceConfig, getRealAPISources, getTotalRealAPICount } from '@/config/dataSources'

export interface DataSourceInfo {
  name: string
  description: string
  url: string
  datasets: number
  category: string
  icon: string
  lastUpdated?: string
}

export interface DataSourceStats {
  totalSources: number
  realAPISources: number
  activeSources: number
  totalDatasets: number
  realDatasets: number
  aiDatasets: number
}

/**
 * Centralized Data Source Manager
 * Handles all data source detection, counting, and configuration
 */
export class CentralizedDataSourceService {
  private cachedSources: Map<string, DataSourceInfo> | null = null
  private cachedStats: DataSourceStats | null = null
  private cacheTimestamp: number = 0
  private readonly CACHE_DURATION = 30000 // 30 seconds

  /**
   * Get all active data sources with live detection
   */
  async getDataSources(): Promise<Map<string, DataSourceInfo>> {
    if (this.isCacheValid()) {
      return this.cachedSources!
    }

    const sources = new Map<string, DataSourceInfo>()

    // Process each source from the registry
    for (const config of DATA_SOURCE_REGISTRY) {
      if (config.isStatic) {
        // Static sources are always available
        sources.set(config.key, {
          name: config.name,
          description: config.description,
          url: config.url,
          datasets: config.expectedDatasets,
          category: config.category,
          icon: config.icon
        })
      } else {
        // Dynamic sources - check availability
        const actualDatasets = await this.checkSourceAvailability(config)
        if (actualDatasets > 0) {
          sources.set(config.key, {
            name: config.name,
            description: config.description,
            url: config.url,
            datasets: actualDatasets,
            category: config.category,
            icon: config.icon,
            lastUpdated: new Date().toISOString()
          })
        }
      }
    }

    this.cachedSources = sources
    this.cacheTimestamp = Date.now()
    return sources
  }

  /**
   * Get comprehensive data source statistics
   */
  async getDataSourceStats(): Promise<DataSourceStats> {
    if (this.isCacheValid() && this.cachedStats) {
      return this.cachedStats
    }

    const sources = await this.getDataSources()
    const realSources = Array.from(sources.entries()).filter(([key]) => key !== 'AI')
    const aiSource = sources.get('AI')

    const totalDatasets = Array.from(sources.values()).reduce((sum, source) => sum + source.datasets, 0)
    const realDatasets = realSources.reduce((sum, [, source]) => sum + source.datasets, 0)
    const aiDatasets = aiSource?.datasets || 0

    const stats: DataSourceStats = {
      totalSources: sources.size,
      realAPISources: realSources.length,
      activeSources: sources.size,
      totalDatasets,
      realDatasets,
      aiDatasets
    }

    this.cachedStats = stats
    return stats
  }

  /**
   * Get source configuration by key
   */
  getSourceConfig(key: string): DataSourceConfig | undefined {
    return DATA_SOURCE_REGISTRY.find(source => source.key === key)
  }

  /**
   * Get total expected real API count (for comparison)
   */
  getTotalExpectedRealAPIs(): number {
    return getTotalRealAPICount()
  }

  /**
   * Check if a dynamic source has available data
   */
  private async checkSourceAvailability(config: DataSourceConfig): Promise<number> {
    if (!config.dataPath) return 0

    try {
      const sourceKey = config.dataPath.split('/').filter(p => p).pop() || ''
      return await this.countAvailableFiles(sourceKey, config.dataPath)
    } catch (error) {
      return 0
    }
  }

  /**
   * Count available files for a specific source
   */
  private async countAvailableFiles(sourceKey: string, dataPath: string): Promise<number> {
    const knownFiles = this.getKnownFilesForSource(sourceKey)
    let count = 0

    for (const file of knownFiles) {
      try {
        const response = await fetch(`${dataPath}${file}`)
        if (response.ok) count++
      } catch (e) {
        // Ignore fetch errors
      }
    }

    return count
  }

  /**
   * Get known files for each source type
   */
  private getKnownFilesForSource(sourceKey: string): string[] {
    const fileMap: Record<string, string[]> = {
      nasa: [
        'nasa_neo_count.json',
        'nasa_space_weather.json',
        'nasa_apod_trends.json',
        'nasa_earth_observation.json',
        'nasa_mars_weather.json'
      ],
      usgs: [
        'usgs_daily_earthquakes.json',
        'usgs_seismic_magnitude.json',
        'usgs_significant_earthquakes.json',
        'usgs_seismic_activity_index.json'
      ],
      eia: [
        'eia_crude_oil_prices.json',
        'eia_natural_gas_prices.json',
        'eia_electricity_generation.json',
        'eia_renewable_energy.json',
        'eia_petroleum_consumption.json'
      ],
      bls: [
        'bls_consumer_price_index.json',
        'bls_producer_price_index.json'
      ],
      cdc: [
        'cdc_covid_deaths.json'
      ],
      nasdaq: [
        'nasdaq_composite_index.json',
        'nasdaq_tech_etf.json',
        'nasdaq_bond_index.json',
        'nasdaq_emerging_markets.json',
        'nasdaq_commodities.json'
      ],
      crypto: [
        'bitcoin_price.json',
        'ethereum_price.json',
        'cardano_price.json',
        'solana_price.json',
        'global_market_cap.json',
        'trending_coins.json',
        'defi_data.json'
      ],
      oecd: [
        'gdp_data.json',
        'inflation_data.json',
        'unemployment_data.json',
        'economic_outlook.json',
        'leading_indicators.json',
        'trade_transport.json'
      ],
      air_quality: [
        'beijing_aqi.json',
        'london_aqi.json',
        'newyork_aqi.json',
        'tokyo_aqi.json',
        'losangeles_aqi.json',
        'paris_aqi.json',
        'mumbai_aqi.json',
        'global_summary.json'
      ],
      'ai-data': [] // AI data is counted differently
    }

    return fileMap[sourceKey] || []
  }

  /**
   * Check if cache is valid
   */
  private isCacheValid(): boolean {
    return this.cachedSources !== null && 
           (Date.now() - this.cacheTimestamp) < this.CACHE_DURATION
  }

  /**
   * Clear cache (useful for testing or forced refresh)
   */
  clearCache(): void {
    this.cachedSources = null
    this.cachedStats = null
    this.cacheTimestamp = 0
  }
}

// Export singleton instance
export const centralizedDataSourceService = new CentralizedDataSourceService()