/**
 * Centralized Data Source Configuration
 * Single source of truth for all API endpoints and data sources
 */

export interface DataSourceConfig {
  key: string
  name: string
  displayName: string
  description: string
  url: string
  category: 'economics' | 'financial' | 'climate' | 'space' | 'geology' | 'energy' | 'health' | 'synthetic' | 'cryptocurrency' | 'international' | 'environmental'
  icon: string
  color: string
  badgeColor: string
  dataPath?: string
  isStatic: boolean
  expectedDatasets: number
}

/**
 * Complete registry of all data sources
 * Add new sources here to automatically integrate them across the platform
 */
export const DATA_SOURCE_REGISTRY: DataSourceConfig[] = [
  // Static Sources (always available)
  {
    key: 'FRED',
    name: 'FRED',
    displayName: 'Federal Reserve Economic Data',
    description: 'Federal Reserve Bank of St. Louis economic data',
    url: 'https://fred.stlouisfed.org/',
    category: 'economics',
    icon: 'bank',
    color: 'text-blue-400',
    badgeColor: 'bg-blue-50 text-blue-700 border-blue-200',
    isStatic: true,
    expectedDatasets: 16,
    dataPath: '/data/'
  },
  {
    key: 'WorldBank',
    name: 'World Bank Open Data',
    displayName: 'World Bank Open Data',
    description: 'Global development data and statistics',
    url: 'https://data.worldbank.org/',
    category: 'economics',
    icon: 'globe',
    color: 'text-green-400',
    badgeColor: 'bg-green-50 text-green-700 border-green-200',
    isStatic: true,
    expectedDatasets: 11,
    dataPath: '/data/'
  },
  {
    key: 'AlphaVantage',
    name: 'Alpha Vantage Financial Data',
    displayName: 'Alpha Vantage',
    description: 'Real-time and historical financial market data',
    url: 'https://www.alphavantage.co/',
    category: 'financial',
    icon: 'chart',
    color: 'text-orange-400',
    badgeColor: 'bg-orange-50 text-orange-700 border-orange-200',
    isStatic: true,
    expectedDatasets: 7,
    dataPath: '/data/'
  },
  {
    key: 'OpenWeather',
    name: 'OpenWeather API',
    displayName: 'OpenWeather',
    description: 'Weather data and forecasts',
    url: 'https://openweathermap.org/',
    category: 'climate',
    icon: 'cloud',
    color: 'text-cyan-400',
    badgeColor: 'bg-cyan-50 text-cyan-700 border-cyan-200',
    isStatic: true,
    expectedDatasets: 6,
    dataPath: '/data/'
  },

  // Dynamic Sources (check for data availability)
  {
    key: 'NASA',
    name: 'NASA',
    displayName: 'NASA Space Data',
    description: 'Space weather and astronomical data',
    url: 'https://api.nasa.gov/',
    category: 'space',
    icon: 'rocket',
    color: 'text-indigo-400',
    badgeColor: 'bg-purple-50 text-purple-700 border-purple-200',
    dataPath: '/data/nasa/',
    isStatic: false,
    expectedDatasets: 5
  },
  {
    key: 'USGS',
    name: 'USGS',
    displayName: 'USGS Geological Data',
    description: 'Geological and seismic activity data',
    url: 'https://earthquake.usgs.gov/',
    category: 'geology',
    icon: 'mountain',
    color: 'text-amber-400',
    badgeColor: 'bg-amber-50 text-amber-700 border-amber-200',
    dataPath: '/data/usgs/',
    isStatic: false,
    expectedDatasets: 4
  },
  {
    key: 'EIA',
    name: 'EIA',
    displayName: 'Energy Information Administration',
    description: 'U.S. energy sector data and statistics',
    url: 'https://www.eia.gov/',
    category: 'energy',
    icon: 'lightning',
    color: 'text-yellow-400',
    badgeColor: 'bg-yellow-50 text-yellow-700 border-yellow-200',
    dataPath: '/data/eia/',
    isStatic: false,
    expectedDatasets: 5
  },
  {
    key: 'BLS',
    name: 'BLS',
    displayName: 'Bureau of Labor Statistics',
    description: 'Bureau of Labor Statistics - Employment and economic data',
    url: 'https://www.bls.gov/',
    category: 'economics',
    icon: 'briefcase',
    color: 'text-emerald-400',
    badgeColor: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    dataPath: '/data/bls/',
    isStatic: false,
    expectedDatasets: 2
  },
  {
    key: 'CDC',
    name: 'CDC',
    displayName: 'Centers for Disease Control',
    description: 'Centers for Disease Control - Health and vital statistics',
    url: 'https://data.cdc.gov/',
    category: 'health',
    icon: 'heart',
    color: 'text-red-400',
    badgeColor: 'bg-red-50 text-red-700 border-red-200',
    dataPath: '/data/cdc/',
    isStatic: false,
    expectedDatasets: 1
  },
  {
    key: 'Nasdaq',
    name: 'Nasdaq Data Link',
    displayName: 'Nasdaq Data Link',
    description: 'Financial markets and economic data platform',
    url: 'https://data.nasdaq.com/',
    category: 'financial',
    icon: 'chart',
    color: 'text-blue-500',
    badgeColor: 'bg-blue-50 text-blue-700 border-blue-200',
    dataPath: '/data/nasdaq/',
    isStatic: false,
    expectedDatasets: 5
  },
  {
    key: 'CoinGecko',
    name: 'CoinGecko',
    displayName: 'CoinGecko Cryptocurrency Data',
    description: 'Cryptocurrency market data and price tracking',
    url: 'https://www.coingecko.com/',
    category: 'cryptocurrency',
    icon: 'currency',
    color: 'text-purple-400',
    badgeColor: 'bg-purple-50 text-purple-700 border-purple-200',
    isStatic: true,
    expectedDatasets: 7,
    dataPath: '/data/crypto/'
  },
  {
    key: 'OECD',
    name: 'OECD',
    displayName: 'OECD International Data',
    description: 'International economic data from 38 member countries',
    url: 'https://data.oecd.org/',
    category: 'international',
    icon: 'globe',
    color: 'text-indigo-400',
    badgeColor: 'bg-indigo-50 text-indigo-700 border-indigo-200',
    isStatic: true,
    expectedDatasets: 6,
    dataPath: '/data/oecd/'
  },
  {
    key: 'WorldAirQuality',
    name: 'World Air Quality Index',
    displayName: 'World Air Quality Index',
    description: 'Global air pollution and environmental data',
    url: 'https://aqicn.org/',
    category: 'environmental',
    icon: 'wind',
    color: 'text-teal-400',
    badgeColor: 'bg-teal-50 text-teal-700 border-teal-200',
    isStatic: true,
    expectedDatasets: 8,
    dataPath: '/data/air_quality/'
  },

  // AI-Generated (special case)
  {
    key: 'AI',
    name: 'AI-Generated Datasets',
    displayName: 'AI-Generated Synthetic Data',
    description: 'Synthetic datasets based on real-world patterns',
    url: '',
    category: 'synthetic',
    icon: 'robot',
    color: 'text-purple-400',
    badgeColor: 'bg-purple-50 text-purple-700 border-purple-200',
    dataPath: '/ai-data/',
    isStatic: false,
    expectedDatasets: 48
  }
]

/**
 * Get all real API sources (excluding AI)
 */
export function getRealAPISources(): DataSourceConfig[] {
  return DATA_SOURCE_REGISTRY.filter(source => source.key !== 'AI')
}

/**
 * Get source configuration by key
 */
export function getSourceConfig(key: string): DataSourceConfig | undefined {
  return DATA_SOURCE_REGISTRY.find(source => source.key === key)
}

/**
 * Get total expected real API source count
 */
export function getTotalRealAPICount(): number {
  return getRealAPISources().length
}

/**
 * Get source configuration by category
 */
export function getSourcesByCategory(category: string): DataSourceConfig[] {
  return DATA_SOURCE_REGISTRY.filter(source => source.category === category)
}

/**
 * Get all categories
 */
export function getAllCategories(): string[] {
  return [...new Set(DATA_SOURCE_REGISTRY.map(source => source.category))]
}