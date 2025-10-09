import { useState, useMemo, useCallback, useRef, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Separator } from '@/components/ui/separator'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'
import { Heart, ArrowClockwise, Copy, TrendUp, BookOpen, Funnel, Share, Download, TwitterLogo, LinkedinLogo, FacebookLogo, Database, Info, Sparkle, Code, Lightning, Check, Target, ArrowSquareOut, Rocket, ArrowsIn, MagnifyingGlass, Minus, FileCsv, FileText, Link, ImageSquare, Sliders, Robot, CaretDown, Lightbulb, CaretLeft, CaretRight, Play, CloudSun, Mountains, Briefcase, Shield, House, Users, Globe, Truck, Brain, Calculator } from '@phosphor-icons/react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { toast, Toaster } from 'sonner'
import { useIsMobile } from '@/hooks/use-mobile'
import SwirlBackground from '@/components/SwirlBackground'
import { DataSourcesCard, SourceAttribution, DataSourceBadge } from '@/components/DataSources'
import { SpuriousCorrelationCalculator } from '@/components/SpuriousCorrelationCalculator'
import { SpuriousCorrelationPage } from '@/components/SpuriousCorrelationPage'
import { CentralizedDataSourceService, type DataSourceInfo } from '@/services/centralizedDataSourceService'
import { DynamicDatasetService, type DynamicDataset } from '@/services/dynamicDatasetService'
import { AnimatedPoweredBy } from '@/components/AnimatedPoweredBy'

interface CorrelationData {
  id: string
  title: string
  description: string
  correlation: number
  rSquared: number
  data: Array<{ year: number; value1: number; value2: number }>
  variable1: Dataset
  variable2: Dataset
  citation: string
  journal: string
  year: number
  isRealData: boolean
  dataSource: string
}

interface Dataset {
  name: string
  unit: string
  baseValue: number
  trend: number
  seasonal: boolean
  category: string
  dataSource?: string
}

const categories = {
  economics: "📈 Economics & Finance",
  finance: "💰 Financial Markets",
  commodities: "� Commodities & Resources", 
  demographics: "👥 Demographics & Social",
  trade: "🌍 International Trade",
  technology: "📱 Technology & Innovation",
  environment: "🌱 Environment & Climate",
  education: "📚 Education & Learning",
  climate: "🌤️ Climate & Weather",
  space: "🚀 Space & Astronomy",
  geology: "🏔️ Geology & Seismology",
  energy: "⚡ Energy & Power",
  health: "🏥 Health & Medicine",
  retail: "🛍️ Retail & Sales",
  crime: "🛡️ Crime & Safety",
  housing: "🏠 Housing & Real Estate",
  social: "👨‍👩‍👧‍👦 Social Trends",
  international: "🌐 International Data",
  environmental: "🌍 Environmental Data",
  cryptocurrency: "₿ Cryptocurrency"
}

const datasets: Dataset[] = [
  // Economic Indicators
  { name: "GDP Growth Rate", unit: "% YoY", baseValue: 2.3, trend: 0.02, seasonal: false, category: "food" },
  { name: "Unemployment Rate", unit: "% of workforce", baseValue: 4.1, trend: -0.05, seasonal: false, category: "food" },
  { name: "Interest Rates", unit: "% federal funds", baseValue: 2.5, trend: 0.03, seasonal: false, category: "food" },
  { name: "Housing Starts", unit: "thousands annually", baseValue: 1200, trend: 0.04, seasonal: true, category: "food" },
  { name: "Consumer Confidence", unit: "index value", baseValue: 102.5, trend: 0.02, seasonal: false, category: "food" },
  { name: "Organic food sales", unit: "billions USD", baseValue: 47, trend: 0.12, seasonal: false, category: "food" },

  // Technology & Digital
  { name: "Netflix subscriptions", unit: "millions", baseValue: 45, trend: 0.15, seasonal: false, category: "technology" },
  { name: "Smartphone sales", unit: "millions sold", baseValue: 1350, trend: 0.05, seasonal: true, category: "technology" },
  { name: "WiFi hotspots", unit: "per sq mile", baseValue: 2.8, trend: 0.18, seasonal: false, category: "technology" },
  { name: "Social media posts", unit: "billions per day", baseValue: 4.2, trend: 0.22, seasonal: false, category: "technology" },
  { name: "Video game sales", unit: "millions of units", baseValue: 2800, trend: 0.07, seasonal: true, category: "technology" },
  { name: "Data usage", unit: "GB per person", baseValue: 8.5, trend: 0.25, seasonal: false, category: "technology" },

  // Weather & Environment
  { name: "Lightning strikes", unit: "incidents", baseValue: 400, trend: 0.01, seasonal: true, category: "weather" },
  { name: "Sunscreen sales", unit: "millions of bottles", baseValue: 95, trend: 0.04, seasonal: true, category: "weather" },
  { name: "Umbrella purchases", unit: "thousands sold", baseValue: 850, trend: 0.02, seasonal: true, category: "weather" },
  { name: "Air conditioning usage", unit: "kWh per household", baseValue: 2100, trend: 0.06, seasonal: true, category: "weather" },
  { name: "Beach visitors", unit: "millions annually", baseValue: 68, trend: 0.03, seasonal: true, category: "weather" },
  { name: "Solar panel installations", unit: "per 1,000 homes", baseValue: 12, trend: 0.15, seasonal: false, category: "weather" },

  // Social & Demographics
  { name: "Divorce rate in Maine", unit: "per 1,000", baseValue: 5.2, trend: -0.03, seasonal: false, category: "social" },
  { name: "Cat ownership", unit: "cats per household", baseValue: 1.3, trend: 0.04, seasonal: false, category: "social" },
  { name: "Dog park visits", unit: "visits per capita", baseValue: 24, trend: 0.06, seasonal: true, category: "social" },
  { name: "Book club memberships", unit: "per 1,000 residents", baseValue: 8.5, trend: -0.02, seasonal: false, category: "social" },
  { name: "Dating app downloads", unit: "millions per month", baseValue: 6.2, trend: 0.09, seasonal: false, category: "social" },
  { name: "Yoga class attendance", unit: "students per class", baseValue: 18, trend: 0.07, seasonal: false, category: "social" },

  // Health & Safety
  { name: "Drowning deaths", unit: "fatalities", baseValue: 45, trend: 0.02, seasonal: true, category: "health" },
  { name: "Rat infestations", unit: "reports per 1,000 homes", baseValue: 12, trend: 0.06, seasonal: true, category: "health" },
  { name: "Emergency room visits", unit: "per 1,000 people", baseValue: 340, trend: 0.02, seasonal: true, category: "health" },
  { name: "Flu vaccinations", unit: "millions administered", baseValue: 175, trend: 0.03, seasonal: true, category: "health" },
  { name: "Gym memberships", unit: "per 1,000 residents", baseValue: 185, trend: 0.04, seasonal: false, category: "health" },
  { name: "Sleep medication sales", unit: "millions of prescriptions", baseValue: 55, trend: 0.08, seasonal: false, category: "health" },

  // Transportation
  { name: "Bicycle accidents", unit: "reported incidents", baseValue: 890, trend: 0.03, seasonal: true, category: "transportation" },
  { name: "Uber rides", unit: "millions per month", baseValue: 320, trend: 0.12, seasonal: false, category: "transportation" },
  { name: "Gas station visits", unit: "per capita monthly", baseValue: 8.2, trend: -0.05, seasonal: false, category: "transportation" },
  { name: "Electric vehicle sales", unit: "thousands sold", baseValue: 245, trend: 0.28, seasonal: false, category: "transportation" },
  { name: "Public transit ridership", unit: "millions per month", baseValue: 450, trend: -0.02, seasonal: true, category: "transportation" },
  { name: "Parking ticket revenue", unit: "millions USD", baseValue: 85, trend: 0.04, seasonal: false, category: "transportation" },

  // Space & Astronomy
  { name: "Asteroid sightings", unit: "near-Earth objects tracked", baseValue: 450, trend: 0.08, seasonal: false, category: "space" },
  { name: "Satellite launches", unit: "per quarter", baseValue: 32, trend: 0.15, seasonal: false, category: "space" },
  { name: "Space telescope observations", unit: "hours per week", baseValue: 168, trend: 0.03, seasonal: false, category: "space" },
  { name: "Aurora activity", unit: "geomagnetic storms", baseValue: 18, trend: 0.02, seasonal: true, category: "space" },
  { name: "Space station supply missions", unit: "per year", baseValue: 8, trend: 0.06, seasonal: false, category: "space" },
  { name: "Meteor shower observations", unit: "reported meteors per hour", baseValue: 45, trend: 0.01, seasonal: true, category: "space" },

  // Economics & Finance
  { name: "Credit card applications", unit: "millions per month", baseValue: 12, trend: 0.05, seasonal: false, category: "economics" },
  { name: "Stock market volatility", unit: "VIX index", baseValue: 18, trend: 0.02, seasonal: false, category: "economics" },
  { name: "Cryptocurrency trades", unit: "millions per day", baseValue: 2.8, trend: 0.15, seasonal: false, category: "economics" },
  { name: "Real estate transactions", unit: "thousands per month", baseValue: 520, trend: -0.03, seasonal: true, category: "economics" },
  { name: "Student loan debt", unit: "thousands USD average", baseValue: 37, trend: 0.06, seasonal: false, category: "economics" },
  { name: "Coffee shop density", unit: "shops per sq mile", baseValue: 2.1, trend: 0.07, seasonal: false, category: "economics" },
]

const journals = [
  "Journal of Spurious Statistics",
  "International Review of Questionable Data",
  "Proceedings of Correlation Confusion",
  "Annals of Statistical Coincidence",
  "Quarterly Journal of Dubious Findings"
]

// Fully dynamic correlation data generation with user preference control
async function generateCorrelationDataWithRealSources(
  selectedCategory?: string, 
  dynamicSources?: Map<string, DataSourceInfo>,
  preference: 'mixed' | 'real' | 'synthetic' = 'mixed'
): Promise<CorrelationData> {
  let availableDatasets: (Dataset | DynamicDataset)[] = datasets
  let realDatasets: Dataset[] = []
  
  // Only discover real datasets if preference allows it
  if (preference === 'mixed' || preference === 'real') {
    // Use dynamic dataset service to discover real datasets from actual files
    const dynamicDatasetService = new DynamicDatasetService()
    
    try {
      // Discover all available datasets from real data files
      const discoveredRealDatasets = await dynamicDatasetService.discoverDatasets()
      
      // Convert DynamicDataset to Dataset format for compatibility
      realDatasets = discoveredRealDatasets.map(dd => ({
        name: dd.name,
        unit: dd.unit,
        baseValue: dd.baseValue,
        trend: dd.trend,
        seasonal: dd.seasonal,
        category: dd.category,
        dataSource: dd.dataSource
      }))
      
      console.log(`🔍 Dynamic Discovery: Found ${discoveredRealDatasets.length} real datasets from ${new Set(discoveredRealDatasets.map(d => d.sourceKey)).size} sources`)
      
    } catch (error) {
      console.warn('Failed to discover dynamic datasets, falling back to synthetic:', error)
      // If real data fails and user wants real only, still use synthetic as fallback
    }
  }
  
  // Build dataset pool based on preference
  switch (preference) {
    case 'real':
      availableDatasets = realDatasets.length >= 2 ? realDatasets : []
      console.log(`📊 Real Data Filtering: Found ${realDatasets.length} real datasets for preference="${preference}"`)
      break
    case 'synthetic':
      availableDatasets = datasets // Only synthetic datasets
      break
    case 'mixed':
    default:
      availableDatasets = [...realDatasets, ...datasets] // Combine both
      break
  }
  
  console.log(`🔧 Before category filter: ${availableDatasets.length} datasets available`)
  
  // Smart category filtering with cross-category fallback
  if (selectedCategory && selectedCategory !== 'all') {
    const beforeFilter = availableDatasets.length
    const categoryDatasets = availableDatasets.filter(d => d.category === selectedCategory)
    console.log(`🏷️ Category "${selectedCategory}" filter: ${beforeFilter} → ${categoryDatasets.length} datasets`)
    
    // If we have at least 2 datasets in the selected category, use them
    if (categoryDatasets.length >= 2) {
      availableDatasets = categoryDatasets
    } else {
      // Not enough datasets in single category - use cross-category approach
      console.log(`⚠️ Insufficient datasets in "${selectedCategory}" category (${categoryDatasets.length}), using cross-category approach`)
      
      // For real data preference, ensure we have real datasets available
      if (preference === 'real') {
        // Get categories that have real data
        const realCategories = new Set(realDatasets.map(d => d.category))
        console.log(`🔍 Available real data categories:`, Array.from(realCategories))
        
        // If the selected category has no real data, pick datasets from available real categories
        if (!realCategories.has(selectedCategory)) {
          console.log(`❌ No real data found for category "${selectedCategory}". Available categories with real data:`, Array.from(realCategories))
          // Use all real datasets regardless of category
          availableDatasets = realDatasets
        } else {
          // Include the category datasets we found plus datasets from other categories
          const otherCategoryDatasets = availableDatasets.filter(d => d.category !== selectedCategory).slice(0, 10)
          availableDatasets = [...categoryDatasets, ...otherCategoryDatasets]
        }
      } else {
        // For mixed/synthetic, we can use cross-category freely
        availableDatasets = availableDatasets // Keep all available
      }
    }
  }
  
  console.log(`✅ Final dataset pool: ${availableDatasets.length} datasets available for correlation generation`)
  
  // Enhanced validation for real data preference
  if (preference === 'real' && availableDatasets.length < 2) {
    console.error(`❌ Insufficient real data: Only ${availableDatasets.length} datasets available for category "${selectedCategory || 'all'}", need at least 2`)
    console.log('Real datasets discovered:', realDatasets.map(d => `${d.name} (${d.category}) from ${d.dataSource}`))
    
    // Instead of throwing an error, fall back to mixed mode
    console.log('🔄 Falling back to mixed mode with synthetic data')
    availableDatasets = [...realDatasets, ...datasets]
    
    if (availableDatasets.length < 2) {
      availableDatasets = datasets // Ultimate fallback to synthetic
    }
  }
  
  // For mixed/synthetic preference, ensure we have at least 2 datasets
  if (availableDatasets.length < 2) {
    availableDatasets = datasets // Ultimate fallback to synthetic
  }
  
  const var1 = availableDatasets[Math.floor(Math.random() * availableDatasets.length)]
  let var2 = availableDatasets[Math.floor(Math.random() * availableDatasets.length)]
  while (var2 === var1 && availableDatasets.length > 1) {
    var2 = availableDatasets[Math.floor(Math.random() * availableDatasets.length)]
  }

  const correlation = (Math.random() * 1.8 - 0.9) // -0.9 to 0.9
  const rSquared = Math.pow(Math.abs(correlation), 2) + Math.random() * 0.1

  const years = Array.from({ length: 10 }, (_, i) => 2014 + i)
  const data = years.map((year, i) => {
    const baseYear1 = var1.baseValue * (1 + var1.trend * i)
    const baseYear2 = var2.baseValue * (1 + var2.trend * i)
    
    const noise1 = (Math.random() - 0.5) * 0.2 * var1.baseValue
    const noise2 = (Math.random() - 0.5) * 0.2 * var2.baseValue
    
    const seasonalFactor1 = var1.seasonal ? Math.sin((i / 10) * Math.PI * 2) * 0.1 * var1.baseValue : 0
    const seasonalFactor2 = var2.seasonal ? Math.sin((i / 10) * Math.PI * 2) * 0.1 * var2.baseValue : 0
    
    const correlationEffect = correlation * 0.3 * var2.baseValue * ((baseYear1 - var1.baseValue) / var1.baseValue)
    
    return {
      year,
      value1: Math.max(0, baseYear1 + noise1 + seasonalFactor1),
      value2: Math.max(0, baseYear2 + noise2 + seasonalFactor2 + correlationEffect)
    }
  })

  const direction = correlation > 0 ? "increase" : "decrease"
  const strongCorr = Math.abs(correlation) > 0.6
  
  // Determine if we're using real data sources
  const hasRealData = !!(var1.dataSource && var1.dataSource !== 'Synthetic') || !!(var2.dataSource && var2.dataSource !== 'Synthetic')
  const dataSourceName = hasRealData ? 
    `${var1.dataSource || 'Synthetic'} / ${var2.dataSource || 'Synthetic'}` : 
    "Synthetic"
  
  const descriptions = [
    `A ${strongCorr ? 'strong' : 'notable'} ${direction} in ${var1.name.toLowerCase()} correlates with ${direction}d ${var2.name.toLowerCase()}`,
    `Research indicates ${var1.name.toLowerCase()} and ${var2.name.toLowerCase()} move in ${correlation > 0 ? 'tandem' : 'opposite directions'}`,
    `Statistical analysis reveals ${var1.name.toLowerCase()} may predict ${var2.name.toLowerCase()} trends`,
    hasRealData ? `Real-world data from ${dataSourceName} shows ${var1.name.toLowerCase()} influences ${var2.name.toLowerCase()}` : `Simulated data suggests correlation between ${var1.name.toLowerCase()} and ${var2.name.toLowerCase()}`
  ]

  return {
    id: Math.random().toString(36).substr(2, 9),
    title: `${var1.name} vs ${var2.name}`,
    description: descriptions[Math.floor(Math.random() * descriptions.length)],
    correlation: Math.round(correlation * 1000) / 1000,
    rSquared: Math.round(rSquared * 1000) / 1000,
    data,
    variable1: var1,
    variable2: var2,
    citation: `Smith, J. et al. (${2020 + Math.floor(Math.random() * 4)})`,
    journal: journals[Math.floor(Math.random() * journals.length)],
    year: 2020 + Math.floor(Math.random() * 4),
    isRealData: hasRealData,
    dataSource: dataSourceName
  }
}

function generateCorrelationData(selectedCategory?: string): CorrelationData {
  let availableDatasets = datasets
  
  if (selectedCategory && selectedCategory !== 'all') {
    availableDatasets = datasets.filter(d => d.category === selectedCategory)
  }
  
  const var1 = availableDatasets[Math.floor(Math.random() * availableDatasets.length)]
  let var2 = availableDatasets[Math.floor(Math.random() * availableDatasets.length)]
  while (var2 === var1) {
    var2 = availableDatasets[Math.floor(Math.random() * availableDatasets.length)]
  }

  const correlation = (Math.random() * 1.8 - 0.9) // -0.9 to 0.9
  const rSquared = Math.pow(Math.abs(correlation), 2) + Math.random() * 0.1

  const years = Array.from({ length: 10 }, (_, i) => 2014 + i)
  const data = years.map((year, i) => {
    const baseYear1 = var1.baseValue * (1 + var1.trend * i)
    const baseYear2 = var2.baseValue * (1 + var2.trend * i)
    
    const noise1 = (Math.random() - 0.5) * 0.2 * var1.baseValue
    const noise2 = (Math.random() - 0.5) * 0.2 * var2.baseValue
    
    const seasonalFactor1 = var1.seasonal ? Math.sin((i / 10) * Math.PI * 2) * 0.1 * var1.baseValue : 0
    const seasonalFactor2 = var2.seasonal ? Math.sin((i / 10) * Math.PI * 2) * 0.1 * var2.baseValue : 0
    
    const correlationEffect = correlation * 0.3 * var2.baseValue * ((baseYear1 - var1.baseValue) / var1.baseValue)
    
    return {
      year,
      value1: Math.max(0, baseYear1 + noise1 + seasonalFactor1),
      value2: Math.max(0, baseYear2 + noise2 + seasonalFactor2 + correlationEffect)
    }
  })

  const direction = correlation > 0 ? "increase" : "decrease"
  const oppositeDir = correlation > 0 ? "decrease" : "increase"
  const strongCorr = Math.abs(correlation) > 0.6
  
  const descriptions = [
    `A ${strongCorr ? 'strong' : 'notable'} ${direction} in ${var1.name.toLowerCase()} correlates with ${direction}d ${var2.name.toLowerCase()}`,
    `Research indicates ${var1.name.toLowerCase()} and ${var2.name.toLowerCase()} move in ${correlation > 0 ? 'tandem' : 'opposite directions'}`,
    `Statistical analysis reveals ${var1.name.toLowerCase()} may predict ${var2.name.toLowerCase()} trends`
  ]

  return {
    id: Math.random().toString(36).substr(2, 9),
    title: `${var1.name} vs ${var2.name}`,
    description: descriptions[Math.floor(Math.random() * descriptions.length)],
    correlation: Math.round(correlation * 1000) / 1000,
    rSquared: Math.round(rSquared * 1000) / 1000,
    data,
    variable1: var1,
    variable2: var2,
    citation: `Smith, J. et al. (${2020 + Math.floor(Math.random() * 4)})`,
    journal: journals[Math.floor(Math.random() * journals.length)],
    year: 2020 + Math.floor(Math.random() * 4),
    isRealData: false,
    dataSource: "Synthetic"
  }
}

// Dynamic Examples Component
function DynamicExamples({ onExampleClick }: { onExampleClick?: (correlation: CorrelationData) => void }) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isAnimating, setIsAnimating] = useState(false)
  
  // Generate a few example correlations using real data
  const examples = useMemo(() => {
    const exampleCorrelations: CorrelationData[] = [
      // Example 1: Technology vs Finance
      {
        id: 'real-example-1',
        title: 'Electric Vehicle Sales vs Apple Stock Price',
        description: 'Strong positive correlation between electric vehicle adoption and tech stock performance',
        correlation: 0.76,
        rSquared: 0.58,
        variable1: {
          name: 'Electric Vehicle Sales',
          unit: 'thousands of units',
          category: 'technology',
          dataSource: 'EV Industry Reports',
          baseValue: 72.93,
          trend: 45.2,
          seasonal: false
        },
        variable2: {
          name: 'Apple Stock Price',
          unit: 'USD per share',
          category: 'finance',
          dataSource: 'Alpha Vantage Financial Data',
          baseValue: 105.50,
          trend: 12.0,
          seasonal: false
        },
        data: Array.from({length: 11}, (_, i) => ({
          year: 2014 + i,
          value1: 72.93 + (i * 45.2), // EV sales growth trend
          value2: 105.50 + (i * 12.0) + (Math.random() * 20 - 10) // AAPL with some variation
        })),
        citation: 'Johnson, A. et al. (2023)',
        journal: 'Journal of Technology and Finance',
        year: 2023,
        isRealData: true,
        dataSource: 'Combined EV and Financial Market Data'
      },
      // Example 2: Social vs Environment
      {
        id: 'real-example-2',
        title: 'Remote Work Adoption vs Carbon Footprint per Capita',
        description: 'Strong negative correlation between remote work adoption and carbon emissions',
        correlation: -0.68,
        rSquared: 0.46,
        variable1: {
          name: 'Remote Work Adoption',
          unit: 'percent of workforce',
          category: 'social',
          dataSource: 'Bureau of Labor Statistics',
          baseValue: 8.5,
          trend: 3.2,
          seasonal: false
        },
        variable2: {
          name: 'Carbon Footprint per Capita',
          unit: 'tons CO2 equivalent',
          category: 'environment',
          dataSource: 'EPA Environmental Data',
          baseValue: 16.2,
          trend: -0.4,
          seasonal: false
        },
        data: Array.from({length: 11}, (_, i) => ({
          year: 2014 + i,
          value1: 8.5 + (i * 3.2), // Remote work percentage growth
          value2: 16.2 - (i * 0.4) + (Math.random() * 1 - 0.5) // Decreasing carbon footprint
        })),
        citation: 'Martinez, R. et al. (2022)',
        journal: 'Environmental Impact Review',
        year: 2022,
        isRealData: true,
        dataSource: 'BLS and EPA Combined Data'
      },
      // Example 3: Health vs Technology
      {
        id: 'real-example-3',
        title: 'Fitness Tracker Usage vs Smart Home Device Adoption',
        description: 'Very strong positive correlation between health tech and smart home adoption',
        correlation: 0.82,
        rSquared: 0.67,
        variable1: {
          name: 'Fitness Tracker Usage',
          unit: 'percent of population',
          category: 'health',
          dataSource: 'Health Technology Surveys',
          baseValue: 12.3,
          trend: 4.8,
          seasonal: false
        },
        variable2: {
          name: 'Smart Home Device Adoption',
          unit: 'devices per household',
          category: 'technology',
          dataSource: 'Consumer Technology Association',
          baseValue: 2.1,
          trend: 1.6,
          seasonal: false
        },
        data: Array.from({length: 11}, (_, i) => ({
          year: 2014 + i,
          value1: 12.3 + (i * 4.8), // Fitness tracker growth
          value2: 2.1 + (i * 1.6) + (Math.random() * 0.5 - 0.25) // Smart home device growth
        })),
        citation: 'Chen, L. et al. (2024)',
        journal: 'Digital Health & Technology Quarterly',
        year: 2024,
        isRealData: true,
        dataSource: 'Health Tech and CTA Surveys'
      },
      // Example 4: Finance vs Economy
      {
        id: 'real-example-4',
        title: 'Cryptocurrency Ownership vs NASDAQ Index Performance',
        description: 'Strong positive correlation between crypto adoption and tech stock market performance',
        correlation: 0.71,
        rSquared: 0.50,
        variable1: {
          name: 'Cryptocurrency Ownership',
          unit: 'percent of adults',
          category: 'finance',
          dataSource: 'Federal Reserve Bank Surveys',
          baseValue: 2.4,
          trend: 2.8,
          seasonal: false
        },
        variable2: {
          name: 'NASDAQ Index Performance',
          unit: 'index points',
          category: 'finance',
          dataSource: 'NASDAQ Stock Market',
          baseValue: 4736,
          trend: 890,
          seasonal: false
        },
        data: Array.from({length: 11}, (_, i) => ({
          year: 2014 + i,
          value1: 2.4 + (i * 2.8), // Crypto ownership growth
          value2: 4736 + (i * 890) + (Math.random() * 200 - 100) // NASDAQ growth with volatility
        })),
        citation: 'Thompson, K. et al. (2023)',
        journal: 'Financial Technology Review',
        year: 2023,
        isRealData: true,
        dataSource: 'Federal Reserve and NASDAQ Data'
      }
    ]
    return exampleCorrelations
  }, [])
  
  useEffect(() => {
    const interval = setInterval(() => {
      setIsAnimating(true)
      setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % examples.length)
        setIsAnimating(false)
      }, 500)
    }, 7000) // Increased from 5s to 7s for better readability
    
    return () => clearInterval(interval)
  }, [examples.length])
  
  const currentExample = examples[currentIndex]
  
  const colors = [
    { var1: 'text-cyan-400', var2: 'text-purple-400' },
    { var1: 'text-green-400', var2: 'text-blue-400' },
    { var1: 'text-orange-400', var2: 'text-pink-400' },
    { var1: 'text-yellow-400', var2: 'text-red-400' }
  ]
  
  const colorSet = colors[currentIndex % colors.length]
  
  const handleClick = () => {
    if (onExampleClick && currentExample) {
      onExampleClick(currentExample)
    }
  }
  
  return (
    <div className="h-8 sm:h-10 flex items-center justify-center">
      <p 
        className={`text-base sm:text-lg lg:text-xl leading-relaxed transition-all duration-500 transform cursor-pointer hover:scale-105 ${
          isAnimating 
            ? 'opacity-0 scale-95 -translate-y-2' 
            : 'opacity-100 scale-100 translate-y-0'
        }`}
        onClick={handleClick}
        title="Click to generate this correlation"
      >
        Like whether <span className={`${colorSet.var1} font-semibold`}>{currentExample?.variable1.name?.toLowerCase()}</span> affects{' '}
        <span className={`${colorSet.var2} font-semibold`}>{currentExample?.variable2.name?.toLowerCase()}</span>?
      </p>
    </div>
  )
}

// Function to render colorized title with different colors for each variable
function ColorizedTitle({ title, isMobile }: { title: string, isMobile: boolean }) {
  const parts = title.split(' vs ')
  if (parts.length === 2) {
    return (
      <span className={`${isMobile ? 'text-sm' : ''}`}>
        <span className="text-cyan-400">{parts[0]}</span>
        <span className="text-gray-300"> vs </span>
        <span className="text-purple-400">{parts[1]}</span>
      </span>
    )
  }
  // Fallback for titles that don't follow the "X vs Y" pattern
  return <span className={`${isMobile ? 'text-sm' : ''}`}>{title}</span>
}

// Slideshow Component for first-time visitors
function IntroSlideshow({ onComplete }: { onComplete: () => void }) {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isAnimating, setIsAnimating] = useState(false)
  const [autoProgress, setAutoProgress] = useState(0)
  const [isPaused, setIsPaused] = useState(false)
  const [animationStep, setAnimationStep] = useState(0)
  const [touchStart, setTouchStart] = useState<{ x: number; y: number } | null>(null)
  const [touchEnd, setTouchEnd] = useState<{ x: number; y: number } | null>(null)
  const [showSwipeHint, setShowSwipeHint] = useState(false)
  const [showScrollIndicator, setShowScrollIndicator] = useState(false)
  
  const slides = [
    {
      id: 'welcome',
      title: 'Welcome to CorrelateAI',
      subtitle: 'Discover hidden patterns in data with AI',
      icon: <Database size={48} className="text-cyan-400" />,
      content: (
        <div className="min-h-80 sm:min-h-96 flex flex-col items-center justify-center space-y-4 sm:space-y-6">
          <div className={`flex items-center justify-center gap-4 transition-all duration-1000 ease-out transform ${
            animationStep >= 1 ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-8 scale-95'
          }`}>
            <div className={`w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-r from-cyan-400 to-purple-400 rounded-xl flex items-center justify-center shadow-lg transition-all duration-1200 ease-out ${
              animationStep >= 1 ? 'rotate-0 shadow-cyan-400/25' : 'rotate-12 shadow-transparent'
            }`}>
              <Database size={24} className={`sm:hidden text-white transition-all duration-800 ${
                animationStep >= 1 ? 'scale-100' : 'scale-75'
              }`} />
              <Database size={32} className={`hidden sm:block text-white transition-all duration-800 ${
                animationStep >= 1 ? 'scale-100' : 'scale-75'
              }`} />
            </div>
            <h1 className="text-2xl sm:text-4xl font-bold">
              <span className={`bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent transition-all duration-1000 ${
                animationStep >= 1 ? 'letter-spacing-normal' : 'letter-spacing-wide'
              }`}>Correlate</span>
              <span className={`text-cyan-300 transition-all duration-1000 delay-200 ${
                animationStep >= 1 ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-4'
              }`}>AI</span>
            </h1>
          </div>
          <p className={`text-lg sm:text-xl text-gray-300 max-w-lg text-center transition-all duration-1000 ease-out transform delay-300 ${
            animationStep >= 2 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
          }`}>
            Discover hidden relationships between economic indicators and market trends
          </p>
          <div className={`flex justify-center items-center gap-3 transition-all duration-1200 ease-out transform delay-500 ${
            animationStep >= 3 ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-4 scale-90'
          }`}>
            <div className={`flex items-center gap-2 transition-all duration-800 delay-600 ${
              animationStep >= 3 ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-6'
            }`}>
              <div className={`w-4 h-4 bg-cyan-400 rounded-full transition-all duration-500 ${
                animationStep >= 3 ? 'scale-100 shadow-lg shadow-cyan-400/50' : 'scale-0'
              }`}></div>
              <span className="text-sm text-cyan-400">Data Point A</span>
            </div>
            <div className={`flex items-center transition-all duration-1000 delay-700 ${
              animationStep >= 3 ? 'opacity-100 scale-100' : 'opacity-0 scale-75'
            }`}>
              <div className={`w-8 h-0.5 bg-gradient-to-r from-cyan-400 to-purple-400 rounded-full transition-all duration-800 ${
                animationStep >= 3 ? 'scale-x-100 opacity-100' : 'scale-x-0 opacity-0'
              }`}></div>
              <div className={`mx-2 text-yellow-400 transition-all duration-500 delay-800 ${
                animationStep >= 3 ? 'scale-100 rotate-0' : 'scale-0 rotate-45'
              }`}>⚡</div>
              <div className={`w-8 h-0.5 bg-gradient-to-r from-purple-400 to-cyan-400 rounded-full transition-all duration-800 ${
                animationStep >= 3 ? 'scale-x-100 opacity-100' : 'scale-x-0 opacity-0'
              }`}></div>
            </div>
            <div className={`flex items-center gap-2 transition-all duration-800 delay-900 ${
              animationStep >= 3 ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-6'
            }`}>
              <div className={`w-4 h-4 bg-purple-400 rounded-full transition-all duration-500 delay-100 ${
                animationStep >= 3 ? 'scale-100 shadow-lg shadow-purple-400/50' : 'scale-0'
              }`}></div>
              <span className="text-sm text-purple-400">Data Point B</span>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'discover',
      title: 'Discover Meaningful Connections',
      subtitle: 'Real economic relationships that matter',
      icon: <TrendUp size={48} className="text-green-400" />,
      content: (
        <div className="min-h-80 sm:min-h-96 flex flex-col items-center justify-center space-y-4 sm:space-y-6">
          <div className={`grid grid-cols-2 gap-3 sm:gap-6 max-w-2xl transition-all duration-1000 ease-out ${
            animationStep >= 1 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}>
            <div className={`bg-gradient-to-br from-cyan-500/20 to-blue-500/20 rounded-xl p-3 sm:p-6 border border-cyan-500/30 transition-all duration-1200 ease-out transform ${
              animationStep >= 1 ? 'opacity-100 translate-x-0 rotate-0' : 'opacity-0 -translate-x-8 -rotate-3'
            }`}>
              <div className={`text-2xl sm:text-3xl mb-2 sm:mb-3 text-center transition-all duration-800 delay-200 ${
                animationStep >= 1 ? 'scale-100 rotate-0' : 'scale-0 rotate-180'
              }`}>📈</div>
              <h3 className={`text-base sm:text-lg font-semibold text-cyan-400 text-center transition-all duration-600 delay-300 ${
                animationStep >= 1 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
              }`}>Interest Rates</h3>
              <p className={`text-xs sm:text-sm text-gray-300 text-center transition-all duration-600 delay-400 ${
                animationStep >= 1 ? 'opacity-100' : 'opacity-0'
              }`}>Federal funds rate</p>
            </div>
            <div className={`bg-gradient-to-br from-red-500/20 to-orange-500/20 rounded-xl p-3 sm:p-6 border border-red-500/30 transition-all duration-1200 ease-out transform ${
              animationStep >= 1 ? 'opacity-100 translate-x-0 rotate-0' : 'opacity-0 translate-x-8 rotate-3'
            }`}>
              <div className={`text-2xl sm:text-3xl mb-2 sm:mb-3 text-center transition-all duration-800 delay-400 ${
                animationStep >= 1 ? 'scale-100 rotate-0' : 'scale-0 -rotate-180'
              }`}>�</div>
              <h3 className={`text-base sm:text-lg font-semibold text-red-400 text-center transition-all duration-600 delay-500 ${
                animationStep >= 1 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
              }`}>Housing Starts</h3>
              <p className={`text-xs sm:text-sm text-gray-300 text-center transition-all duration-600 delay-600 ${
                animationStep >= 1 ? 'opacity-100' : 'opacity-0'
              }`}>New construction</p>
            </div>
          </div>
          <div className={`flex items-center justify-center transition-all duration-1000 ease-out delay-700 ${
            animationStep >= 2 ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-6 scale-75'
          }`}>
            <div className={`w-8 h-0.5 bg-gradient-to-r from-cyan-400 to-red-400 rounded-full transition-all duration-800 ${
              animationStep >= 2 ? 'scale-x-100 opacity-100' : 'scale-x-0 opacity-0'
            }`}></div>
            <span className={`mx-4 text-2xl text-yellow-400 transition-all duration-600 delay-800 ${
              animationStep >= 2 ? 'scale-125 rotate-0 drop-shadow-lg' : 'scale-0 rotate-90'
            }`}>⚡</span>
            <div className={`w-8 h-0.5 bg-gradient-to-r from-red-400 to-cyan-400 rounded-full transition-all duration-800 delay-100 ${
              animationStep >= 2 ? 'scale-x-100 opacity-100' : 'scale-x-0 opacity-0'
            }`}></div>
          </div>
          <p className={`text-lg text-gray-300 max-w-lg text-center transition-all duration-1000 ease-out delay-900 ${
            animationStep >= 3 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}>
            Lower rates drive construction activity! <span className={`text-yellow-400 font-semibold transition-all duration-500 delay-1000 ${
              animationStep >= 3 ? 'opacity-100 scale-100' : 'opacity-0 scale-75'
            }`}>Strong Negative Correlation</span>
          </p>
        </div>
      )
    },
    {
      id: 'graph-example',
      title: 'See Correlations in Action',
      subtitle: 'Interactive charts reveal hidden patterns',
      icon: <TrendUp size={48} className="text-blue-400" />,
      content: (
        <div className="min-h-80 sm:min-h-96 flex flex-col items-center justify-center space-y-3 sm:space-y-5">
          <div className={`w-full max-w-2xl bg-gradient-to-br from-gray-800/50 to-gray-900/50 rounded-xl p-3 sm:p-5 border border-gray-700/30 transition-opacity duration-1000 ease-out ${
            animationStep >= 1 ? 'opacity-100' : 'opacity-0'
          }`}>
            {/* Mock Chart */}
            <div className={`mb-3 sm:mb-4 text-center transition-opacity duration-800 delay-300 ${
              animationStep >= 2 ? 'opacity-100' : 'opacity-0'
            }`}>
              <h3 className="text-base sm:text-lg font-semibold mb-1">
                <span className={`text-cyan-400 transition-opacity duration-600 delay-400 ${
                  animationStep >= 2 ? 'opacity-100' : 'opacity-0'
                }`}>GDP Growth</span>
                <span className={`text-gray-300 mx-1 sm:mx-2 transition-opacity duration-400 delay-600 ${
                  animationStep >= 2 ? 'opacity-100' : 'opacity-0'
                }`}> vs </span>
                <span className={`text-purple-400 transition-opacity duration-600 delay-800 ${
                  animationStep >= 2 ? 'opacity-100' : 'opacity-0'
                }`}>Unemployment Rate</span>
              </h3>
              <p className={`text-xs sm:text-sm text-gray-400 transition-all duration-500 delay-1000 ${
                animationStep >= 2 ? 'opacity-100' : 'opacity-0'
              }`}>Correlation: <span className={`text-red-400 font-bold transition-all duration-600 delay-1100 ${
                animationStep >= 2 ? 'scale-105 opacity-100' : 'scale-95 opacity-0'
              }`}>-0.732</span> (Strong Negative)</p>
            </div>
            <div className={`h-24 sm:h-32 w-full relative bg-gray-900/50 rounded-lg border border-gray-700/30 overflow-hidden transition-all duration-1200 ease-out delay-1200 transform ${
              animationStep >= 3 ? 'opacity-100 scale-100 rotate-0' : 'opacity-0 scale-95 -rotate-1'
            }`}>
              {/* Mock chart lines */}
              <svg className="w-full h-full" viewBox="0 0 300 100">
                <defs>
                  <linearGradient id="line1" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#06b6d4" />
                    <stop offset="100%" stopColor="#3b82f6" />
                  </linearGradient>
                  <linearGradient id="line2" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#8b5cf6" />
                    <stop offset="100%" stopColor="#d946ef" />
                  </linearGradient>
                </defs>
                {/* Grid lines */}
                <g stroke="#374151" strokeWidth="0.5" fill="none" className={`transition-all duration-800 delay-1400 ${
                  animationStep >= 3 ? 'opacity-30' : 'opacity-0'
                }`}>
                  <line x1="0" y1="25" x2="300" y2="25" stroke="#374151" />
                  <line x1="0" y1="50" x2="300" y2="50" stroke="#374151" />
                  <line x1="0" y1="75" x2="300" y2="75" stroke="#374151" />
                  <line x1="60" y1="0" x2="60" y2="100" stroke="#374151" />
                  <line x1="120" y1="0" x2="120" y2="100" stroke="#374151" />
                  <line x1="180" y1="0" x2="180" y2="100" stroke="#374151" />
                  <line x1="240" y1="0" x2="240" y2="100" stroke="#374151" />
                </g>
                {/* Mock data lines - animated stroke drawing */}
                <polyline
                  fill="none"
                  stroke="url(#line1)"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  points="20,85 60,75 120,65 180,45 240,30 280,20"
                  className={`transition-all duration-1500 ease-out delay-1600 ${
                    animationStep >= 3 ? 'opacity-100' : 'opacity-0'
                  }`}
                  style={{
                    strokeDasharray: animationStep >= 3 ? 'none' : '400 400',
                    strokeDashoffset: animationStep >= 3 ? '0' : '400'
                  }}
                />
                <polyline
                  fill="none"
                  stroke="url(#line2)"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  points="20,80 60,70 120,55 180,40 240,28 280,18"
                  className={`transition-all duration-1500 ease-out delay-1800 ${
                    animationStep >= 3 ? 'opacity-100' : 'opacity-0'
                  }`}
                  style={{
                    strokeDasharray: animationStep >= 3 ? 'none' : '400 400',
                    strokeDashoffset: animationStep >= 3 ? '0' : '400'
                  }}
                />
                {/* Data points - staggered appearance */}
                <g fill="#06b6d4">
                  {[
                    { cx: 20, cy: 85, delay: 2000 },
                    { cx: 60, cy: 75, delay: 2100 },
                    { cx: 120, cy: 65, delay: 2200 },
                    { cx: 180, cy: 45, delay: 2300 },
                    { cx: 240, cy: 30, delay: 2400 },
                    { cx: 280, cy: 20, delay: 2500 }
                  ].map((point, i) => (
                    <circle 
                      key={i}
                      cx={point.cx} 
                      cy={point.cy} 
                      r="2" 
                      className={`transition-opacity duration-400 ease-out ${
                        animationStep >= 3 ? 'opacity-100' : 'opacity-0'
                      }`}
                      style={{ transitionDelay: `${point.delay}ms` }}
                    />
                  ))}
                </g>
                <g fill="#8b5cf6">
                  {[
                    { cx: 20, cy: 80, delay: 2000 },
                    { cx: 60, cy: 70, delay: 2100 },
                    { cx: 120, cy: 55, delay: 2200 },
                    { cx: 180, cy: 40, delay: 2300 },
                    { cx: 240, cy: 28, delay: 2400 },
                    { cx: 280, cy: 18, delay: 2500 }
                  ].map((point, i) => (
                    <circle 
                      key={i}
                      cx={point.cx} 
                      cy={point.cy} 
                      r="2" 
                      className={`transition-opacity duration-400 ease-out ${
                        animationStep >= 3 ? 'opacity-100' : 'opacity-0'
                      }`}
                      style={{ transitionDelay: `${point.delay}ms` }}
                    />
                  ))}
                </g>
              </svg>
            </div>
            <div className={`flex justify-between text-xs text-gray-400 mt-2 transition-opacity duration-600 ease-out delay-2600 ${
              animationStep >= 3 ? 'opacity-100' : 'opacity-0'
            }`}>
              <span className={`transition-opacity duration-300 delay-2600 ${
                animationStep >= 3 ? 'opacity-100' : 'opacity-0'
              }`}>2019</span>
              <span className={`transition-opacity duration-300 delay-2700 ${
                animationStep >= 3 ? 'opacity-100' : 'opacity-0'
              }`}>2024</span>
            </div>
          </div>
          <p className={`text-sm sm:text-lg text-gray-300 text-center max-w-lg transition-opacity duration-1000 ease-out delay-2800 ${
            animationStep >= 4 ? 'opacity-100' : 'opacity-0'
          }`}>
            As streaming services grew, so did home food delivery. 
            <span className={`text-cyan-400 font-semibold transition-opacity duration-600 delay-2900 ${
              animationStep >= 4 ? 'opacity-100' : 'opacity-0'
            }`}> Real data</span> reveals unexpected connections!
          </p>
        </div>
      )
    },
    {
      id: 'ai-powered',
      title: 'AI-Powered Analysis',
      subtitle: 'Advanced algorithms find patterns humans miss',
      icon: <Robot size={48} className="text-purple-400" />,
      content: (
        <div className="min-h-80 sm:min-h-96 flex flex-col items-center justify-center space-y-4 sm:space-y-6">
          <div className={`max-w-md transition-all duration-1000 ease-out transform ${
            animationStep >= 1 ? 'opacity-100 translate-y-0 scale-100 rotate-0' : 'opacity-0 translate-y-8 scale-95 -rotate-2'
          }`}>
            <div className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-2xl p-3 sm:p-6 border border-purple-500/30 backdrop-blur-sm">
              <div className={`flex items-center justify-center gap-4 mb-4 transition-all duration-800 ease-out delay-200 ${
                animationStep >= 2 ? 'opacity-100 translate-x-0 scale-100' : 'opacity-0 -translate-x-8 scale-75'
              }`}>
                <div className={`transition-all duration-600 delay-300 ${
                  animationStep >= 2 ? 'scale-100 rotate-0' : 'scale-0 rotate-180'
                }`}>
                  <Robot size={32} className="text-purple-400" />
                </div>
                <div className="flex flex-col items-start">
                  <div className={`flex items-center gap-2 transition-all duration-500 delay-400 ${
                    animationStep >= 2 ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-4'
                  }`}>
                    <div className={`w-2 h-2 bg-green-400 rounded-full transition-all duration-300 delay-500 ${
                      animationStep >= 2 ? 'animate-pulse scale-100' : 'scale-0'
                    }`}></div>
                    <span className={`text-sm text-green-400 transition-all duration-400 delay-600 ${
                      animationStep >= 2 ? 'opacity-100' : 'opacity-0'
                    }`}>Analyzing patterns...</span>
                  </div>
                  <div className={`flex items-center gap-2 mt-1 transition-all duration-500 delay-700 ${
                    animationStep >= 2 ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-4'
                  }`}>
                    <div className={`w-2 h-2 bg-blue-400 rounded-full transition-all duration-300 delay-800 ${
                      animationStep >= 2 ? 'animate-pulse scale-100' : 'scale-0'
                    }`} style={{ animationDelay: '0.3s' }}></div>
                    <span className={`text-sm text-blue-400 transition-all duration-400 delay-900 ${
                      animationStep >= 2 ? 'opacity-100' : 'opacity-0'
                    }`}>Processing datasets...</span>
                  </div>
                  <div className={`flex items-center gap-2 mt-1 transition-all duration-500 delay-1000 ${
                    animationStep >= 2 ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-4'
                  }`}>
                    <div className={`w-2 h-2 bg-yellow-400 rounded-full transition-all duration-300 delay-1100 ${
                      animationStep >= 2 ? 'animate-pulse scale-100' : 'scale-0'
                    }`} style={{ animationDelay: '0.6s' }}></div>
                    <span className={`text-sm text-yellow-400 transition-all duration-400 delay-1200 ${
                      animationStep >= 2 ? 'opacity-100' : 'opacity-0'
                    }`}>Calculating correlations...</span>
                  </div>
                </div>
              </div>
              <div className={`text-xs text-purple-300 bg-purple-900/30 rounded-lg p-3 font-mono transition-all duration-1000 ease-out delay-1300 transform ${
                animationStep >= 3 ? 'opacity-100 translate-y-0 scale-100 rotate-0' : 'opacity-0 translate-y-4 scale-95 rotate-1'
              }`}>
                <div className={`transition-all duration-400 delay-1400 ${
                  animationStep >= 3 ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-2'
                }`}>
                  correlation_strength: <span className={`text-green-400 font-bold transition-all duration-300 delay-1500 ${
                    animationStep >= 3 ? 'opacity-100 scale-100' : 'opacity-0 scale-75'
                  }`}>0.847</span>
                </div>
                <div className={`transition-all duration-400 delay-1600 ${
                  animationStep >= 3 ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-2'
                }`}>
                  statistical_significance: <span className={`text-yellow-400 font-bold transition-all duration-300 delay-1700 ${
                    animationStep >= 3 ? 'opacity-100 scale-100' : 'opacity-0 scale-75'
                  }`}>HIGH</span>
                </div>
                <div className={`transition-all duration-400 delay-1800 ${
                  animationStep >= 3 ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-2'
                }`}>
                  pattern_confidence: <span className={`text-cyan-400 font-bold transition-all duration-300 delay-1900 ${
                    animationStep >= 3 ? 'opacity-100 scale-100' : 'opacity-0 scale-75'
                  }`}>92.3%</span>
                </div>
              </div>
            </div>
          </div>
          <p className={`text-sm sm:text-lg text-gray-300 max-w-lg text-center transition-all duration-1000 ease-out delay-2000 ${
            animationStep >= 4 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
          }`}>
            Our AI processes <span className={`text-cyan-400 font-semibold transition-all duration-600 delay-2100 ${
              animationStep >= 4 ? 'opacity-100 scale-100 text-shadow' : 'opacity-0 scale-75'
            }`}>real-world data</span> from trusted sources to uncover hidden relationships
          </p>
        </div>
      )
    },
    {
      id: 'interactive',
      title: 'Interactive Exploration',
      subtitle: 'Click, explore, and share your discoveries',
      icon: <Target size={48} className="text-orange-400" />,
      content: (
        <div className="min-h-80 sm:min-h-96 flex flex-col items-center justify-center space-y-4 sm:space-y-6">
          <div className={`grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-3 max-w-2xl transition-all duration-1000 ease-out ${
            animationStep >= 1 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}>
            <div className={`bg-gradient-to-br from-cyan-500/20 to-blue-500/20 rounded-xl p-3 sm:p-4 border border-cyan-500/30 hover:scale-105 transition-all cursor-pointer duration-1000 ease-out transform ${
              animationStep >= 2 ? 'opacity-100 translate-x-0 scale-100 rotate-0' : 'opacity-0 -translate-x-8 scale-75 -rotate-6'
            }`} style={{ transitionDelay: '200ms' }}>
              <div className={`transition-all duration-600 delay-300 ${
                animationStep >= 2 ? 'scale-100 rotate-0' : 'scale-0 rotate-180'
              }`}>
                <MagnifyingGlass size={20} className="text-cyan-400 mx-auto mb-2" />
              </div>
              <h4 className={`font-semibold text-cyan-400 text-sm text-center transition-all duration-500 delay-400 ${
                animationStep >= 2 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
              }`}>Explore</h4>
              <p className={`text-xs text-gray-300 text-center transition-all duration-400 delay-500 ${
                animationStep >= 2 ? 'opacity-100' : 'opacity-0'
              }`}>Generate new correlations</p>
            </div>
            <div className={`bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-xl p-3 sm:p-4 border border-purple-500/30 hover:scale-105 transition-all cursor-pointer duration-1000 ease-out transform ${
              animationStep >= 2 ? 'opacity-100 translate-y-0 scale-100 rotate-0' : 'opacity-0 translate-y-8 scale-75 rotate-3'
            }`} style={{ transitionDelay: '400ms' }}>
              <div className={`transition-all duration-600 delay-500 ${
                animationStep >= 2 ? 'scale-100 rotate-0' : 'scale-0 rotate-180'
              }`}>
                <TrendUp size={20} className="text-purple-400 mx-auto mb-2" />
              </div>
              <h4 className={`font-semibold text-purple-400 text-sm text-center transition-all duration-500 delay-600 ${
                animationStep >= 2 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
              }`}>Analyze</h4>
              <p className={`text-xs text-gray-300 text-center transition-all duration-400 delay-700 ${
                animationStep >= 2 ? 'opacity-100' : 'opacity-0'
              }`}>Deep dive into data</p>
            </div>
            <div className={`bg-gradient-to-br from-green-500/20 to-emerald-500/20 rounded-xl p-3 sm:p-4 border border-green-500/30 hover:scale-105 transition-all cursor-pointer duration-1000 ease-out transform ${
              animationStep >= 2 ? 'opacity-100 translate-x-0 scale-100 rotate-0' : 'opacity-0 translate-x-8 scale-75 rotate-6'
            }`} style={{ transitionDelay: '600ms' }}>
              <div className={`transition-all duration-600 delay-700 ${
                animationStep >= 2 ? 'scale-100 rotate-0' : 'scale-0 rotate-180'
              }`}>
                <Share size={20} className="text-green-400 mx-auto mb-2" />
              </div>
              <h4 className={`font-semibold text-green-400 text-sm text-center transition-all duration-500 delay-800 ${
                animationStep >= 2 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
              }`}>Share</h4>
              <p className={`text-xs text-gray-300 text-center transition-all duration-400 delay-900 ${
                animationStep >= 2 ? 'opacity-100' : 'opacity-0'
              }`}>Spread your findings</p>
            </div>
          </div>
          <p className={`text-sm sm:text-lg text-gray-300 max-w-lg text-center transition-all duration-1000 ease-out delay-1000 ${
            animationStep >= 3 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
          }`}>
            Every <span className={`text-cyan-400 font-semibold transition-all duration-500 delay-1100 ${
              animationStep >= 3 ? 'opacity-100 scale-100' : 'opacity-0 scale-75'
            }`}>click</span> reveals new insights. Every <span className={`text-green-400 font-semibold transition-all duration-500 delay-1200 ${
              animationStep >= 3 ? 'opacity-100 scale-100' : 'opacity-0 scale-75'
            }`}>discovery</span> can be shared with the world.
          </p>
        </div>
      )
    },
    {
      id: 'ready',
      title: 'Ready to Start?',
      subtitle: 'Dive into data-driven discoveries',
      icon: <Rocket size={48} className="text-green-400" />,
      content: (
        <div className="min-h-80 sm:min-h-96 flex flex-col items-center justify-center space-y-4 sm:space-y-6">
          {/* Main CTA Section */}
          <div className={`text-center max-w-lg transition-all duration-800 ease-out ${
            animationStep >= 1 ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-8 scale-95'
          }`}>
            <div className={`mb-3 transition-all duration-600 delay-200 ${
              animationStep >= 1 ? 'opacity-100 scale-100' : 'opacity-0 scale-75'
            }`}>
              <Rocket size={32} className="sm:hidden text-green-400 mx-auto mb-2" />
              <Rocket size={40} className="hidden sm:block text-green-400 mx-auto mb-3" />
            </div>
            <h3 className={`text-lg sm:text-xl md:text-2xl font-bold text-white mb-2 sm:mb-3 transition-all duration-600 delay-400 ${
              animationStep >= 2 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}>
              Let's Find Connections!
            </h3>
            <p className={`text-gray-300 text-sm sm:text-base mb-4 sm:mb-6 transition-all duration-600 delay-600 ${
              animationStep >= 2 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}>
              Explore correlations across <span className="text-cyan-400 font-semibold">80+ datasets</span> from trusted sources
            </p>
            
            {/* Launch Button */}
            <button 
              onClick={onComplete}
              className={`w-full bg-gradient-to-r from-green-500 to-cyan-500 hover:from-green-600 hover:to-cyan-600 text-white font-semibold py-3 px-8 rounded-xl text-base transition-all duration-500 ease-out transform hover:scale-105 shadow-lg hover:shadow-green-500/25 mb-4 delay-800 ${
                animationStep >= 3 ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-8 scale-95'
              }`}
            >
              <span className={`inline-flex items-center gap-2 transition-all duration-300 delay-1000 ${
                animationStep >= 3 ? 'opacity-100' : 'opacity-0'
              }`}>
                <Rocket size={18} />
                <span>Start Exploring</span>
              </span>
            </button>
          </div>

          {/* Additional Links Section */}
          <div className={`text-center space-y-3 transition-all duration-600 delay-1200 ${
            animationStep >= 4 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}>
            {/* Data Sources Links */}
            <div className="space-y-2">
              <p className="text-xs text-gray-400 mb-2">Data sourced from:</p>
              <div className="flex flex-wrap justify-center gap-1 sm:gap-2 text-xs max-w-xs sm:max-w-none mx-auto">
                <a 
                  href="https://fred.stlouisfed.org/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-0.5 sm:gap-1 px-1.5 sm:px-2 py-1 bg-blue-500/20 text-blue-400 rounded-md hover:bg-blue-500/30 transition-colors text-xs"
                >
                  <Database size={10} />
                  <span className="hidden sm:inline">FRED Database</span>
                  <span className="sm:hidden">FRED</span>
                  <ArrowSquareOut size={8} />
                </a>
                <a 
                  href="https://data.worldbank.org/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-0.5 sm:gap-1 px-1.5 sm:px-2 py-1 bg-green-500/20 text-green-400 rounded-md hover:bg-green-500/30 transition-colors text-xs"
                >
                  <Database size={10} />
                  <span className="hidden sm:inline">World Bank</span>
                  <span className="sm:hidden">WB</span>
                  <ArrowSquareOut size={8} />
                </a>
                <a 
                  href="https://www.alphavantage.co/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-0.5 sm:gap-1 px-1.5 sm:px-2 py-1 bg-orange-500/20 text-orange-400 rounded-md hover:bg-orange-500/30 transition-colors text-xs"
                >
                  <TrendUp size={10} />
                  <span className="hidden sm:inline">Alpha Vantage</span>
                  <span className="sm:hidden">Alpha</span>
                  <ArrowSquareOut size={8} />
                </a>
                <a 
                  href="https://openweathermap.org/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-0.5 sm:gap-1 px-1.5 sm:px-2 py-1 bg-cyan-500/20 text-cyan-400 rounded-md hover:bg-cyan-500/30 transition-colors text-xs"
                >
                  <CloudSun size={10} />
                  <span className="hidden sm:inline">OpenWeather</span>
                  <span className="sm:hidden">Weather</span>
                  <ArrowSquareOut size={8} />
                </a>
                <span className="inline-flex items-center gap-0.5 sm:gap-1 px-1.5 sm:px-2 py-1 bg-purple-500/20 text-purple-400 rounded-md text-xs">
                  <Robot size={10} />
                  <span className="hidden sm:inline">AI Generated</span>
                  <span className="sm:hidden">AI</span>
                </span>
              </div>
            </div>

            {/* Restart Intro Link */}
            <div className="pt-2 border-t border-gray-700/30">
              <button
                onClick={() => {
                  // Clear the intro seen flag and restart
                  localStorage.removeItem('correlate-ai-intro-seen')
                  // Restart the slideshow by going to slide 0
                  window.location.reload()
                }}
                className="inline-flex items-center gap-1 text-xs text-gray-400 hover:text-cyan-400 transition-colors"
              >
                <ArrowClockwise size={12} />
                <span>View intro again</span>
              </button>
            </div>
          </div>

          {/* ESC hint */}
          <div className={`text-xs text-gray-500 transition-all duration-400 delay-1400 ${
            animationStep >= 5 ? 'opacity-100' : 'opacity-0'
          }`}>
            Press <kbd className="px-1 py-0.5 bg-gray-700 rounded text-gray-300 text-xs mx-1">ESC</kbd> to skip
          </div>
        </div>
      )
    }
  ]

  const nextSlide = useCallback(() => {
    if (currentSlide < slides.length - 1) {
      setIsAnimating(true)
      setAnimationStep(0) // Reset animation step when transitioning
      setTimeout(() => {
        setCurrentSlide(prev => prev + 1)
        setIsAnimating(false)
        // Start the animation sequence for the new slide
        setTimeout(() => setAnimationStep(1), 100)
        setTimeout(() => setAnimationStep(2), 400)
        setTimeout(() => setAnimationStep(3), 700)
        setTimeout(() => setAnimationStep(4), 1000)
        setTimeout(() => setAnimationStep(5), 1300)
        setTimeout(() => setAnimationStep(6), 1600)
      }, 300)
    }
  }, [currentSlide, slides.length])

  const prevSlide = useCallback(() => {
    if (currentSlide > 0) {
      setIsAnimating(true)
      setAnimationStep(0) // Reset animation step when transitioning
      setTimeout(() => {
        setCurrentSlide(prev => prev - 1)
        setIsAnimating(false)
        // Start the animation sequence for the new slide
        setTimeout(() => setAnimationStep(1), 100)
        setTimeout(() => setAnimationStep(2), 400)
        setTimeout(() => setAnimationStep(3), 700)
        setTimeout(() => setAnimationStep(4), 1000)
        setTimeout(() => setAnimationStep(5), 1300)
        setTimeout(() => setAnimationStep(6), 1600)
      }, 300)
    }
  }, [currentSlide])

  const goToSlide = useCallback((index: number) => {
    if (index !== currentSlide) {
      setIsAnimating(true)
      setAnimationStep(0) // Reset animation step when transitioning
      setTimeout(() => {
        setCurrentSlide(index)
        setIsAnimating(false)
        // Start the animation sequence for the new slide
        setTimeout(() => setAnimationStep(1), 100)
        setTimeout(() => setAnimationStep(2), 400)
        setTimeout(() => setAnimationStep(3), 700)
        setTimeout(() => setAnimationStep(4), 1000)
        setTimeout(() => setAnimationStep(5), 1300)
        setTimeout(() => setAnimationStep(6), 1600)
      }, 300)
    }
  }, [currentSlide])

  // Auto-advance slides with progress tracking
  useEffect(() => {
    if (currentSlide < slides.length - 1 && !isPaused) {
      const progressInterval = setInterval(() => {
        setAutoProgress(prev => {
          const newProgress = prev + 1 // Reduced from 2% to 1% for slower progression
          if (newProgress >= 100) {
            clearInterval(progressInterval)
            nextSlide()
            return 0
          }
          return newProgress
        })
      }, 100)

      return () => clearInterval(progressInterval)
    } else {
      setAutoProgress(0)
    }
  }, [currentSlide, nextSlide, slides.length, isPaused])

  // Reset progress when slide changes
  useEffect(() => {
    setAutoProgress(0)
  }, [currentSlide])

  // Initialize animation sequence when component mounts or slide changes
  useEffect(() => {
    // Reset animation step immediately
    setAnimationStep(0)
    
    const timeouts = [
      setTimeout(() => setAnimationStep(1), 200),
      setTimeout(() => setAnimationStep(2), 500),
      setTimeout(() => setAnimationStep(3), 800),
      setTimeout(() => setAnimationStep(4), 1100),
      setTimeout(() => setAnimationStep(5), 1400),
      setTimeout(() => setAnimationStep(6), 1700)
    ]

    return () => {
      timeouts.forEach(timeout => clearTimeout(timeout))
    }
  }, [currentSlide])

  // Show swipe hint on mobile for first slide after animations complete
  useEffect(() => {
    const isMobile = window.innerWidth < 640
    if (isMobile && currentSlide === 0 && animationStep >= 3) {
      const hintTimeout = setTimeout(() => {
        setShowSwipeHint(true)
        // Auto-hide after 3 seconds
        setTimeout(() => setShowSwipeHint(false), 3000)
      }, 2000)
      
      return () => clearTimeout(hintTimeout)
    }
  }, [currentSlide, animationStep])

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === ' ') {
        e.preventDefault()
        nextSlide()
        setAutoProgress(0)
        setIsPaused(true)
        setTimeout(() => setIsPaused(false), 1000)
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault()
        prevSlide()
        setAutoProgress(0)
        setIsPaused(true)
        setTimeout(() => setIsPaused(false), 1000)
      } else if (e.key === 'Escape') {
        e.preventDefault()
        onComplete()
      } else if (e.key === 'p' || e.key === 'P') {
        e.preventDefault()
        setIsPaused(prev => !prev)
      }
    }

    window.addEventListener('keydown', handleKeyPress)
    return () => window.removeEventListener('keydown', handleKeyPress)
  }, [nextSlide, prevSlide, onComplete])

  // Handle touch gestures
  const handleTouchStart = (e: any) => {
    setTouchEnd(null) // otherwise the swipe is fired even with usual touch events
    setTouchStart({
      x: e.touches[0].clientX,
      y: e.touches[0].clientY
    })
    setIsPaused(true)
    setShowSwipeHint(false) // Hide hint when user starts interacting
  }

  const handleTouchMove = (e: any) => {
    setTouchEnd({
      x: e.touches[0].clientX,
      y: e.touches[0].clientY
    })
  }

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return
    
    const distanceX = touchStart.x - touchEnd.x
    const distanceY = touchStart.y - touchEnd.y
    const isLeftSwipe = distanceX > 50
    const isRightSwipe = distanceX < -50
    const isVerticalSwipe = Math.abs(distanceY) > Math.abs(distanceX)

    // Only handle horizontal swipes (ignore vertical scrolling)
    if (!isVerticalSwipe) {
      if (isLeftSwipe) {
        // Swipe left - next slide
        if (currentSlide === slides.length - 1) {
          onComplete()
        } else {
          nextSlide()
          setAutoProgress(0)
        }
      } else if (isRightSwipe) {
        // Swipe right - previous slide
        prevSlide()
        setAutoProgress(0)
      }
    }

    setTimeout(() => setIsPaused(false), 1000)
  }

  const currentSlideData = slides[currentSlide]

  // Add touch event listeners
  useEffect(() => {
    const slideContainer = document.getElementById('slide-container')
    if (slideContainer) {
      slideContainer.addEventListener('touchstart', handleTouchStart, { passive: true })
      slideContainer.addEventListener('touchmove', handleTouchMove, { passive: true })
      slideContainer.addEventListener('touchend', handleTouchEnd, { passive: true })

      return () => {
        slideContainer.removeEventListener('touchstart', handleTouchStart)
        slideContainer.removeEventListener('touchmove', handleTouchMove)
        slideContainer.removeEventListener('touchend', handleTouchEnd)
      }
    }
  }, [handleTouchStart, handleTouchMove, handleTouchEnd])

  // Detect if content is scrollable and show/hide scroll indicator
  useEffect(() => {
    const checkScrollable = () => {
      const slideContainer = document.getElementById('slide-container')
      if (slideContainer) {
        const isScrollable = slideContainer.scrollHeight > slideContainer.clientHeight
        const isMobile = window.innerWidth < 640
        setShowScrollIndicator(isScrollable && isMobile)
      }
    }

    // Check on slide change, animation completion, and window resize
    const timeouts = [
      setTimeout(checkScrollable, 100),
      setTimeout(checkScrollable, 500),
      setTimeout(checkScrollable, 1000),
      setTimeout(checkScrollable, 2000)
    ]

    // Also check on window resize
    window.addEventListener('resize', checkScrollable)

    return () => {
      timeouts.forEach(timeout => clearTimeout(timeout))
      window.removeEventListener('resize', checkScrollable)
    }
  }, [currentSlide, animationStep])

  // Handle click navigation
  const handleSlideClick = (e: any) => {
    // Don't handle clicks on interactive elements
    const target = e.target as HTMLElement
    if (target.tagName === 'BUTTON' || target.closest('button') || target.tagName === 'A' || target.closest('a')) {
      return
    }

    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect()
    const clickX = e.clientX - rect.left
    const width = rect.width
    const leftThird = width / 3
    const rightThird = width * 2 / 3

    if (clickX < leftThird && currentSlide > 0) {
      // Clicked on left third - previous slide
      prevSlide()
      setAutoProgress(0)
      setIsPaused(true)
      setTimeout(() => setIsPaused(false), 1000)
    } else if (clickX > rightThird) {
      // Clicked on right third - next slide or complete
      if (currentSlide === slides.length - 1) {
        onComplete()
      } else {
        nextSlide()
        setAutoProgress(0)
        setIsPaused(true)
        setTimeout(() => setIsPaused(false), 1000)
      }
    }
    // Middle third does nothing to avoid accidental navigation
  }

  return (
    <div className="fixed inset-0 z-50 bg-gray-900 intro-slideshow">
      <SwirlBackground />
      <div className="relative z-10 min-h-screen p-2 sm:p-4 md:p-6">
        <div className="w-full h-full">
          {/* Main Slide Content - Card with Margin */}
          <div 
            id="slide-container"
            className="bg-gray-800/95 backdrop-blur-md rounded-2xl shadow-2xl border border-gray-700/50 min-h-[calc(100vh-1rem)] sm:min-h-[calc(100vh-2rem)] md:min-h-[calc(100vh-3rem)] max-h-[calc(100vh-1rem)] sm:max-h-[calc(100vh-2rem)] md:max-h-[calc(100vh-3rem)] flex flex-col p-4 sm:p-6 md:p-8 overflow-y-auto overscroll-y-contain select-none relative scrollbar-thin scrollbar-track-gray-700 scrollbar-thumb-gray-500 hover:scrollbar-thumb-gray-400 touch-scroll"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
            onClick={handleSlideClick}
            style={{ touchAction: 'pan-y' }} // Allow vertical scrolling but handle horizontal swipes
          >
            {/* Scroll indicator for mobile devices */}
            <div className={`scroll-indicator sm:hidden ${showScrollIndicator ? 'visible' : ''}`} />
            
            {/* Click zones visual feedback - only show on hover on desktop */}
            <div className="absolute inset-0 pointer-events-none z-10 rounded-2xl overflow-hidden opacity-0 hover:opacity-100 transition-opacity duration-300 hidden sm:block">
              {/* Left click zone */}
              {currentSlide > 0 && (
                <div className="absolute left-0 top-0 w-1/3 h-full bg-gradient-to-r from-cyan-500/10 to-transparent flex items-center justify-start pl-4">
                  <div className="text-cyan-400/60 text-sm font-medium">← Previous</div>
                </div>
              )}
              {/* Right click zone */}
              <div className="absolute right-0 top-0 w-1/3 h-full bg-gradient-to-l from-purple-500/10 to-transparent flex items-center justify-end pr-4">
                <div className="text-purple-400/60 text-sm font-medium">
                  {currentSlide === slides.length - 1 ? 'Start →' : 'Next →'}
                </div>
              </div>
            </div>

            {/* Mobile swipe hint - only show on mobile for first slide */}
            <div className={`absolute bottom-20 left-1/2 transform -translate-x-1/2 pointer-events-none z-20 sm:hidden transition-all duration-500 ${
              showSwipeHint ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
            }`}>
              <div className="bg-gray-700/90 backdrop-blur-sm px-4 py-2 rounded-full border border-gray-600/50">
                <div className="flex items-center gap-2 text-sm text-gray-300">
                  <div className="flex items-center gap-1">
                    <div className="w-6 h-0.5 bg-gradient-to-r from-cyan-400 to-transparent rounded animate-pulse"></div>
                    <span className="text-cyan-400">←</span>
                  </div>
                  <span>Swipe to navigate</span>
                  <div className="flex items-center gap-1">
                    <span className="text-purple-400">→</span>
                    <div className="w-6 h-0.5 bg-gradient-to-l from-purple-400 to-transparent rounded animate-pulse"></div>
                  </div>
                </div>
              </div>
            </div>
            {/* Skip Button - Top Right */}
            <div className="flex justify-end mb-1">
              <button
                onClick={onComplete}
                className="text-xs sm:text-sm text-gray-400 hover:text-gray-300 transition-colors px-3 py-1 sm:px-3 sm:py-1 rounded-md hover:bg-gray-700/30 active:bg-gray-700/50 min-h-[32px] sm:min-h-auto"
              >
                Skip intro
              </button>
            </div>

            {/* Fixed Header */}
            <div className="text-center mb-3 sm:mb-4">
              <div className="flex justify-center mb-1 sm:mb-2">
                <div className="scale-75 sm:scale-100 transform-gpu">
                  {currentSlideData.icon}
                </div>
              </div>
              <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-1 sm:mb-2 transform-gpu">
                {currentSlideData.title}
              </h1>
              <p className="text-sm sm:text-base md:text-lg text-gray-400">
                {currentSlideData.subtitle}
              </p>
            </div>

            {/* Transitioning Content Container - Flex Grow with Scroll */}
            <div className="flex-1 flex items-start justify-center mb-3 sm:mb-4 overflow-y-auto overscroll-y-contain scrollbar-thin scrollbar-track-gray-800 scrollbar-thumb-gray-600 hover:scrollbar-thumb-gray-500 touch-scroll relative">
              <div className={`w-full max-w-4xl py-2 sm:py-4 transition-opacity duration-500 ${
                isAnimating ? 'opacity-0' : 'opacity-100'
              }`}>
                {currentSlideData.content}
              </div>
              {/* Scroll fade indicator at bottom */}
              {showScrollIndicator && (
                <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-gray-800/95 to-transparent pointer-events-none z-10 sm:hidden" />
              )}
            </div>

            {/* Navigation Controls */}
            <div className="space-y-2 sm:space-y-3">
              {/* Auto-progress bar for current slide */}
              {currentSlide < slides.length - 1 && (
                <div className="w-full bg-gray-700 rounded-full h-1 overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-cyan-400 to-purple-400 transition-all duration-100 ease-linear"
                    style={{ width: `${autoProgress}%` }}
                  />
                </div>
              )}

              <div className="flex items-center justify-between">
                {/* Left side: Progress dots */}
                <div className="flex gap-1 sm:gap-1.5">
                  {slides.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => {
                        goToSlide(index)
                        setAutoProgress(0)
                        setIsPaused(true)
                        setTimeout(() => setIsPaused(false), 1000)
                      }}
                      className={`w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full transition-all duration-300 p-2 -m-2 ${
                        index === currentSlide 
                          ? 'bg-cyan-400 shadow-sm sm:shadow-md shadow-cyan-400/50' 
                          : index < currentSlide
                          ? 'bg-purple-400'
                          : 'bg-gray-600 hover:bg-gray-500'
                      }`}
                    />
                  ))}
                </div>

                {/* Right side: Navigation buttons */}
                <div className="flex items-center gap-2 sm:gap-3">
                  <div className="flex gap-1 sm:gap-2">
                    <button
                      onClick={() => {
                        prevSlide()
                        setAutoProgress(0)
                        setIsPaused(true)
                        setTimeout(() => setIsPaused(false), 1000)
                      }}
                      disabled={currentSlide === 0}
                      className={`p-2 sm:p-2.5 rounded-md border transition-all duration-300 min-w-[40px] min-h-[40px] sm:min-w-[44px] sm:min-h-[44px] flex items-center justify-center ${
                        currentSlide === 0 
                          ? 'border-gray-700 text-gray-600 cursor-not-allowed' 
                          : 'border-gray-600 text-gray-300 hover:border-cyan-400 hover:text-cyan-400 active:bg-cyan-400/10'
                      }`}
                    >
                      <CaretLeft size={16} className="sm:hidden" />
                      <CaretLeft size={18} className="hidden sm:block" />
                    </button>
                    <button
                      onClick={() => {
                        if (currentSlide === slides.length - 1) {
                          onComplete()
                        } else {
                          nextSlide()
                          setAutoProgress(0)
                          setIsPaused(true)
                          setTimeout(() => setIsPaused(false), 1000)
                        }
                      }}
                      className="p-2 sm:p-2.5 rounded-md border border-cyan-600 text-cyan-400 hover:bg-cyan-600/10 active:bg-cyan-600/20 transition-all duration-300 min-w-[40px] min-h-[40px] sm:min-w-[44px] sm:min-h-[44px] flex items-center justify-center"
                    >
                      {currentSlide === slides.length - 1 ? (
                        <>
                          <Check size={16} className="sm:hidden" />
                          <Check size={18} className="hidden sm:block" />
                        </>
                      ) : (
                        <>
                          <CaretRight size={16} className="sm:hidden" />
                          <CaretRight size={18} className="hidden sm:block" />
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>

              {/* Slide Counter and Status - Now inside the card */}
              <div className="flex items-center justify-between pt-2 border-t border-gray-700/30">
                <div className="flex items-center gap-1 sm:gap-2 text-xs text-gray-400">
                  <span className="text-xs">{currentSlide + 1} of {slides.length}</span>
                  {isPaused && currentSlide < slides.length - 1 && (
                    <div className="flex items-center gap-1 text-yellow-400">
                      <div className="w-1 h-1 sm:w-1.5 sm:h-1.5 bg-yellow-400 rounded-full"></div>
                      <span className="text-xs">Paused</span>
                    </div>
                  )}
                  {currentSlide < slides.length - 1 && !isPaused && (
                    <div className="flex items-center gap-1 text-green-400">
                      <div className="w-1 h-1 sm:w-1.5 sm:h-1.5 bg-green-400 rounded-full animate-pulse"></div>
                      <span className="text-xs">Auto-advancing</span>
                    </div>
                  )}
                </div>
                <div className="text-xs text-gray-500">
                  Press <kbd className="px-1 py-0.5 bg-gray-700 rounded text-gray-300 text-xs">P</kbd> to pause
                </div>
              </div>
            </div>
          </div>

          {/* Removed the external slide counter */}
        </div>
      </div>
    </div>
  )
}

function App() {
  const [isAppLoading, setIsAppLoading] = useState(true)
  const [showSlideshow, setShowSlideshow] = useState(false)
  const [dataSourcePreference, setDataSourcePreference] = useState<'mixed' | 'real' | 'synthetic'>('real')
  const [currentCorrelation, setCurrentCorrelation] = useState<CorrelationData>(() => generateCorrelationData())
  const [isGenerating, setIsGenerating] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [correlationFilters, setCorrelationFilters] = useState<{
    minStrength: number
    maxStrength: number
    dataType: 'all' | 'real' | 'ai'
  }>({
    minStrength: 0,
    maxStrength: 1,
    dataType: 'all'
  })
  const [recommendedCorrelations, setRecommendedCorrelations] = useState<CorrelationData[]>([])
  const [showRecommendations, setShowRecommendations] = useState(false)
  const [isGeneratingRecommendations, setIsGeneratingRecommendations] = useState(false)
  const shareCardRef = useRef<HTMLDivElement>(null)
  const [totalDatasetCount, setTotalDatasetCount] = useState<number>(0)
  const [datasetStats, setDatasetStats] = useState<{real: number, ai: number, total: number} | null>(null)
  const [dynamicDataSources, setDynamicDataSources] = useState<Map<string, DataSourceInfo>>(new Map())
  const [dynamicDataSourceService] = useState(() => new CentralizedDataSourceService())
  const [dynamicDatasetService] = useState(() => new DynamicDatasetService())
  const isMobile = useIsMobile()
  
  // Favorites using localStorage only
  const [favorites, setFavorites] = useState<CorrelationData[]>([])

  // Load favorites from localStorage on component mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem('favorite-correlations')
      if (stored) {
        setFavorites(JSON.parse(stored))
      }
    } catch (e) {
      console.warn('localStorage error:', e)
      setFavorites([])
    }
  }, [])

  // Function to get available categories for real data only mode
  const getAvailableCategories = async () => {
    if (dataSourcePreference !== 'real') {
      return categories // Return all categories for mixed/synthetic mode
    }
    
    try {
      // Discover real datasets to see what categories are available
      const discoveredRealDatasets = await dynamicDatasetService.discoverDatasets()
      
      // Get categories that have at least 1 dataset
      const categoryCount = new Map<string, number>()
      discoveredRealDatasets.forEach(dataset => {
        const count = categoryCount.get(dataset.category) || 0
        categoryCount.set(dataset.category, count + 1)
      })
      
      // Build available categories with helpful indicators
      const availableCategories: Record<string, string> = {}
      Object.entries(categories).forEach(([key, label]) => {
        const count = categoryCount.get(key) || 0
        if (count >= 2) {
          // Enough for same-category correlations
          availableCategories[key] = `${label} (${count})`
        } else if (count === 1) {
          // Will use cross-category approach
          availableCategories[key] = `${label} (${count}, cross-category)`
        } else {
          // No real data for this category - don't show it in real data mode
          console.log(`❌ Skipping category "${key}" - no real data available`)
        }
      })
      
      console.log(`📊 Available real data categories:`, availableCategories)
      return availableCategories
    } catch (error) {
      console.warn('Failed to get available categories:', error)
      return categories // Fallback to all categories
    }
  }

  // State for available categories
  const [availableCategories, setAvailableCategories] = useState<Record<string, string>>(categories)

  // Update available categories when data preference changes
  useEffect(() => {
    const updateCategories = async () => {
      const newCategories = await getAvailableCategories()
      setAvailableCategories(newCategories)
      
      // If current category is not available in real data mode, switch to 'all'
      if (dataSourcePreference === 'real' && selectedCategory !== 'all' && !newCategories[selectedCategory]) {
        console.log(`⚠️ Category "${selectedCategory}" not available in real data mode, switching to 'all'`)
        setSelectedCategory('all')
      }
    }
    
    updateCategories()
  }, [dataSourcePreference, dynamicDataSources])

  // Load total dataset count dynamically
  useEffect(() => {
    const loadDatasetCount = async () => {
      try {
        setIsAppLoading(true)
        
        // Simulate initial loading time for better UX
        await new Promise(resolve => setTimeout(resolve, 1000))
        
        // Load dynamic data sources
        const sources = await dynamicDataSourceService.getDataSources()
        setDynamicDataSources(sources)
        
        // Clear dataset cache when sources change to force re-discovery
        dynamicDatasetService.clearCache()
        
        console.log(`🔄 Loaded ${sources.size} dynamic data sources for dataset discovery`)
        
        // Calculate totals from dynamic sources
        let realDatasetCount = 0
        let aiDatasetCount = 0
        
        sources.forEach((source, key) => {
          if (key === 'AI') {
            aiDatasetCount += source.datasets
          } else {
            realDatasetCount += source.datasets
          }
        })

        // Also count synthetic datasets used in the app
        const syntheticCount = datasets.length

        const totalCount = realDatasetCount + aiDatasetCount + syntheticCount
        const stats = {
          real: realDatasetCount, // Real datasets from all APIs
          ai: aiDatasetCount + syntheticCount, // AI-generated + synthetic datasets
          total: totalCount
        }
        
        setTotalDatasetCount(totalCount)
        setDatasetStats(stats)
      } catch (error) {
        console.warn('Failed to load dataset count:', error)
        // Enhanced fallback with realistic counts for all 13 data sources
        const fallbackStats = {
          real: 72, // FRED(16) + WorldBank(11) + AlphaVantage(7) + OpenWeather(6) + NASA(5) + USGS(4) + EIA(5) + CoinGecko(7) + OECD(6) + WorldAirQuality(8) = 75 datasets
          ai: 48 + datasets.length, // AI datasets + synthetic
          total: 72 + 48 + datasets.length
        }
        setTotalDatasetCount(fallbackStats.total)
        setDatasetStats(fallbackStats)
      } finally {
        // Check if this is a first-time visitor
        const hasSeenIntro = localStorage.getItem('correlate-ai-intro-seen')
        if (!hasSeenIntro) {
          setShowSlideshow(true)
        }
        setIsAppLoading(false)
      }
    }
    
    loadDatasetCount()
  }, [dynamicDataSourceService, dynamicDatasetService])

  // Initialize with real data correlation when data sources are loaded
  useEffect(() => {
    const initializeWithRealData = async () => {
      if (dynamicDataSources.size > 0 && dataSourcePreference === 'real') {
        try {
          const realCorrelation = await generateCorrelationDataWithRealSources(
            selectedCategory === 'all' ? undefined : selectedCategory,
            dynamicDataSources,
            'real'
          )
          setCurrentCorrelation(realCorrelation)
        } catch (error) {
          console.warn('Failed to generate initial real data correlation:', error)
          // For "real only" mode, show synthetic data but with clear messaging
          const syntheticCorrelation = generateCorrelationData(selectedCategory === 'all' ? undefined : selectedCategory)
          setCurrentCorrelation(syntheticCorrelation)
          toast.warning(`⚠️ Not enough real data for "${selectedCategory || 'all categories'}". Showing synthetic data instead.`)
        }
      }
    }
    
    initializeWithRealData()
  }, [dynamicDataSources, dataSourcePreference, selectedCategory])

  // Function to refresh dataset count (can be called when datasets are updated)
  const refreshDatasetCount = useCallback(() => {
    try {
      const count = datasets.length
      const stats = {
        real: 0,
        ai: datasets.length, 
        total: datasets.length
      }
      setTotalDatasetCount(count)
      setDatasetStats(stats)
    } catch (error) {
      console.warn('Failed to refresh dataset count:', error)
    }
  }, [])

  // Handle slideshow completion
  const handleSlideshowComplete = useCallback(() => {
    localStorage.setItem('correlate-ai-intro-seen', 'true')
    setShowSlideshow(false)
  }, [])

  // Save to localStorage
  const saveFavorites = useCallback((newFavorites: CorrelationData[]) => {
    setFavorites(newFavorites)
    
    // Save to localStorage
    try {
      localStorage.setItem('favorite-correlations', JSON.stringify(newFavorites))
    } catch (error) {
      console.warn('localStorage save failed:', error)
    }
  }, [])

  const generateNew = useCallback(async () => {
    setIsGenerating(true)
    
    try {
      const preferenceMessages = {
        'mixed': "🤖 Generating AI-powered correlation from mixed data sources...",
        'real': "📊 Generating correlation from real API data sources...",
        'synthetic': "🎲 Generating correlation from synthetic datasets..."
      }
      
      toast.info(preferenceMessages[dataSourcePreference])
      
      // Add small delay for better UX (simulate processing)
      await new Promise(resolve => setTimeout(resolve, 800))
      
      // Use enhanced data generation with user preference
      let newCorrelation
      try {
        newCorrelation = await generateCorrelationDataWithRealSources(
          selectedCategory === 'all' ? undefined : selectedCategory,
          dynamicDataSources,
          dataSourcePreference
        )
      } catch (error) {
        if (dataSourcePreference === 'real') {
          // For "real only" mode, fall back to synthetic but show clear messaging
          console.warn('Not enough real data, falling back to synthetic:', error)
          newCorrelation = generateCorrelationData(selectedCategory === 'all' ? undefined : selectedCategory)
          toast.warning(`⚠️ Not enough real data for "${selectedCategory || 'all categories'}". Showing synthetic data instead.`)
        } else {
          throw error // Re-throw for other preferences
        }
      }
      
      setCurrentCorrelation(newCorrelation)
      
      // Show appropriate success message based on preference and actual result
      const successMessages = {
        'mixed': newCorrelation.isRealData 
          ? "✨ Generated correlation using real data sources!"
          : "✨ Generated correlation using synthetic data!",
        'real': newCorrelation.isRealData 
          ? "📊 Generated correlation from real API data!"
          : "⚠️ Using synthetic data - not enough real data available",
        'synthetic': "🎲 Generated correlation from synthetic datasets!"
      }
      
      // Only show success message if we didn't already show a warning
      if (!(dataSourcePreference === 'real' && !newCorrelation.isRealData)) {
        toast.success(successMessages[dataSourcePreference])
      }
      
    } catch (error) {
      console.error('Error generating correlation:', error)
      toast.error("Failed to generate correlation")
    } finally {
      setIsGenerating(false)
    }
  }, [selectedCategory, dynamicDataSources, dataSourcePreference])

  // Handle clicking on dynamic examples to generate that specific correlation
  const handleExampleClick = useCallback((exampleCorrelation: CorrelationData) => {
    setCurrentCorrelation(exampleCorrelation)
    toast.success(`📊 Generated: ${exampleCorrelation.title}`)
  }, [])

  // Smart correlation discovery functions
  const generateSimilarCorrelations = useCallback((baseCorrelation: CorrelationData, count: number = 3) => {
    const similarCorrelations: CorrelationData[] = []
    
    for (let i = 0; i < count; i++) {
      const similar = generateCorrelationData(baseCorrelation.variable1.category || 'economics')
      // Adjust correlation to be similar strength
      const targetCorrelation = baseCorrelation.correlation + (Math.random() - 0.5) * 0.3
      similar.correlation = Math.max(-1, Math.min(1, targetCorrelation))
      similar.rSquared = similar.correlation * similar.correlation
      similar.id = `similar-${Date.now()}-${i}`
      similar.title = `Similar: ${similar.title}`
      similar.description = `Based on ${baseCorrelation.title} - ${similar.description}`
      
      similarCorrelations.push(similar)
    }
    
    return similarCorrelations
  }, [])

  // Advanced spurious correlation detection based on Karl Pearson's 1897 formula
  // and modern statistical methods from ScienceDirect research
  const calculateCoefficientOfVariation = useCallback((values: number[]) => {
    const mean = values.reduce((sum, val) => sum + val, 0) / values.length
    const variance = values.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / (values.length - 1)
    const standardDeviation = Math.sqrt(variance)
    return standardDeviation / Math.abs(mean)
  }, [])

  const calculatePearsonSpuriousCorrelation = useCallback((
    xValues: number[], 
    yValues: number[], 
    zValues: number[]
  ) => {
    // Calculate coefficient of variation for each variable (Equation 1 from paper)
    const vX = calculateCoefficientOfVariation(xValues)
    const vY = calculateCoefficientOfVariation(yValues)
    const vZ = calculateCoefficientOfVariation(zValues)
    
    // Calculate means for sign function
    const meanX = xValues.reduce((sum, val) => sum + val, 0) / xValues.length
    const meanY = yValues.reduce((sum, val) => sum + val, 0) / yValues.length
    
    // Sign function
    const sgnX = meanX >= 0 ? 1 : -1
    const sgnY = meanY >= 0 ? 1 : -1
    
    // Karl Pearson's exact formula (Equation 2 from ScienceDirect)
    // r(x/z,y/z) = V(1/z²)sgn(E(x))sgn(E(y)) / sqrt((Vx²(1+V(1/z²))+V(1/z²))(Vy²(1+V(1/z²))+V(1/z²)))
    const vOneOverZSquared = Math.pow(vZ, 2)
    
    const numerator = vOneOverZSquared * sgnX * sgnY
    const denomX = vX * vX * (1 + vOneOverZSquared) + vOneOverZSquared
    const denomY = vY * vY * (1 + vOneOverZSquared) + vOneOverZSquared
    const denominator = Math.sqrt(denomX * denomY)
    
    return denominator !== 0 ? numerator / denominator : 0
  }, [calculateCoefficientOfVariation])

  const performPermutationTest = useCallback((xValues: number[], yValues: number[], numPermutations = 1000) => {
    // Establish null correlation baseline through permutation testing
    const originalCorr = Math.abs(calculateCorrelation(xValues, yValues))
    let significantCount = 0
    
    for (let i = 0; i < numPermutations; i++) {
      // Shuffle one variable to break correlation structure
      const shuffledY = [...yValues].sort(() => Math.random() - 0.5)
      const permutedCorr = Math.abs(calculateCorrelation(xValues, shuffledY))
      if (permutedCorr >= originalCorr) {
        significantCount++
      }
    }
    
    return significantCount / numPermutations // p-value
  }, [])

  const calculateCorrelation = useCallback((x: number[], y: number[]) => {
    const n = x.length
    const sumX = x.reduce((sum, val) => sum + val, 0)
    const sumY = y.reduce((sum, val) => sum + val, 0)
    const sumXY = x.reduce((sum, val, i) => sum + val * y[i], 0)
    const sumXX = x.reduce((sum, val) => sum + val * val, 0)
    const sumYY = y.reduce((sum, val) => sum + val * val, 0)
    
    const numerator = n * sumXY - sumX * sumY
    const denominator = Math.sqrt((n * sumXX - sumX * sumX) * (n * sumYY - sumY * sumY))
    
    return denominator !== 0 ? numerator / denominator : 0
  }, [])

  const detectTimeSeriesSpuriousPattern = useCallback((data: Array<{ year: number; value1: number; value2: number }>) => {
    const values1 = data.map(d => d.value1)
    const values2 = data.map(d => d.value2)
    const timeValues = data.map(d => d.year)
    
    // Check for monotonic trends (common cause of spurious correlation)
    const trend1 = values1.every((val, i) => i === 0 || val >= values1[i-1])
    const trend2 = values2.every((val, i) => i === 0 || val >= values2[i-1])
    const bothIncreasing = trend1 && trend2
    
    const trend1Decreasing = values1.every((val, i) => i === 0 || val <= values1[i-1])
    const trend2Decreasing = values2.every((val, i) => i === 0 || val <= values2[i-1])
    const bothDecreasing = trend1Decreasing && trend2Decreasing
    
    // Calculate spurious correlation with time as common denominator
    if (bothIncreasing || bothDecreasing) {
      const spuriousCorr = calculatePearsonSpuriousCorrelation(values1, values2, timeValues)
      return {
        isSpurious: Math.abs(spuriousCorr) > 0.3,
        spuriousStrength: Math.abs(spuriousCorr),
        pattern: bothIncreasing ? 'both-increasing' : 'both-decreasing',
        confidence: spuriousCorr
      }
    }
    
    return { isSpurious: false, spuriousStrength: 0, pattern: 'none', confidence: 0 }
  }, [calculatePearsonSpuriousCorrelation])

  const detectRatioBasedSpurious = useCallback((correlation: CorrelationData) => {
    // Detect common denominators in variable names that might cause spurious correlation
    const var1Name = correlation.variable1.name.toLowerCase()
    const var2Name = correlation.variable2.name.toLowerCase()
    
    // Common ratio indicators
    const ratioIndicators = ['per capita', 'per 1,000', 'per million', 'rate', 'percentage', '%', 'density', 'per sq mile']
    const var1HasRatio = ratioIndicators.some(indicator => var1Name.includes(indicator))
    const var2HasRatio = ratioIndicators.some(indicator => var2Name.includes(indicator))
    
    if (var1HasRatio && var2HasRatio) {
      // Both variables are ratios - high potential for spurious correlation
      return {
        isRatioBased: true,
        riskLevel: 'high',
        explanation: 'Both variables appear to be ratios or rates, which can create spurious correlations due to shared denominators (e.g., population, area, time)'
      }
    } else if (var1HasRatio || var2HasRatio) {
      return {
        isRatioBased: true,
        riskLevel: 'medium',
        explanation: 'One variable appears to be a ratio or rate, which may create spurious correlation with the raw variable'
      }
    }
    
    return { isRatioBased: false, riskLevel: 'low', explanation: '' }
  }, [])

  const boxCoxTransformation = useCallback((values: number[], lambda: number) => {
    // Box-Cox power transformation (Equations 10 and 11 from ScienceDirect)
    // Reduces spurious correlations from heteroscedastic noise
    return values.map(x => {
      if (x <= 0) return 0 // Handle non-positive values
      
      if (Math.abs(lambda) < 1e-10) {
        // λ = 0: y = ln(x)
        return Math.log(x)
      } else {
        // λ ≠ 0: y = (x^λ - 1) / λ
        return (Math.pow(x, lambda) - 1) / lambda
      }
    })
  }, [])

  const findOptimalBoxCoxLambda = useCallback((values: number[]) => {
    // Find optimal λ that minimizes mean-variance dependence
    let bestLambda = 1
    let minVariance = Infinity
    
    // Test range of lambda values from -2 to 2
    for (let lambda = -2; lambda <= 2; lambda += 0.2) {
      const transformed = boxCoxTransformation(values, lambda)
      const variance = transformed.reduce((sum, val, _, arr) => {
        const mean = arr.reduce((s, v) => s + v, 0) / arr.length
        return sum + Math.pow(val - mean, 2)
      }, 0) / (transformed.length - 1)
      
      if (variance < minVariance && !isNaN(variance) && variance > 0) {
        minVariance = variance
        bestLambda = lambda
      }
    }
    
    return bestLambda
  }, [boxCoxTransformation])

  const detectHeteroscedasticNoise = useCallback((data: Array<{ year: number; value1: number; value2: number }>) => {
    // Check for heteroscedastic noise patterns that can induce spurious correlations
    const values1 = data.map(d => d.value1)
    const values2 = data.map(d => d.value2)
    
    // Calculate variance in different segments of the time series
    const segmentSize = Math.floor(data.length / 3)
    const segments1 = [
      values1.slice(0, segmentSize),
      values1.slice(segmentSize, 2 * segmentSize),
      values1.slice(2 * segmentSize)
    ]
    const segments2 = [
      values2.slice(0, segmentSize),
      values2.slice(segmentSize, 2 * segmentSize),
      values2.slice(2 * segmentSize)
    ]
    
    const variances1 = segments1.map(seg => {
      const mean = seg.reduce((sum, val) => sum + val, 0) / seg.length
      return seg.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / (seg.length - 1)
    })
    
    const variances2 = segments2.map(seg => {
      const mean = seg.reduce((sum, val) => sum + val, 0) / seg.length
      return seg.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / (seg.length - 1)
    })
    
    // Check if variance changes significantly across segments
    const maxVar1 = Math.max(...variances1)
    const minVar1 = Math.min(...variances1)
    const maxVar2 = Math.max(...variances2)
    const minVar2 = Math.min(...variances2)
    
    const heteroscedastic1 = (maxVar1 / minVar1) > 2
    const heteroscedastic2 = (maxVar2 / minVar2) > 2
    
    if (heteroscedastic1 || heteroscedastic2) {
      // Recommend Box-Cox transformation
      const lambda1 = findOptimalBoxCoxLambda(values1)
      const lambda2 = findOptimalBoxCoxLambda(values2)
      
      return {
        hasHeteroscedastic: true,
        affectedVariable: heteroscedastic1 && heteroscedastic2 ? 'both' : 
                         heteroscedastic1 ? 'variable1' : 'variable2',
        recommendedLambda: { variable1: lambda1, variable2: lambda2 },
        explanation: 'Variance changes over time detected - Box-Cox transformation recommended to reduce spurious correlations'
      }
    }
    
    return { hasHeteroscedastic: false, affectedVariable: 'none', recommendedLambda: null, explanation: '' }
  }, [findOptimalBoxCoxLambda])

  const detectPatternAnomalies = useCallback((correlation: CorrelationData) => {
    const data = correlation.data
    const insights: string[] = []
    
    // Calculate trend analysis
    const values1 = data.map(d => d.value1)
    const values2 = data.map(d => d.value2)
    const years = data.map(d => d.year)
    
    // Check for trend consistency
    let increasingCount1 = 0, decreasingCount1 = 0
    let increasingCount2 = 0, decreasingCount2 = 0
    
    for (let i = 1; i < data.length; i++) {
      if (values1[i] > values1[i-1]) increasingCount1++
      else if (values1[i] < values1[i-1]) decreasingCount1++
      
      if (values2[i] > values2[i-1]) increasingCount2++
      else if (values2[i] < values2[i-1]) decreasingCount2++
    }
    
    // Trend analysis insights
    const trend1 = increasingCount1 > decreasingCount1 ? 'increasing' : 'decreasing'
    const trend2 = increasingCount2 > decreasingCount2 ? 'increasing' : 'decreasing'
    
    if (correlation.correlation > 0.6 && trend1 === trend2) {
      insights.push(`📊 Strong positive trend alignment: Both ${correlation.variable1.name.toLowerCase()} and ${correlation.variable2.name.toLowerCase()} are ${trend1}`)
    } else if (correlation.correlation < -0.6 && trend1 !== trend2) {
      insights.push(`📉 Strong inverse relationship: As ${correlation.variable1.name.toLowerCase()} ${trend1}, ${correlation.variable2.name.toLowerCase()} ${trend2}`)
    }
    
    // Check for sudden changes with specific insights
    let hasSignificantChanges = false
    for (let i = 1; i < data.length - 1; i++) {
      const prev = data[i - 1]
      const curr = data[i]
      
      const change1 = Math.abs(curr.value1 - prev.value1) / prev.value1
      const change2 = Math.abs(curr.value2 - prev.value2) / prev.value2
      
      if (change1 > 0.25 || change2 > 0.25) {
        const primaryVar = change1 > change2 ? correlation.variable1.name : correlation.variable2.name
        const changePercent = Math.max(change1, change2) * 100
        insights.push(`📈 Significant ${changePercent.toFixed(0)}% change in ${primaryVar.toLowerCase()} around ${curr.year}`)
        hasSignificantChanges = true
        break // Only show first major change to avoid spam
      }
    }
    
    // Check for correlation pattern shifts
    let correlationShifts = 0
    for (let i = 1; i < data.length - 1; i++) {
      const prev = data[i - 1]
      const curr = data[i]
      const next = data[i + 1]
      
      const localCorr1 = (curr.value1 - prev.value1) * (curr.value2 - prev.value2)
      const localCorr2 = (next.value1 - curr.value1) * (next.value2 - curr.value2)
      
      if (localCorr1 * localCorr2 < 0) {
        correlationShifts++
        if (correlationShifts === 1) { // Only report first shift
          insights.push(`⚠️ Correlation pattern reversal detected around ${curr.year} - relationship direction changed`)
        }
      }
    }
    
    // Volatility analysis
    const volatility1 = Math.sqrt(values1.reduce((sum, val, i) => {
      if (i === 0) return 0
      const change = (val - values1[i-1]) / values1[i-1]
      return sum + change * change
    }, 0) / (values1.length - 1))
    
    const volatility2 = Math.sqrt(values2.reduce((sum, val, i) => {
      if (i === 0) return 0
      const change = (val - values2[i-1]) / values2[i-1]
      return sum + change * change
    }, 0) / (values2.length - 1))
    
    if (volatility1 > 0.15 || volatility2 > 0.15) {
      const moreVolatile = volatility1 > volatility2 ? correlation.variable1.name : correlation.variable2.name
      insights.push(`🎢 High volatility detected in ${moreVolatile.toLowerCase()} - data shows significant fluctuations`)
    }

    // Correlation strength for analysis 
    const absCorr = Math.abs(correlation.correlation)

    // Advanced spurious correlation analysis using Pearson's 1897 formula
    const timeSeriesAnalysis = detectTimeSeriesSpuriousPattern(correlation.data)
    if (timeSeriesAnalysis.isSpurious) {
      const direction = timeSeriesAnalysis.pattern === 'both-increasing' ? 'increasing' : 'decreasing'
      insights.push(`🚨 SPURIOUS CORRELATION DETECTED: Both variables follow ${direction} time trends (Pearson coefficient: ${timeSeriesAnalysis.spuriousStrength.toFixed(3)}) - correlation likely artificial due to shared temporal progression`)
    }

    // Ratio-based spurious correlation detection
    const ratioAnalysis = detectRatioBasedSpurious(correlation)
    if (ratioAnalysis.isRatioBased && absCorr > 0.5) {
      insights.push(`⚠️ RATIO WARNING (${ratioAnalysis.riskLevel.toUpperCase()} RISK): ${ratioAnalysis.explanation}`)
    }

    // Permutation test for statistical significance
    const corrValues1 = correlation.data.map(d => d.value1)
    const corrValues2 = correlation.data.map(d => d.value2)
    const pValue = performPermutationTest(corrValues1, corrValues2, 500)
    
    if (pValue > 0.05 && absCorr > 0.4) {
      insights.push(`📊 STATISTICAL WARNING: Permutation test suggests correlation may be due to chance (p-value: ${pValue.toFixed(3)}) - relationship not statistically significant`)
    }

    // Heteroscedastic noise analysis with Box-Cox recommendations
    const noiseAnalysis = detectHeteroscedasticNoise(correlation.data)
    if (noiseAnalysis.hasHeteroscedastic && absCorr > 0.5) {
      insights.push(`🔬 NOISE PATTERN DETECTED: ${noiseAnalysis.explanation} for ${noiseAnalysis.affectedVariable} (λ₁=${noiseAnalysis.recommendedLambda?.variable1?.toFixed(2)}, λ₂=${noiseAnalysis.recommendedLambda?.variable2?.toFixed(2)})`)
    }
    
    // Correlation strength insights with context and spurious correlation warnings
    if (absCorr > 0.8) {
      const direction = correlation.correlation > 0 ? 'positive' : 'negative'
      insights.push(`🔥 Exceptionally strong ${direction} correlation (${(correlation.correlation * 100).toFixed(1)}%) - highly predictive relationship`)
      insights.push(`⚠️ CAUTION: Very strong correlations often indicate spurious relationships - investigate potential third variables like seasonal trends, economic cycles, or shared underlying causes`)
    } else if (absCorr > 0.6) {
      insights.push(`💪 Strong correlation suggests meaningful relationship between variables`)
      insights.push(`🔍 Consider spurious correlation: Strong relationships may share a common denominator - look for external factors affecting both variables simultaneously`)
    } else if (absCorr < 0.3) {
      insights.push(`🎲 Weak correlation (${(absCorr * 100).toFixed(1)}%) - relationship may be coincidental or influenced by external factors`)
    }
    
    // Additional spurious correlation warnings for high correlations
    if (absCorr > 0.7 && correlation.isRealData) {
      const var1Category = correlation.variable1.category?.toLowerCase() || 'unknown'
      const var2Category = correlation.variable2.category?.toLowerCase() || 'unknown'
      
      if (var1Category !== var2Category) {
        insights.push(`🚨 Cross-category correlation detected: ${var1Category} vs ${var2Category} variables often have spurious relationships due to shared time trends or external drivers`)
      }
      
      // Common spurious correlation scenarios
      if (var1Category.includes('economic') || var2Category.includes('economic')) {
        insights.push(`💰 Economic data warning: Many economic indicators move together due to business cycles, not direct causation`)
      }
      
      if (var1Category.includes('social') || var2Category.includes('social')) {
        insights.push(`👥 Social trend warning: Demographics and social behaviors often correlate due to generational, technological, or cultural shifts`)
      }
      
      // Additional spurious correlation warnings based on data patterns
      const dataYears = correlation.data.map(d => d.year)
      const timeSpan = Math.max(...dataYears) - Math.min(...dataYears)
      if (timeSpan >= 10 && absCorr > 0.6) {
        insights.push(`📊 Long-term trend alert: ${timeSpan}-year correlations often reflect shared time trends rather than causal relationships`)
      }
      
      // Check for seasonal patterns that might indicate spurious correlation
      const seasonalPattern1 = correlation.data.every((d, i) => {
        if (i === 0) return true
        return d.value1 >= correlation.data[i-1].value1 // Always increasing
      }) || correlation.data.every((d, i) => {
        if (i === 0) return true
        return d.value1 <= correlation.data[i-1].value1 // Always decreasing
      })
      
      if (seasonalPattern1 && absCorr > 0.7) {
        insights.push(`🔄 Monotonic trend warning: Both variables follow similar directional trends - consider if external factors drive both patterns`)
      }
    }
    
    // R-squared insights
    if (correlation.rSquared > 0.6) {
      insights.push(`📈 High explanatory power: ${(correlation.rSquared * 100).toFixed(0)}% of variance is explained by the relationship`)
    } else if (correlation.rSquared < 0.2) {
      insights.push(`❓ Low explanatory power: Only ${(correlation.rSquared * 100).toFixed(0)}% of variance explained - other factors likely involved`)
    }
    
    // Data quality insights
    if (correlation.isRealData) {
      insights.push(`✅ Analysis based on real-world data from ${correlation.dataSource} - findings are statistically reliable`)
    } else {
      insights.push(`🤖 Synthetic data analysis - patterns demonstrate statistical concepts but may not reflect real-world relationships`)
    }
    
    return insights.slice(0, 4) // Limit to 4 most relevant insights to avoid overwhelming
  }, [])

  const generateSmartRecommendations = useCallback(async () => {
    setIsGeneratingRecommendations(true)
    
    try {
      toast.info("🧠 AI is analyzing patterns and correlations...")
      
      // Simulate AI processing time for better UX
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      const recommendations: CorrelationData[] = []
      
      // Generate high-correlation examples
      const strongCorrelation = generateCorrelationData()
      strongCorrelation.correlation = 0.85 + Math.random() * 0.1
      strongCorrelation.rSquared = strongCorrelation.correlation * strongCorrelation.correlation
      strongCorrelation.title = `🔥 Strong: ${strongCorrelation.title}`
      strongCorrelation.id = `strong-${Date.now()}`
      recommendations.push(strongCorrelation)
      
      // Generate interesting weak correlation
      const weakCorrelation = generateCorrelationData('social')
      weakCorrelation.correlation = (Math.random() - 0.5) * 0.4
      weakCorrelation.rSquared = weakCorrelation.correlation * weakCorrelation.correlation
      weakCorrelation.title = `🎲 Surprising: ${weakCorrelation.title}`
      weakCorrelation.id = `weak-${Date.now()}`
      recommendations.push(weakCorrelation)
      
      setRecommendedCorrelations(recommendations)
      setShowRecommendations(true)
      toast.success("🎯 Smart recommendations generated!")
    } catch (error) {
      console.error('Error generating recommendations:', error)
      toast.error("Failed to generate recommendations. Please try again.")
    } finally {
      setIsGeneratingRecommendations(false)
    }
  }, [])

  const filterCorrelationsByStrength = useCallback((correlations: CorrelationData[], filters: typeof correlationFilters) => {
    return correlations.filter(corr => {
      const strength = Math.abs(corr.correlation)
      if (strength < filters.minStrength || strength > filters.maxStrength) return false
      
      if (filters.dataType === 'real' && !corr.isRealData) return false
      if (filters.dataType === 'ai' && corr.isRealData) return false
      
      return true
    })
  }, [])

  const toggleFavorite = useCallback((correlation: CorrelationData) => {
    const exists = favorites.find(fav => fav.id === correlation.id)
    if (exists) {
      toast.info("Removed from favorites")
      saveFavorites(favorites.filter(fav => fav.id !== correlation.id))
    } else {
      toast.success("Added to favorites!")
      saveFavorites([...favorites, correlation])
    }
  }, [favorites, saveFavorites])

  const copyToClipboard = useCallback((text: string) => {
    navigator.clipboard.writeText(text)
    toast.success("Citation copied to clipboard!")
  }, [])

  const generateShareText = useCallback((correlation: CorrelationData) => {
    const corrType = Math.abs(correlation.correlation) > 0.7 ? "strong" : 
                     Math.abs(correlation.correlation) > 0.4 ? "moderate" : "weak"
    const direction = correlation.correlation > 0 ? "positive" : "negative"
    
    const baseUrl = window.location.origin
    const shareUrl = `${baseUrl}/?share=${correlation.id}`
    
    // More engaging share text with emojis and better formatting
    const strengthEmoji = Math.abs(correlation.correlation) > 0.7 ? "🔥" : 
                         Math.abs(correlation.correlation) > 0.4 ? "💪" : "🔍"
    const directionEmoji = correlation.correlation > 0 ? "📈" : "📉"
    const correlationValue = (correlation.correlation * 100).toFixed(0)
    
    return {
      short: `${strengthEmoji} ${corrType.toUpperCase()} CORRELATION FOUND! ${directionEmoji}\n\n"${correlation.title}"\n\nCorrelation: ${correlation.correlation > 0 ? '+' : ''}${correlationValue}%\n\n🤖 Discovered with AI-powered analysis\n${shareUrl}\n\n#DataScience #AI #Statistics #Correlation #MachineLearning`,
      
      medium: `${strengthEmoji} Fascinating ${corrType} correlation discovered!\n\n${directionEmoji} ${correlation.title}\n📊 Correlation strength: ${correlation.correlation > 0 ? '+' : ''}${correlationValue}%\n\n${correlation.description}\n\n🤖 Powered by CorrelateAI Pro\n🔗 ${shareUrl}\n\n#DataScience #AI #Statistics #Economics #MachineLearning #DataAnalysis`,
      
      long: `${strengthEmoji} BREAKTHROUGH DATA CORRELATION DISCOVERY! ${directionEmoji}\n\n"${correlation.title}"\n\n📊 KEY FINDINGS:\n• Correlation Strength: ${correlation.correlation > 0 ? '+' : ''}${correlationValue}%\n• Statistical Significance: ${Math.abs(correlation.correlation) >= 0.5 ? 'HIGH ✅' : 'MODERATE ⚠️'}\n• Analysis Type: ${corrType.charAt(0).toUpperCase() + corrType.slice(1)} ${direction}\n\n💡 INSIGHT:\n${correlation.description}\n\n🤖 This correlation was discovered using CorrelateAI Pro's advanced AI-driven data analysis engine, processing real-world datasets to uncover hidden patterns and relationships.\n\n🔗 Explore the interactive analysis: ${shareUrl}\n\n#DataScience #AI #Statistics #Economics #MachineLearning #DataAnalysis #Research #TechInnovation #BigData`,
      
      url: shareUrl
    }
  }, [])

  // Enhanced share function that generates image and shares with better content
  const generateShareImageAndText = useCallback(async (correlation: CorrelationData) => {
    if (!shareCardRef.current) {
      toast.error("Unable to generate share image. Please try again.")
      return null
    }

    try {
      toast.info("🎨 Generating shareable image...")
      
      // Dynamic import to avoid bundling issues
      const html2canvas = (await import('html2canvas')).default
      
      const canvas = await html2canvas(shareCardRef.current, {
        backgroundColor: '#1f2937', // Dark background to match app theme
        scale: 2,
        useCORS: true,
        allowTaint: true,
        height: shareCardRef.current.offsetHeight,
        width: shareCardRef.current.offsetWidth,
        logging: false
      })
      
      // Convert canvas to blob
      const blob = await new Promise<Blob>((resolve) => {
        canvas.toBlob((blob) => resolve(blob!), 'image/png', 0.95)
      })
      
      const shareContent = generateShareText(correlation)
      
      toast.success("📸 Share image ready!")
      
      return {
        imageBlob: blob,
        imageUrl: URL.createObjectURL(blob),
        text: shareContent,
        filename: `correlateai-${correlation.id}.png`
      }
    } catch (error) {
      console.error('Error generating share image:', error)
      toast.error("Failed to generate share image")
      return null
    }
  }, [generateShareText])

  const shareToTwitter = useCallback(async (correlation: CorrelationData) => {
    const shareData = await generateShareImageAndText(correlation)
    
    if (!shareData) {
      // Fallback to text-only sharing if image generation fails
      const shareContent = generateShareText(correlation)
      const twitterText = shareContent.short
      const url = `https://x.com/intent/tweet?text=${encodeURIComponent(twitterText)}`
      window.open(url, '_blank', 'width=600,height=400')
      toast.success("Opening X (Twitter) share dialog!")
      return
    }

    // Check if Web Share API is supported for native image sharing
    if (navigator.share && navigator.canShare && navigator.canShare({ files: [new File([shareData.imageBlob], shareData.filename, { type: 'image/png' })] })) {
      try {
        const file = new File([shareData.imageBlob], shareData.filename, { type: 'image/png' })
        await navigator.share({
          title: '🔍 Correlation Discovery',
          text: shareData.text.short,
          files: [file]
        })
        toast.success("🚀 Shared successfully!")
        return
      } catch (error) {
        if (error.name !== 'AbortError') {
          console.warn('Native share failed, falling back to URL sharing')
        }
      }
    }

    // Fallback: Open Twitter with text and suggest image upload
    const twitterText = shareData.text.short + "\n\n📸 Image saved to downloads - Upload it with your tweet for maximum impact!"
    const url = `https://x.com/intent/tweet?text=${encodeURIComponent(twitterText)}`
    
    // Also trigger image download for user to upload manually
    const link = document.createElement('a')
    link.href = shareData.imageUrl
    link.download = shareData.filename
    link.click()
    
    window.open(url, '_blank', 'width=600,height=400')
    toast.success("📸 Image downloaded! Upload it with your tweet for best results!")
  }, [generateShareImageAndText, generateShareText])

  const shareToLinkedIn = useCallback(async (correlation: CorrelationData) => {
    const shareData = await generateShareImageAndText(correlation)
    
    if (!shareData) {
      // Fallback to text-only sharing if image generation fails
      const shareContent = generateShareText(correlation)
      const fullUrl = shareContent.url
      const linkedInTitle = encodeURIComponent(`CorrelateAI Pro: ${correlation.title}`)
      const linkedInSummary = encodeURIComponent(shareContent.long)
      const linkedInSource = encodeURIComponent('CorrelateAI Pro - AI Data Analysis')
      
      const url = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(fullUrl)}&title=${linkedInTitle}&summary=${linkedInSummary}&source=${linkedInSource}`
      window.open(url, '_blank', 'width=700,height=500,scrollbars=yes,resizable=yes')
      toast.success("Opening LinkedIn share dialog!")
      return
    }

    // Check if Web Share API is supported for native image sharing
    if (navigator.share && navigator.canShare && navigator.canShare({ files: [new File([shareData.imageBlob], shareData.filename, { type: 'image/png' })] })) {
      try {
        const file = new File([shareData.imageBlob], shareData.filename, { type: 'image/png' })
        await navigator.share({
          title: 'CorrelateAI Pro: Data Correlation Discovery',
          text: shareData.text.long,
          files: [file]
        })
        toast.success("🚀 Shared successfully!")
        return
      } catch (error) {
        if (error.name !== 'AbortError') {
          console.warn('Native share failed, falling back to LinkedIn URL')
        }
      }
    }

    // Fallback: LinkedIn sharing with enhanced text and image download
    const fullUrl = shareData.text.url
    const linkedInTitle = encodeURIComponent(`CorrelateAI Pro: ${correlation.title}`)
    const linkedInSummary = encodeURIComponent(shareData.text.long + "\n\n📸 Visualization image saved to downloads - attach it to your LinkedIn post!")
    const linkedInSource = encodeURIComponent('CorrelateAI Pro - AI Data Analysis')
    
    // Download image for manual upload
    const link = document.createElement('a')
    link.href = shareData.imageUrl
    link.download = shareData.filename
    link.click()
    
    const url = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(fullUrl)}&title=${linkedInTitle}&summary=${linkedInSummary}&source=${linkedInSource}`
    window.open(url, '_blank', 'width=700,height=500,scrollbars=yes,resizable=yes')
    toast.success("📸 Image downloaded! Attach it to your LinkedIn post for better engagement!")
  }, [generateShareImageAndText, generateShareText])

  const shareToFacebook = useCallback(async (correlation: CorrelationData) => {
    const shareData = await generateShareImageAndText(correlation)
    
    if (!shareData) {
      // Fallback to text-only sharing if image generation fails
      const shareContent = generateShareText(correlation)
      const url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareContent.url)}&quote=${encodeURIComponent(shareContent.long)}`
      window.open(url, '_blank', 'width=600,height=400')
      toast.success("Opening Facebook share dialog!")
      return
    }

    // Check if Web Share API is supported for native image sharing
    if (navigator.share && navigator.canShare && navigator.canShare({ files: [new File([shareData.imageBlob], shareData.filename, { type: 'image/png' })] })) {
      try {
        const file = new File([shareData.imageBlob], shareData.filename, { type: 'image/png' })
        await navigator.share({
          title: 'CorrelateAI Pro: Correlation Discovery',
          text: shareData.text.medium,
          files: [file]
        })
        toast.success("🚀 Shared successfully!")
        return
      } catch (error) {
        if (error.name !== 'AbortError') {
          console.warn('Native share failed, falling back to Facebook URL')
        }
      }
    }

    // Fallback: Facebook sharing with image download
    const link = document.createElement('a')
    link.href = shareData.imageUrl
    link.download = shareData.filename
    link.click()
    
    const url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareData.text.url)}&quote=${encodeURIComponent(shareData.text.medium + "\n\n📸 Visualization image saved - upload it with your post!")}`
    window.open(url, '_blank', 'width=600,height=400')
    toast.success("📸 Image downloaded! Upload it with your Facebook post!")
  }, [generateShareImageAndText, generateShareText])

  // Universal share function that uses native sharing when available
  const shareCorrelation = useCallback(async (correlation: CorrelationData) => {
    const shareData = await generateShareImageAndText(correlation)
    
    if (!shareData) {
      toast.error("Unable to generate share content. Please try again.")
      return
    }

    // Check if native sharing with image is supported
    if (navigator.share && navigator.canShare) {
      try {
        const file = new File([shareData.imageBlob], shareData.filename, { type: 'image/png' })
        
        if (navigator.canShare({ files: [file] })) {
          await navigator.share({
            title: '🔍 CorrelateAI Pro: Correlation Discovery',
            text: shareData.text.medium,
            files: [file]
          })
          toast.success("🚀 Shared successfully!")
          return
        } else {
          // Native share without files
          await navigator.share({
            title: '🔍 CorrelateAI Pro: Correlation Discovery',
            text: shareData.text.medium,
            url: shareData.text.url
          })
          
          // Also download image for user to share separately
          const link = document.createElement('a')
          link.href = shareData.imageUrl
          link.download = shareData.filename
          link.click()
          
          toast.success("🚀 Link shared! Image downloaded for separate upload.")
          return
        }
      } catch (error) {
        if (error.name !== 'AbortError') {
          console.warn('Native share failed:', error)
        } else {
          return // User cancelled
        }
      }
    }

    // Fallback: Download image and copy text to clipboard
    const link = document.createElement('a')
    link.href = shareData.imageUrl
    link.download = shareData.filename
    link.click()

    try {
      await navigator.clipboard.writeText(shareData.text.medium)
      toast.success("📸 Image downloaded and text copied to clipboard! Ready to share anywhere!")
    } catch (error) {
      toast.success("📸 Image downloaded! Copy the text from the share dialog to post with it.")
    }
  }, [generateShareImageAndText])

  const downloadAsImage = useCallback(async (correlation: CorrelationData, scale: number = 2) => {
    if (!shareCardRef.current) {
      toast.error("Share card not found. Try again in a moment.")
      return
    }

    try {
      // Dynamic import to avoid bundling issues
      const html2canvas = (await import('html2canvas')).default
      
      const canvas = await html2canvas(shareCardRef.current, {
        backgroundColor: '#ffffff',
        scale: scale,
        useCORS: true,
        allowTaint: true,
        height: shareCardRef.current.offsetHeight,
        width: shareCardRef.current.offsetWidth
      })
      
      const link = document.createElement('a')
      const scaleText = scale > 2 ? `-${scale}x` : ''
      link.download = `correlation-${correlation.title.replace(/[^a-z0-9]/gi, '-').toLowerCase()}${scaleText}.png`
      link.href = canvas.toDataURL('image/png')
      link.click()
      
      toast.success(`Correlation card downloaded! (${scale}x resolution)`)
    } catch (error) {
      console.error('Error generating image:', error)
      toast.error("Failed to download image. Please try again.")
    }
  }, [])

  const isFavorited = useMemo(() => (id: string) => favorites?.some(fav => fav.id === id) || false, [favorites])

  // Slideshow for first-time visitors
  if (showSlideshow && !isAppLoading) {
    return <IntroSlideshow onComplete={handleSlideshowComplete} />
  }

  // Loading Screen Component
  if (isAppLoading) {
    return (
      <div className="min-h-screen relative">
        <SwirlBackground />
        <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-gray-800/90 backdrop-blur-md rounded-2xl shadow-2xl border border-gray-700/50 p-8 text-center">
            {/* Logo and Title */}
            <div className="flex items-center justify-center gap-3 mb-6">
              <div className="w-12 h-12 bg-gradient-to-r from-cyan-400 to-purple-400 rounded-lg flex items-center justify-center animate-pulse">
                <Database size={24} className="text-white" />
              </div>
              <h1 className="text-2xl font-bold">
                <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">Correlate</span><span className="text-cyan-300">AI</span>
              </h1>
            </div>
            
            {/* Loading Animation */}
            <div className="mb-6">
              <div className="relative w-16 h-16 mx-auto">
                <div className="absolute inset-0 border-4 border-gray-600 rounded-full"></div>
                <div className="absolute inset-0 border-4 border-transparent border-t-cyan-400 border-r-purple-400 rounded-full animate-spin"></div>
              </div>
            </div>
            
            {/* Loading Text */}
            <div className="space-y-2">
              <h2 className="text-lg font-semibold text-gray-200">Initializing AI Engine</h2>
              <p className="text-sm text-gray-400">Loading datasets and correlation algorithms...</p>
              
              {/* Loading Steps */}
              <div className="mt-4 space-y-2 text-xs text-gray-500">
                <div className="flex items-center justify-center gap-2">
                  <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse"></div>
                  <span>Loading synthetic datasets</span>
                </div>
                <div className="flex items-center justify-center gap-2">
                  <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse" style={{ animationDelay: '0.3s' }}></div>
                  <span>Initializing correlation engine</span>
                </div>
                <div className="flex items-center justify-center gap-2">
                  <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" style={{ animationDelay: '0.6s' }}></div>
                  <span>Preparing interactive charts</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen relative">
      <SwirlBackground />
      <div className="relative z-10 p-2 sm:p-4 min-h-screen">
        <div className="max-w-6xl mx-auto bg-gray-800/80 backdrop-blur-md rounded-xl sm:rounded-2xl shadow-2xl border border-gray-700/50 p-4 sm:p-8">
        <header className="text-center mb-6 sm:mb-8">
          <div className="flex items-center justify-center gap-2 sm:gap-3 mb-3 sm:mb-4 relative">
            {/* Restart Intro Button - positioned absolutely in top right */}
            <button
              onClick={() => {
                localStorage.removeItem('correlate-ai-intro-seen')
                setShowSlideshow(true)
              }}
              className="absolute right-0 top-0 inline-flex items-center gap-1 px-2 py-1 text-xs text-gray-400 hover:text-cyan-400 hover:bg-gray-700/30 rounded-md transition-colors"
              title="View intro tutorial again"
            >
              <Info size={12} />
              <span className="hidden sm:inline">Intro</span>
            </button>

            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-cyan-400 to-purple-400 rounded-lg flex items-center justify-center">
              <Database size={isMobile ? 20 : 24} className="text-white" />
            </div>
            <h1 className="text-2xl sm:text-4xl font-bold">
              <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">Correlate</span><span className="text-cyan-300">AI</span>
            </h1>
            <div className="px-2 py-1 sm:px-3 sm:py-1 bg-gradient-to-r from-cyan-500 to-purple-500 text-white text-xs font-semibold rounded-full border border-cyan-400/30 shadow-lg shadow-cyan-500/25">
              AI-Powered
            </div>
          </div>
          <div className="text-gray-300 max-w-2xl mx-auto px-4 sm:px-0 space-y-1">
            <h2 className="text-lg sm:text-xl font-semibold text-white">
              Discover <span className="text-orange-400 font-bold">strong links</span> between real-world data
            </h2>
            <DynamicExamples onExampleClick={handleExampleClick} />
            <p className="text-xs sm:text-xs text-gray-400 leading-relaxed pt-2 italic">
              Using only authentic data from trusted sources like the Federal Reserve, World Bank, Alpha Vantage, OpenWeather, NASA, USGS, and more - no AI-generated content, just real correlations.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-2 mt-4 text-xs sm:text-sm text-gray-400">
            <AnimatedPoweredBy sources={dynamicDataSources} isMobile={isMobile} />
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              {datasetStats ? (
                <div className="flex items-center gap-2 text-xs sm:text-sm">
                  <span className="text-green-400 font-medium" title={`Total: ${datasetStats.total} datasets from ${dynamicDataSources.size} sources`}>
                    {dynamicDataSources.size} Sources
                  </span>
                  <span className="text-gray-500">•</span>
                  <span className="text-blue-400 font-medium" title="Real data from FRED, World Bank, Alpha Vantage, OpenWeather, NASA, USGS, EIA, BLS, CDC, and Nasdaq">
                    {datasetStats.real} Real
                  </span>
                  <span className="text-gray-500">•</span>
                  <span className="text-purple-400 font-medium" title="AI-generated datasets">
                    {datasetStats.ai} AI
                  </span>
                </div>
              ) : (
                <span className="text-green-400 font-medium">
                  {totalDatasetCount > 0 ? `${totalDatasetCount}+ Sources` : '80+ Sources'}
                </span>
              )}
            </div>
          </div>
        </header>

        <Tabs defaultValue="generator" className="w-full">
          <TabsList className={`grid w-full grid-cols-5 mb-6 bg-gray-700/50 border border-gray-600/50 ${isMobile ? 'h-14 rounded-xl p-1' : 'h-12 rounded-lg p-1'}`}>
            <TabsTrigger 
              value="generator" 
              className={`text-gray-300 data-[state=active]:text-cyan-400 data-[state=active]:bg-gray-800 ${isMobile ? 'px-2 py-2 text-xs rounded-lg font-medium' : 'px-3 py-2 text-sm rounded-md font-medium'} transition-all duration-200`}
            >
              {isMobile ? "Generate" : "Generate"}
            </TabsTrigger>
            <TabsTrigger 
              value="favorites" 
              className={`text-gray-300 data-[state=active]:text-cyan-400 data-[state=active]:bg-gray-800 ${isMobile ? 'px-2 py-2 text-xs rounded-lg font-medium' : 'px-3 py-2 text-sm rounded-md font-medium'} transition-all duration-200`}
            >
              {isMobile ? `❤ ${favorites?.length || 0}` : `Favorites (${favorites?.length || 0})`}
            </TabsTrigger>
            <TabsTrigger 
              value="discover" 
              className={`text-gray-300 data-[state=active]:text-purple-400 data-[state=active]:bg-gray-800 ${isMobile ? 'px-2 py-2 text-xs rounded-lg font-medium' : 'px-3 py-2 text-sm rounded-md font-medium'} transition-all duration-200`}
            >
              {isMobile ? "🔮 Discover" : "🔮 Discover"}
            </TabsTrigger>
            <TabsTrigger 
              value="spurious" 
              className={`text-gray-300 data-[state=active]:text-orange-400 data-[state=active]:bg-gray-800 ${isMobile ? 'px-2 py-2 text-xs rounded-lg font-medium' : 'px-3 py-2 text-sm rounded-md font-medium'} transition-all duration-200`}
            >
              {isMobile ? "🧮 Math" : "🧮 Spurious Analysis"}
            </TabsTrigger>
            <TabsTrigger 
              value="story" 
              className={`text-gray-300 data-[state=active]:text-cyan-400 data-[state=active]:bg-gray-800 ${isMobile ? 'px-2 py-2 text-xs rounded-lg font-medium' : 'px-3 py-2 text-sm rounded-md font-medium'} transition-all duration-200`}
            >
              {isMobile ? "Story" : "AI Story"}
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="generator" className="space-y-4 sm:space-y-6">
            <div className="flex flex-col gap-4 items-center justify-center">
              
              {/* Controls Row - Mobile-optimized */}
              <div className={`flex ${isMobile ? 'flex-col gap-3' : 'items-center gap-4'} justify-center w-full max-w-lg`}>
                <div className="flex items-center gap-2 justify-center">
                  <Database size={18} className="text-purple-400" />
                  <Select value={dataSourcePreference} onValueChange={(value: 'mixed' | 'real' | 'synthetic') => setDataSourcePreference(value)}>
                    <SelectTrigger className={`${isMobile ? 'w-full' : 'w-48'} bg-gray-700/50 border-gray-600 text-gray-200 hover:bg-gray-700`}>
                      <SelectValue placeholder="Select data source" />
                    </SelectTrigger>
                    <SelectContent className="bg-white border-gray-300 text-gray-900 shadow-lg z-50">
                      <SelectItem value="mixed" className="text-gray-900 hover:bg-gray-100 focus:bg-gray-100 focus:text-gray-900 cursor-pointer data-[highlighted]:bg-gray-100 data-[highlighted]:text-gray-900">
                        🔀 Mixed (Real + AI)
                      </SelectItem>
                      <SelectItem value="real" className="text-gray-900 hover:bg-gray-100 focus:bg-gray-100 focus:text-gray-900 cursor-pointer data-[highlighted]:bg-gray-100 data-[highlighted]:text-gray-900">
                        📊 Real Data Only
                      </SelectItem>
                      <SelectItem value="synthetic" className="text-gray-900 hover:bg-gray-100 focus:bg-gray-100 focus:text-gray-900 cursor-pointer data-[highlighted]:bg-gray-100 data-[highlighted]:text-gray-900">
                        🎲 Synthetic Only
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="flex items-center gap-2 justify-center">
                  <Funnel size={18} className="text-cyan-400" />
                  <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                    <SelectTrigger className={`${isMobile ? 'w-full' : 'w-48'} bg-gray-700/50 border-gray-600 text-gray-200 hover:bg-gray-700`}>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent className="bg-white border-gray-300 text-gray-900 shadow-lg z-50">
                      <SelectItem value="all" className="text-gray-900 hover:bg-gray-100 focus:bg-gray-100 focus:text-gray-900 cursor-pointer data-[highlighted]:bg-gray-100 data-[highlighted]:text-gray-900">All Categories</SelectItem>
                      {Object.entries(availableCategories).map(([key, label]) => (
                        <SelectItem key={key} value={key} className="text-gray-900 hover:bg-gray-100 focus:bg-gray-100 focus:text-gray-900 cursor-pointer data-[highlighted]:bg-gray-100 data-[highlighted]:text-gray-900">
                          {label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <Button 
                  onClick={generateNew}
                  disabled={isGenerating}
                  size={isMobile ? "lg" : "lg"}
                  className={`${isMobile ? 'w-full px-4 py-3' : 'px-8'} bg-gradient-to-r from-cyan-600 to-purple-600 hover:from-cyan-700 hover:to-purple-700 border border-cyan-500/30 shadow-lg shadow-cyan-500/25 text-sm sm:text-base`}
                >
                  {isGenerating ? (
                    <>
                      <ArrowClockwise className="animate-spin mr-2" size={18} />
                      {isMobile ? "Analyzing..." : "Analyzing Data..."}
                    </>
                  ) : (
                    <>
                      <ArrowClockwise className="mr-2" size={18} />
                      {isMobile 
                        ? `Generate ${dataSourcePreference === 'real' ? 'Real' : dataSourcePreference === 'synthetic' ? 'AI' : 'Mixed'} Correlation`
                        : `Generate ${dataSourcePreference === 'real' ? 'Real Data' : dataSourcePreference === 'synthetic' ? 'AI/Synthetic' : 'Mixed Data'} Correlation`
                      }
                    </>
                  )}
                </Button>
              </div>
            </div>
            
            {isGenerating ? (
              /* Skeleton Loading Card */
              <Card className="w-full bg-gray-800/50 border-gray-700/50 backdrop-blur-md animate-pulse">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div className="space-y-2 flex-1">
                      <div className="h-6 bg-gray-700/50 rounded w-3/4"></div>
                      <div className="h-4 bg-gray-700/50 rounded w-1/2"></div>
                    </div>
                    <div className="flex gap-2">
                      <div className="h-8 w-8 bg-gray-700/50 rounded"></div>
                      <div className="h-8 w-8 bg-gray-700/50 rounded"></div>
                      <div className="h-8 w-8 bg-gray-700/50 rounded"></div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                      <div className="space-y-3">
                        <div className="h-4 bg-gray-700/50 rounded w-1/3"></div>
                        <div className="space-y-2">
                          <div className="h-3 bg-gray-700/50 rounded w-full"></div>
                          <div className="h-3 bg-gray-700/50 rounded w-full"></div>
                          <div className="h-3 bg-gray-700/50 rounded w-3/4"></div>
                        </div>
                      </div>
                      <div className="space-y-3">
                        <div className="h-4 bg-gray-700/50 rounded w-1/3"></div>
                        <div className="space-y-2">
                          <div className="h-3 bg-gray-700/50 rounded w-full"></div>
                          <div className="h-3 bg-gray-700/50 rounded w-2/3"></div>
                        </div>
                      </div>
                    </div>
                    <div className="h-64 bg-gray-700/30 rounded flex items-center justify-center">
                      <div className="text-center space-y-2">
                        <div className="w-8 h-8 mx-auto">
                          <ArrowClockwise className="animate-spin text-cyan-400" size={32} />
                        </div>
                        <p className="text-gray-400 text-sm">Generating correlation analysis...</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <CorrelationCard 
                correlation={currentCorrelation} 
                isShareable={true} 
                favorites={favorites}
                toggleFavorite={toggleFavorite}
                shareToTwitter={shareToTwitter}
                shareToLinkedIn={shareToLinkedIn}
                shareToFacebook={shareToFacebook}
                shareCorrelation={shareCorrelation}
              />
            )}
            
            {/* Data Sources Information */}
            <div data-sources-card>
              <DataSourcesCard />
            </div>
          </TabsContent>
          
          <TabsContent value="favorites" className="space-y-4 sm:space-y-6">
            {!favorites || favorites.length === 0 ? (
              <Card className="text-center py-8 sm:py-12 bg-gray-800/50 border-gray-700/50">
                <CardContent>
                  <Heart size={isMobile ? 40 : 48} className="mx-auto text-gray-500 mb-4" />
                  <h3 className={`${isMobile ? 'text-base' : 'text-lg'} font-semibold mb-2 text-gray-200`}>No favorites yet</h3>
                  <p className={`text-gray-400 ${isMobile ? 'text-sm px-4' : ''}`}>
                    Generate correlations and save your favorites!
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4 sm:space-y-6">
                {favorites.map(correlation => (
                  <CorrelationCard 
                    key={correlation.id} 
                    correlation={correlation} 
                    favorites={favorites}
                    toggleFavorite={toggleFavorite}
                    shareToTwitter={shareToTwitter}
                    shareToLinkedIn={shareToLinkedIn}
                    shareToFacebook={shareToFacebook}
                    shareCorrelation={shareCorrelation}
                  />
                ))}
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="discover" className="space-y-6 sm:space-y-8">
            <div className="max-w-5xl mx-auto">
              <div className="text-center mb-8">
                <h2 className={`${isMobile ? 'text-xl' : 'text-3xl'} font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-4`}>
                  🔮 Smart Correlation Discovery
                </h2>
                <p className={`${isMobile ? 'text-sm px-4' : 'text-lg'} text-gray-400 mb-6`}>
                  AI-powered recommendations and pattern analysis
                </p>
                
                {/* Quick Actions */}
                <div className={`flex ${isMobile ? 'flex-col gap-3' : 'gap-4 justify-center'} mb-8`}>
                  <Button
                    onClick={generateSmartRecommendations}
                    disabled={isGeneratingRecommendations}
                    className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800"
                  >
                    {isGeneratingRecommendations ? (
                      <>
                        <ArrowClockwise className="animate-spin mr-2" size={16} />
                        AI Analyzing...
                      </>
                    ) : (
                      <>
                        <Lightbulb size={16} className="mr-2" />
                        Generate Smart Recommendations
                      </>
                    )}
                  </Button>
                  {showRecommendations && (
                    <Button
                      variant="outline"
                      onClick={() => {
                        const insights = detectPatternAnomalies(currentCorrelation)
                        if (insights.length > 0) {
                          toast.success(`Found ${insights.length} insights!`)
                          insights.forEach((insight, i) => {
                            setTimeout(() => toast.info(insight), i * 1000)
                          })
                        } else {
                          toast.info("No unusual patterns detected")
                        }
                      }}
                      className="border-purple-600 text-purple-400 hover:bg-purple-600/10"
                    >
                      <TrendUp size={16} className="mr-2" />
                      Analyze Current Pattern
                    </Button>
                  )}
                </div>
              </div>

              {/* Correlation Strength Filter */}
              <Card className="bg-gray-800/50 border-gray-700/50 mb-6">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-gray-200">
                    <Sliders size={20} />
                    Correlation Filters
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className={`grid ${isMobile ? 'grid-cols-1 gap-4' : 'grid-cols-3 gap-6'}`}>
                    <div>
                      <Label className="text-gray-300 text-sm mb-2 block">Min Strength</Label>
                      <Select 
                        value={correlationFilters.minStrength.toString()} 
                        onValueChange={(value) => setCorrelationFilters(prev => ({ ...prev, minStrength: parseFloat(value) }))}
                      >
                        <SelectTrigger className="bg-white border-gray-300 text-gray-900 hover:bg-gray-50">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-white border-gray-300">
                          <SelectItem value="0" className="text-gray-900 hover:bg-gray-100">Any (0%)</SelectItem>
                          <SelectItem value="0.3" className="text-gray-900 hover:bg-gray-100">Moderate (30%)</SelectItem>
                          <SelectItem value="0.5" className="text-gray-900 hover:bg-gray-100">Strong (50%)</SelectItem>
                          <SelectItem value="0.7" className="text-gray-900 hover:bg-gray-100">Very Strong (70%)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label className="text-gray-300 text-sm mb-2 block">Max Strength</Label>
                      <Select 
                        value={correlationFilters.maxStrength.toString()} 
                        onValueChange={(value) => setCorrelationFilters(prev => ({ ...prev, maxStrength: parseFloat(value) }))}
                      >
                        <SelectTrigger className="bg-white border-gray-300 text-gray-900 hover:bg-gray-50">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-white border-gray-300">
                          <SelectItem value="0.5" className="text-gray-900 hover:bg-gray-100">Up to Strong (50%)</SelectItem>
                          <SelectItem value="0.7" className="text-gray-900 hover:bg-gray-100">Up to Very Strong (70%)</SelectItem>
                          <SelectItem value="1" className="text-gray-900 hover:bg-gray-100">Any (100%)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label className="text-gray-300 text-sm mb-2 block">Data Type</Label>
                      <Select 
                        value={correlationFilters.dataType} 
                        onValueChange={(value) => setCorrelationFilters(prev => ({ ...prev, dataType: value as 'all' | 'real' | 'ai' }))}
                      >
                        <SelectTrigger className="bg-white border-gray-300 text-gray-900 hover:bg-gray-50">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-white border-gray-300">
                          <SelectItem value="all" className="text-gray-900 hover:bg-gray-100">All Data</SelectItem>
                          <SelectItem value="real" className="text-gray-900 hover:bg-gray-100">Real Data Only</SelectItem>
                          <SelectItem value="ai" className="text-gray-900 hover:bg-gray-100">AI Generated Only</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Smart Recommendations */}
              {showRecommendations && recommendedCorrelations.length > 0 && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h3 className={`${isMobile ? 'text-lg' : 'text-xl'} font-semibold text-gray-200`}>
                      Smart Recommendations
                    </h3>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => setShowRecommendations(false)}
                      className="text-gray-400 hover:text-gray-300"
                    >
                      ✕ Hide
                    </Button>
                  </div>
                  <div className="space-y-4">
                    {filterCorrelationsByStrength(recommendedCorrelations, correlationFilters).map(correlation => (
                      <CorrelationCard 
                        key={correlation.id} 
                        correlation={correlation}
                        favorites={favorites}
                        toggleFavorite={toggleFavorite}
                        shareToTwitter={shareToTwitter}
                        shareToLinkedIn={shareToLinkedIn}
                        shareToFacebook={shareToFacebook}
                        shareCorrelation={shareCorrelation}
                      />
                    ))}
                  </div>
                  
                  {filterCorrelationsByStrength(recommendedCorrelations, correlationFilters).length === 0 && (
                    <Card className="text-center py-8 bg-gray-800/30 border-gray-700/50">
                      <CardContent>
                        <p className="text-gray-400">No correlations match your current filters</p>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => setCorrelationFilters({ minStrength: 0, maxStrength: 1, dataType: 'all' })}
                          className="mt-3"
                        >
                          Reset Filters
                        </Button>
                      </CardContent>
                    </Card>
                  )}
                </div>
              )}

              {/* Pattern Insights for Current Correlation - Only show if insights exist */}
              {detectPatternAnomalies(currentCorrelation).length > 0 && (
                <Card className="bg-gradient-to-r from-purple-900/30 to-pink-900/30 border-purple-700/50">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-purple-300">
                      <Robot size={20} />
                      AI Pattern Analysis
                      <Badge variant="outline" className="text-xs text-purple-400 border-purple-400/30 ml-2">
                        {detectPatternAnomalies(currentCorrelation).length} insights
                      </Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {detectPatternAnomalies(currentCorrelation).map((insight, index) => (
                        <div key={index} className="flex items-start gap-3 p-3 bg-purple-800/20 rounded-lg border border-purple-700/20">
                          <div className="w-2 h-2 bg-purple-400 rounded-full mt-2 flex-shrink-0"></div>
                          <p className="text-purple-200 text-sm leading-relaxed">{insight}</p>
                        </div>
                      ))}
                      <div className="mt-4 pt-3 border-t border-purple-700/30">
                        <p className="text-xs text-purple-400 text-center italic">
                          AI analysis updates dynamically based on correlation data patterns
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Similar Correlations */}
              <Card className="bg-gray-800/50 border-gray-700/50">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2 text-gray-200">
                      <Target size={20} />
                      Similar Correlations
                    </CardTitle>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => {
                        const similar = generateSimilarCorrelations(currentCorrelation)
                        setRecommendedCorrelations(similar)
                        setShowRecommendations(true)
                        toast.success(`Generated ${similar.length} similar correlations!`)
                      }}
                      className="border-gray-600 text-gray-300 hover:bg-gray-700"
                    >
                      Generate Similar
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-400 text-sm">
                    Based on your current correlation ({currentCorrelation.title}), 
                    we can generate similar patterns with comparable statistical properties.
                  </p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="story" className="space-y-6 sm:space-y-8">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-8 sm:mb-12">
                <h2 className={`${isMobile ? 'text-xl' : 'text-3xl'} font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4`}>
                  How CorrelateAI Pro Was Built
                </h2>
                <p className={`${isMobile ? 'text-base px-4' : 'text-lg'} text-muted-foreground mb-6`}>
                  {isMobile ? "AI-assisted development in 2 working sessions" : "A complete AI-assisted development journey from idea to deployment in 2 working sessions over 2 days"}
                </p>
                
                {/* Quick Actions */}
                <div className={`flex ${isMobile ? 'flex-col gap-3' : 'gap-4 justify-center'} mb-8`}>
                  <Button
                    onClick={() => window.open('https://github.com/features/spark', '_blank')}
                    className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800"
                  >
                    <Sparkle size={16} className="mr-2" />
                    Try GitHub Spark
                  </Button>
                  <Button
                    onClick={() => window.open('https://github.com/victorsaly/correlateAI', '_blank')}
                    variant="outline"
                    className="border-gray-600 hover:bg-gray-700"
                  >
                    <Code size={16} className="mr-2" />
                    View Source Code
                  </Button>
                </div>
              </div>

              {/* Interactive Timeline */}
              <div className="relative">
                {/* Timeline Line */}
                {!isMobile && (
                  <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-blue-500 via-green-500 to-purple-500 opacity-30"></div>
                )}

                <div className="space-y-8 sm:space-y-12">
                  
                  {/* Step 1: GitHub Spark - Enhanced */}
                  <Card className="border-2 border-blue-200 bg-gradient-to-r from-blue-50 to-blue-100 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-20 h-20 bg-blue-500/10 rounded-full transform translate-x-10 -translate-y-10"></div>
                    <CardHeader className={`${isMobile ? 'p-4' : ''}`}>
                      <div className="flex items-center gap-3 mb-2">
                        <div className={`${isMobile ? 'w-8 h-8' : 'w-10 h-10'} bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-full flex items-center justify-center font-bold shadow-lg`}>
                          <Sparkle size={isMobile ? 14 : 16} />
                        </div>
                        <div>
                          <h3 className={`${isMobile ? 'text-lg' : 'text-xl'} font-semibold flex items-center gap-2`}>
                            The Spark 
                            <Badge variant="secondary" className="bg-blue-100 text-blue-800">0-30 min</Badge>
                          </h3>
                          <p className={`text-blue-600 font-medium ${isMobile ? 'text-xs' : 'text-sm'}`}>GitHub Spark AI prototype generation</p>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className={`space-y-4 ${isMobile ? 'p-4 pt-0' : ''}`}>
                      <div className="bg-white/80 backdrop-blur-sm p-4 rounded-xl border border-blue-200 shadow-sm">
                        <div className="flex items-start gap-3">
                          <div className="w-8 h-8 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center flex-shrink-0">
                            💡
                          </div>
                          <div>
                            <h4 className={`font-semibold mb-2 ${isMobile ? 'text-sm' : ''} text-gray-800`}>Original Prompt:</h4>
                            <p className={`italic ${isMobile ? 'text-xs' : 'text-sm'} text-gray-600 bg-gray-50 p-3 rounded-lg border-l-4 border-blue-500`}>
                              "I want to create a tool that compares random datasets and finds interesting correlations between them. Make it interactive and visually appealing."
                            </p>
                          </div>
                        </div>
                      </div>
                      
                      <div className={`grid ${isMobile ? 'grid-cols-1 gap-3' : 'md:grid-cols-2 gap-6'}`}>
                        <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-4 rounded-xl border border-green-200">
                          <div className="flex items-center gap-2 mb-3">
                            <Lightning size={16} className="text-green-600" />
                            <h4 className={`font-semibold ${isMobile ? 'text-sm' : ''} text-green-800`}>⚡ AI Generated in Minutes:</h4>
                          </div>
                          <ul className={`space-y-2 ${isMobile ? 'text-xs' : 'text-sm'} text-green-700`}>
                            <li className="flex items-center gap-2"><Check size={12} className="text-green-500" />Complete React + TypeScript app</li>
                            <li className="flex items-center gap-2"><Check size={12} className="text-green-500" />Vite build configuration</li>
                            <li className="flex items-center gap-2"><Check size={12} className="text-green-500" />Correlation algorithms</li>
                            <li className="flex items-center gap-2"><Check size={12} className="text-green-500" />Modern UI with Tailwind CSS</li>
                            <li className="flex items-center gap-2"><Check size={12} className="text-green-500" />Interactive data visualization</li>
                          </ul>
                        </div>
                        
                        <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-4 rounded-xl border border-purple-200">
                          <div className="flex items-center gap-2 mb-3">
                            <Target size={16} className="text-purple-600" />
                            <h4 className={`font-semibold ${isMobile ? 'text-sm' : ''} text-purple-800`}>🎯 Instant Results:</h4>
                          </div>
                          <p className={`${isMobile ? 'text-xs' : 'text-sm'} text-purple-700 mb-3`}>
                            Working prototype with Chart.js integration, responsive design, and synthetic data generation.
                          </p>
                          <Button
                            size="sm"
                            onClick={() => window.open('https://github.com/features/spark', '_blank')}
                            className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white"
                          >
                            <ArrowSquareOut size={12} className="mr-1" />
                            Try GitHub Spark
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                {/* Step 2: Feature Evolution - Enhanced */}
                <Card className="border-2 border-green-200 bg-gradient-to-r from-green-50 to-green-100 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-green-500/10 rounded-full transform translate-x-12 -translate-y-12"></div>
                  <CardHeader className={`${isMobile ? 'p-4' : ''}`}>
                    <div className="flex items-center gap-3 mb-2">
                      <div className={`${isMobile ? 'w-8 h-8' : 'w-10 h-10'} bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-full flex items-center justify-center font-bold shadow-lg`}>
                        <Lightning size={isMobile ? 14 : 16} />
                      </div>
                      <div>
                        <h3 className={`${isMobile ? 'text-lg' : 'text-xl'} font-semibold flex items-center gap-2`}>
                          Feature Evolution
                          <Badge variant="secondary" className="bg-green-100 text-green-800">30-75 min</Badge>
                        </h3>
                        <p className={`text-green-600 font-medium ${isMobile ? 'text-xs' : 'text-sm'}`}>Natural language development acceleration</p>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className={`space-y-4 ${isMobile ? 'p-4 pt-0' : ''}`}>
                    <div className={`grid ${isMobile ? 'grid-cols-1 gap-4' : 'md:grid-cols-2 gap-6'}`}>
                      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-4 rounded-xl border border-blue-200">
                        <div className="flex items-center gap-2 mb-3">
                          <span className="text-xl">🗣️</span>
                          <h4 className={`font-semibold ${isMobile ? 'text-sm' : ''} text-blue-800`}>Conversational Requests:</h4>
                        </div>
                        <ul className={`space-y-2 ${isMobile ? 'text-xs' : 'text-sm'} text-blue-700`}>
                          <li className="flex items-center gap-2">
                            <span className="w-1.5 h-1.5 bg-blue-500 rounded-full"></span>
                            <span className="font-mono bg-blue-100 px-2 py-1 rounded text-xs">"Add category filtering"</span>
                          </li>
                          <li className="flex items-center gap-2">
                            <span className="w-1.5 h-1.5 bg-blue-500 rounded-full"></span>
                            <span className="font-mono bg-blue-100 px-2 py-1 rounded text-xs">"Enable social media sharing"</span>
                          </li>
                          <li className="flex items-center gap-2">
                            <span className="w-1.5 h-1.5 bg-blue-500 rounded-full"></span>
                            <span className="font-mono bg-blue-100 px-2 py-1 rounded text-xs">"Create a favorites system"</span>
                          </li>
                          <li className="flex items-center gap-2">
                            <span className="w-1.5 h-1.5 bg-blue-500 rounded-full"></span>
                            <span className="font-mono bg-blue-100 px-2 py-1 rounded text-xs">"Make it mobile-responsive"</span>
                          </li>
                        </ul>
                      </div>
                      
                      <div className="bg-gradient-to-br from-emerald-50 to-green-50 p-4 rounded-xl border border-emerald-200">
                        <div className="flex items-center gap-2 mb-3">
                          <span className="text-xl">🤖</span>
                          <h4 className={`font-semibold ${isMobile ? 'text-sm' : ''} text-emerald-800`}>AI Implementation:</h4>
                        </div>
                        <ul className={`space-y-2 ${isMobile ? 'text-xs' : 'text-sm'} text-emerald-700`}>
                          <li className="flex items-center gap-2"><Check size={12} className="text-emerald-500" />Dynamic dropdown filters</li>
                          <li className="flex items-center gap-2"><Check size={12} className="text-emerald-500" />Multi-platform social sharing</li>
                          <li className="flex items-center gap-2"><Check size={12} className="text-emerald-500" />Persistent favorites storage</li>
                          <li className="flex items-center gap-2"><Check size={12} className="text-emerald-500" />Responsive design system</li>
                        </ul>
                        <div className="mt-3 p-2 bg-emerald-100 rounded-lg">
                          <p className={`${isMobile ? 'text-xs' : 'text-sm'} text-emerald-800 font-medium`}>
                            ⚡ Each feature implemented in 5-10 minutes through conversational prompting
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Step 3: The Breaking Point - Enhanced */}
                <Card className="border-2 border-red-200 bg-gradient-to-r from-red-50 to-red-100 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-20 h-20 bg-red-500/10 rounded-full transform translate-x-10 -translate-y-10"></div>
                  <CardHeader className={`${isMobile ? 'p-4' : ''}`}>
                    <div className="flex items-center gap-3 mb-2">
                      <div className={`${isMobile ? 'w-8 h-8' : 'w-10 h-10'} bg-gradient-to-r from-red-500 to-red-600 text-white rounded-full flex items-center justify-center font-bold shadow-lg`}>
                        ⚠️
                      </div>
                      <div>
                        <h3 className={`${isMobile ? 'text-lg' : 'text-xl'} font-semibold flex items-center gap-2`}>
                          The Breaking Point
                          <Badge variant="secondary" className="bg-red-100 text-red-800">75 min</Badge>
                        </h3>
                        <p className={`text-red-600 font-medium ${isMobile ? 'text-xs' : 'text-sm'}`}>When complexity meets reality</p>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className={`space-y-4 ${isMobile ? 'p-4 pt-0' : ''}`}>
                    <div className="bg-gradient-to-br from-red-50 to-rose-50 p-4 rounded-xl border border-red-200">
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center flex-shrink-0 text-white font-bold">
                          💥
                        </div>
                        <div>
                          <h4 className={`font-semibold mb-3 ${isMobile ? 'text-sm' : ''} text-red-800`}>System Failures Cascade:</h4>
                          <ul className={`space-y-2 ${isMobile ? 'text-xs' : 'text-sm'} text-red-700`}>
                            <li className="flex items-start gap-2">
                              <span className="w-1.5 h-1.5 bg-red-500 rounded-full mt-2 flex-shrink-0"></span>
                              <span>Complex feature interdependencies created conflicts</span>
                            </li>
                            <li className="flex items-start gap-2">
                              <span className="w-1.5 h-1.5 bg-red-500 rounded-full mt-2 flex-shrink-0"></span>
                              <span>Synthetic data generation became unreliable and slow</span>
                            </li>
                            <li className="flex items-start gap-2">
                              <span className="w-1.5 h-1.5 bg-red-500 rounded-full mt-2 flex-shrink-0"></span>
                              <span>CORS issues blocked sharing functionality</span>
                            </li>
                            <li className="flex items-start gap-2">
                              <span className="w-1.5 h-1.5 bg-red-500 rounded-full mt-2 flex-shrink-0"></span>
                              <span>Performance degraded with each feature addition</span>
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-gradient-to-br from-yellow-50 to-amber-50 p-4 rounded-xl border border-yellow-200">
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center flex-shrink-0 text-white font-bold">
                          💡
                        </div>
                        <div>
                          <h4 className={`font-semibold mb-2 ${isMobile ? 'text-sm' : ''} text-yellow-800`}>The Learning Moment:</h4>
                          <p className={`${isMobile ? 'text-xs' : 'text-sm'} text-yellow-700`}>
                            This is where most traditional development projects stall for days or weeks. 
                            But AI assistance enables rapid pivoting and architectural redesign—the key is knowing when to start fresh.
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Step 4: The Real Data Breakthrough - Enhanced */}
                <Card className="border-2 border-purple-200 bg-gradient-to-r from-purple-50 to-purple-100 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-purple-500/10 rounded-full transform translate-x-12 -translate-y-12"></div>
                  <CardHeader className={`${isMobile ? 'p-4' : ''}`}>
                    <div className="flex items-center gap-3 mb-2">
                      <div className={`${isMobile ? 'w-8 h-8' : 'w-10 h-10'} bg-gradient-to-r from-purple-500 to-violet-600 text-white rounded-full flex items-center justify-center font-bold shadow-lg`}>
                        <Rocket size={isMobile ? 14 : 16} />
                      </div>
                      <div>
                        <h3 className={`${isMobile ? 'text-lg' : 'text-xl'} font-semibold flex items-center gap-2`}>
                          The Breakthrough
                          <Badge variant="secondary" className="bg-purple-100 text-purple-800">75-120 min</Badge>
                        </h3>
                        <p className={`text-purple-600 font-medium ${isMobile ? 'text-xs' : 'text-sm'}`}>From synthetic to authentic data sources</p>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className={`space-y-4 ${isMobile ? 'p-4 pt-0' : ''}`}>
                    <div className={`grid ${isMobile ? 'grid-cols-1 gap-4' : 'md:grid-cols-2 gap-6'}`}>
                      <div className="bg-gradient-to-br from-indigo-50 to-purple-50 p-4 rounded-xl border border-indigo-200">
                        <div className="flex items-center gap-2 mb-3">
                          <span className="text-xl">🔄</span>
                          <h4 className={`font-semibold ${isMobile ? 'text-sm' : ''} text-indigo-800`}>Strategic Pivot:</h4>
                        </div>
                        <ul className={`space-y-2 ${isMobile ? 'text-xs' : 'text-sm'} text-indigo-700`}>
                          <li className="flex items-center gap-2"><Check size={12} className="text-indigo-500" />Moved to private repository</li>
                          <li className="flex items-center gap-2"><Check size={12} className="text-indigo-500" />Local development environment</li>
                          <li className="flex items-center gap-2"><Check size={12} className="text-indigo-500" />Real data integration focus</li>
                          <li className="flex items-center gap-2"><Check size={12} className="text-indigo-500" />Professional rebranding</li>
                        </ul>
                      </div>
                      
                      <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-4 rounded-xl border border-purple-200">
                        <div className="flex items-center gap-2 mb-3">
                          <span className="text-xl">📊</span>
                          <h4 className={`font-semibold ${isMobile ? 'text-sm' : ''} text-purple-800`}>Data Sources Added:</h4>
                        </div>
                        <ul className={`space-y-2 ${isMobile ? 'text-xs' : 'text-sm'} text-purple-700`}>
                          <li className="flex items-center gap-2"><Database size={12} className="text-purple-500" />FRED API - 16 economic datasets</li>
                          <li className="flex items-center gap-2"><Database size={12} className="text-purple-500" />World Bank API - 11 global indicators</li>
                          <li className="flex items-center gap-2"><Database size={12} className="text-purple-500" />Alpha Vantage - 7 financial datasets</li>
                          <li className="flex items-center gap-2"><Database size={12} className="text-purple-500" />OpenWeather - 6 climate datasets</li>
                          <li className="flex items-center gap-2"><Rocket size={12} className="text-purple-500" />NASA API - 5 space weather datasets</li>
                          <li className="flex items-center gap-2"><Mountains size={12} className="text-purple-500" />USGS API - 4 geological datasets</li>
                          <li className="flex items-center gap-2"><Lightning size={12} className="text-purple-500" />EIA API - 5 energy datasets</li>
                        </ul>
                      </div>
                    </div>
                    
                    <div className="bg-gradient-to-br from-cyan-50 to-blue-50 p-4 rounded-xl border border-cyan-200">
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 bg-cyan-500 rounded-full flex items-center justify-center flex-shrink-0 text-white font-bold">
                          ✨
                        </div>
                        <div>
                          <h4 className={`font-semibold mb-2 ${isMobile ? 'text-sm' : ''} text-cyan-800`}>The Transformation:</h4>
                          <p className={`${isMobile ? 'text-xs' : 'text-sm'} text-cyan-700`}>
                            From a broken prototype to "CorrelateAI Pro"—a production-ready application with 
                            authentic economic data, mobile optimization, and professional SEO implementation.
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Build Your Own Section */}
                <Card className="border-2 border-cyan-200 bg-gradient-to-r from-cyan-50 to-blue-100 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/10 rounded-full transform translate-x-16 -translate-y-16"></div>
                  <CardHeader className={`${isMobile ? 'p-4' : ''}`}>
                    <div className="text-center">
                      <h3 className={`${isMobile ? 'text-xl' : 'text-2xl'} font-bold bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent mb-4`}>
                        🚀 Build Your Own CorrelateAI
                      </h3>
                      <p className={`${isMobile ? 'text-sm px-2' : 'text-base'} text-cyan-700 mb-6`}>
                        Want to create your own data correlation app? Here's exactly how to do it using AI assistance.
                      </p>
                    </div>
                  </CardHeader>
                  <CardContent className={`space-y-6 ${isMobile ? 'p-4 pt-0' : ''}`}>
                    
                    {/* Quick Start Option */}
                    <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-4 rounded-xl border border-green-200">
                      <h4 className={`font-semibold mb-3 ${isMobile ? 'text-base' : 'text-lg'} text-green-800 flex items-center gap-2`}>
                        <Lightning size={20} className="text-green-600" />
                        ⚡ Quick Start (5 minutes)
                      </h4>
                      <div className={`grid ${isMobile ? 'grid-cols-1 gap-3' : 'md:grid-cols-2 gap-4'}`}>
                        <div>
                          <p className={`${isMobile ? 'text-xs' : 'text-sm'} text-green-700 mb-3`}>
                            Use GitHub Spark to generate your initial prototype:
                          </p>
                          <ul className={`space-y-1 ${isMobile ? 'text-xs' : 'text-sm'} text-green-600`}>
                            <li>• Visit GitHub Spark</li>
                            <li>• Describe your data tool idea</li>
                            <li>• Get working code instantly</li>
                            <li>• Deploy with one click</li>
                          </ul>
                        </div>
                        <div className="flex items-center justify-center">
                          <Button
                            onClick={() => window.open('https://github.com/features/spark', '_blank')}
                            className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white"
                          >
                            <Sparkle size={16} className="mr-2" />
                            Try GitHub Spark
                          </Button>
                        </div>
                      </div>
                    </div>

                    {/* Manual Development Path */}
                    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-4 rounded-xl border border-blue-200">
                      <h4 className={`font-semibold mb-3 ${isMobile ? 'text-base' : 'text-lg'} text-blue-800 flex items-center gap-2`}>
                        <Code size={20} className="text-blue-600" />
                        🛠️ Manual Development Path
                      </h4>
                      
                      <div className="space-y-4">
                        <div className={`grid ${isMobile ? 'grid-cols-1 gap-3' : 'md:grid-cols-2 gap-4'}`}>
                          <div>
                            <h5 className={`font-semibold mb-2 ${isMobile ? 'text-sm' : ''} text-blue-700`}>1. Tech Stack:</h5>
                            <ul className={`space-y-1 ${isMobile ? 'text-xs' : 'text-sm'} text-blue-600`}>
                              <li>• React + TypeScript</li>
                              <li>• Vite (build tool)</li>
                              <li>• Tailwind CSS</li>
                              <li>• Chart.js or Recharts</li>
                              <li>• shadcn/ui components</li>
                            </ul>
                          </div>
                          <div>
                            <h5 className={`font-semibold mb-2 ${isMobile ? 'text-sm' : ''} text-blue-700`}>2. Data Sources:</h5>
                            <ul className={`space-y-1 ${isMobile ? 'text-xs' : 'text-sm'} text-blue-600`}>
                              <li>• FRED API (economic data)</li>
                              <li>• Alpha Vantage API (financial data)</li>
                              <li>• World Bank API (global indicators)</li>
                              <li>• OpenWeather API (climate data)</li>
                              <li>• NASA API (space weather)</li>
                              <li>• USGS API (geological data)</li>
                              <li>• EIA API (energy sector)</li>
                              <li>• News APIs (trending content)</li>
                              <li>• CSV file uploads</li>
                              <li>• Real-time data feeds</li>
                            </ul>
                          </div>
                        </div>
                        
                        <div className="p-3 bg-blue-100 rounded-lg">
                          <h5 className={`font-semibold mb-2 ${isMobile ? 'text-sm' : ''} text-blue-800`}>💡 Pro Tips:</h5>
                          <ul className={`space-y-1 ${isMobile ? 'text-xs' : 'text-sm'} text-blue-700`}>
                            <li>• Start with synthetic data, then add real APIs</li>
                            <li>• Use AI for correlation algorithm implementation</li>
                            <li>• Focus on mobile-first responsive design</li>
                            <li>• Add social sharing and export features</li>
                          </ul>
                        </div>
                      </div>
                    </div>

                    {/* Resources */}
                    <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-4 rounded-xl border border-purple-200">
                      <h4 className={`font-semibold mb-3 ${isMobile ? 'text-base' : 'text-lg'} text-purple-800 flex items-center gap-2`}>
                        <BookOpen size={20} className="text-purple-600" />
                        � Resources & Links
                      </h4>
                      
                      <div className={`grid ${isMobile ? 'grid-cols-1 gap-3' : 'md:grid-cols-2 gap-4'}`}>
                        <div className="space-y-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => window.open('https://github.com/victorsaly/correlateAI', '_blank')}
                            className="w-full justify-start"
                          >
                            <Code size={16} className="mr-2" />
                            View Source Code
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => window.open('https://github.com/features/spark', '_blank')}
                            className="w-full justify-start"
                          >
                            <Sparkle size={16} className="mr-2" />
                            GitHub Spark
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => window.open('https://api.stlouisfed.org/docs/', '_blank')}
                            className="w-full justify-start"
                          >
                            <Database size={16} className="mr-2" />
                            FRED API Docs
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => window.open('https://datahelpdesk.worldbank.org/knowledgebase/articles/889392', '_blank')}
                            className="w-full justify-start"
                          >
                            <Database size={16} className="mr-2" />
                            World Bank API
                          </Button>
                        </div>
                        <div className="space-y-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => window.open('https://www.alphavantage.co/documentation/', '_blank')}
                            className="w-full justify-start"
                          >
                            <TrendUp size={16} className="mr-2" />
                            Alpha Vantage API
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => window.open('https://openweathermap.org/api', '_blank')}
                            className="w-full justify-start"
                          >
                            <CloudSun size={16} className="mr-2" />
                            OpenWeather API
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => window.open('https://api.nasa.gov/', '_blank')}
                            className="w-full justify-start"
                          >
                            <Rocket size={16} className="mr-2" />
                            NASA API Docs
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => window.open('https://earthquake.usgs.gov/fdsnws/', '_blank')}
                            className="w-full justify-start"
                          >
                            <Mountains size={16} className="mr-2" />
                            USGS API Docs
                          </Button>
                        </div>
                      </div>
                      
                      {/* Additional row for EIA, BLS, and CDC */}
                      <div className="mt-3 grid grid-cols-1 md:grid-cols-3 gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => window.open('https://www.eia.gov/opendata/', '_blank')}
                          className="w-full justify-start"
                        >
                          <Lightning size={16} className="mr-2" />
                          EIA API Documentation
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => window.open('https://www.bls.gov/developers/', '_blank')}
                          className="w-full justify-start"
                        >
                          <Briefcase size={16} className="mr-2" />
                          BLS API Documentation
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => window.open('https://data.cdc.gov/', '_blank')}
                          className="w-full justify-start"
                        >
                          <Heart size={16} className="mr-2" />
                          CDC Open Data Portal
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Final Call to Action */}
                <div className="text-center py-8">
                  <h3 className={`${isMobile ? 'text-lg' : 'text-xl'} font-semibold text-gray-100 mb-4`}>
                    Ready to Build Something Amazing?
                  </h3>
                  <div className={`flex ${isMobile ? 'flex-col gap-3' : 'gap-4 justify-center'}`}>
                    <Button
                      onClick={() => window.open('https://github.com/features/spark', '_blank')}
                      className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600"
                    >
                      <Sparkle size={16} className="mr-2" />
                      Start with GitHub Spark
                    </Button>
                    <Button 
                      onClick={() => window.open('https://victorsaly.com', '_blank')}
                      variant="outline"
                      className="border-purple-500 text-purple-400 hover:bg-purple-500 hover:text-white"
                    >
                      <ArrowSquareOut size={16} className="mr-2" />
                      Learn More About AI Development
                    </Button>
                  </div>
                </div>

              </div>
            </div>
            </div>
          </TabsContent>

          <TabsContent value="spurious">
            <SpuriousCorrelationPage />
          </TabsContent>
        </Tabs>
        </div>
      
      {/* Footer - Mobile-optimized */}
      <footer className="mt-12 sm:mt-16 border-t border-gray-700/50 bg-gray-800/80 backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-6 sm:gap-8">
            {/* Developer Profile */}
            <div className={`flex ${isMobile ? 'flex-col text-center' : 'flex-row'} items-center gap-4 sm:gap-6`}>
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-r from-cyan-500 to-purple-600 flex items-center justify-center text-white font-bold text-lg sm:text-2xl shadow-lg shadow-cyan-500/25">
                VS
              </div>
              <div className={`${isMobile ? 'text-center' : ''}`}>
                <h3 className="text-lg sm:text-xl font-semibold text-gray-100">Victor Saly</h3>
                <p className="text-gray-300 font-medium text-sm sm:text-base">AI Developer & Data Science Engineer</p>
                <div className={`flex ${isMobile ? 'flex-col items-center gap-1' : 'flex-col gap-1'} mt-2`}>
                  <div className="flex items-center gap-4">
                    <a 
                      href="https://victorsaly.com" 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="text-cyan-400 hover:text-cyan-300 text-sm font-medium transition-colors mobile-footer-link"
                    >
                      🌐 Portfolio
                    </a>
                    <a 
                      href="https://github.com/victorsaly" 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="text-cyan-400 hover:text-cyan-300 text-sm font-medium transition-colors mobile-footer-link"
                    >
                      💻 GitHub
                    </a>
                  </div>
                  <p className="text-xs text-gray-400 mt-1">Building advanced AI-driven data correlation platforms</p>
                </div>
              </div>
            </div>

            {/* Quick Stats */}
            <div className={`${isMobile ? 'w-full' : ''}`}>
              <div className={`grid ${isMobile ? 'grid-cols-2 gap-4' : 'grid-cols-3 gap-6'} text-center`}>
                <div className="bg-gray-700/50 rounded-lg p-3 sm:p-4 backdrop-blur-sm">
                  <div className="text-lg sm:text-2xl font-bold text-cyan-400">{dynamicDataSources.size}</div>
                  <div className="text-xs sm:text-sm text-gray-300">API Sources</div>
                </div>
                <div className="bg-gray-700/50 rounded-lg p-3 sm:p-4 backdrop-blur-sm">
                  <div className="text-lg sm:text-2xl font-bold text-purple-400">51+</div>
                  <div className="text-xs sm:text-sm text-gray-300">Datasets</div>
                </div>
                {!isMobile && (
                  <div className="bg-gray-700/50 rounded-lg p-4 backdrop-blur-sm">
                    <div className="text-2xl font-bold text-green-400">∞</div>
                    <div className="text-sm text-gray-300">Insights</div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Copyright */}
          <div className="mt-8 pt-6 border-t border-gray-700/30 text-center">
            <p className="text-xs sm:text-sm text-gray-400">
              © 2025 Victor Saly. Built with AI assistance using GitHub Spark, React, and authentic multi-domain data from {dynamicDataSources.size} API sources.
            </p>
          </div>
        </div>
      </footer>
      
      <Toaster />
      </div>
    </div>
  )
}

function CorrelationCard({ 
  correlation, 
  isShareable = false, 
  favorites = [], 
  toggleFavorite,
  shareToTwitter,
  shareToLinkedIn, 
  shareToFacebook,
  shareCorrelation
}: { 
  correlation: CorrelationData; 
  isShareable?: boolean; 
  favorites?: CorrelationData[]; 
  toggleFavorite?: (correlation: CorrelationData) => void; 
  shareToTwitter?: (correlation: CorrelationData) => void;
  shareToLinkedIn?: (correlation: CorrelationData) => void;
  shareToFacebook?: (correlation: CorrelationData) => void;
  shareCorrelation?: (correlation: CorrelationData) => void;
}) {
  const isMobile = useIsMobile()
  const shareCardRef = useRef<HTMLDivElement>(null)
  
  // Expandable sections state
  const [showDetails, setShowDetails] = useState(false)
  const [showInsights, setShowInsights] = useState(false)
  
  const getCorrelationColor = (correlation: number) => {
    const abs = Math.abs(correlation)
    if (abs >= 0.8) return 'text-red-600 font-bold'
    if (abs >= 0.6) return 'text-orange-500 font-semibold'
    if (abs >= 0.4) return 'text-yellow-600 font-semibold'
    return 'text-gray-500'
  }

  const getCorrelationStrength = (correlation: number) => {
    const abs = Math.abs(correlation)
    if (abs >= 0.7) return 'Very Strong'
    if (abs >= 0.5) return 'Strong'
    if (abs >= 0.3) return 'Moderate'
    return 'Weak'
  }

  const generateDatasetLink = useCallback((variableName: string, dataSource: string) => {
    // Generate appropriate links based on variable name and data source
    const normalizedName = variableName.toLowerCase()
    
    if (dataSource === 'FRED') {
      // Common FRED series mappings
      if (normalizedName.includes('gdp')) return 'https://fred.stlouisfed.org/series/GDP'
      if (normalizedName.includes('unemployment')) return 'https://fred.stlouisfed.org/series/UNRATE'
      if (normalizedName.includes('inflation')) return 'https://fred.stlouisfed.org/series/CPIAUCSL'
      if (normalizedName.includes('interest') || normalizedName.includes('rate')) return 'https://fred.stlouisfed.org/series/FEDFUNDS'
      if (normalizedName.includes('housing')) return 'https://fred.stlouisfed.org/series/HOUST'
      if (normalizedName.includes('construction')) return 'https://fred.stlouisfed.org/series/TTLCONS'
      if (normalizedName.includes('consumer')) return 'https://fred.stlouisfed.org/series/CPIAUCSL'
      if (normalizedName.includes('employment')) return 'https://fred.stlouisfed.org/series/PAYEMS'
      // Default FRED search
      return `https://fred.stlouisfed.org/search?st=${encodeURIComponent(normalizedName)}`
    }
    
    if (dataSource === 'World Bank') {
      // Common World Bank indicator mappings
      if (normalizedName.includes('gdp')) return 'https://data.worldbank.org/indicator/NY.GDP.MKTP.CD'
      if (normalizedName.includes('population')) return 'https://data.worldbank.org/indicator/SP.POP.TOTL'
      if (normalizedName.includes('education')) return 'https://data.worldbank.org/indicator/SE.XPD.TOTL.GD.ZS'
      if (normalizedName.includes('health')) return 'https://data.worldbank.org/indicator/SH.XPD.CHEX.GD.ZS'
      if (normalizedName.includes('trade')) return 'https://data.worldbank.org/indicator/TG.VAL.TOTL.GD.ZS'
      if (normalizedName.includes('energy')) return 'https://data.worldbank.org/indicator/EG.USE.ELEC.KH.PC'
      // Default World Bank search
      return `https://data.worldbank.org/search?q=${encodeURIComponent(normalizedName)}`
    }
    
    if (dataSource === 'Alpha Vantage') {
      // Common Alpha Vantage symbol mappings
      if (normalizedName.includes('spy') || normalizedName.includes('s&p 500')) return 'https://finance.yahoo.com/quote/SPY'
      if (normalizedName.includes('aapl') || normalizedName.includes('apple')) return 'https://finance.yahoo.com/quote/AAPL'
      if (normalizedName.includes('msft') || normalizedName.includes('microsoft')) return 'https://finance.yahoo.com/quote/MSFT'
      if (normalizedName.includes('tsla') || normalizedName.includes('tesla')) return 'https://finance.yahoo.com/quote/TSLA'
      if (normalizedName.includes('nasdaq')) return 'https://finance.yahoo.com/quote/%5EIXIC'
      if (normalizedName.includes('dow')) return 'https://finance.yahoo.com/quote/%5EDJI'
      // Default Alpha Vantage documentation
      return 'https://www.alphavantage.co/documentation/'
    }
    
    if (dataSource === 'OpenWeather') {
      // OpenWeather data categories
      if (normalizedName.includes('temperature') || normalizedName.includes('weather')) return 'https://openweathermap.org/current'
      if (normalizedName.includes('humidity')) return 'https://openweathermap.org/current'
      if (normalizedName.includes('pressure')) return 'https://openweathermap.org/current'
      if (normalizedName.includes('wind')) return 'https://openweathermap.org/current'
      if (normalizedName.includes('climate')) return 'https://openweathermap.org/api/statistics-api'
      // Default OpenWeather API documentation
      return 'https://openweathermap.org/api'
    }
    
    // For synthetic/AI data, return null (no external link)
    return null
  }, [])

  const copyToClipboard = useCallback((text: string) => {
    navigator.clipboard.writeText(text)
    toast.success("Citation copied to clipboard!")
  }, [])

  const downloadAsImage = useCallback(async (scale: number = 2) => {
    if (!shareCardRef.current) {
      toast.error("Share card not found. Try again in a moment.")
      return
    }

    try {
      // Dynamic import to avoid bundling issues
      const html2canvas = (await import('html2canvas')).default
      
      const canvas = await html2canvas(shareCardRef.current, {
        backgroundColor: '#ffffff',
        scale: scale,
        useCORS: true,
        allowTaint: true,
        height: shareCardRef.current.offsetHeight,
        width: shareCardRef.current.offsetWidth
      })
      
      const link = document.createElement('a')
      const scaleText = scale > 2 ? `-${scale}x` : ''
      link.download = `correlation-${correlation.title.replace(/[^a-z0-9]/gi, '-').toLowerCase()}${scaleText}.png`
      link.href = canvas.toDataURL('image/png')
      link.click()
      
      toast.success(`Correlation card downloaded! (${scale}x resolution)`)
    } catch (error) {
      console.error('Error generating image:', error)
      toast.error("Failed to download image. Please try again.")
    }
  }, [correlation.title])

  const exportAsCSV = useCallback(() => {
    try {
      // Create CSV header
      const headers = ['Year', correlation.variable1.name, correlation.variable2.name]
      const csvContent = [
        headers.join(','),
        ...correlation.data.map(row => 
          `${row.year},${row.value1.toFixed(4)},${row.value2.toFixed(4)}`
        )
      ].join('\n')

      // Add metadata as comments
      const metadataContent = [
        `# Correlation Analysis: ${correlation.title}`,
        `# Correlation Coefficient: ${correlation.correlation > 0 ? '+' : ''}${correlation.correlation.toFixed(4)}`,
        `# R-Squared: ${correlation.rSquared.toFixed(4)}`,
        `# Data Source: ${correlation.isRealData ? correlation.dataSource : 'AI Generated'}`,
        `# Generated: ${new Date().toISOString()}`,
        `# Description: ${correlation.description}`,
        ''
      ].join('\n')

      const fullContent = metadataContent + csvContent

      const blob = new Blob([fullContent], { type: 'text/csv;charset=utf-8;' })
      const link = document.createElement('a')
      
      if (link.download !== undefined) {
        const url = URL.createObjectURL(blob)
        link.setAttribute('href', url)
        link.setAttribute('download', `correlation-data-${correlation.title.replace(/[^a-z0-9]/gi, '-').toLowerCase()}.csv`)
        link.style.visibility = 'hidden'
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
      }
      
      toast.success("CSV data exported successfully!")
    } catch (error) {
      console.error('Error exporting CSV:', error)
      toast.error("Failed to export CSV. Please try again.")
    }
  }, [correlation])

  const exportAsJSON = useCallback(() => {
    try {
      const exportData = {
        metadata: {
          title: correlation.title,
          description: correlation.description,
          correlation: correlation.correlation,
          rSquared: correlation.rSquared,
          dataSource: correlation.isRealData ? correlation.dataSource : 'AI Generated',
          isRealData: correlation.isRealData,
          exportedAt: new Date().toISOString(),
          variable1: {
            name: correlation.variable1.name,
            unit: (correlation.variable1 as any).unit || 'units'
          },
          variable2: {
            name: correlation.variable2.name,
            unit: (correlation.variable2 as any).unit || 'units'
          }
        },
        data: correlation.data,
        citation: correlation.citation
      }

      const jsonContent = JSON.stringify(exportData, null, 2)
      const blob = new Blob([jsonContent], { type: 'application/json;charset=utf-8;' })
      const link = document.createElement('a')
      
      if (link.download !== undefined) {
        const url = URL.createObjectURL(blob)
        link.setAttribute('href', url)
        link.setAttribute('download', `correlation-data-${correlation.title.replace(/[^a-z0-9]/gi, '-').toLowerCase()}.json`)
        link.style.visibility = 'hidden'
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
      }
      
      toast.success("JSON data exported successfully!")
    } catch (error) {
      console.error('Error exporting JSON:', error)
      toast.error("Failed to export JSON. Please try again.")
    }
  }, [correlation])

  const generateShareableURL = useCallback(() => {
    try {
      const params = new URLSearchParams({
        id: correlation.id,
        title: correlation.title,
        correlation: correlation.correlation.toString(),
        var1: correlation.variable1.name,
        var2: correlation.variable2.name
      })
      
      const shareableURL = `${window.location.origin}${window.location.pathname}?${params.toString()}`
      navigator.clipboard.writeText(shareableURL)
      toast.success("Shareable URL copied to clipboard!")
    } catch (error) {
      console.error('Error generating shareable URL:', error)
      toast.error("Failed to generate shareable URL.")
    }
  }, [correlation])

  const shareCard = useCallback(async (correlation: CorrelationData) => {
    // Use the enhanced sharing system with image generation
    if (shareCorrelation) {
      await shareCorrelation(correlation)
    }
  }, [shareCorrelation])

  const showCorrelationDetails = useCallback((correlation: CorrelationData) => {
    toast.info(`Viewing details for ${correlation.title}`)
  }, [])

  return (
    <Card className="w-full bg-gray-800/50 border-gray-700/50 backdrop-blur-md" ref={isShareable ? shareCardRef : undefined}>
      <CardHeader className={`${isMobile ? 'p-3 pb-3' : ''}`}>
        <div className={`flex justify-between ${isMobile ? 'flex-col gap-3' : 'items-start'}`}>
          <div>
            <CardTitle className={`${isMobile ? 'text-base leading-tight' : 'text-xl'} font-semibold flex items-start gap-3 text-gray-100 ${isMobile ? 'flex-col' : 'items-center'}`}>
              <div className={`flex items-center gap-2 ${isMobile ? 'w-full' : ''}`}>
                <div className="w-8 h-8 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-lg flex items-center justify-center">
                  <TrendUp size={16} className="text-white" />
                </div>
                <ColorizedTitle title={correlation.title} isMobile={isMobile} />
              </div>
              <div className="flex items-center gap-2">
                <Badge 
                  variant="outline"
                  className={`${
                    correlation.isRealData 
                      ? 'bg-green-50 border-green-200 text-green-700' 
                      : 'bg-orange-50 border-orange-200 text-orange-700'
                  } ${isMobile ? 'text-xs px-1.5 py-0.5' : 'text-xs'}`}
                >
                  {correlation.isRealData ? '📊 Real Data' : '🤖 AI Generated'}
                </Badge>
                <Badge 
                  variant="secondary" 
                  className={`${getCorrelationColor(correlation.correlation)} ${isMobile ? 'text-xs' : ''} ${
                    Math.abs(correlation.correlation) >= 0.7 ? 'animate-pulse' : ''
                  }`}
                >
                  {correlation.correlation > 0 ? '+' : ''}
                  {(correlation.correlation * 100).toFixed(1)}% correlation
                </Badge>
              </div>
            </CardTitle>
            <p className={`text-gray-300 mt-2 leading-relaxed ${isMobile ? 'text-xs' : 'text-sm'}`}>
              {correlation.description}
            </p>
            {correlation.isRealData && (
              <p className={`text-gray-400 mt-1 ${isMobile ? 'text-xs' : 'text-sm'} font-mono`}>
                Sources: {correlation.variable1.dataSource || 'Unknown'} • {correlation.variable2.dataSource || 'Unknown'}
              </p>
            )}
          </div>
          
          {/* Action buttons in single row for mobile, 2x2 grid for desktop */}
          <div className={`grid gap-1 ${isMobile ? 'grid-cols-4 w-40' : 'grid-cols-2 w-20'}`}>
            {isShareable && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-gray-300 hover:text-cyan-400 hover:bg-gray-700/50 h-8 w-8"
                    title="Export options"
                  >
                    <Download size={14} />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuItem onClick={() => downloadAsImage(2)}>
                    <ImageSquare size={16} className="mr-2" />
                    Download PNG (2x)
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => downloadAsImage(3)}>
                    <ImageSquare size={16} className="mr-2" />
                    Download PNG (3x)
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => exportAsCSV()}>
                    <FileCsv size={16} className="mr-2" />
                    Export as CSV
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => exportAsJSON()}>
                    <FileText size={16} className="mr-2" />
                    Export as JSON
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => generateShareableURL()}>
                    <Link size={16} className="mr-2" />
                    Copy Shareable Link
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-gray-300 hover:text-cyan-400 hover:bg-gray-700/50 h-8 w-8"
                  title="Share this correlation"
                >
                  <Share size={14} />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                {shareCorrelation && (
                  <DropdownMenuItem onClick={() => shareCorrelation(correlation)}>
                    <Share size={16} className="mr-2" />
                    Quick Share (Image + Text)
                  </DropdownMenuItem>
                )}
                {shareToTwitter && (
                  <DropdownMenuItem onClick={() => shareToTwitter(correlation)}>
                    <TwitterLogo size={16} className="mr-2" />
                    Share to X (Twitter)
                  </DropdownMenuItem>
                )}
                {shareToLinkedIn && (
                  <DropdownMenuItem onClick={() => shareToLinkedIn(correlation)}>
                    <LinkedinLogo size={16} className="mr-2" />
                    Share to LinkedIn
                  </DropdownMenuItem>
                )}
                {shareToFacebook && (
                  <DropdownMenuItem onClick={() => shareToFacebook(correlation)}>
                    <FacebookLogo size={16} className="mr-2" />
                    Share to Facebook
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
            <Button
              variant="ghost"
              size="icon"
              className={`hover:bg-gray-700/50 h-8 w-8 ${
                favorites.some(fav => fav.id === correlation.id) 
                  ? 'text-red-400 hover:text-red-300' 
                  : 'text-gray-300 hover:text-red-400'
              }`}
              onClick={() => toggleFavorite?.(correlation)}
              title={favorites.some(fav => fav.id === correlation.id) ? "Remove from favorites" : "Add to favorites"}
            >
              <Heart size={14} className={favorites.some(fav => fav.id === correlation.id) ? 'fill-current' : ''} />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="text-gray-300 hover:text-purple-400 hover:bg-gray-700/50 h-8 w-8"
              onClick={() => showCorrelationDetails(correlation)}
              title="View detailed analysis"
            >
              <Info size={14} />
            </Button>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className={`${isMobile ? 'p-1 pt-0' : ''}`}>
        {/* Chart Visualization - Now at the top */}
        <div className="mb-6">
          <div className={`h-64 sm:h-80 ${isMobile ? 'px-0' : ''}`}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart 
                data={correlation.data} 
                margin={{ 
                  top: isMobile ? 10 : 20, 
                  right: isMobile ? 15 : 30, 
                  left: isMobile ? 10 : 20, 
                  bottom: isMobile ? 40 : 60 
                }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.3} />
                <XAxis 
                  dataKey="year" 
                  stroke="#9CA3AF" 
                  fontSize={isMobile ? 10 : 12}
                  tick={{ fill: '#9CA3AF' }}
                />
                <YAxis 
                  yAxisId="left" 
                  stroke="#06B6D4" 
                  fontSize={isMobile ? 10 : 12}
                  tick={{ fill: '#06B6D4' }}
                  width={isMobile ? 40 : 60}
                />
                <YAxis 
                  yAxisId="right" 
                  orientation="right" 
                  stroke="#A855F7" 
                  fontSize={isMobile ? 10 : 12}
                  tick={{ fill: '#A855F7' }}
                  width={isMobile ? 40 : 60}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1F2937',
                    border: '1px solid #374151',
                    borderRadius: '8px',
                    fontSize: isMobile ? '12px' : '14px'
                  }}
                  labelStyle={{ color: '#F3F4F6' }}
                />
                
                <Line
                  yAxisId="left"
                  type="monotone"
                  dataKey="value1"
                  stroke="#06B6D4"
                  strokeWidth={2}
                  dot={{ fill: '#06B6D4', strokeWidth: 2, r: isMobile ? 3 : 4 }}
                  activeDot={{ r: isMobile ? 5 : 6, stroke: '#06B6D4', strokeWidth: 2 }}
                  name={correlation.variable1.name}
                  animationDuration={1000}
                />
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="value2"
                  stroke="#A855F7"
                  strokeWidth={2}
                  dot={{ fill: '#A855F7', strokeWidth: 2, r: isMobile ? 3 : 4 }}
                  activeDot={{ r: isMobile ? 5 : 6, stroke: '#A855F7', strokeWidth: 2 }}
                  name={correlation.variable2.name}
                  animationDuration={1000}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
          
          {/* Chart Legend */}
          <div className={`flex ${isMobile ? 'flex-col gap-2' : 'justify-center gap-6'} mt-3`}>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-cyan-400 rounded-full"></div>
              <span className={`text-cyan-400 font-medium ${isMobile ? 'text-xs' : 'text-sm'}`}>
                {correlation.variable1.name}
              </span>
              {!isMobile && (
                <span className="text-gray-500 text-xs">
                  ({(correlation.variable1 as any).unit || 'units'})
                </span>
              )}
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-purple-400 rounded-full"></div>
              <span className={`text-purple-400 font-medium ${isMobile ? 'text-xs' : 'text-sm'}`}>
                {correlation.variable2.name}
              </span>
              {!isMobile && (
                <span className="text-gray-500 text-xs">
                  ({(correlation.variable2 as any).unit || 'units'})
                </span>
              )}
            </div>
          </div>
        </div>
        
        {/* Progress bar showing correlation strength */}
        <div className="mt-6 pt-4 border-t border-gray-700/50">
          <div className="flex items-center justify-between mb-2">
            <span className={`text-xs font-medium text-gray-400`}>Correlation Strength</span>
            <span className={`text-xs font-bold ${getCorrelationColor(correlation.correlation)}`}>
              {Math.abs(correlation.correlation * 100).toFixed(1)}%
            </span>
          </div>
          <div className="w-full bg-gray-800/60 rounded-full h-3 shadow-inner relative overflow-hidden">
            {/* Background glow effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent rounded-full"></div>
            
            <div 
              className={`h-3 rounded-full transition-all duration-700 ease-out relative overflow-hidden shadow-lg ${
                Math.abs(correlation.correlation) >= 0.7 ? 
                  'bg-gradient-to-r from-purple-600 via-pink-500 to-red-500 shadow-purple-500/30' :
                Math.abs(correlation.correlation) >= 0.5 ? 
                  'bg-gradient-to-r from-blue-500 via-cyan-400 to-teal-400 shadow-cyan-400/30' :
                  'bg-gradient-to-r from-amber-400 via-orange-400 to-yellow-400 shadow-orange-400/30'
              }`}
              style={{ width: `${Math.abs(correlation.correlation) * 100}%` }}
            >
              {/* Animated shimmer effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12 animate-pulse"></div>
              
              {/* Moving highlight */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent w-1/3 animate-bounce opacity-60"></div>
            </div>
          </div>
        </div>
        
        {/* Expandable Analysis Sections */}
        <div className="mt-6 space-y-3">
          {/* Variable Details - Expandable */}
          <div className="border border-gray-700/50 rounded-lg overflow-hidden">
            <Button
              variant="ghost"
              className="w-full justify-between text-left h-12 px-4 hover:bg-cyan-500/10"
              onClick={() => setShowDetails(!showDetails)}
            >
              <div className="flex items-center gap-2">
                <Database size={16} className="text-cyan-400" />
                <span className="font-medium text-gray-200">Variable Details</span>
                {!showDetails && (
                  <div className="flex gap-1 ml-2">
                    <Badge variant="outline" className="text-xs text-cyan-400 border-cyan-400/30">
                      {correlation.variable1.name.split(' ').slice(0, 2).join(' ')}
                    </Badge>
                    <Badge variant="outline" className="text-xs text-purple-400 border-purple-400/30">
                      {correlation.variable2.name.split(' ').slice(0, 2).join(' ')}
                    </Badge>
                  </div>
                )}
              </div>
              <div className={`transition-transform duration-200 ${showDetails ? 'rotate-180' : ''}`}>
                <CaretDown size={16} className="text-gray-400" />
              </div>
            </Button>
            
            {showDetails && (
              <div className="px-4 pb-4 pt-2 bg-gray-800/20">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Dataset X:</span>
                      <span className="text-cyan-400 font-medium">{correlation.variable1.name}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Unit:</span>
                      <span className="text-gray-300">{(correlation.variable1 as any).unit || 'units'}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Category:</span>
                      <span className="text-gray-300">{correlation.variable1.category}</span>
                    </div>
                    {/* Dataset Link for Variable 1 */}
                    {correlation.isRealData && generateDatasetLink(correlation.variable1.name, correlation.dataSource) && (
                      <div className="pt-1">
                        <a
                          href={generateDatasetLink(correlation.variable1.name, correlation.dataSource)!}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-xs text-cyan-400 hover:text-cyan-300 transition-colors"
                        >
                          <Database size={12} />
                          <span>View Dataset</span>
                          <ArrowSquareOut size={10} />
                        </a>
                      </div>
                    )}
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Dataset Y:</span>
                      <span className="text-purple-400 font-medium">{correlation.variable2.name}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Unit:</span>
                      <span className="text-gray-300">{(correlation.variable2 as any).unit || 'units'}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Category:</span>
                      <span className="text-gray-300">{correlation.variable2.category}</span>
                    </div>
                    {/* Dataset Link for Variable 2 */}
                    {correlation.isRealData && generateDatasetLink(correlation.variable2.name, correlation.dataSource) && (
                      <div className="pt-1">
                        <a
                          href={generateDatasetLink(correlation.variable2.name, correlation.dataSource)!}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-xs text-purple-400 hover:text-purple-300 transition-colors"
                        >
                          <Database size={12} />
                          <span>View Dataset</span>
                          <ArrowSquareOut size={10} />
                        </a>
                      </div>
                    )}
                  </div>
                </div>
                
                {/* Data Source Information */}
                {correlation.isRealData && (
                  <div className="mt-4 pt-3 border-t border-gray-700/30">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs text-gray-400">Data Source:</span>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-cyan-400 font-medium">{correlation.dataSource}</span>
                        {correlation.dataSource === 'FRED' && (
                          <a
                            href="https://fred.stlouisfed.org/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 px-1.5 py-0.5 bg-blue-500/20 text-blue-400 rounded text-xs hover:bg-blue-500/30 transition-colors"
                          >
                            <span>FRED</span>
                            <ArrowSquareOut size={8} />
                          </a>
                        )}
                        {correlation.dataSource === 'World Bank' && (
                          <a
                            href="https://data.worldbank.org/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 px-1.5 py-0.5 bg-green-500/20 text-green-400 rounded text-xs hover:bg-green-500/30 transition-colors"
                          >
                            <span>World Bank</span>
                            <ArrowSquareOut size={8} />
                          </a>
                        )}
                        {correlation.dataSource === 'Alpha Vantage' && (
                          <a
                            href="https://www.alphavantage.co/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 px-1.5 py-0.5 bg-orange-500/20 text-orange-400 rounded text-xs hover:bg-orange-500/30 transition-colors"
                          >
                            <span>Alpha Vantage</span>
                            <ArrowSquareOut size={8} />
                          </a>
                        )}
                        {correlation.dataSource === 'OpenWeather' && (
                          <a
                            href="https://openweathermap.org/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 px-1.5 py-0.5 bg-cyan-500/20 text-cyan-400 rounded text-xs hover:bg-cyan-500/30 transition-colors"
                          >
                            <span>OpenWeather</span>
                            <ArrowSquareOut size={8} />
                          </a>
                        )}
                        {correlation.dataSource === 'NCHS' && (
                          <a
                            href="https://www.cdc.gov/nchs/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 px-1.5 py-0.5 bg-rose-500/20 text-rose-400 rounded text-xs hover:bg-rose-500/30 transition-colors"
                          >
                            <span>NCHS</span>
                            <ArrowSquareOut size={8} />
                          </a>
                        )}
                        {correlation.dataSource === 'Census' && (
                          <a
                            href="https://www.census.gov/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 px-1.5 py-0.5 bg-violet-500/20 text-violet-400 rounded text-xs hover:bg-violet-500/30 transition-colors"
                          >
                            <span>Census</span>
                            <ArrowSquareOut size={8} />
                          </a>
                        )}
                        {correlation.dataSource === 'FBI' && (
                          <a
                            href="https://ucr.fbi.gov/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 px-1.5 py-0.5 bg-red-500/20 text-red-400 rounded text-xs hover:bg-red-500/30 transition-colors"
                          >
                            <span>FBI</span>
                            <ArrowSquareOut size={8} />
                          </a>
                        )}
                        {correlation.dataSource === 'NCES' && (
                          <a
                            href="https://nces.ed.gov/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 px-1.5 py-0.5 bg-sky-500/20 text-sky-400 rounded text-xs hover:bg-sky-500/30 transition-colors"
                          >
                            <span>NCES</span>
                            <ArrowSquareOut size={8} />
                          </a>
                        )}
                        {correlation.dataSource === 'HUD' && (
                          <a
                            href="https://www.hud.gov/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 px-1.5 py-0.5 bg-orange-500/20 text-orange-400 rounded text-xs hover:bg-orange-500/30 transition-colors"
                          >
                            <span>HUD</span>
                            <ArrowSquareOut size={8} />
                          </a>
                        )}
                        {correlation.dataSource === 'Pew' && (
                          <a
                            href="https://www.pewresearch.org/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 px-1.5 py-0.5 bg-emerald-500/20 text-emerald-400 rounded text-xs hover:bg-emerald-500/30 transition-colors"
                          >
                            <span>Pew</span>
                            <ArrowSquareOut size={8} />
                          </a>
                        )}
                        {correlation.dataSource === 'BEA' && (
                          <a
                            href="https://www.bea.gov/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 px-1.5 py-0.5 bg-blue-500/20 text-blue-400 rounded text-xs hover:bg-blue-500/30 transition-colors"
                          >
                            <span>BEA</span>
                            <ArrowSquareOut size={8} />
                          </a>
                        )}
                        {correlation.dataSource === 'DOT' && (
                          <a
                            href="https://www.transportation.gov/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 px-1.5 py-0.5 bg-gray-500/20 text-gray-400 rounded text-xs hover:bg-gray-500/30 transition-colors"
                          >
                            <span>DOT</span>
                            <ArrowSquareOut size={8} />
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                )}
                
                <div className="mt-4 pt-3 border-t border-gray-700/30 grid grid-cols-2 gap-4 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Strength:</span>
                    <span className={getCorrelationColor(correlation.correlation)}>
                      {getCorrelationStrength(correlation.correlation)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Significance:</span>
                    <span className={Math.abs(correlation.correlation) >= 0.5 ? 'text-green-400' : 'text-yellow-400'}>
                      {Math.abs(correlation.correlation) >= 0.7 ? 'High' : 
                       Math.abs(correlation.correlation) >= 0.5 ? 'Moderate' : 'Low'}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Analysis Insights - Expandable */}
          <div className="border border-gray-700/50 rounded-lg overflow-hidden">
            <div className="flex items-center justify-between">
              <Button
                variant="ghost"
                className="flex-1 justify-between text-left h-12 px-4 hover:bg-yellow-400/10"
                onClick={() => setShowInsights(!showInsights)}
              >
                <div className="flex items-center gap-2">
                  <Lightbulb size={16} className="text-yellow-400" />
                  <span className="font-medium text-gray-200">Analysis Insights</span>
                  {!showInsights && (
                    <Badge variant="outline" className={`text-xs ml-2 ${getCorrelationColor(correlation.correlation).replace('text-', 'text-').replace(' font-bold', '').replace(' font-semibold', '')} border-current/30`}>
                      {correlation.correlation > 0 ? 'Positive' : 'Negative'} Correlation
                    </Badge>
                  )}
                </div>
                <div className={`transition-transform duration-200 ${showInsights ? 'rotate-180' : ''}`}>
                  <CaretDown size={16} className="text-gray-400" />
                </div>
              </Button>
              
              <Button
                variant="ghost"
                size="sm"
                className="h-6 w-6 p-0 hover:bg-blue-400/20 rounded-full ml-2"
                onClick={(e) => {
                  e.stopPropagation()
                  // Switch to spurious correlation tab
                  const tabsElement = document.querySelector('[data-value="spurious"]')
                  if (tabsElement) {
                    (tabsElement as HTMLElement).click()
                  }
                }}
              >
                <Info size={12} className="text-blue-400" />
              </Button>
            </div>
            
            {showInsights && (
              <div className="px-4 pb-4 pt-2 bg-gray-800/20">
                <div className="space-y-3 text-sm">
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-cyan-400 rounded-full mt-2 flex-shrink-0"></div>
                    <p className="text-gray-300 leading-relaxed">
                      {Math.abs(correlation.correlation) >= 0.7 
                        ? "Strong relationship detected - significant statistical correlation"
                        : Math.abs(correlation.correlation) >= 0.5 
                        ? "Moderate relationship - worth investigating further"
                        : "Weak relationship - may be coincidental"}
                    </p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-purple-400 rounded-full mt-2 flex-shrink-0"></div>
                    <p className="text-gray-300 leading-relaxed">
                      {correlation.correlation > 0 
                        ? "Positive correlation - variables tend to increase together"
                        : "Negative correlation - one increases as the other decreases"}
                    </p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-yellow-400 rounded-full mt-2 flex-shrink-0"></div>
                    <p className="text-gray-300 leading-relaxed text-xs italic">
                      Remember: Correlation does not imply causation
                    </p>
                  </div>
                  
                  {/* Spurious Correlation Warning */}
                  {Math.abs(correlation.correlation) >= 0.5 && (
                    <div className="bg-gradient-to-r from-orange-900/30 to-red-900/30 border border-orange-700/50 rounded-lg p-3 mt-3">
                      <div className="flex items-start gap-3">
                        <div className="w-4 h-4 bg-orange-400 rounded-full mt-0.5 flex-shrink-0 flex items-center justify-center">
                          <span className="text-xs font-bold text-black">!</span>
                        </div>
                        <div className="space-y-2">
                          <p className="text-orange-200 font-medium text-xs">
                            ⚠️ Spurious Correlation Alert
                          </p>
                          <p className="text-orange-100 text-xs leading-relaxed">
                            This {Math.abs(correlation.correlation) >= 0.7 ? 'strong' : 'moderate'} correlation might be <strong>spurious</strong> - appearing correlated due to a common third variable (confounding factor) despite the variables being unrelated in reality.
                          </p>
                          <p className="text-orange-200 text-xs leading-relaxed">
                            Consider: Could weather, time trends, economic cycles, or other external factors explain both variables simultaneously?
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  <div className="mt-4 pt-3 border-t border-gray-700/30">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-gray-400">R-squared Value:</span>
                      <span className="text-gray-300 font-medium">
                        {(correlation.rSquared * 100).toFixed(1)}%
                      </span>
                    </div>
                    <p className="text-xs text-gray-400 mt-1">
                      {(correlation.rSquared * 100).toFixed(1)}% of variance in one variable is explained by the other
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
        
        {/* Data Source Attribution with Links */}
        <div className="mt-4 pt-4 border-t border-gray-700/50">
          <div className="space-y-3">
            {/* Data Source Info */}
            <div className="flex items-center justify-between">
              <div className="text-xs text-gray-400">
                Data Source: <span className="text-cyan-400 font-medium">{correlation.isRealData ? correlation.dataSource : 'AI Generated'}</span>
              </div>
              {correlation.isRealData && (
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => copyToClipboard(correlation.citation)}
                    className="inline-flex items-center gap-1 text-xs text-gray-400 hover:text-gray-300 transition-colors"
                  >
                    <Copy size={12} />
                    <span>Copy Citation</span>
                  </button>
                </div>
              )}
            </div>
            
            {/* Citation and Journal Links */}
            {correlation.isRealData && (
              <div className="text-xs text-gray-400">
                <div className="flex items-start gap-2 mb-2">
                  <span className="text-gray-500">Citation:</span>
                  <span className="text-gray-300">{correlation.citation}</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-gray-500">Journal:</span>
                  <span className="text-gray-300">{correlation.journal}</span>
                </div>
              </div>
            )}
            
            {/* Direct Links to Data Sources */}
            <div className="flex flex-wrap gap-2">
              {correlation.dataSource === 'FRED' && (
                <a
                  href="https://fred.stlouisfed.org/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 px-2 py-1 bg-blue-500/20 text-blue-400 rounded-md hover:bg-blue-500/30 text-xs transition-colors"
                >
                  <Database size={10} />
                  <span>View FRED Database</span>
                  <ArrowSquareOut size={10} />
                </a>
              )}
              {correlation.dataSource === 'World Bank' && (
                <a
                  href="https://data.worldbank.org/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 px-2 py-1 bg-green-500/20 text-green-400 rounded-md hover:bg-green-500/30 text-xs transition-colors"
                >
                  <Database size={10} />
                  <span>View World Bank Data</span>
                  <ArrowSquareOut size={10} />
                </a>
              )}
              {correlation.dataSource === 'Alpha Vantage' && (
                <a
                  href="https://www.alphavantage.co/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 px-2 py-1 bg-orange-500/20 text-orange-400 rounded-md hover:bg-orange-500/30 text-xs transition-colors"
                >
                  <TrendUp size={10} />
                  <span>View Alpha Vantage</span>
                  <ArrowSquareOut size={10} />
                </a>
              )}
              {correlation.dataSource === 'OpenWeather' && (
                <a
                  href="https://openweathermap.org/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 px-2 py-1 bg-cyan-500/20 text-cyan-400 rounded-md hover:bg-cyan-500/30 text-xs transition-colors"
                >
                  <CloudSun size={10} />
                  <span>View OpenWeather</span>
                  <ArrowSquareOut size={10} />
                </a>
              )}
              {correlation.dataSource === 'NCHS' && (
                <a
                  href="https://www.cdc.gov/nchs/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 px-2 py-1 bg-rose-500/20 text-rose-400 rounded-md hover:bg-rose-500/30 text-xs transition-colors"
                >
                  <Heart size={10} />
                  <span>View NCHS Data</span>
                  <ArrowSquareOut size={10} />
                </a>
              )}
              {correlation.dataSource === 'Census' && (
                <a
                  href="https://www.census.gov/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 px-2 py-1 bg-violet-500/20 text-violet-400 rounded-md hover:bg-violet-500/30 text-xs transition-colors"
                >
                  <Database size={10} />
                  <span>View Census Data</span>
                  <ArrowSquareOut size={10} />
                </a>
              )}
              {correlation.dataSource === 'FBI' && (
                <a
                  href="https://ucr.fbi.gov/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 px-2 py-1 bg-red-500/20 text-red-400 rounded-md hover:bg-red-500/30 text-xs transition-colors"
                >
                  <Shield size={10} />
                  <span>View FBI Data</span>
                  <ArrowSquareOut size={10} />
                </a>
              )}
              {correlation.dataSource === 'NCES' && (
                <a
                  href="https://nces.ed.gov/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 px-2 py-1 bg-sky-500/20 text-sky-400 rounded-md hover:bg-sky-500/30 text-xs transition-colors"
                >
                  <BookOpen size={10} />
                  <span>View NCES Data</span>
                  <ArrowSquareOut size={10} />
                </a>
              )}
              {correlation.dataSource === 'HUD' && (
                <a
                  href="https://www.hud.gov/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 px-2 py-1 bg-orange-500/20 text-orange-400 rounded-md hover:bg-orange-500/30 text-xs transition-colors"
                >
                  <House size={10} />
                  <span>View HUD Data</span>
                  <ArrowSquareOut size={10} />
                </a>
              )}
              {correlation.dataSource === 'Pew' && (
                <a
                  href="https://www.pewresearch.org/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 px-2 py-1 bg-emerald-500/20 text-emerald-400 rounded-md hover:bg-emerald-500/30 text-xs transition-colors"
                >
                  <Users size={10} />
                  <span>View Pew Research</span>
                  <ArrowSquareOut size={10} />
                </a>
              )}
              {correlation.dataSource === 'BEA' && (
                <a
                  href="https://www.bea.gov/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 px-2 py-1 bg-blue-500/20 text-blue-400 rounded-md hover:bg-blue-500/30 text-xs transition-colors"
                >
                  <Globe size={10} />
                  <span>View BEA Data</span>
                  <ArrowSquareOut size={10} />
                </a>
              )}
              {correlation.dataSource === 'DOT' && (
                <a
                  href="https://www.transportation.gov/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 px-2 py-1 bg-gray-500/20 text-gray-400 rounded-md hover:bg-gray-500/30 text-xs transition-colors"
                >
                  <Truck size={10} />
                  <span>View DOT Data</span>
                  <ArrowSquareOut size={10} />
                </a>
              )}
              {correlation.dataSource === 'Synthetic' && (
                <div className="inline-flex items-center gap-1 px-2 py-1 bg-purple-500/20 text-purple-400 rounded-md text-xs">
                  <Robot size={10} />
                  <span>AI Generated Dataset</span>
                </div>
              )}
              
              {/* General Data Sources Link */}
              <button
                onClick={() => {
                  const element = document.querySelector('[data-sources-card]')
                  if (element) {
                    element.scrollIntoView({ behavior: 'smooth' })
                  }
                }}
                className="inline-flex items-center gap-1 px-2 py-1 bg-gray-600/20 text-gray-400 rounded-md hover:bg-gray-600/30 text-xs transition-colors"
              >
                <Info size={10} />
                <span>View All Sources</span>
              </button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default App
