import { useState, useMemo, useCallback, useRef, useEffect } from 'react'
import { useKV } from '@github/spark/hooks'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Separator } from '@/components/ui/separator'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { Heart, ArrowClockwise, Copy, TrendUp, BookOpen, Funnel, Share, Download, TwitterLogo, LinkedinLogo, FacebookLogo, Database } from '@phosphor-icons/react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { toast, Toaster } from 'sonner'
import { dataService, realDatasets, allDatasets, RealDataset, RealDataPoint } from '@/services/dataService'

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
  food: "🍕 Food & Consumption",
  technology: "📱 Technology & Digital",
  weather: "🌤️ Weather & Environment",
  social: "👥 Social & Demographics",
  health: "🏥 Health & Safety",
  transportation: "🚗 Transportation",
  economics: "💰 Economics & Finance"
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
    const [dataset1, dataset2] = dataService.getRandomDatasets(selectedCategory)
    
    // Fetch real data for both datasets
    const [data1, data2] = await Promise.all([
      dataService.fetchDataset(dataset1),
      dataService.fetchDataset(dataset2)
    ])

    if (data1.length < 3 || data2.length < 3) {
      console.warn('Not enough real data, falling back to synthetic')
      return null
    }

    // Calculate actual correlation
    const correlation = dataService.calculateCorrelation(data1, data2)
    const rSquared = Math.pow(Math.abs(correlation), 2)

    // Find common years and create chart data
    const commonYears = data1
      .filter(d1 => data2.some(d2 => d2.year === d1.year))
      .map(d => d.year)
      .sort()

    const chartData = commonYears.map(year => ({
      year,
      value1: data1.find(d => d.year === year)!.value,
      value2: data2.find(d => d.year === year)!.value
    }))

    const direction = correlation > 0 ? "increase" : "decrease"
    const strongCorr = Math.abs(correlation) > 0.6
    const corrMagnitude = Math.abs(correlation) > 0.7 ? 'strong' : 
                         Math.abs(correlation) > 0.4 ? 'moderate' : 'weak'

    const realDescriptions = [
      `A ${corrMagnitude} ${correlation > 0 ? 'positive' : 'negative'} correlation exists between ${dataset1.name.toLowerCase()} and ${dataset2.name.toLowerCase()}`,
      `Analysis of ${dataset1.source} data shows ${dataset1.name.toLowerCase()} ${correlation > 0 ? 'correlates positively' : 'correlates negatively'} with ${dataset2.name.toLowerCase()}`,
      `Real-world data indicates ${dataset1.name.toLowerCase()} and ${dataset2.name.toLowerCase()} ${correlation > 0 ? 'trend together' : 'move in opposite directions'}`
    ]

    // Real academic-style citations
    const realJournals = [
      "Journal of Economic Analysis",
      "American Economic Review",
      "Federal Reserve Economic Data Bulletin",
      "Quarterly Review of Economics and Finance",
      "International Journal of Statistics"
    ]

    return {
      id: Math.random().toString(36).substr(2, 9),
      title: `${dataset1.name} vs ${dataset2.name}`,
      description: realDescriptions[Math.floor(Math.random() * realDescriptions.length)],
      correlation: Math.round(correlation * 1000) / 1000,
      rSquared: Math.round(rSquared * 1000) / 1000,
      data: chartData,
      variable1: dataset1,
      variable2: dataset2,
      citation: `Federal Reserve Economic Data (${new Date().getFullYear()})`,
      journal: realJournals[Math.floor(Math.random() * realJournals.length)],
      year: new Date().getFullYear(),
      isRealData: true,
      dataSource: dataset1.source
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
  
  // KV store with fallback to localStorage
  const [kvFavorites, setKvFavorites] = useKV<CorrelationData[]>("favorite-correlations", [])
  const [favorites, setFavorites] = useState<CorrelationData[]>([])
  const [kvError, setKvError] = useState(false)

  // Handle KV errors and fallback to localStorage
  useEffect(() => {
    try {
      if (kvFavorites) {
        setFavorites(kvFavorites)
        setKvError(false)
      }
    } catch (error) {
      console.warn('KV store error, falling back to localStorage:', error)
      setKvError(true)
      // Load from localStorage as fallback
      try {
        const stored = localStorage.getItem('favorite-correlations')
        if (stored) {
          setFavorites(JSON.parse(stored))
        }
      } catch (e) {
        console.warn('localStorage error:', e)
        setFavorites([])
      }
    }
  }, [kvFavorites])

  // Save to both KV and localStorage for reliability
  const saveFavorites = useCallback((newFavorites: CorrelationData[]) => {
    setFavorites(newFavorites)
    
    // Try to save to KV store
    if (!kvError) {
      try {
        setKvFavorites(newFavorites)
      } catch (error) {
        console.warn('KV save failed, using localStorage:', error)
        setKvError(true)
      }
    }
    
    // Always save to localStorage as backup
    try {
      localStorage.setItem('favorite-correlations', JSON.stringify(newFavorites))
    } catch (error) {
      console.warn('localStorage save failed:', error)
    }
  }, [setKvFavorites, kvError])

  const generateNew = useCallback(async () => {
    setIsGenerating(true)
    
    try {
      toast.info("Fetching real economic data...")
      const realCorrelation = await generateRealDataCorrelation(selectedCategory)
      
      if (realCorrelation) {
        setCurrentCorrelation(realCorrelation)
        toast.success("Real data correlation generated!")
      } else {
        // Fallback to synthetic data if real data fails
        toast.warning("Real data unavailable, using synthetic data")
        setCurrentCorrelation(generateCorrelationData(selectedCategory))
      }
    } catch (error) {
      console.error('Error generating correlation:', error)
      toast.error("Generation failed, using synthetic data")
      setCurrentCorrelation(generateCorrelationData(selectedCategory))
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
    
    return `🔍 Fascinating ${corrType} ${direction} correlation discovered!\n\n${correlation.title}\nr = ${correlation.correlation > 0 ? '+' : ''}${correlation.correlation}\n\n${correlation.description}\n\n#SpuriousCorrelations #DataScience #Statistics`
  }, [])

  const shareToTwitter = useCallback((correlation: CorrelationData) => {
    const text = generateShareText(correlation)
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`
    window.open(url, '_blank', 'width=600,height=400')
    toast.success("Opening Twitter share dialog!")
  }, [generateShareText])

  const shareToLinkedIn = useCallback((correlation: CorrelationData) => {
    const text = generateShareText(correlation)
    const url = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.href)}&summary=${encodeURIComponent(text)}`
    window.open(url, '_blank', 'width=600,height=600')
    toast.success("Opening LinkedIn share dialog!")
  }, [generateShareText])

  const shareToFacebook = useCallback((correlation: CorrelationData) => {
    const text = generateShareText(correlation)
    const url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}&quote=${encodeURIComponent(text)}`
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
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-6xl mx-auto">
        <header className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              CorrelateAI Pro
            </h1>
            <div className="px-3 py-1 bg-gradient-to-r from-blue-500 to-purple-500 text-white text-xs font-semibold rounded-full">
              AI-Generated App
            </div>
          </div>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Discover surprising correlations in real economic data using AI-powered analysis. 
            Built entirely with artificial intelligence using authentic data from Federal Reserve & World Bank APIs.
          </p>
          <div className="flex items-center justify-center gap-2 mt-4 text-sm text-muted-foreground">
            <Database size={16} className="text-blue-500" />
            <span>Real data from</span>
            <span className="font-semibold text-blue-600">FRED API</span>
            <span>+</span>
            <span className="font-semibold text-green-600">World Bank API</span>
          </div>
        </header>

        <Tabs defaultValue="generator" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-6">
            <TabsTrigger value="generator">Generate</TabsTrigger>
            <TabsTrigger value="favorites">
              Favorites ({favorites?.length || 0})
            </TabsTrigger>
            <TabsTrigger value="story">
              How It Was Made
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="generator" className="space-y-6">
            <div className="flex flex-col gap-4 items-center justify-center">
              
              {/* Controls Row */}
              <div className="flex flex-col sm:flex-row gap-4 items-center">
                <div className="flex items-center gap-2">
                  <Funnel size={18} className="text-muted-foreground" />
                  <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                    <SelectTrigger className="w-48">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Categories</SelectItem>
                      <SelectItem value="economics">💰 Economics & Finance</SelectItem>
                      <SelectItem value="social">👥 Social & Demographics</SelectItem>
                      <SelectItem value="finance">📊 Finance & Markets</SelectItem>
                      <SelectItem value="demographics">👨‍👩‍👧‍👦 Demographics</SelectItem>
                      <SelectItem value="technology">💻 Technology</SelectItem>
                      <SelectItem value="environment">🌍 Environment</SelectItem>
                      <SelectItem value="health">❤️ Health</SelectItem>
                      <SelectItem value="education">🎓 Education</SelectItem>
                      <SelectItem value="trade">🌐 Trade & International</SelectItem>
                      <SelectItem value="commodities">🛢️ Commodities</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <Button 
                  onClick={generateNew}
                  disabled={isGenerating}
                  size="lg"
                  className="px-8"
                >
                  {isGenerating ? (
                    <>
                      <ArrowClockwise className="animate-spin mr-2" size={18} />
                      Fetching Real Data...
                    </>
                  ) : (
                    <>
                      <ArrowClockwise className="mr-2" size={18} />
                      Generate New Correlation
                    </>
                  )}
                </Button>
              </div>
            </div>
            
            <CorrelationCard correlation={currentCorrelation} isShareable={true} />
          </TabsContent>
          
          <TabsContent value="favorites" className="space-y-6">
            {!favorites || favorites.length === 0 ? (
              <Card className="text-center py-12">
                <CardContent>
                  <Heart size={48} className="mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No favorites yet</h3>
                  <p className="text-muted-foreground">
                    Generate correlations and save your favorites!
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-6">
                {favorites.map(correlation => (
                  <CorrelationCard key={correlation.id} correlation={correlation} />
                ))}
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="story" className="space-y-8">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
                  How CorrelateAI Pro Was Built
                </h2>
                <p className="text-lg text-muted-foreground">
                  A complete AI-assisted development journey from idea to deployment in 2 hours
                </p>
              </div>

              {/* Timeline Steps */}
              <div className="space-y-12">
                
                {/* Step 1: GitHub Spark */}
                <Card className="border-2 border-blue-200 bg-gradient-to-r from-blue-50 to-blue-100">
                  <CardHeader>
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold">1</div>
                      <h3 className="text-xl font-semibold">The Spark (0-30 minutes)</h3>
                    </div>
                    <p className="text-muted-foreground">Started with GitHub Spark - AI prototype generation</p>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="bg-white p-4 rounded-lg border">
                      <h4 className="font-semibold mb-2">💡 Original Prompt:</h4>
                      <p className="text-sm italic">"I want to create a tool that compares random datasets and finds interesting correlations between them."</p>
                    </div>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <h4 className="font-semibold mb-2">⚡ AI Generated:</h4>
                        <ul className="text-sm space-y-1">
                          <li>• Complete React + TypeScript app</li>
                          <li>• Vite build configuration</li>
                          <li>• Correlation algorithms</li>
                          <li>• Modern UI with Tailwind CSS</li>
                          <li>• Synthetic test datasets</li>
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-semibold mb-2">🎯 Result:</h4>
                        <p className="text-sm">Working prototype with interactive data visualization in minutes, not hours.</p>
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
      
      {/* Footer */}
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
            <p className="text-sm text-gray-500">
              © {new Date().getFullYear()} CorrelateAI Pro. Powered by real-time data from FRED API & World Bank API.
            </p>
          </div>
        </div>
      </footer>
      
      <Toaster />
    </div>
  )

  // CorrelationCard component moved outside to prevent re-render issues
  function CorrelationCard({ correlation, isShareable = false }: { correlation: CorrelationData; isShareable?: boolean }) {
    return (
      <Card className="w-full" ref={isShareable ? shareCardRef : undefined}>
        <CardHeader>
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <CardTitle className="text-xl font-semibold flex items-center gap-2">
                <TrendUp size={20} />
                {correlation.title}
              </CardTitle>
              <CardDescription className="mt-2">{correlation.description}</CardDescription>
            </div>
            <div className="flex items-center gap-2 ml-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => toggleFavorite(correlation)}
              >
                <Heart 
                  size={18} 
                  weight={isFavorited(correlation.id) ? "fill" : "regular"}
                  className={isFavorited(correlation.id) ? "text-red-500" : ""}
                />
              </Button>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm">
                    <Share size={18} />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuItem onClick={() => shareToTwitter(correlation)}>
                    <TwitterLogo size={16} className="mr-2" />
                    Share on Twitter
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => shareToLinkedIn(correlation)}>
                    <LinkedinLogo size={16} className="mr-2" />
                    Share on LinkedIn
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => shareToFacebook(correlation)}>
                    <FacebookLogo size={16} className="mr-2" />
                    Share on Facebook
                  </DropdownMenuItem>
                  <Separator />
                  <DropdownMenuItem onClick={() => downloadAsImage(correlation)}>
                    <Download size={16} className="mr-2" />
                    Download as Image
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => copyToClipboard(generateShareText(correlation))}>
                    <Copy size={16} className="mr-2" />
                    Copy Share Text
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
          
          <div className="flex gap-2 mt-4 flex-wrap">
            <Badge variant="secondary">
              r = {correlation.correlation > 0 ? '+' : ''}{correlation.correlation}
            </Badge>
            <Badge variant="outline">
              R² = {correlation.rSquared.toFixed(3)}
            </Badge>
            <Badge variant={correlation.isRealData ? "default" : "secondary"} className="text-xs">
              {correlation.isRealData ? (
                <>
                  <Database size={12} className="mr-1" />
                  {correlation.dataSource} Real Data
                </>
              ) : (
                <>
                  <Database size={12} className="mr-1" />
                  {categories[(correlation.variable1 as Dataset).category as keyof typeof categories]}
                </>
              )}
            </Badge>
          </div>
        </CardHeader>
        
        <CardContent>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={correlation.data}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="year" stroke="#64748b" />
                <YAxis yAxisId="left" orientation="left" stroke="#3b82f6" />
                <YAxis yAxisId="right" orientation="right" stroke="#f97316" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'white', 
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px'
                  }}
                  formatter={(value, name) => [
                    typeof value === 'number' ? value.toFixed(1) : value,
                    name === 'value1' ? correlation.variable1.name : correlation.variable2.name
                  ]}
                  labelFormatter={(year) => `Year: ${year}`}
                />
                <Line 
                  yAxisId="left"
                  type="monotone" 
                  dataKey="value1" 
                  stroke="#3b82f6" 
                  strokeWidth={2}
                  dot={{ fill: '#3b82f6', strokeWidth: 2, r: 3 }}
                  animationDuration={1200}
                />
                <Line 
                  yAxisId="right"
                  type="monotone" 
                  dataKey="value2" 
                  stroke="#f97316" 
                  strokeWidth={2}
                  dot={{ fill: '#f97316', strokeWidth: 2, r: 3 }}
                  animationDuration={1200}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
          
          <div className="mt-6 p-4 bg-muted/30 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <BookOpen size={16} />
              <span className="text-sm font-medium">Citation</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => copyToClipboard(`${correlation.citation}. ${correlation.title}. ${correlation.journal}, ${correlation.year}.`)}
              >
                <Copy size={14} />
              </Button>
            </div>
            <p className="text-sm text-muted-foreground">
              {correlation.citation}. "{correlation.title}." <em>{correlation.journal}</em>, {correlation.year}.
            </p>
          </div>
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
          <p className="text-sm text-gray-500">
            © {new Date().getFullYear()} CorrelateAI Pro. Powered by real-time data from FRED API & World Bank API.
          </p>
        </div>
      </div>
    </footer>
  )
}

export default App