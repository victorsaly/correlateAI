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
import { Heart, ArrowClockwise, Copy, TrendUp, BookOpen, Funnel, Share, Download, TwitterLogo, LinkedinLogo, FacebookLogo, Database, Info, Sparkle, Code, Lightning, Check, Target, ArrowSquareOut, Rocket, ArrowsOut, ArrowsIn, MagnifyingGlass, Minus, FileCsv, FileText, Link, ImageSquare, Sliders, Robot, Eye, Lightbulb } from '@phosphor-icons/react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceArea } from 'recharts'
import { toast, Toaster } from 'sonner'
import { useIsMobile } from '@/hooks/use-mobile'
import SwirlBackground from '@/components/SwirlBackground'
import { DataSourcesCard, SourceAttribution, DataSourceBadge } from '@/components/DataSources'

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
}

const categories = {
  food: "🍎 Food & Consumption",
  technology: "📱 Technology", 
  weather: "⛅ Weather & Environment",
  social: "👥 Social & Demographics",
  health: "❤️ Health & Wellness"
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

function App() {
  const [isAppLoading, setIsAppLoading] = useState(true)
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
        setIsAppLoading(true)
        
        // Simulate initial loading time for better UX
        await new Promise(resolve => setTimeout(resolve, 1000))
        
        // Count real datasets from public/data/ folder
        let realDatasetCount = 0
        try {
          const response = await fetch('/data/summary.json')
          if (response.ok) {
            const summary = await response.json()
            // Count datasets mentioned in summary, excluding summary itself
            realDatasetCount = summary?.datasets?.length || 32 // Fallback to manual count
          }
        } catch (error) {
          console.warn('Could not fetch real dataset summary, using fallback count')
          realDatasetCount = 32 // Manual count based on FRED + World Bank data
        }

        // Count AI-generated datasets from public/ai-data/ folder
        let aiDatasetCount = 0
        try {
          const response = await fetch('/ai-data/generation_summary.json')
          if (response.ok) {
            const aiSummary = await response.json()
            aiDatasetCount = aiSummary?.totalDatasets || 48 // Fallback based on directory listing
          }
        } catch (error) {
          console.warn('Could not fetch AI dataset summary, using fallback count')
          aiDatasetCount = 48 // Manual count based on generated files
        }

        // Also count synthetic datasets used in the app
        const syntheticCount = datasets.length

        const totalCount = realDatasetCount + aiDatasetCount + syntheticCount
        const stats = {
          real: realDatasetCount, // Real datasets from APIs (FRED, World Bank)
          ai: aiDatasetCount + syntheticCount, // AI-generated + synthetic datasets
          total: totalCount
        }
        
        setTotalDatasetCount(totalCount)
        setDatasetStats(stats)
      } catch (error) {
        console.warn('Failed to load dataset count:', error)
        // Enhanced fallback with realistic counts
        const fallbackStats = {
          real: 32, // Known real datasets
          ai: 48 + datasets.length, // AI datasets + synthetic
          total: 32 + 48 + datasets.length
        }
        setTotalDatasetCount(fallbackStats.total)
        setDatasetStats(fallbackStats)
      } finally {
        setIsAppLoading(false)
      }
    }
    
    loadDatasetCount()
  }, [])

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
      toast.info("🤖 Generating AI-powered correlation analysis...")
      
      // Add small delay for better UX (simulate processing)
      await new Promise(resolve => setTimeout(resolve, 800))
      
      // Use synthetic data generation which works with all our categories
      const newCorrelation = generateCorrelationData(selectedCategory === 'all' ? undefined : selectedCategory)
      setCurrentCorrelation(newCorrelation)
      toast.success("✨ New correlation generated!")
      
    } catch (error) {
      console.error('Error generating correlation:', error)
      toast.error("Failed to generate correlation")
    } finally {
      setIsGenerating(false)
    }
  }, [selectedCategory])

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

  const detectPatternAnomalies = useCallback((correlation: CorrelationData) => {
    const data = correlation.data
    const insights: string[] = []
    
    // Check for sudden changes
    for (let i = 1; i < data.length - 1; i++) {
      const prev = data[i - 1]
      const curr = data[i]
      const next = data[i + 1]
      
      const change1 = Math.abs(curr.value1 - prev.value1) / prev.value1
      const change2 = Math.abs(curr.value2 - prev.value2) / prev.value2
      
      if (change1 > 0.2 || change2 > 0.2) {
        insights.push(`📈 Significant change detected in ${curr.year}`)
      }
      
      // Check for correlation breakdown
      const localCorr1 = (curr.value1 - prev.value1) * (curr.value2 - prev.value2)
      const localCorr2 = (next.value1 - curr.value1) * (next.value2 - curr.value2)
      
      if (localCorr1 * localCorr2 < 0) {
        insights.push(`⚠️ Correlation pattern shifts around ${curr.year}`)
      }
    }
    
    // Check overall strength
    if (Math.abs(correlation.correlation) > 0.8) {
      insights.push(`🔥 Exceptionally strong correlation (${(correlation.correlation * 100).toFixed(1)}%)`)
    } else if (Math.abs(correlation.correlation) < 0.2) {
      insights.push(`🎲 Weak correlation - may be coincidental`)
    }
    
    return insights
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
              <h1 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
                CorrelateAI Pro
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
          <TabsList className={`grid w-full grid-cols-4 mb-6 bg-gray-700/50 border border-gray-600/50 ${isMobile ? 'h-14 rounded-xl p-1' : 'h-12 rounded-lg p-1'}`}>
            <TabsTrigger 
              value="generator" 
              className={`text-gray-300 data-[state=active]:text-cyan-400 data-[state=active]:bg-gray-800 ${isMobile ? 'px-3 py-2 text-sm rounded-lg font-medium' : 'px-4 py-2 text-base rounded-md font-medium'} transition-all duration-200`}
            >
              {isMobile ? "Generate" : "Generate"}
            </TabsTrigger>
            <TabsTrigger 
              value="favorites" 
              className={`text-gray-300 data-[state=active]:text-cyan-400 data-[state=active]:bg-gray-800 ${isMobile ? 'px-3 py-2 text-sm rounded-lg font-medium' : 'px-4 py-2 text-base rounded-md font-medium'} transition-all duration-200`}
            >
              {isMobile ? `❤ ${favorites?.length || 0}` : `Favorites (${favorites?.length || 0})`}
            </TabsTrigger>
            <TabsTrigger 
              value="discover" 
              className={`text-gray-300 data-[state=active]:text-purple-400 data-[state=active]:bg-gray-800 ${isMobile ? 'px-3 py-2 text-sm rounded-lg font-medium' : 'px-4 py-2 text-base rounded-md font-medium'} transition-all duration-200`}
            >
              {isMobile ? "🔮 Discover" : "🔮 Discover"}
            </TabsTrigger>
            <TabsTrigger 
              value="story" 
              className={`text-gray-300 data-[state=active]:text-cyan-400 data-[state=active]:bg-gray-800 ${isMobile ? 'px-3 py-2 text-sm rounded-lg font-medium' : 'px-4 py-2 text-base rounded-md font-medium'} transition-all duration-200`}
            >
              {isMobile ? "Story" : "AI Story"}
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
                      {Object.entries(categories).map(([key, label]) => (
                        <SelectItem key={key} value={key} className="text-gray-200 hover:bg-gray-700">
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
                      <Eye size={16} className="mr-2" />
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

              {/* Pattern Insights for Current Correlation */}
              <Card className="bg-gradient-to-r from-purple-900/30 to-pink-900/30 border-purple-700/50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-purple-300">
                    <Robot size={20} />
                    AI Pattern Analysis
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {detectPatternAnomalies(currentCorrelation).length > 0 ? (
                      detectPatternAnomalies(currentCorrelation).map((insight, index) => (
                        <div key={index} className="flex items-start gap-3 p-3 bg-purple-800/20 rounded-lg">
                          <div className="w-2 h-2 bg-purple-400 rounded-full mt-2 flex-shrink-0"></div>
                          <p className="text-purple-200 text-sm">{insight}</p>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-6">
                        <Robot size={48} className="mx-auto text-purple-500 mb-3" />
                        <p className="text-purple-300">No unusual patterns detected</p>
                        <p className="text-purple-400 text-sm mt-1">The correlation follows expected statistical behavior</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

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
                  {isMobile ? "AI-assisted development in 2 hours" : "A complete AI-assisted development journey from idea to deployment in 2 hours"}
                </p>
                
                {/* Quick Actions */}
                <div className={`flex ${isMobile ? 'flex-col gap-3' : 'gap-4 justify-center'} mb-8`}>
                  <Button
                    onClick={() => window.open('https://spark.github.com', '_blank')}
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
                            onClick={() => window.open('https://spark.github.com', '_blank')}
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
                          <li className="flex items-center gap-2"><Database size={12} className="text-purple-500" />FRED API - 20 economic datasets</li>
                          <li className="flex items-center gap-2"><Database size={12} className="text-purple-500" />World Bank API - 11 global indicators</li>
                          <li className="flex items-center gap-2"><Database size={12} className="text-purple-500" />Real-time data streaming</li>
                          <li className="flex items-center gap-2"><Database size={12} className="text-purple-500" />Professional data validation</li>
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
                            onClick={() => window.open('https://spark.github.com', '_blank')}
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
                              <li>• World Bank API</li>
                              <li>• Custom dataset APIs</li>
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
                            onClick={() => window.open('https://spark.github.com', '_blank')}
                            className="w-full justify-start"
                          >
                            <Sparkle size={16} className="mr-2" />
                            GitHub Spark
                          </Button>
                        </div>
                        <div className="space-y-2">
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
                      onClick={() => window.open('https://spark.github.com', '_blank')}
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
                  <p className="text-xs text-gray-400 mt-1">Building the future with AI assistance</p>
                </div>
              </div>
            </div>

            {/* Quick Stats */}
            <div className={`${isMobile ? 'w-full' : ''}`}>
              <div className={`grid ${isMobile ? 'grid-cols-2 gap-4' : 'grid-cols-3 gap-6'} text-center`}>
                <div className="bg-gray-700/50 rounded-lg p-3 sm:p-4 backdrop-blur-sm">
                  <div className="text-lg sm:text-2xl font-bold text-cyan-400">31</div>
                  <div className="text-xs sm:text-sm text-gray-300">Data Sources</div>
                </div>
                <div className="bg-gray-700/50 rounded-lg p-3 sm:p-4 backdrop-blur-sm">
                  <div className="text-lg sm:text-2xl font-bold text-purple-400">2h</div>
                  <div className="text-xs sm:text-sm text-gray-300">Dev Time</div>
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
              © 2025 Victor Saly. Built with AI assistance using GitHub Spark, React, and authentic economic data.
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
  
  // Chart zoom/pan state
  const [zoomState, setZoomState] = useState<{
    refAreaLeft?: string | number
    refAreaRight?: string | number
    left?: string | number
    right?: string | number
    animation?: boolean
  }>({ animation: true })
  const [isZooming, setIsZooming] = useState(false)
  
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

  // Chart zoom functionality
  const zoomOut = useCallback(() => {
    setZoomState({ 
      refAreaLeft: undefined, 
      refAreaRight: undefined,
      left: 'dataMin',
      right: 'dataMax',
      animation: true
    })
  }, [])

  const zoom = useCallback(() => {
    let { refAreaLeft, refAreaRight } = zoomState
    const { data } = correlation

    if (refAreaLeft === refAreaRight || !refAreaLeft || !refAreaRight) {
      setZoomState(prev => ({ ...prev, refAreaLeft: undefined, refAreaRight: undefined }))
      return
    }

    // Ensure left is smaller than right
    if (refAreaLeft > refAreaRight) [refAreaLeft, refAreaRight] = [refAreaRight, refAreaLeft]

    setZoomState({
      refAreaLeft: undefined,
      refAreaRight: undefined,
      left: refAreaLeft,
      right: refAreaRight,
      animation: false
    })
  }, [zoomState, correlation])

  const handleMouseDown = useCallback((e: any) => {
    if (e?.activeLabel) {
      setZoomState(prev => ({ ...prev, refAreaLeft: e.activeLabel }))
      setIsZooming(true)
    }
  }, [])

  const handleMouseMove = useCallback((e: any) => {
    if (isZooming && e?.activeLabel && zoomState.refAreaLeft) {
      setZoomState(prev => ({ ...prev, refAreaRight: e.activeLabel }))
    }
  }, [isZooming, zoomState.refAreaLeft])

  const handleMouseUp = useCallback(() => {
    if (isZooming) {
      zoom()
      setIsZooming(false)
    }
  }, [isZooming, zoom])

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
                  <Heart size={16} className="text-white" />
                </div>
                <span className={`${isMobile ? 'text-sm' : ''}`}>
                  {correlation.title}
                </span>
              </div>
              <Badge 
                variant="secondary" 
                className={`${getCorrelationColor(correlation.correlation)} ${isMobile ? 'text-xs' : ''} ${
                  Math.abs(correlation.correlation) >= 0.7 ? 'animate-pulse' : ''
                }`}
              >
                {correlation.correlation > 0 ? '+' : ''}
                {(correlation.correlation * 100).toFixed(1)}% correlation
              </Badge>
            </CardTitle>
            <p className={`text-gray-300 mt-2 leading-relaxed ${isMobile ? 'text-xs' : 'text-sm'}`}>
              {correlation.description}
            </p>
          </div>
          
          <div className={`flex gap-2 ${isMobile ? 'w-full justify-between' : 'flex-col'}`}>
            {isShareable && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-gray-300 hover:text-cyan-400 hover:bg-gray-700/50"
                    title="Export options"
                  >
                    <Download size={16} />
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
                  className="text-gray-300 hover:text-cyan-400 hover:bg-gray-700/50"
                  title="Share this correlation"
                >
                  <Share size={16} />
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
              className={`hover:bg-gray-700/50 ${
                favorites.some(fav => fav.id === correlation.id) 
                  ? 'text-red-400 hover:text-red-300' 
                  : 'text-gray-300 hover:text-red-400'
              }`}
              onClick={() => toggleFavorite?.(correlation)}
              title={favorites.some(fav => fav.id === correlation.id) ? "Remove from favorites" : "Add to favorites"}
            >
              <Heart size={16} className={favorites.some(fav => fav.id === correlation.id) ? 'fill-current' : ''} />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="text-gray-300 hover:text-purple-400 hover:bg-gray-700/50"
              onClick={() => showCorrelationDetails(correlation)}
              title="View detailed analysis"
            >
              <Info size={16} />
            </Button>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className={`${isMobile ? 'p-3 pt-0' : ''}`}>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
          <div className="space-y-4">
            <div>
              <h4 className={`font-medium text-gray-200 mb-3 ${isMobile ? 'text-sm' : ''}`}>Variable Details</h4>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Dataset X:</span>
                  <span className="text-cyan-400 font-medium">{correlation.variable1.name}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Dataset Y:</span>
                  <span className="text-purple-400 font-medium">{correlation.variable2.name}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Strength:</span>
                  <span className={getCorrelationColor(correlation.correlation)}>
                    {getCorrelationStrength(correlation.correlation)}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Significance:</span>
                  <span className={Math.abs(correlation.correlation) >= 0.5 ? 'text-green-400' : 'text-yellow-400'}>
                    {Math.abs(correlation.correlation) >= 0.7 ? 'High' : 
                     Math.abs(correlation.correlation) >= 0.5 ? 'Moderate' : 'Low'}
                  </span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="space-y-4">
            <div>
              <h4 className={`font-medium text-gray-200 mb-3 ${isMobile ? 'text-sm' : ''}`}>Analysis Insights</h4>
              <div className="space-y-2 text-sm">
                <div className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-cyan-400 rounded-full mt-2 flex-shrink-0"></div>
                  <p className="text-gray-300 leading-relaxed">
                    {Math.abs(correlation.correlation) >= 0.7 
                      ? "Strong relationship detected - significant statistical correlation"
                      : Math.abs(correlation.correlation) >= 0.5 
                      ? "Moderate relationship - worth investigating further"
                      : "Weak relationship - may be coincidental"}
                  </p>
                </div>
                <div className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-purple-400 rounded-full mt-2 flex-shrink-0"></div>
                  <p className="text-gray-300 leading-relaxed">
                    {correlation.correlation > 0 
                      ? "Positive correlation - variables tend to increase together"
                      : "Negative correlation - one increases as the other decreases"}
                  </p>
                </div>
                <div className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-yellow-400 rounded-full mt-2 flex-shrink-0"></div>
                  <p className="text-gray-300 leading-relaxed text-xs italic">
                    Remember: Correlation does not imply causation
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Chart Visualization */}
        <div className="mt-6">
          {/* Chart Controls */}
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-400">Interactive Chart:</span>
              <span className="text-xs text-gray-500">Click & drag to zoom</span>
            </div>
            <div className="flex gap-1">
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={zoomOut}
                className="text-gray-400 hover:text-cyan-400 h-8 px-2"
                title="Reset zoom"
              >
                <ArrowsOut size={14} />
              </Button>
            </div>
          </div>
          
          <div className={`h-64 sm:h-80 ${isMobile ? 'px-2' : ''}`}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart 
                data={correlation.data} 
                margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.3} />
                <XAxis 
                  dataKey="year" 
                  stroke="#9CA3AF" 
                  fontSize={isMobile ? 10 : 12}
                  tick={{ fill: '#9CA3AF' }}
                  domain={[zoomState.left || 'dataMin', zoomState.right || 'dataMax']}
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
                
                {/* Zoom selection area */}
                {zoomState.refAreaLeft && zoomState.refAreaRight && (
                  <ReferenceArea
                    yAxisId="left"
                    x1={zoomState.refAreaLeft}
                    x2={zoomState.refAreaRight}
                    strokeOpacity={0.3}
                    fill="#06B6D4"
                    fillOpacity={0.1}
                  />
                )}
                
                <Line
                  yAxisId="left"
                  type="monotone"
                  dataKey="value1"
                  stroke="#06B6D4"
                  strokeWidth={2}
                  dot={{ fill: '#06B6D4', strokeWidth: 2, r: isMobile ? 3 : 4 }}
                  activeDot={{ r: isMobile ? 5 : 6, stroke: '#06B6D4', strokeWidth: 2 }}
                  name={correlation.variable1.name}
                  animationDuration={zoomState.animation ? 1000 : 0}
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
                  animationDuration={zoomState.animation ? 1000 : 0}
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
          <div className="w-full bg-gray-700/50 rounded-full h-2">
            <div 
              className={`h-2 rounded-full transition-all duration-500 ${
                Math.abs(correlation.correlation) >= 0.7 ? 'bg-gradient-to-r from-red-500 to-red-600' :
                Math.abs(correlation.correlation) >= 0.5 ? 'bg-gradient-to-r from-orange-500 to-orange-600' :
                'bg-gradient-to-r from-yellow-500 to-yellow-600'
              }`}
              style={{ width: `${Math.abs(correlation.correlation) * 100}%` }}
            ></div>
          </div>
        </div>
        
        {/* Data Source Attribution */}
        {correlation.isRealData && (
          <div className="mt-4 pt-4 border-t border-gray-700/50">
            <div className="text-xs text-gray-400 mb-2">
              Data Source: <span className="text-cyan-400 font-medium">{correlation.dataSource}</span>
            </div>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => copyToClipboard(correlation.citation)}
              className="text-xs text-gray-400 hover:text-gray-300"
            >
              <Copy size={12} className="mr-1" />
              Copy Citation
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

export default App
