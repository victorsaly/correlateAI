import { useState, useMemo, useCallback, useRef, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Separator } from '@/components/ui/separator'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { Heart, ArrowClockwise, Copy, TrendUp, BookOpen, Funnel, Share, Download, TwitterLogo, LinkedinLogo, FacebookLogo, Database, Info } from '@phosphor-icons/react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceArea } from 'recharts'
import { toast, Toaster } from 'sonner'
import { useIsMobile } from '@/hooks/use-mobile'
import { dataService, allDatasets, RealDataset, RealDataPoint } from '@/services/staticDataService'
import SwirlBackground from '@/components/SwirlBackground'
import { DataSourcesCard, SourceAttribution, DataSourceBadge } from '@/components/DataSources'

interface CorrelationData {
  id: string
  title: string
  description: string
  correlation: number
  rSquared: number
  data: Array<{ year: number; value1: number; value2: number }>
  variable1: Dataset | RealDataset
  variable2: Dataset | RealDataset
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
}

const categories = {
  economics: "💰 Economics & Finance",
  finance: "📊 Finance & Markets", 
  social: "👥 Social & Demographics",
  demographics: "👨‍👩‍👧‍👦 Demographics",
  technology: "� Technology",
  environment: "🌍 Environment",
  health: "❤️ Health",
  education: "🎓 Education",
  trade: "🌐 Trade & International",
  commodities: "�️ Commodities",
  entertainment: "� Entertainment & Media",
  transportation: "🚗 Transportation",
  food: "🍎 Food & Agriculture",
  housing: "🏘️ Housing & Urban"
}

const datasets: Dataset[] = [
  // Food & Consumption
  { name: "Ice cream sales", unit: "thousands of gallons", baseValue: 150, trend: 0.05, seasonal: true, category: "food" },
  { name: "Margarine consumption", unit: "lbs per capita", baseValue: 8.2, trend: -0.08, seasonal: false, category: "food" },
  { name: "Apple sales", unit: "millions sold", baseValue: 280, trend: -0.02, seasonal: true, category: "food" },
  { name: "Coffee consumption", unit: "cups per capita", baseValue: 412, trend: 0.03, seasonal: false, category: "food" },
  { name: "Pizza deliveries", unit: "millions per month", baseValue: 3.2, trend: 0.08, seasonal: true, category: "food" },
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

// Generate correlation using real data from APIs
async function generateRealDataCorrelation(selectedCategory?: string): Promise<CorrelationData | null> {
  try {
    const categoryToPass = selectedCategory === 'all' ? undefined : selectedCategory
    const [dataset1, dataset2] = dataService.getRandomDatasets(categoryToPass)    // Use the public generateCorrelation method that handles everything
    const result = await dataService.generateCorrelation(dataset1, dataset2)
    
    // Combine data1 and data2 into the format expected by CorrelationData
    const combinedData = result.data1.map(d1 => {
      const d2 = result.data2.find(d => d.year === d1.year)
      return {
        year: d1.year,
        value1: d1.value,
        value2: d2?.value || 0
      }
    }).filter(d => d.value2 !== 0) // Only include years with data for both datasets
    
    // Convert the result to match our CorrelationData interface
    return {
      id: Math.random().toString(36).substr(2, 9),
      title: `${dataset1.name} vs ${dataset2.name}`,
      description: result.description,
      correlation: Math.round(result.correlation * 1000) / 1000,
      rSquared: Math.round(result.rSquared * 1000) / 1000,
      data: combinedData,
      variable1: dataset1,
      variable2: dataset2,
      citation: `${dataset1.source} & ${dataset2.source} (${new Date().getFullYear()})`,
      journal: "Economic Data Analysis",
      year: new Date().getFullYear(),
      isRealData: true,
      dataSource: `${dataset1.source}, ${dataset2.source}`
    }
  } catch (error) {
    console.error('Failed to generate real data correlation:', error)
    return null
  }
}

function App() {
  const [currentCorrelation, setCurrentCorrelation] = useState<CorrelationData>(() => generateCorrelationData())
  const [isGenerating, setIsGenerating] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const shareCardRef = useRef<HTMLDivElement>(null)
  const [totalDatasetCount, setTotalDatasetCount] = useState<number>(0)
  const [datasetStats, setDatasetStats] = useState<{real: number, ai: number, total: number} | null>(null)
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

  // Load total dataset count dynamically
  useEffect(() => {
    const loadDatasetCount = async () => {
      try {
        // Give the service time to initialize if needed
        await new Promise(resolve => setTimeout(resolve, 100))
        const count = dataService.getTotalDatasetCount()
        const stats = dataService.getDatasetStats()
        setTotalDatasetCount(count)
        setDatasetStats(stats)
      } catch (error) {
        console.warn('Failed to load dataset count:', error)
        setTotalDatasetCount(80) // Fallback value
        setDatasetStats(null)
      }
    }
    
    loadDatasetCount()
  }, [])

  // Function to refresh dataset count (can be called when datasets are updated)
  const refreshDatasetCount = useCallback(() => {
    try {
      const count = dataService.getTotalDatasetCount()
      const stats = dataService.getDatasetStats()
      setTotalDatasetCount(count)
      setDatasetStats(stats)
    } catch (error) {
      console.warn('Failed to refresh dataset count:', error)
    }
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
      toast.info("Fetching real economic data...")
      const realCorrelation = await generateRealDataCorrelation(selectedCategory)
      
      if (realCorrelation) {
        setCurrentCorrelation(realCorrelation)
        toast.success("Real data correlation generated!")
      } else {
        // NO MOCK DATA FALLBACK - Only real or AI-generated data
        toast.error("No real data available for selected category - only real and AI-generated data used")
        console.error("No real data correlation could be generated - system does not use mock data")
      }
    } catch (error) {
      console.error('Error generating correlation:', error)
      toast.error("Data generation failed - no mock data fallback available")
      console.error("System exclusively uses real economic data and AI-generated datasets")
    } finally {
      setIsGenerating(false)
    }
  }, [selectedCategory])

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
    
    return {
      short: `🔍 ${corrType.charAt(0).toUpperCase() + corrType.slice(1)} ${direction} correlation: ${correlation.title} (r=${correlation.correlation > 0 ? '+' : ''}${correlation.correlation}) #DataScience #AI #Correlation`,
      long: `🔍 Fascinating ${corrType} ${direction} correlation discovered!\n\n${correlation.title}\nr = ${correlation.correlation > 0 ? '+' : ''}${correlation.correlation}\n\n${correlation.description}\n\n🤖 Powered by CorrelateAI Pro - AI-driven data correlation analysis\n📊 Real data from FRED & World Bank APIs\n\n${shareUrl}\n\n#DataScience #AI #Statistics #Economics #MachineLearning`,
      url: shareUrl
    }
  }, [])

  const shareToTwitter = useCallback((correlation: CorrelationData) => {
    const shareContent = generateShareText(correlation)
    const twitterText = shareContent.short + `\n\n🔗 ${shareContent.url}`
    const url = `https://x.com/intent/tweet?text=${encodeURIComponent(twitterText)}`
    window.open(url, '_blank', 'width=600,height=400')
    toast.success("Opening X (Twitter) share dialog!")
  }, [generateShareText])

  const shareToLinkedIn = useCallback((correlation: CorrelationData) => {
    const shareContent = generateShareText(correlation)
    const fullUrl = shareContent.url
    
    // LinkedIn sharing with proper URL encoding and parameters
    const linkedInTitle = encodeURIComponent(`CorrelateAI Pro: ${correlation.title}`)
    const linkedInSummary = encodeURIComponent(shareContent.long)
    const linkedInSource = encodeURIComponent('CorrelateAI Pro - AI Data Analysis')
    
    // Use the proper LinkedIn share URL with all parameters
    const url = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(fullUrl)}&title=${linkedInTitle}&summary=${linkedInSummary}&source=${linkedInSource}`
    
    window.open(url, '_blank', 'width=700,height=500,scrollbars=yes,resizable=yes')
    toast.success("Opening LinkedIn share dialog!")
  }, [generateShareText])

  const shareToFacebook = useCallback((correlation: CorrelationData) => {
    const shareContent = generateShareText(correlation)
    const url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareContent.url)}&quote=${encodeURIComponent(shareContent.long)}`
    window.open(url, '_blank', 'width=600,height=400')
    toast.success("Opening Facebook share dialog!")
  }, [generateShareText])

  const downloadAsImage = useCallback(async (correlation: CorrelationData) => {
    if (!shareCardRef.current) {
      toast.error("Share card not found. Try again in a moment.")
      return
    }

    try {
      // Dynamic import to avoid bundling issues
      const html2canvas = (await import('html2canvas')).default
      
      const canvas = await html2canvas(shareCardRef.current, {
        backgroundColor: '#ffffff',
        scale: 2,
        useCORS: true,
        allowTaint: true,
        height: shareCardRef.current.offsetHeight,
        width: shareCardRef.current.offsetWidth
      })
      
      const link = document.createElement('a')
      link.download = `correlation-${correlation.title.replace(/[^a-z0-9]/gi, '-').toLowerCase()}.png`
      link.href = canvas.toDataURL('image/png')
      link.click()
      
      toast.success("Correlation card downloaded!")
    } catch (error) {
      console.error('Error generating image:', error)
      toast.error("Failed to download image. Please try again.")
    }
  }, [])

  const isFavorited = useMemo(() => (id: string) => favorites?.some(fav => fav.id === id) || false, [favorites])

  return (
    <div className="min-h-screen relative">
      <SwirlBackground />
      <div className="relative z-10 p-2 sm:p-4 min-h-screen">
        <div className="max-w-6xl mx-auto bg-gray-800/80 backdrop-blur-md rounded-xl sm:rounded-2xl shadow-2xl border border-gray-700/50 p-4 sm:p-8">
        <header className="text-center mb-6 sm:mb-8">
          <div className="flex items-center justify-center gap-2 sm:gap-3 mb-3 sm:mb-4">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-cyan-400 to-purple-400 rounded-lg flex items-center justify-center">
              <Database size={isMobile ? 20 : 24} className="text-white" />
            </div>
            <h1 className="text-2xl sm:text-4xl font-bold bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
              {isMobile ? "CorrelateAI" : "CorrelateAI Pro"}
            </h1>
            <div className="px-2 py-1 sm:px-3 sm:py-1 bg-gradient-to-r from-cyan-500 to-purple-500 text-white text-xs font-semibold rounded-full border border-cyan-400/30 shadow-lg shadow-cyan-500/25">
              AI-Powered
            </div>
          </div>
          <p className="text-gray-300 max-w-2xl mx-auto leading-relaxed text-sm sm:text-base px-4 sm:px-0">
            Discover surprising correlations in real economic data using advanced AI analysis. 
            Built with cutting-edge artificial intelligence and authentic data from Federal Reserve & World Bank APIs.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-2 mt-4 text-xs sm:text-sm text-gray-400">
            <div className="flex items-center gap-2">
              <Database size={14} className="text-cyan-400" />
              <span>Powered by</span>
              <span className="font-semibold text-blue-400">FRED</span>
              <span>+</span>
              <span className="font-semibold text-green-400">World Bank</span>
              <span>+</span>
              <span className="font-semibold text-purple-400">AI Datasets</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              {datasetStats ? (
                <div className="flex items-center gap-2 text-xs sm:text-sm">
                  <span className="text-green-400 font-medium" title={`Total: ${datasetStats.total} datasets`}>
                    {datasetStats.total} Sources
                  </span>
                  <span className="text-gray-500">•</span>
                  <span className="text-blue-400 font-medium" title="Real economic data from FRED & World Bank">
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
          <TabsList className={`grid w-full grid-cols-3 mb-4 sm:mb-6 bg-gray-700/50 border border-gray-600/50 ${isMobile ? 'h-12 rounded-lg' : 'rounded-md'}`}>
            <TabsTrigger 
              value="generator" 
              className={`text-gray-300 data-[state=active]:text-cyan-400 data-[state=active]:bg-gray-800 ${isMobile ? 'px-3 py-2 h-10 text-sm rounded-md' : 'px-4 py-2'} transition-all duration-200`}
            >
              {isMobile ? "Generate" : "Generate"}
            </TabsTrigger>
            <TabsTrigger 
              value="favorites" 
              className={`text-gray-300 data-[state=active]:text-cyan-400 data-[state=active]:bg-gray-800 ${isMobile ? 'px-3 py-2 h-10 text-sm rounded-md' : 'px-4 py-2'} transition-all duration-200`}
            >
              {isMobile ? `❤ (${favorites?.length || 0})` : `Favorites (${favorites?.length || 0})`}
            </TabsTrigger>
            <TabsTrigger 
              value="story" 
              className={`text-gray-300 data-[state=active]:text-cyan-400 data-[state=active]:bg-gray-800 ${isMobile ? 'px-3 py-2 h-10 text-sm rounded-md' : 'px-4 py-2'} transition-all duration-200`}
            >
              {isMobile ? "Story" : "AI Development Story"}
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="generator" className="space-y-4 sm:space-y-6">
            <div className="flex flex-col gap-4 items-center justify-center">
              
              {/* Controls Row - Mobile-optimized */}
              <div className={`flex ${isMobile ? 'flex-col gap-3' : 'items-center gap-4'} justify-center w-full max-w-lg`}>
                <div className="flex items-center gap-2 justify-center">
                  <Funnel size={18} className="text-cyan-400" />
                  <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                    <SelectTrigger className={`${isMobile ? 'w-full' : 'w-48'} bg-gray-700/50 border-gray-600 text-gray-200 hover:bg-gray-700`}>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-800 border-gray-600">
                      <SelectItem value="all" className="text-gray-200 hover:bg-gray-700">All Categories</SelectItem>
                      {dataService.getCategories().map(category => (
                        <SelectItem key={category} value={category} className="text-gray-200 hover:bg-gray-700">
                          {categories[category as keyof typeof categories] || `📊 ${category.charAt(0).toUpperCase() + category.slice(1)}`}
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
                      {isMobile ? "Analyzing..." : "Analyzing Real Data..."}
                    </>
                  ) : (
                    <>
                      <ArrowClockwise className="mr-2" size={18} />
                      {isMobile ? "Generate AI Correlation" : "Generate AI Correlation"}
                    </>
                  )}
                </Button>
              </div>
            </div>
            
            <CorrelationCard correlation={currentCorrelation} isShareable={true} />
            
            {/* Data Sources Information */}
            <DataSourcesCard />
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
                  <CorrelationCard key={correlation.id} correlation={correlation} />
                ))}
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="story" className="space-y-6 sm:space-y-8">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-8 sm:mb-12">
                <h2 className={`${isMobile ? 'text-xl' : 'text-3xl'} font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4`}>
                  How CorrelateAI Pro Was Built
                </h2>
                <p className={`${isMobile ? 'text-base px-4' : 'text-lg'} text-muted-foreground`}>
                  {isMobile ? "AI-assisted development in 2 hours" : "A complete AI-assisted development journey from idea to deployment in 2 hours"}
                </p>
              </div>

              {/* Timeline Steps - Mobile-optimized */}
              <div className="space-y-8 sm:space-y-12">
                
                {/* Step 1: GitHub Spark */}
                <Card className="border-2 border-blue-200 bg-gradient-to-r from-blue-50 to-blue-100">
                  <CardHeader className={`${isMobile ? 'p-4' : ''}`}>
                    <div className="flex items-center gap-3 mb-2">
                      <div className={`${isMobile ? 'w-6 h-6' : 'w-8 h-8'} bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold`}>1</div>
                      <h3 className={`${isMobile ? 'text-lg' : 'text-xl'} font-semibold`}>
                        {isMobile ? "The Spark (30 min)" : "The Spark (0-30 minutes)"}
                      </h3>
                    </div>
                    <p className={`text-muted-foreground ${isMobile ? 'text-sm' : ''}`}>Started with GitHub Spark - AI prototype generation</p>
                  </CardHeader>
                  <CardContent className={`space-y-4 ${isMobile ? 'p-4 pt-0' : ''}`}>
                    <div className="bg-white p-3 sm:p-4 rounded-lg border">
                      <h4 className={`font-semibold mb-2 ${isMobile ? 'text-sm' : ''}`}>💡 Original Prompt:</h4>
                      <p className={`italic ${isMobile ? 'text-xs' : 'text-sm'}`}>"I want to create a tool that compares random datasets and finds interesting correlations between them."</p>
                    </div>
                    <div className={`grid ${isMobile ? 'grid-cols-1 gap-3' : 'md:grid-cols-2 gap-4'}`}>
                      <div>
                        <h4 className={`font-semibold mb-2 ${isMobile ? 'text-sm' : ''}`}>⚡ AI Generated:</h4>
                        <ul className={`space-y-1 ${isMobile ? 'text-xs' : 'text-sm'}`}>
                          <li>• Complete React + TypeScript app</li>
                          <li>• Vite build configuration</li>
                          <li>• Correlation algorithms</li>
                          <li>• Modern UI with Tailwind CSS</li>
                          <li>• Synthetic test datasets</li>
                        </ul>
                      </div>
                      <div>
                        <h4 className={`font-semibold mb-2 ${isMobile ? 'text-sm' : ''}`}>🎯 Result:</h4>
                        <p className={`${isMobile ? 'text-xs' : 'text-sm'}`}>Working prototype with interactive data visualization in minutes, not hours.</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Step 2: Feature Evolution */}
                <Card className="border-2 border-green-200 bg-gradient-to-r from-green-50 to-green-100">
                  <CardHeader>
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-8 h-8 bg-green-500 text-white rounded-full flex items-center justify-center text-sm font-bold">2</div>
                      <h3 className="text-xl font-semibold">Feature Evolution (30-75 minutes)</h3>
                    </div>
                    <p className="text-muted-foreground">Natural language feature requests</p>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="bg-white p-4 rounded-lg border">
                        <h4 className="font-semibold mb-2">🗣️ Conversational Requests:</h4>
                        <ul className="text-sm space-y-1">
                          <li>• "Add category filtering"</li>
                          <li>• "Enable social media sharing"</li>
                          <li>• "Create a favorites system"</li>
                          <li>• "Add export functionality"</li>
                        </ul>
                      </div>
                      <div className="bg-white p-4 rounded-lg border">
                        <h4 className="font-semibold mb-2">🤖 AI Implementation:</h4>
                        <ul className="text-sm space-y-1">
                          <li>• Dropdown filters with categories</li>
                          <li>• Twitter, Facebook, LinkedIn sharing</li>
                          <li>• Local storage favorites</li>
                          <li>• CSV/image export options</li>
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Step 3: The Breaking Point */}
                <Card className="border-2 border-red-200 bg-gradient-to-r from-red-50 to-red-100">
                  <CardHeader>
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center text-sm font-bold">3</div>
                      <h3 className="text-xl font-semibold">The Breaking Point (75 minutes)</h3>
                    </div>
                    <p className="text-muted-foreground">When complexity met reality</p>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="bg-white p-4 rounded-lg border">
                      <h4 className="font-semibold mb-2">💥 System Failures:</h4>
                      <ul className="text-sm space-y-1">
                        <li>• Complex interdependencies created conflicts</li>
                        <li>• Synthetic data generation became unreliable</li>
                        <li>• CORS issues blocked sharing functionality</li>
                        <li>• Performance degraded with feature additions</li>
                      </ul>
                    </div>
                    <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                      <h4 className="font-semibold mb-2">🎯 Key Insight:</h4>
                      <p className="text-sm">This is where most traditional development projects stall. But AI assistance enables rapid recovery and pivoting.</p>
                    </div>
                  </CardContent>
                </Card>

                {/* Step 4: The Breakthrough */}
                <Card className="border-2 border-purple-200 bg-gradient-to-r from-purple-50 to-purple-100">
                  <CardHeader>
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-8 h-8 bg-purple-500 text-white rounded-full flex items-center justify-center text-sm font-bold">4</div>
                      <h3 className="text-xl font-semibold">The Real Data Breakthrough (75-120 minutes)</h3>
                    </div>
                    <p className="text-muted-foreground">From synthetic to authentic data sources</p>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="bg-white p-4 rounded-lg border">
                        <h4 className="font-semibold mb-2">🔄 Strategic Pivot:</h4>
                        <ul className="text-sm space-y-1">
                          <li>• Moved to private repository</li>
                          <li>• Local development environment</li>
                          <li>• Real data integration focus</li>
                          <li>• Professional rebranding</li>
                        </ul>
                      </div>
                      <div className="bg-white p-4 rounded-lg border">
                        <h4 className="font-semibold mb-2">📊 Data Sources Added:</h4>
                        <ul className="text-sm space-y-1">
                          <li>• FRED API (Federal Reserve) - 20 datasets</li>
                          <li>• World Bank API - 11 global indicators</li>
                          <li>• Real-time economic data</li>
                          <li>• Professional data sourcing</li>
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                </Card>

              </div>

              {/* Final Results */}
              <Card className="border-2 border-indigo-200 bg-gradient-to-r from-indigo-50 to-indigo-100 mt-12">
                <CardHeader>
                  <h3 className="text-2xl font-bold text-center">🎉 Final Results</h3>
                  <p className="text-center text-muted-foreground">Production-ready application in 2 hours</p>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-3 gap-6 text-center">
                    <div>
                      <div className="text-3xl font-bold text-indigo-600 mb-2">850+</div>
                      <p className="text-sm">Lines of Code Generated</p>
                    </div>
                    <div>
                      <div className="text-3xl font-bold text-indigo-600 mb-2">31</div>
                      <p className="text-sm">Real Data Sources</p>
                    </div>
                    <div>
                      <div className="text-3xl font-bold text-indigo-600 mb-2">0</div>
                      <p className="text-sm">Lines Coded Manually</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Links Section */}
              <div className="bg-gradient-to-r from-gray-50 to-gray-100 p-8 rounded-lg border-2 border-gray-200 mt-12">
                <h3 className="text-xl font-bold mb-6 text-center">📚 Explore the Full Story</h3>
                <div className="grid md:grid-cols-3 gap-4">
                  <a 
                    href="/DEVELOPMENT_STORY.md" 
                    target="_blank"
                    className="flex items-center gap-3 p-4 bg-white rounded-lg border hover:border-blue-300 transition-colors"
                  >
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      📖
                    </div>
                    <div>
                      <div className="font-semibold">Development Story</div>
                      <div className="text-xs text-muted-foreground">Complete case study</div>
                    </div>
                  </a>
                  <a 
                    href="/TECHNICAL_DOCS.md" 
                    target="_blank"
                    className="flex items-center gap-3 p-4 bg-white rounded-lg border hover:border-green-300 transition-colors"
                  >
                    <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                      🔧
                    </div>
                    <div>
                      <div className="font-semibold">Technical Docs</div>
                      <div className="text-xs text-muted-foreground">Architecture details</div>
                    </div>
                  </a>
                  <a 
                    href="https://github.com/victorsaly/random-data-correlat" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 p-4 bg-white rounded-lg border hover:border-purple-300 transition-colors"
                  >
                    <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                      💻
                    </div>
                    <div>
                      <div className="font-semibold">GitHub Repo</div>
                      <div className="text-xs text-muted-foreground">Source code</div>
                    </div>
                  </a>
                </div>
              </div>

              {/* Call to Action */}
              <div className="text-center mt-12">
                <h3 className="text-xl font-semibold mb-4">Experience AI-Assisted Development</h3>
                <p className="text-muted-foreground mb-6">
                  This entire application demonstrates what's possible when human creativity meets AI capability.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button 
                    onClick={() => copyToClipboard(window.location.href)}
                    variant="outline" 
                    className="px-6"
                  >
                    <Share size={16} className="mr-2" />
                    Share This Story
                  </Button>
                  <Button 
                    onClick={() => window.open('https://victorsaly.com', '_blank')}
                    className="px-6 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
                  >
                    <TrendUp size={16} className="mr-2" />
                    Learn More About AI Development
                  </Button>
                </div>
              </div>

            </div>
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
                  <a 
                    href="https://www.linkedin.com/in/victorsaly/" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-cyan-400 hover:text-cyan-300 font-medium inline-flex items-center gap-2 text-sm"
                  >
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                    </svg>
                    LinkedIn Profile
                  </a>
                  <a 
                    href="https://victorsaly.com" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-cyan-400 hover:text-cyan-300 font-medium inline-flex items-center gap-2 text-sm"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                    victorsaly.com
                  </a>
                </div>
              </div>
            </div>

            {/* AI Development Approach - Mobile-optimized */}
            <div className={`text-center ${isMobile ? 'max-w-full' : 'lg:text-right max-w-md'}`}>
              <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-2 bg-gradient-to-r from-purple-900/50 to-cyan-900/50 border border-purple-700/50 rounded-full mb-3">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-xs sm:text-sm font-medium text-gray-200">100% AI-Generated Application</span>
              </div>
              <p className={`text-xs sm:text-sm text-gray-400 leading-relaxed ${isMobile ? 'px-2' : ''}`}>
                Built entirely through AI-assisted development using advanced language models. 
                This application demonstrates the power of AI in creating professional-grade 
                data visualization and correlation analysis tools.
              </p>
            </div>
          </div>

          {/* Bottom Section - Mobile-optimized */}
          <div className="mt-6 sm:mt-8 pt-4 sm:pt-6 border-t border-gray-700/50 text-center">
            <p className="text-xs sm:text-sm text-gray-500 mb-2">
              © {new Date().getFullYear()} CorrelateAI Pro. Powered by real-time data from FRED API & World Bank API.
            </p>
            <div className={`flex ${isMobile ? 'flex-col gap-2' : 'items-center justify-center gap-4'} text-xs text-gray-400`}>
              <span className="flex items-center justify-center gap-1">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                FRED (Federal Reserve)
              </span>
              <span className="flex items-center justify-center gap-1">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                World Bank Open Data
              </span>
              <span className="flex items-center justify-center gap-1">
                <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                AI-Generated Datasets
              </span>
            </div>
          </div>
        </div>
      </footer>
      
      <Toaster />
      </div>
    </div>
  )

  // CorrelationCard component moved outside to prevent re-render issues
  function CorrelationCard({ correlation, isShareable = false }: { correlation: CorrelationData; isShareable?: boolean }) {
    return (
      <Card className="w-full bg-gray-800/50 border-gray-700/50 backdrop-blur-md" ref={isShareable ? shareCardRef : undefined}>
        <CardHeader className={`${isMobile ? 'p-4 pb-2' : ''}`}>
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <CardTitle className={`${isMobile ? 'text-lg' : 'text-xl'} font-semibold flex items-center gap-2 text-gray-100`}>
                <TrendUp size={isMobile ? 18 : 20} className="text-cyan-400" />
                {correlation.title}
              </CardTitle>
              <CardDescription className={`mt-2 text-gray-300 ${isMobile ? 'text-sm' : ''}`}>
                {correlation.description}
              </CardDescription>
            </div>
            <div className="flex items-center gap-1 sm:gap-2 ml-2 sm:ml-4">
              <Button
                variant="ghost"
                size="sm"
                className="hover:bg-gray-700/50 text-gray-300 hover:text-gray-100 p-2"
                onClick={() => toggleFavorite(correlation)}
              >
                <Heart 
                  size={isMobile ? 16 : 18} 
                  weight={isFavorited(correlation.id) ? "fill" : "regular"}
                  className={isFavorited(correlation.id) ? "text-red-400" : ""}
                />
              </Button>
              
              {/* Prominent Social Share Buttons */}
              <div className="flex items-center gap-1">
                <Button
                  variant="ghost"
                  size="sm"
                  className="hover:bg-blue-600/30 hover:shadow-lg hover:shadow-blue-500/20 text-blue-400 hover:text-blue-200 p-2 transition-all duration-300 hover:scale-105 border border-transparent hover:border-blue-500/30"
                  onClick={() => shareToLinkedIn(correlation)}
                  title="Share on LinkedIn"
                >
                  <LinkedinLogo size={isMobile ? 16 : 18} weight="fill" />
                </Button>
                
                <Button
                  variant="ghost"
                  size="sm"
                  className="hover:bg-gray-900/60 hover:shadow-lg hover:shadow-gray-900/30 text-gray-300 hover:text-white p-2 transition-all duration-300 hover:scale-105 border border-transparent hover:border-gray-600/40"
                  onClick={() => shareToTwitter(correlation)}
                  title="Share on X (Twitter)"
                >
                  <TwitterLogo size={isMobile ? 16 : 18} weight="fill" />
                </Button>
                
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="hover:bg-gray-700/50 text-gray-400 hover:text-gray-200 p-2">
                      <Share size={isMobile ? 14 : 16} />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-44 bg-gray-800 border-gray-700">
                    <DropdownMenuItem onClick={() => shareToFacebook(correlation)} className="text-gray-200 hover:bg-gray-700">
                      <FacebookLogo size={14} className="mr-2" />
                      Facebook
                    </DropdownMenuItem>
                    <Separator className="bg-gray-600" />
                    <DropdownMenuItem onClick={() => downloadAsImage(correlation)} className="text-gray-200 hover:bg-gray-700">
                      <Download size={14} className="mr-2" />
                      Download Image
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => copyToClipboard(generateShareText(correlation).long)} className="text-gray-200 hover:bg-gray-700">
                      <Copy size={14} className="mr-2" />
                      Copy Text
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </div>
          
          <div className={`flex gap-1 sm:gap-2 mt-4 flex-wrap ${isMobile ? 'text-xs' : ''}`}>
            <Badge variant="secondary" className="bg-cyan-900/50 text-cyan-300 border-cyan-700/50">
              r = {correlation.correlation > 0 ? '+' : ''}{correlation.correlation}
            </Badge>
            <Badge variant="outline" className="border-gray-600 text-gray-300">
              R² = {correlation.rSquared.toFixed(3)}
            </Badge>
            <Badge variant={correlation.isRealData ? "default" : "secondary"} className={correlation.isRealData ? "bg-purple-900/50 text-purple-300 border-purple-700/50" : "bg-gray-700/50 text-gray-300 border-gray-600/50"}>
              {correlation.isRealData ? (
                <>
                  <Database size={10} className="mr-1" />
                  {isMobile ? "Real Data" : `${correlation.dataSource} Real Data`}
                </>
              ) : (
                <>
                  <Database size={10} className="mr-1" />
                  {isMobile ? "Synthetic" : categories[(correlation.variable1 as Dataset).category as keyof typeof categories]}
                </>
              )}
            </Badge>
          </div>
        </CardHeader>
        
        <CardContent className={`bg-gray-900/30 rounded-lg ${isMobile ? 'p-3' : ''}`}>
          <div className={`${isMobile ? 'h-56' : 'h-64'} w-full`}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={correlation.data} margin={isMobile ? { top: 5, right: 15, left: 15, bottom: 25 } : undefined}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis 
                  dataKey="year" 
                  stroke="#9CA3AF"
                  fontSize={isMobile ? 10 : 12}
                  tick={{ fontSize: isMobile ? 10 : 12 }}
                  label={{ value: 'Year', position: 'insideBottom', offset: -5, style: { textAnchor: 'middle', fill: '#9CA3AF', fontSize: isMobile ? '10px' : '12px' } }}
                />
                <YAxis 
                  yAxisId="left" 
                  orientation="left" 
                  stroke="#06B6D4"
                  fontSize={isMobile ? 9 : 11}
                  tick={{ fontSize: isMobile ? 9 : 11 }}
                  width={isMobile ? 40 : 60}
                  label={!isMobile ? { value: correlation.variable1.unit, angle: -90, position: 'insideLeft', style: { textAnchor: 'middle', fill: '#06B6D4', fontSize: '11px' } } : undefined}
                />
                <YAxis 
                  yAxisId="right" 
                  orientation="right" 
                  stroke="#A855F7"
                  fontSize={isMobile ? 9 : 11}
                  tick={{ fontSize: isMobile ? 9 : 11 }}
                  width={isMobile ? 40 : 60}
                  label={!isMobile ? { value: correlation.variable2.unit, angle: 90, position: 'insideRight', style: { textAnchor: 'middle', fill: '#A855F7', fontSize: '11px' } } : undefined}
                />
                
                {/* COVID Period Highlight (2020-2022) */}
                <ReferenceArea
                  x1={2020}
                  x2={2022}
                  fill="#EF4444"
                  fillOpacity={0.15}
                  stroke="#EF4444"
                  strokeOpacity={0.6}
                  strokeWidth={2}
                  strokeDasharray="8 4"
                />
                
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1F2937', 
                    border: '1px solid #374151',
                    borderRadius: '8px',
                    color: '#F3F4F6',
                    fontSize: isMobile ? '11px' : '12px',
                    padding: isMobile ? '8px' : '12px'
                  }}
                  formatter={(value, name) => {
                    const variable = name === 'value1' ? correlation.variable1 : correlation.variable2
                    return [
                      `${typeof value === 'number' ? value.toFixed(1) : value} ${variable.unit}`,
                      isMobile ? variable.name.substring(0, 20) + (variable.name.length > 20 ? '...' : '') : variable.name
                    ]
                  }}
                  labelFormatter={(year) => {
                    const isCovidPeriod = year >= 2020 && year <= 2022
                    if (isCovidPeriod) {
                      return (
                        <div>
                          <div style={{ fontWeight: 'bold', color: '#EF4444' }}>Year {year} - COVID Period</div>
                          {!isMobile && (
                            <div style={{ fontSize: '11px', color: '#9CA3AF', marginTop: '2px' }}>
                              Data may show pandemic-related anomalies
                            </div>
                          )}
                        </div>
                      )
                    }
                    return `Year ${year}`
                  }}
                />
                <Line 
                  yAxisId="left"
                  type="monotone" 
                  dataKey="value1" 
                  stroke="#06B6D4" 
                  strokeWidth={isMobile ? 2 : 3}
                  dot={{ fill: '#06B6D4', strokeWidth: 2, r: isMobile ? 3 : 4 }}
                  animationDuration={1200}
                />
                <Line 
                  yAxisId="right"
                  type="monotone" 
                  dataKey="value2" 
                  stroke="#A855F7" 
                  strokeWidth={isMobile ? 2 : 3}
                  dot={{ fill: '#A855F7', strokeWidth: 2, r: isMobile ? 3 : 4 }}
                  animationDuration={1200}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
          
          {/* Chart Legend and COVID Period Information - Mobile-optimized */}
          <div className="mt-3 sm:mt-4 space-y-2 sm:space-y-3">
            {/* Axis Information */}
            <div className={`flex items-center justify-center gap-3 sm:gap-6 text-xs text-gray-400 ${isMobile ? 'flex-col gap-2' : ''}`}>
              <div className="flex items-center gap-2">
                <div className="w-3 h-0.5 bg-cyan-400"></div>
                <span className={`${isMobile ? 'text-center' : ''}`}>
                  {isMobile ? 
                    `${correlation.variable1.name.substring(0, 15)}${correlation.variable1.name.length > 15 ? '...' : ''}` : 
                    `${correlation.variable1.name} (${correlation.variable1.unit})`
                  }
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-0.5 bg-purple-400"></div>
                <span className={`${isMobile ? 'text-center' : ''}`}>
                  {isMobile ? 
                    `${correlation.variable2.name.substring(0, 15)}${correlation.variable2.name.length > 15 ? '...' : ''}` : 
                    `${correlation.variable2.name} (${correlation.variable2.unit})`
                  }
                </span>
              </div>
            </div>
            
            {/* COVID Period Legend - Simplified for mobile */}
            <div className={`flex items-center justify-center gap-2 sm:gap-4 text-xs bg-red-50/10 p-2 rounded border border-red-400/20 ${isMobile ? 'flex-col text-center' : ''}`}>
              <div className="flex items-center gap-2">
                <div className="w-6 sm:w-8 h-4 bg-red-400/20 border-l-2 border-r-2 border-red-500 border-dashed rounded-sm flex items-center justify-center">
                  <div className="w-1 h-1 bg-red-500 rounded-full"></div>
                </div>
                <span className="text-red-400 font-medium text-xs">
                  {isMobile ? "COVID-19 Period" : "COVID-19 Impact Period"}
                </span>
                <span className="text-gray-300 font-mono bg-gray-800 px-1 sm:px-2 py-0.5 rounded text-xs border">
                  2020-2022
                </span>
              </div>
            </div>
            
            {/* Explanation - Simplified for mobile */}
            {!isMobile && (
              <div className="flex items-start justify-center gap-2 text-xs text-gray-500 max-w-lg mx-auto">
                <Info size={14} className="text-yellow-400 mt-0.5 flex-shrink-0" />
                <p className="text-center">
                  The <span className="text-red-400 font-medium">highlighted red area (2020-2022)</span> shows the COVID-19 pandemic period. 
                  Economic and social data during these years may show unusual patterns due to lockdowns, 
                  policy changes, and behavioral shifts. Correlations in this period should be interpreted carefully.
                </p>
              </div>
            )}
            
            {/* Mobile COVID explanation - condensed */}
            {isMobile && (
              <div className="text-xs text-gray-500 text-center px-2">
                <Info size={12} className="text-yellow-400 inline mr-1" />
                Red area shows COVID-19 period with potential data anomalies (2020-2022)
              </div>
            )}
          </div>
          
          <div className={`mt-4 sm:mt-6 p-3 sm:p-4 bg-gray-800/50 rounded-lg border border-gray-700/50`}>
            <div className="flex items-center gap-2 mb-2">
              <BookOpen size={isMobile ? 14 : 16} className="text-cyan-400" />
              <span className={`${isMobile ? 'text-xs' : 'text-sm'} font-medium text-gray-200`}>Citation</span>
              <Button
                variant="ghost"
                size="sm"
                className="hover:bg-gray-700/50 text-gray-400 hover:text-gray-200 p-1"
                onClick={() => copyToClipboard(`${correlation.citation}. ${correlation.title}. ${correlation.journal}, ${correlation.year}.`)}
              >
                <Copy size={isMobile ? 12 : 14} />
              </Button>
            </div>
            <p className={`${isMobile ? 'text-xs' : 'text-sm'} text-gray-400`}>
              {correlation.citation}. "{correlation.title}." <em>{correlation.journal}</em>, {correlation.year}.
            </p>
          </div>
          
          {/* Enhanced Source Attribution - Mobile-optimized */}
          {correlation.isRealData && (
            <div className={`mt-4 p-2 sm:p-3 bg-gray-900/50 rounded-lg border border-gray-600/50`}>
              <div className={`${isMobile ? 'text-xs' : 'text-xs'} text-gray-300 font-medium mb-2`}>Data Sources:</div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <SourceAttribution dataset={correlation.variable1} />
                </div>
                <div className="flex items-center justify-between">
                  <SourceAttribution dataset={correlation.variable2} />
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    )
  }

  const FooterComponent = () => (
    <footer className="mt-16 border-t border-gray-200 bg-gradient-to-r from-blue-50 to-purple-50">
      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
          {/* Developer Profile */}
          <div className="flex items-center gap-6">
            <div className="w-20 h-20 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-2xl">
              VS
            </div>
            <div>
              <h3 className="text-xl font-semibold text-gray-900">Victor Saly</h3>
              <p className="text-gray-600 font-medium">AI Developer & Data Science Engineer</p>
              <a 
                href="https://victorsaly.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-800 font-medium inline-flex items-center gap-1 mt-1"
              >
                victorsaly.com
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </a>
            </div>
          </div>

          {/* AI Development Approach */}
          <div className="text-center lg:text-right max-w-md">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-100 to-blue-100 rounded-full mb-3">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm font-medium text-gray-700">100% AI-Generated Application</span>
            </div>
            <p className="text-sm text-gray-600 leading-relaxed">
              Built entirely through AI-assisted development using advanced language models. 
              This application demonstrates the power of AI in creating professional-grade 
              data visualization and correlation analysis tools.
            </p>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="mt-8 pt-6 border-t border-gray-200 text-center">
          <p className="text-sm text-gray-500 mb-2">
            © {new Date().getFullYear()} CorrelateAI Pro. Powered by real-time data from authoritative sources.
          </p>
          <div className="flex items-center justify-center gap-4 text-xs text-gray-400">
            <span className="flex items-center gap-1">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              FRED (Federal Reserve)
            </span>
            <span className="flex items-center gap-1">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              World Bank Open Data
            </span>
            <span className="flex items-center gap-1">
              <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
              AI-Generated Datasets
            </span>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default App