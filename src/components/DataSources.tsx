import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ArrowSquareOut, Database, Brain } from '@phosphor-icons/react'
import { dataService } from '@/services/staticDataService'

interface DataSourceInfo {
  name: string
  description: string
  url: string
  logo?: string
  datasets: number
}

export function DataSourcesCard() {
  const sources = dataService.getDataSources()
  const stats = dataService.getDatasetStats()

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Database className="w-5 h-5" />
          Powered by Multiple Data Sources
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Our correlation analysis uses {stats.total} datasets from authoritative sources
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        {Array.from(sources.entries()).map(([key, source]) => (
          <DataSourceItem key={key} sourceKey={key} source={source} />
        ))}
        
        <div className="mt-6 p-4 bg-muted/50 rounded-lg">
          <p className="text-xs text-muted-foreground leading-relaxed mb-3">
            <strong>Data Quality Commitment:</strong> We exclusively use real economic data from 
            authoritative sources and AI-generated synthetic datasets based on real-world patterns. 
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
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

function DataSourceItem({ sourceKey, source }: { sourceKey: string, source: DataSourceInfo }) {
  const getSourceIcon = (key: string) => {
    switch (key) {
      case 'AI':
        return <Brain className="w-4 h-4" />
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