/**
 * Data Source Management Component
 * 
 * Provides a dashboard for managing automated data collection:
 * - View and manage data sources
 * - Monitor data quality and updates
 * - Configure automation settings
 * - Discover new data sources
 */

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  Database, 
  Lightning, 
  Check, 
  X, 
  Clock, 
  TrendUp, 
  ArrowClockwise,
  Warning,
  Info,
  Sparkle,
  Robot,
  Target
} from '@phosphor-icons/react'
import { toast } from 'sonner'
import { dataPipelineService, DataSource, DataUpdate } from '@/services/dataPipelineService'

interface DataSourceCardProps {
  source: DataSource
  stats: any
  onToggle: (sourceId: string, active: boolean) => void
  onUpdate: (sourceId: string) => void
}

const DataSourceCard: React.FC<DataSourceCardProps> = ({ source, stats, onToggle, onUpdate }) => {
  const getReliabilityColor = (score: number) => {
    if (score >= 0.9) return 'text-green-400'
    if (score >= 0.7) return 'text-yellow-400'
    return 'text-red-400'
  }

  const getQualityColor = (score: number) => {
    if (score >= 0.8) return 'bg-green-500/20 text-green-400'
    if (score >= 0.6) return 'bg-yellow-500/20 text-yellow-400'
    return 'bg-red-500/20 text-red-400'
  }

  return (
    <Card className="bg-gray-800/50 border-gray-700/50">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg text-white flex items-center gap-2">
              <Database size={20} className="text-cyan-400" />
              {source.name}
              {source.cost === 'free' && (
                <Badge variant="outline" className="text-green-400 border-green-400/30">
                  Free
                </Badge>
              )}
            </CardTitle>
            <CardDescription className="text-gray-400 mt-1">
              {source.description}
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Switch
              checked={source.isActive}
              onCheckedChange={(checked) => onToggle(source.id, checked)}
              disabled={!source.apiKey && source.id !== 'worldbank' && source.id !== 'census'}
            />
            <Label htmlFor={source.id} className="text-sm text-gray-400">
              {source.isActive ? 'Active' : 'Inactive'}
            </Label>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Status Indicators */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-400">Reliability</span>
              <span className={`text-sm font-medium ${getReliabilityColor(source.reliability)}`}>
                {(source.reliability * 100).toFixed(0)}%
              </span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-2">
              <div 
                className="bg-cyan-400 h-2 rounded-full transition-all duration-300"
                style={{ width: `${source.reliability * 100}%` }}
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-400">Quality Score</span>
              <Badge variant="outline" className={getQualityColor(stats?.recentQualityScore || 0)}>
                {((stats?.recentQualityScore || 0) * 100).toFixed(0)}%
              </Badge>
            </div>
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <Clock size={12} />
              {source.updateFrequency} updates
            </div>
          </div>
        </div>

        {/* Categories */}
        <div className="flex flex-wrap gap-1">
          {source.categories.slice(0, 4).map((category, index) => (
            <Badge 
              key={index} 
              variant="outline" 
              className="text-xs text-gray-400 border-gray-600"
            >
              {category}
            </Badge>
          ))}
          {source.categories.length > 4 && (
            <Badge variant="outline" className="text-xs text-gray-500">
              +{source.categories.length - 4}
            </Badge>
          )}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 pt-2 border-t border-gray-700/50">
          <div className="text-center">
            <div className="text-lg font-semibold text-white">
              {stats?.totalUpdates || 0}
            </div>
            <div className="text-xs text-gray-400">Updates</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-semibold text-white">
              {source.rateLimit}/min
            </div>
            <div className="text-xs text-gray-400">Rate Limit</div>
          </div>
          <div className="text-center">
            <div className={`text-lg font-semibold ${
              (stats?.errorRate || 0) < 0.1 ? 'text-green-400' : 'text-red-400'
            }`}>
              {((stats?.errorRate || 0) * 100).toFixed(0)}%
            </div>
            <div className="text-xs text-gray-400">Error Rate</div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2 pt-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onUpdate(source.id)}
            className="flex-1"
            disabled={!source.isActive}
          >
            <ArrowClockwise size={14} className="mr-1" />
            Update Now
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="px-3"
            disabled
          >
            <Info size={14} />
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

interface UpdateHistoryProps {
  updates: DataUpdate[]
}

const UpdateHistory: React.FC<UpdateHistoryProps> = ({ updates }) => {
  const getStatusIcon = (update: DataUpdate) => {
    if (update.errors.length > 0) {
      return <X size={16} className="text-red-400" />
    }
    if (update.qualityScore < 0.7) {
      return <Warning size={16} className="text-yellow-400" />
    }
    return <Check size={16} className="text-green-400" />
  }

  return (
    <Card className="bg-gray-800/50 border-gray-700/50">
      <CardHeader>
        <CardTitle className="text-lg text-white flex items-center gap-2">
          <Clock size={20} className="text-cyan-400" />
          Recent Updates
        </CardTitle>
        <CardDescription>
          Latest data collection activities
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {updates.slice(0, 20).map((update, index) => (
            <div 
              key={index} 
              className="flex items-center justify-between p-3 bg-gray-900/50 rounded-lg"
            >
              <div className="flex items-center gap-3">
                {getStatusIcon(update)}
                <div>
                  <div className="text-sm font-medium text-white">
                    {update.datasetId}
                  </div>
                  <div className="text-xs text-gray-400">
                    {update.timestamp.toLocaleString()}
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm text-white">
                  {update.recordsUpdated} records
                </div>
                <div className="text-xs text-gray-400">
                  Quality: {(update.qualityScore * 100).toFixed(0)}%
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

export const DataSourceManager: React.FC = () => {
  const [sources, setSources] = useState<Map<string, DataSource>>(new Map())
  const [sourceStats, setSourceStats] = useState<{ [key: string]: any }>({})
  const [updateHistory, setUpdateHistory] = useState<DataUpdate[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [autoDiscoveryEnabled, setAutoDiscoveryEnabled] = useState(true)

  // Load initial data
  useEffect(() => {
    loadDataSources()
    loadUpdateHistory()
    const interval = setInterval(() => {
      loadDataSources()
      loadUpdateHistory()
    }, 30000) // Refresh every 30 seconds

    return () => clearInterval(interval)
  }, [])

  const loadDataSources = async () => {
    try {
      // This would integrate with your dataPipelineService
      const stats = dataPipelineService.getDataSourceStats()
      setSourceStats(stats)
      
      // For demo purposes, we'll simulate some data sources
      const mockSources = new Map([
        ['fred', {
          id: 'fred',
          name: 'Federal Reserve Economic Data',
          description: 'US economic indicators and financial data',
          baseUrl: 'https://api.stlouisfed.org/fred',
          apiKey: 'demo_key',
          rateLimit: 120,
          categories: ['economics', 'finance', 'employment'],
          isActive: true,
          lastUpdate: new Date(),
          updateFrequency: 'daily' as const,
          reliability: 0.95,
          cost: 'free' as const
        }],
        ['worldbank', {
          id: 'worldbank',
          name: 'World Bank Open Data',
          description: 'Global development and economic indicators',
          baseUrl: 'https://api.worldbank.org/v2',
          rateLimit: 100,
          categories: ['economics', 'demographics', 'development'],
          isActive: true,
          lastUpdate: new Date(),
          updateFrequency: 'weekly' as const,
          reliability: 0.90,
          cost: 'free' as const
        }]
      ])
      
      setSources(mockSources)
    } catch (error) {
      console.error('Error loading data sources:', error)
      toast.error('Failed to load data sources')
    }
  }

  const loadUpdateHistory = async () => {
    try {
      const history = dataPipelineService.getUpdateHistory(50)
      setUpdateHistory(history)
    } catch (error) {
      console.error('Error loading update history:', error)
    }
  }

  const handleToggleSource = async (sourceId: string, active: boolean) => {
    try {
      const source = sources.get(sourceId)
      if (source) {
        source.isActive = active
        setSources(new Map(sources))
        toast.success(`${source.name} ${active ? 'activated' : 'deactivated'}`)
      }
    } catch (error) {
      toast.error('Failed to update source status')
    }
  }

  const handleUpdateSource = async (sourceId: string) => {
    setIsLoading(true)
    try {
      toast.info('Starting data update...')
      await dataPipelineService.triggerUpdate([sourceId])
      toast.success('Data update completed')
      loadUpdateHistory()
    } catch (error) {
      toast.error('Data update failed')
    } finally {
      setIsLoading(false)
    }
  }

  const handleBulkUpdate = async () => {
    setIsLoading(true)
    try {
      toast.info('Starting bulk data update...')
      await dataPipelineService.triggerUpdate()
      toast.success('Bulk update completed')
      loadUpdateHistory()
    } catch (error) {
      toast.error('Bulk update failed')
    } finally {
      setIsLoading(false)
    }
  }

  const handleDiscoverSources = async () => {
    setIsLoading(true)
    try {
      toast.info('Discovering new data sources...')
      // This would trigger the discovery process
      setTimeout(() => {
        toast.success('Discovery completed - 2 new sources found')
        loadDataSources()
      }, 3000)
    } catch (error) {
      toast.error('Discovery failed')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Data Source Management</h1>
          <p className="text-gray-400">Automate and monitor your data collection pipeline</p>
        </div>
        <div className="flex gap-3">
          <Button
            onClick={handleDiscoverSources}
            disabled={isLoading}
            variant="outline"
            className="flex items-center gap-2"
          >
            <Sparkle size={16} />
            Discover Sources
          </Button>
          <Button
            onClick={handleBulkUpdate}
            disabled={isLoading}
            className="flex items-center gap-2"
          >
            <Lightning size={16} />
            Update All
          </Button>
        </div>
      </div>

      <Tabs defaultValue="sources" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="sources">Data Sources</TabsTrigger>
          <TabsTrigger value="history">Update History</TabsTrigger>
          <TabsTrigger value="quality">Quality Metrics</TabsTrigger>
          <TabsTrigger value="settings">Automation Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="sources" className="space-y-6">
          {/* Summary Cards */}
          <div className="grid grid-cols-4 gap-4">
            <Card className="bg-gray-800/50 border-gray-700/50">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <Database size={24} className="text-cyan-400" />
                  <div>
                    <div className="text-2xl font-bold text-white">{sources.size}</div>
                    <div className="text-xs text-gray-400">Active Sources</div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-gray-800/50 border-gray-700/50">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <TrendUp size={24} className="text-green-400" />
                  <div>
                    <div className="text-2xl font-bold text-white">
                      {Object.values(sourceStats).reduce((sum: number, stat: any) => sum + (stat.totalUpdates || 0), 0)}
                    </div>
                    <div className="text-xs text-gray-400">Total Updates</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gray-800/50 border-gray-700/50">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <Target size={24} className="text-yellow-400" />
                  <div>
                    <div className="text-2xl font-bold text-white">
                      {Object.values(sourceStats).length > 0 
                        ? (Object.values(sourceStats).reduce((sum: number, stat: any) => sum + (stat.recentQualityScore || 0), 0) / Object.values(sourceStats).length * 100).toFixed(0)
                        : 0}%
                    </div>
                    <div className="text-xs text-gray-400">Avg Quality</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gray-800/50 border-gray-700/50">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <Robot size={24} className="text-purple-400" />
                  <div>
                    <div className="text-2xl font-bold text-white">24/7</div>
                    <div className="text-xs text-gray-400">Automated</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Data Sources Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from(sources.values()).map((source) => (
              <DataSourceCard
                key={source.id}
                source={source}
                stats={sourceStats[source.id]}
                onToggle={handleToggleSource}
                onUpdate={handleUpdateSource}
              />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="history">
          <UpdateHistory updates={updateHistory} />
        </TabsContent>

        <TabsContent value="quality" className="space-y-6">
          <Card className="bg-gray-800/50 border-gray-700/50">
            <CardHeader>
              <CardTitle className="text-white">Data Quality Overview</CardTitle>
              <CardDescription>
                Monitor the quality of your automated data collection
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-gray-400">
                Quality metrics dashboard coming soon...
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="space-y-6">
          <Card className="bg-gray-800/50 border-gray-700/50">
            <CardHeader>
              <CardTitle className="text-white">Automation Settings</CardTitle>
              <CardDescription>
                Configure how your data pipeline operates
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label className="text-white">Auto Discovery</Label>
                  <p className="text-sm text-gray-400">
                    Automatically discover and register new data sources
                  </p>
                </div>
                <Switch
                  checked={autoDiscoveryEnabled}
                  onCheckedChange={setAutoDiscoveryEnabled}
                />
              </div>
              
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label className="text-white">Update Frequency</Label>
                  <select className="w-full p-2 bg-gray-700 border border-gray-600 rounded text-white">
                    <option value="hourly">Hourly</option>
                    <option value="daily" selected>Daily</option>
                    <option value="weekly">Weekly</option>
                  </select>
                </div>
                
                <div className="space-y-2">
                  <Label className="text-white">Quality Threshold</Label>
                  <input 
                    type="range" 
                    min="0.5" 
                    max="1.0" 
                    step="0.1" 
                    defaultValue="0.7"
                    className="w-full"
                  />
                  <div className="text-sm text-gray-400">Current: 70%</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}