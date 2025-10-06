/**
 * Automated Data Pipeline Service for CorrelateAI
 * 
 * This service handles:
 * - Automated data discovery and collection
 * - Scheduled data updates
 * - Data quality monitoring and validation
 * - Dynamic data source registration
 * - Cache management and optimization
 */

import { dataService, RealDataset, RealDataPoint } from './dataService'

export interface DataSource {
  id: string
  name: string
  description: string
  baseUrl: string
  apiKey?: string
  rateLimit: number // requests per minute
  categories: string[]
  isActive: boolean
  lastUpdate: Date
  updateFrequency: 'hourly' | 'daily' | 'weekly' | 'monthly'
  reliability: number // 0-1 score
  cost: 'free' | 'paid'
}

export interface DataPipelineConfig {
  maxConcurrentRequests: number
  retryAttempts: number
  retryDelay: number
  cacheExpiration: number // hours
  qualityThreshold: number // 0-1 score
  autoDiscovery: boolean
}

export interface DataQualityMetrics {
  completeness: number // % of non-null values
  consistency: number // variability score
  timeliness: number // how recent the data is
  accuracy: number // validation against known patterns
  overall: number // weighted average
}

export interface DataUpdate {
  datasetId: string
  timestamp: Date
  recordsUpdated: number
  qualityScore: number
  errors: string[]
  source: string
}

class DataPipelineService {
  private config: DataPipelineConfig = {
    maxConcurrentRequests: 5,
    retryAttempts: 3,
    retryDelay: 2000,
    cacheExpiration: 24, // 24 hours
    qualityThreshold: 0.7,
    autoDiscovery: true
  }

  private dataSources: Map<string, DataSource> = new Map()
  private updateQueue: string[] = []
  private isProcessing = false
  private updateHistory: DataUpdate[] = []

  constructor() {
    this.initializeDefaultSources()
    if (this.config.autoDiscovery) {
      this.startAutoDiscovery()
    }
  }

  /**
   * Initialize default data sources
   */
  private initializeDefaultSources(): void {
    const defaultSources: DataSource[] = [
      {
        id: 'fred',
        name: 'Federal Reserve Economic Data',
        description: 'US economic indicators and financial data',
        baseUrl: 'https://api.stlouisfed.org/fred',
        apiKey: import.meta.env.VITE_FRED_API_KEY,
        rateLimit: 120, // 120 requests per minute
        categories: ['economics', 'finance', 'employment', 'housing'],
        isActive: true,
        lastUpdate: new Date(),
        updateFrequency: 'daily',
        reliability: 0.95,
        cost: 'free'
      },
      {
        id: 'worldbank',
        name: 'World Bank Open Data',
        description: 'Global development and economic indicators',
        baseUrl: 'https://api.worldbank.org/v2',
        rateLimit: 100,
        categories: ['economics', 'demographics', 'development', 'environment'],
        isActive: true,
        lastUpdate: new Date(),
        updateFrequency: 'weekly',
        reliability: 0.90,
        cost: 'free'
      },
      {
        id: 'census',
        name: 'US Census Bureau',
        description: 'US demographic and economic census data',
        baseUrl: 'https://api.census.gov/data',
        rateLimit: 500,
        categories: ['demographics', 'economics', 'housing', 'business'],
        isActive: true,
        lastUpdate: new Date(),
        updateFrequency: 'monthly',
        reliability: 0.93,
        cost: 'free'
      },
      {
        id: 'bls',
        name: 'Bureau of Labor Statistics',
        description: 'US employment, wages, and labor statistics',
        baseUrl: 'https://api.bls.gov/publicAPI/v2',
        rateLimit: 25, // Limited for public API
        categories: ['employment', 'wages', 'economics', 'inflation'],
        isActive: true,
        lastUpdate: new Date(),
        updateFrequency: 'monthly',
        reliability: 0.94,
        cost: 'free'
      },
      {
        id: 'alpha_vantage',
        name: 'Alpha Vantage',
        description: 'Stock market and financial data',
        baseUrl: 'https://www.alphavantage.co/query',
        apiKey: import.meta.env.VITE_ALPHA_VANTAGE_API_KEY,
        rateLimit: 5, // 5 requests per minute for free tier
        categories: ['finance', 'stocks', 'forex', 'crypto'],
        isActive: !!import.meta.env.VITE_ALPHA_VANTAGE_API_KEY,
        lastUpdate: new Date(),
        updateFrequency: 'daily',
        reliability: 0.88,
        cost: 'free'
      },
      {
        id: 'weather',
        name: 'OpenWeatherMap',
        description: 'Weather and climate data',
        baseUrl: 'https://api.openweathermap.org/data/2.5',
        apiKey: import.meta.env.VITE_OPENWEATHER_API_KEY,
        rateLimit: 60,
        categories: ['weather', 'climate', 'environment'],
        isActive: !!import.meta.env.VITE_OPENWEATHER_API_KEY,
        lastUpdate: new Date(),
        updateFrequency: 'hourly',
        reliability: 0.85,
        cost: 'free'
      }
    ]

    defaultSources.forEach(source => {
      this.dataSources.set(source.id, source)
    })
  }

  /**
   * Discover new data sources automatically
   */
  private async startAutoDiscovery(): Promise<void> {
    // This would run periodically to discover new APIs and data sources
    setInterval(async () => {
      await this.discoverNewSources()
    }, 24 * 60 * 60 * 1000) // Run daily
  }

  /**
   * Discover new data sources from various directories and APIs
   */
  private async discoverNewSources(): Promise<DataSource[]> {
    const discoveredSources: DataSource[] = []

    try {
      // Check government data catalogs
      const govSources = await this.discoverGovernmentSources()
      discoveredSources.push(...govSources)

      // Check academic data repositories
      const academicSources = await this.discoverAcademicSources()
      discoveredSources.push(...academicSources)

      // Check open data directories
      const openDataSources = await this.discoverOpenDataSources()
      discoveredSources.push(...openDataSources)

      // Register new sources
      for (const source of discoveredSources) {
        if (!this.dataSources.has(source.id)) {
          await this.registerDataSource(source)
        }
      }

    } catch (error) {
      console.error('Error discovering new data sources:', error)
    }

    return discoveredSources
  }

  /**
   * Discover government data sources
   */
  private async discoverGovernmentSources(): Promise<DataSource[]> {
    const sources: DataSource[] = []

    // Check data.gov catalog
    try {
      const response = await fetch('https://catalog.data.gov/api/3/action/package_search?q=api&rows=50')
      const data = await response.json()
      
      if (data.success && data.result.results) {
        for (const dataset of data.result.results.slice(0, 10)) { // Limit to 10 for now
          if (dataset.resources?.some((r: any) => r.format === 'API')) {
            sources.push({
              id: `gov_${dataset.name}`,
              name: dataset.title || dataset.name,
              description: dataset.notes || 'Government dataset',
              baseUrl: dataset.url || '',
              rateLimit: 100,
              categories: dataset.tags?.map((t: any) => t.name) || ['government'],
              isActive: false, // Needs manual verification
              lastUpdate: new Date(),
              updateFrequency: 'weekly',
              reliability: 0.8,
              cost: 'free'
            })
          }
        }
      }
    } catch (error) {
      console.warn('Failed to discover government sources:', error)
    }

    return sources
  }

  /**
   * Discover academic data repositories
   */
  private async discoverAcademicSources(): Promise<DataSource[]> {
    const sources: DataSource[] = []

    // Academic sources often require manual curation
    // This could be expanded to check academic APIs like:
    // - Harvard Dataverse
    // - Zenodo
    // - Figshare
    // - ICPSR

    return sources
  }

  /**
   * Discover open data directories
   */
  private async discoverOpenDataSources(): Promise<DataSource[]> {
    const sources: DataSource[] = []

    // Could check sources like:
    // - European Data Portal
    // - UN Data
    // - OECD Data
    // - Regional open data portals

    return sources
  }

  /**
   * Register a new data source
   */
  async registerDataSource(source: DataSource): Promise<boolean> {
    try {
      // Validate the source
      const isValid = await this.validateDataSource(source)
      if (!isValid) {
        console.warn(`Invalid data source: ${source.id}`)
        return false
      }

      // Test connectivity
      const isConnectable = await this.testSourceConnectivity(source)
      if (!isConnectable) {
        console.warn(`Cannot connect to data source: ${source.id}`)
        source.isActive = false
      }

      this.dataSources.set(source.id, source)
      console.log(`Registered new data source: ${source.name}`)
      return true

    } catch (error) {
      console.error(`Error registering data source ${source.id}:`, error)
      return false
    }
  }

  /**
   * Validate data source configuration
   */
  private async validateDataSource(source: DataSource): Promise<boolean> {
    // Check required fields
    if (!source.id || !source.name || !source.baseUrl) {
      return false
    }

    // Check URL format
    try {
      new URL(source.baseUrl)
    } catch {
      return false
    }

    // Check rate limits are reasonable
    if (source.rateLimit < 1 || source.rateLimit > 10000) {
      return false
    }

    return true
  }

  /**
   * Test connectivity to a data source
   */
  private async testSourceConnectivity(source: DataSource): Promise<boolean> {
    try {
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 5000) // 5 second timeout

      const response = await fetch(source.baseUrl, {
        method: 'HEAD',
        signal: controller.signal
      })

      clearTimeout(timeoutId)
      return response.ok || response.status === 405 // Some APIs don't support HEAD

    } catch (error) {
      console.warn(`Connectivity test failed for ${source.id}:`, error)
      return false
    }
  }

  /**
   * Schedule automated data updates
   */
  startAutomatedUpdates(): void {
    // Update data based on source frequency
    setInterval(async () => {
      await this.processUpdateQueue()
    }, 60 * 60 * 1000) // Check every hour

    // Add datasets to update queue based on their frequency
    setInterval(() => {
      this.scheduleUpdates()
    }, 30 * 60 * 1000) // Schedule every 30 minutes
  }

  /**
   * Schedule updates based on data source frequencies
   */
  private scheduleUpdates(): void {
    const now = new Date()

    for (const [sourceId, source] of this.dataSources) {
      if (!source.isActive) continue

      const timeSinceUpdate = now.getTime() - source.lastUpdate.getTime()
      const updateIntervalMs = this.getUpdateIntervalMs(source.updateFrequency)

      if (timeSinceUpdate >= updateIntervalMs) {
        // Add all datasets from this source to update queue
        const sourceDatasets = this.getDatasetsBySource(sourceId)
        sourceDatasets.forEach(dataset => {
          if (!this.updateQueue.includes(dataset.id)) {
            this.updateQueue.push(dataset.id)
          }
        })
      }
    }
  }

  /**
   * Get update interval in milliseconds
   */
  private getUpdateIntervalMs(frequency: string): number {
    switch (frequency) {
      case 'hourly': return 60 * 60 * 1000
      case 'daily': return 24 * 60 * 60 * 1000
      case 'weekly': return 7 * 24 * 60 * 60 * 1000
      case 'monthly': return 30 * 24 * 60 * 60 * 1000
      default: return 24 * 60 * 60 * 1000
    }
  }

  /**
   * Get datasets by source
   */
  private getDatasetsBySource(sourceId: string): RealDataset[] {
    // This would integrate with your existing dataService to get datasets by source
    return [] // Placeholder - implement based on your data structure
  }

  /**
   * Process the update queue
   */
  private async processUpdateQueue(): Promise<void> {
    if (this.isProcessing || this.updateQueue.length === 0) return

    this.isProcessing = true
    console.log(`Processing ${this.updateQueue.length} data updates...`)

    const batchSize = this.config.maxConcurrentRequests
    while (this.updateQueue.length > 0) {
      const batch = this.updateQueue.splice(0, batchSize)
      await Promise.allSettled(
        batch.map(datasetId => this.updateDataset(datasetId))
      )
      
      // Rate limiting between batches
      await new Promise(resolve => setTimeout(resolve, 1000))
    }

    this.isProcessing = false
    console.log('Data update process completed')
  }

  /**
   * Update a specific dataset
   */
  private async updateDataset(datasetId: string): Promise<DataUpdate> {
    const startTime = new Date()
    let recordsUpdated = 0
    let errors: string[] = []
    let qualityScore = 0

    try {
      // Fetch fresh data
      const data = await dataService.fetchDatasetData(datasetId)
      
      if (data && data.length > 0) {
        // Validate data quality
        const quality = await this.assessDataQuality(data)
        qualityScore = quality.overall

        if (qualityScore >= this.config.qualityThreshold) {
          // Update cache/storage
          recordsUpdated = data.length
          console.log(`Updated ${datasetId}: ${recordsUpdated} records, quality: ${qualityScore.toFixed(2)}`)
        } else {
          errors.push(`Quality score ${qualityScore.toFixed(2)} below threshold ${this.config.qualityThreshold}`)
        }
      } else {
        errors.push('No data received from source')
      }

    } catch (error) {
      errors.push(error instanceof Error ? error.message : 'Unknown error')
      console.error(`Error updating dataset ${datasetId}:`, error)
    }

    const update: DataUpdate = {
      datasetId,
      timestamp: startTime,
      recordsUpdated,
      qualityScore,
      errors,
      source: 'auto-update'
    }

    this.updateHistory.push(update)
    return update
  }

  /**
   * Assess data quality
   */
  private async assessDataQuality(data: RealDataPoint[]): Promise<DataQualityMetrics> {
    const completeness = this.calculateCompleteness(data)
    const consistency = this.calculateConsistency(data)
    const timeliness = this.calculateTimeliness(data)
    const accuracy = this.calculateAccuracy(data)

    const overall = (completeness * 0.3 + consistency * 0.3 + timeliness * 0.2 + accuracy * 0.2)

    return {
      completeness,
      consistency,
      timeliness,
      accuracy,
      overall
    }
  }

  /**
   * Calculate data completeness (% of non-null values)
   */
  private calculateCompleteness(data: RealDataPoint[]): number {
    if (data.length === 0) return 0
    const validPoints = data.filter(point => point.value !== null && point.value !== undefined && !isNaN(point.value))
    return validPoints.length / data.length
  }

  /**
   * Calculate data consistency (low variability indicates consistency)
   */
  private calculateConsistency(data: RealDataPoint[]): number {
    if (data.length < 2) return 1

    const values = data.map(d => d.value).filter(v => !isNaN(v))
    if (values.length < 2) return 0

    const mean = values.reduce((a, b) => a + b, 0) / values.length
    const variance = values.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / values.length
    const coefficientOfVariation = Math.sqrt(variance) / Math.abs(mean)

    // Convert to 0-1 score (lower CV = higher consistency)
    return Math.max(0, 1 - Math.min(1, coefficientOfVariation))
  }

  /**
   * Calculate data timeliness (how recent the data is)
   */
  private calculateTimeliness(data: RealDataPoint[]): number {
    if (data.length === 0) return 0

    const currentYear = new Date().getFullYear()
    const latestYear = Math.max(...data.map(d => d.year))
    const yearDifference = currentYear - latestYear

    // Score based on how recent the latest data point is
    if (yearDifference === 0) return 1.0
    if (yearDifference === 1) return 0.8
    if (yearDifference === 2) return 0.6
    if (yearDifference <= 5) return 0.4
    return 0.2
  }

  /**
   * Calculate data accuracy (basic validation against expected patterns)
   */
  private calculateAccuracy(data: RealDataPoint[]): number {
    if (data.length === 0) return 0

    let accuracyScore = 1.0

    // Check for extreme outliers (simple validation)
    const values = data.map(d => d.value).filter(v => !isNaN(v))
    if (values.length > 0) {
      const sorted = [...values].sort((a, b) => a - b)
      const q1 = sorted[Math.floor(sorted.length * 0.25)]
      const q3 = sorted[Math.floor(sorted.length * 0.75)]
      const iqr = q3 - q1
      const lowerBound = q1 - 1.5 * iqr
      const upperBound = q3 + 1.5 * iqr

      const outliers = values.filter(v => v < lowerBound || v > upperBound)
      const outlierRatio = outliers.length / values.length

      // Reduce score based on outlier percentage
      accuracyScore *= Math.max(0, 1 - outlierRatio * 2)
    }

    return accuracyScore
  }

  /**
   * Get data source statistics
   */
  getDataSourceStats(): { [sourceId: string]: any } {
    const stats: { [sourceId: string]: any } = {}

    for (const [sourceId, source] of this.dataSources) {
      const recentUpdates = this.updateHistory
        .filter(update => update.source === sourceId)
        .slice(-10) // Last 10 updates

      stats[sourceId] = {
        name: source.name,
        isActive: source.isActive,
        reliability: source.reliability,
        lastUpdate: source.lastUpdate,
        updateFrequency: source.updateFrequency,
        recentQualityScore: recentUpdates.length > 0 
          ? recentUpdates.reduce((sum, u) => sum + u.qualityScore, 0) / recentUpdates.length 
          : 0,
        totalUpdates: recentUpdates.length,
        errorRate: recentUpdates.length > 0
          ? recentUpdates.filter(u => u.errors.length > 0).length / recentUpdates.length
          : 0
      }
    }

    return stats
  }

  /**
   * Get update history
   */
  getUpdateHistory(limit: number = 100): DataUpdate[] {
    return this.updateHistory
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
      .slice(0, limit)
  }

  /**
   * Manual trigger for data updates
   */
  async triggerUpdate(datasetIds?: string[]): Promise<DataUpdate[]> {
    if (datasetIds) {
      this.updateQueue.push(...datasetIds.filter(id => !this.updateQueue.includes(id)))
    } else {
      // Trigger update for all active datasets
      const allDatasets = this.getAllActiveDatasets()
      this.updateQueue.push(...allDatasets.map(d => d.id))
    }

    if (!this.isProcessing) {
      await this.processUpdateQueue()
    }

    return this.getUpdateHistory(datasetIds?.length || 50)
  }

  /**
   * Get all active datasets
   */
  private getAllActiveDatasets(): RealDataset[] {
    // This would integrate with your existing dataService
    return [] // Placeholder - implement based on your data structure
  }

  /**
   * Configure the pipeline
   */
  updateConfig(newConfig: Partial<DataPipelineConfig>): void {
    this.config = { ...this.config, ...newConfig }
  }

  /**
   * Get current configuration
   */
  getConfig(): DataPipelineConfig {
    return { ...this.config }
  }
}

// Export singleton instance
export const dataPipelineService = new DataPipelineService()

// Auto-start updates if in production
if (import.meta.env.PROD) {
  dataPipelineService.startAutomatedUpdates()
}