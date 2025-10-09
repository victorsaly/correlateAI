import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ArrowSquareOut, Database, Brain, TrendUp, CloudSun, Rocket, Mountains, Lightning, Briefcase, Heart, ChartLine, CurrencyBtc, Globe, Wind } from '@phosphor-icons/react'
import { dataService } from '@/services/staticDataService'
import { CentralizedDataSourceService, DataSourceInfo as DynamicDataSourceInfo } from '@/services/centralizedDataSourceService'
import { getSourceConfig } from '@/config/dataSources'

interface DataSourceInfo {
  name: string
  description: string
  url: string
  logo?: string
  datasets: number
}

export function DataSourcesCard() {
  const [sources, setSources] = useState<Map<string, DynamicDataSourceInfo>>(new Map())
  const [totalDatasets, setTotalDatasets] = useState(0)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadSources = async () => {
      try {
        const centralizedService = new CentralizedDataSourceService()
        // Clear cache to ensure fresh data
        centralizedService.clearCache()
        const dynamicSources = await centralizedService.getDataSources()
        const stats = await centralizedService.getDataSourceStats()
        
        console.log(`🔍 DataSources loaded: ${dynamicSources.size} sources, ${stats.totalDatasets} total datasets`)
        console.log('📊 Sources:', Array.from(dynamicSources.keys()))
        
        setSources(dynamicSources)
        setTotalDatasets(stats.totalDatasets)
      } catch (error) {
        console.error('Failed to load data sources:', error)
        // Fallback to static sources with default categories
        const staticSources = dataService.getDataSources()
        const staticStats = dataService.getDatasetStats()
        
        const fallbackSources = new Map<string, DynamicDataSourceInfo>()
        for (const [key, source] of staticSources.entries()) {
          fallbackSources.set(key, {
            ...source,
            category: key.toLowerCase(),
            icon: 'database'
          })
        }
        
        setSources(fallbackSources)
        setTotalDatasets(staticStats.total)
      } finally {
        setIsLoading(false)
      }
    }

    loadSources()
    
    // Refresh every 5 minutes to catch new data
    const interval = setInterval(loadSources, 5 * 60 * 1000)
    return () => clearInterval(interval)
  }, [])

  if (isLoading) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="w-5 h-5" />
            Loading Data Sources...
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-gray-100 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Database className="w-5 h-5" />
          Powered by {sources.size} Data Sources
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Our correlation analysis uses {totalDatasets} datasets from authoritative sources
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        {Array.from(sources.entries()).map(([key, source]) => (
          <DataSourceItem key={key} sourceKey={key} source={source} />
        ))}
        
        <div className="mt-6 p-4 bg-muted/50 rounded-lg">
          <p className="text-xs text-muted-foreground leading-relaxed mb-3">
            <strong>Data Quality Commitment:</strong> We exclusively use real economic, financial, climate, space, geological, energy, health, 
            cryptocurrency, international, and environmental data from authoritative sources including Federal Reserve (FRED), World Bank, 
            Alpha Vantage financial markets, OpenWeather, NASA space weather, USGS earthquakes and geological data, EIA energy statistics, 
            Bureau of Labor Statistics (BLS), Centers for Disease Control (CDC), Nasdaq Data Link, CoinGecko cryptocurrency markets, 
            OECD international economic indicators, and World Air Quality Index environmental data.
          </p>
          
          {/* Quick Access Links */}
          <div className="flex flex-wrap gap-2 mt-3">
            <a
              href="https://fred.stlouisfed.org/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 px-3 py-1 text-xs bg-blue-50 text-blue-700 border border-blue-200 rounded-md hover:bg-blue-100 transition-colors"
            >
              <Database className="w-3 h-3" />
              Explore FRED Data
              <ArrowSquareOut className="w-3 h-3" />
            </a>
            <a
              href="https://data.worldbank.org/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 px-3 py-1 text-xs bg-green-50 text-green-700 border border-green-200 rounded-md hover:bg-green-100 transition-colors"
            >
              <Database className="w-3 h-3" />
              Explore World Bank Data
              <ArrowSquareOut className="w-3 h-3" />
            </a>
            <a
              href="https://www.alphavantage.co/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 px-3 py-1 text-xs bg-orange-50 text-orange-700 border border-orange-200 rounded-md hover:bg-orange-100 transition-colors"
            >
              <TrendUp className="w-3 h-3" />
              Explore Alpha Vantage
              <ArrowSquareOut className="w-3 h-3" />
            </a>
            <a
              href="https://openweathermap.org/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 px-3 py-1 text-xs bg-cyan-50 text-cyan-700 border border-cyan-200 rounded-md hover:bg-cyan-100 transition-colors"
            >
              <CloudSun className="w-3 h-3" />
              Explore OpenWeather
              <ArrowSquareOut className="w-3 h-3" />
            </a>
            <a
              href="https://api.nasa.gov/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 px-3 py-1 text-xs bg-indigo-50 text-indigo-700 border border-indigo-200 rounded-md hover:bg-indigo-100 transition-colors"
            >
              <Rocket className="w-3 h-3" />
              Explore NASA Data
              <ArrowSquareOut className="w-3 h-3" />
            </a>
            <a
              href="https://earthquake.usgs.gov/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 px-3 py-1 text-xs bg-amber-50 text-amber-700 border border-amber-200 rounded-md hover:bg-amber-100 transition-colors"
            >
              <Mountains className="w-3 h-3" />
              Explore USGS Data
              <ArrowSquareOut className="w-3 h-3" />
            </a>
            <a
              href="https://www.eia.gov/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 px-3 py-1 text-xs bg-yellow-50 text-yellow-700 border border-yellow-200 rounded-md hover:bg-yellow-100 transition-colors"
            >
              <Lightning className="w-3 h-3" />
              Explore EIA Data
              <ArrowSquareOut className="w-3 h-3" />
            </a>
            <a
              href="https://www.bls.gov/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 px-3 py-1 text-xs bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-md hover:bg-emerald-100 transition-colors"
            >
              <Briefcase className="w-3 h-3" />
              Explore BLS Data
              <ArrowSquareOut className="w-3 h-3" />
            </a>
            <a
              href="https://data.cdc.gov/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 px-3 py-1 text-xs bg-red-50 text-red-700 border border-red-200 rounded-md hover:bg-red-100 transition-colors"
            >
              <Heart className="w-3 h-3" />
              Explore CDC Data
              <ArrowSquareOut className="w-3 h-3" />
            </a>
            <a
              href="https://data.nasdaq.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 px-3 py-1 text-xs bg-blue-50 text-blue-700 border border-blue-200 rounded-md hover:bg-blue-100 transition-colors"
            >
              <ChartLine className="w-3 h-3" />
              Explore Nasdaq Data
              <ArrowSquareOut className="w-3 h-3" />
            </a>
            <a
              href="https://www.coingecko.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 px-3 py-1 text-xs bg-purple-50 text-purple-700 border border-purple-200 rounded-md hover:bg-purple-100 transition-colors"
            >
              <CurrencyBtc className="w-3 h-3" />
              Explore CoinGecko
              <ArrowSquareOut className="w-3 h-3" />
            </a>
            <a
              href="https://data.oecd.org/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 px-3 py-1 text-xs bg-indigo-50 text-indigo-700 border border-indigo-200 rounded-md hover:bg-indigo-100 transition-colors"
            >
              <Globe className="w-3 h-3" />
              Explore OECD Data
              <ArrowSquareOut className="w-3 h-3" />
            </a>
            <a
              href="https://aqicn.org/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 px-3 py-1 text-xs bg-teal-50 text-teal-700 border border-teal-200 rounded-md hover:bg-teal-100 transition-colors"
            >
              <Wind className="w-3 h-3" />
              Explore Air Quality
              <ArrowSquareOut className="w-3 h-3" />
            </a>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

function DataSourceItem({ sourceKey, source }: { sourceKey: string, source: DynamicDataSourceInfo }) {
  const getSourceIcon = (key: string): React.ReactElement => {
    const iconMap: Record<string, React.ReactElement> = {
      'FRED': <Database className="w-4 h-4" />,
      'WorldBank': <Database className="w-4 h-4" />,
      'AI': <Brain className="w-4 h-4" />,
      'AlphaVantage': <TrendUp className="w-4 h-4" />,
      'OpenWeather': <CloudSun className="w-4 h-4" />,
      'NASA': <Rocket className="w-4 h-4" />,
      'USGS': <Mountains className="w-4 h-4" />,
      'EIA': <Lightning className="w-4 h-4" />,
      'BLS': <Briefcase className="w-4 h-4" />,
      'CDC': <Heart className="w-4 h-4" />,
      'Nasdaq': <ChartLine className="w-4 h-4" />,
      'CoinGecko': <CurrencyBtc className="w-4 h-4" />,
      'OECD': <Globe className="w-4 h-4" />,
      'WorldAirQuality': <Wind className="w-4 h-4" />
    }
    
    return iconMap[key] || <Database className="w-4 h-4" />
  }

  const getSourceBadge = (key: string): React.ReactElement => {
    const config = getSourceConfig(key)
    
    const badgeMap: Record<string, { label: string; className: string }> = {
      'FRED': { label: 'Federal Reserve', className: 'bg-blue-50 text-blue-700 border-blue-200' },
      'WorldBank': { label: 'World Bank', className: 'bg-green-50 text-green-700 border-green-200' },
      'AlphaVantage': { label: 'Financial Markets', className: 'bg-orange-50 text-orange-700 border-orange-200' },
      'OpenWeather': { label: 'Weather Data', className: 'bg-cyan-50 text-cyan-700 border-cyan-200' },
      'NASA': { label: 'Space Weather', className: 'bg-purple-50 text-purple-700 border-purple-200' },
      'USGS': { label: 'Geological Data', className: 'bg-amber-50 text-amber-700 border-amber-200' },
      'EIA': { label: 'Energy Sector', className: 'bg-yellow-50 text-yellow-700 border-yellow-200' },
      'BLS': { label: 'Labor Statistics', className: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
      'CDC': { label: 'Health Statistics', className: 'bg-red-50 text-red-700 border-red-200' },
      'Nasdaq': { label: 'Financial Markets', className: 'bg-blue-50 text-blue-700 border-blue-200' },
      'CoinGecko': { label: 'Cryptocurrency', className: 'bg-purple-50 text-purple-700 border-purple-200' },
      'OECD': { label: 'International Data', className: 'bg-indigo-50 text-indigo-700 border-indigo-200' },
      'WorldAirQuality': { label: 'Air Quality', className: 'bg-teal-50 text-teal-700 border-teal-200' },
      'AI': { label: 'AI-Generated', className: 'bg-purple-50 text-purple-700 border-purple-200' }
    }
    
    const badge = badgeMap[key] || { label: 'Official Data', className: '' }
    return <Badge variant="outline" className={badge.className}>{badge.label}</Badge>
  }

  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors gap-3">
      <div className="flex items-center gap-3 min-w-0 flex-1">
        {getSourceIcon(sourceKey)}
        <div className="flex-1 min-w-0">
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-1">
            <h4 className="font-medium text-sm truncate">{source.name}</h4>
            <div className="flex-shrink-0">
              {getSourceBadge(sourceKey)}
            </div>
          </div>
          <p className="text-xs text-muted-foreground line-clamp-2">{source.description}</p>
        </div>
      </div>
      
      <div className="flex items-center justify-between sm:justify-end gap-2 flex-shrink-0">
        <Badge variant="secondary" className="text-xs">
          {source.datasets} datasets
        </Badge>
        {source.url && (
          <a
            href={source.url}
            target="_blank"
            rel="noopener noreferrer"
            className="p-1 hover:bg-muted rounded text-muted-foreground hover:text-foreground transition-colors flex-shrink-0"
            title={`Visit ${source.name}`}
          >
            <ArrowSquareOut className="w-3 h-3" />
          </a>
        )}
      </div>
    </div>
  )
}

export function DataSourceBadge({ dataset }: { dataset: any }) {
  if (dataset.isAIGenerated) {
    return (
      <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200 text-xs">
        <Brain className="w-3 h-3 mr-1" />
        AI-Generated
      </Badge>
    )
  }
  
  if (dataset.source?.includes('FRED')) {
    return (
      <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 text-xs">
        <Database className="w-3 h-3 mr-1" />
        FRED
      </Badge>
    )
  }
  
  if (dataset.source?.includes('World Bank')) {
    return (
      <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 text-xs">
        <Database className="w-3 h-3 mr-1" />
        World Bank
      </Badge>
    )
  }
  
  if (dataset.source?.includes('Alpha Vantage')) {
    return (
      <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-200 text-xs">
        <TrendUp className="w-3 h-3 mr-1" />
        Alpha Vantage
      </Badge>
    )
  }
  
  if (dataset.source?.includes('OpenWeather')) {
    return (
      <Badge variant="outline" className="bg-cyan-50 text-cyan-700 border-cyan-200 text-xs">
        <CloudSun className="w-3 h-3 mr-1" />
        OpenWeather
      </Badge>
    )
  }

  if (dataset.source?.includes('NASA')) {
    return (
      <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200 text-xs">
        <Rocket className="w-3 h-3 mr-1" />
        NASA
      </Badge>
    )
  }

  if (dataset.source?.includes('USGS')) {
    return (
      <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200 text-xs">
        <Mountains className="w-3 h-3 mr-1" />
        USGS
      </Badge>
    )
  }

  if (dataset.source?.includes('EIA')) {
    return (
      <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200 text-xs">
        <Lightning className="w-3 h-3 mr-1" />
        EIA
      </Badge>
    )
  }
  
  return (
    <Badge variant="outline" className="text-xs">
      <Database className="w-3 h-3 mr-1" />
      {dataset.source || 'Official Data'}
    </Badge>
  )
}

export function SourceAttribution({ dataset }: { dataset: any }) {
  if (!dataset) return null

  return (
    <div className="text-xs text-muted-foreground space-y-1">
      <div className="flex items-center gap-2">
        <DataSourceBadge dataset={dataset} />
        {dataset.sourceUrl && (
          <a
            href={dataset.sourceUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-foreground transition-colors underline"
          >
            View Source
          </a>
        )}
      </div>
      {dataset.citation && (
        <p className="italic">{dataset.citation}</p>
      )}
      {dataset.aiGeneratedAt && (
        <p className="text-muted-foreground">
          AI generated: {new Date(dataset.aiGeneratedAt).toLocaleDateString()}
        </p>
      )}
    </div>
  )
}