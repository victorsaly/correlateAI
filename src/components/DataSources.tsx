import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ArrowSquareOut, Database, Brain, TrendUp, CloudSun, Rocket, Mountains, Lightning } from '@phosphor-icons/react'
import { dataService } from '@/services/staticDataService'
import { dynamicDataSourceService, DataSourceInfo as DynamicDataSourceInfo } from '@/services/dynamicDataSourceService'
import { useState, useEffect } from 'react'

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
        const dynamicSources = await dynamicDataSourceService.getDataSources()
        const total = await dynamicDataSourceService.getTotalDatasetCount()
        
        setSources(dynamicSources)
        setTotalDatasets(total)
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
            <strong>Data Quality Commitment:</strong> We exclusively use real economic, financial, climate, space, geological, and energy data from 
            authoritative sources including Federal Reserve (FRED), World Bank, Alpha Vantage financial markets, OpenWeather, NASA space weather, 
            USGS geological data, and EIA energy statistics, plus AI-generated synthetic datasets based on real-world patterns. 
            No mock or fabricated data is ever used in our analysis.
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
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

function DataSourceItem({ sourceKey, source }: { sourceKey: string, source: DynamicDataSourceInfo }) {
  const getSourceIcon = (key: string) => {
    switch (key) {
      case 'AI':
        return <Brain className="w-4 h-4" />
      case 'AlphaVantage':
        return <TrendUp className="w-4 h-4" />
      case 'OpenWeather':
        return <CloudSun className="w-4 h-4" />
      case 'NASA':
        return <Rocket className="w-4 h-4" />
      case 'USGS':
        return <Mountains className="w-4 h-4" />
      case 'EIA':
        return <Lightning className="w-4 h-4" />
      default:
        return <Database className="w-4 h-4" />
    }
  }

  const getSourceBadge = (key: string) => {
    switch (key) {
      case 'FRED':
        return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">Federal Reserve</Badge>
      case 'WorldBank':
        return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">World Bank</Badge>
      case 'AlphaVantage':
        return <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-200">Financial Markets</Badge>
      case 'OpenWeather':
        return <Badge variant="outline" className="bg-cyan-50 text-cyan-700 border-cyan-200">Weather Data</Badge>
      case 'NASA':
        return <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">Space Weather</Badge>
      case 'USGS':
        return <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">Geological Data</Badge>
      case 'EIA':
        return <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">Energy Sector</Badge>
      case 'AI':
        return <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">AI-Generated</Badge>
      default:
        return <Badge variant="outline">Official Data</Badge>
    }
  }

  return (
    <div className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors">
      <div className="flex items-center gap-3">
        {getSourceIcon(sourceKey)}
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <h4 className="font-medium text-sm">{source.name}</h4>
            {getSourceBadge(sourceKey)}
          </div>
          <p className="text-xs text-muted-foreground">{source.description}</p>
        </div>
      </div>
      
      <div className="flex items-center gap-2">
        <Badge variant="secondary" className="text-xs">
          {source.datasets} datasets
        </Badge>
        {source.url && (
          <a
            href={source.url}
            target="_blank"
            rel="noopener noreferrer"
            className="p-1 hover:bg-muted rounded text-muted-foreground hover:text-foreground transition-colors"
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