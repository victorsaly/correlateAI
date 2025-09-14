import { useState } from 'react'
import { useKV } from '@github/spark/hooks'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Separator } from '@/components/ui/separator'
import { Heart, ArrowClockwise, Copy, TrendUp, BookOpen, Funnel, Share, Download, TwitterLogo, LinkedinLogo, FacebookLogo } from '@phosphor-icons/react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { toast } from 'sonner'

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
    year: 2020 + Math.floor(Math.random() * 4)
  }
}

function App() {
  const [currentCorrelation, setCurrentCorrelation] = useState<CorrelationData>(generateCorrelationData)
  const [favorites, setFavorites, deleteFavorites] = useKV<CorrelationData[]>("favorite-correlations", [])
  const [isGenerating, setIsGenerating] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [shareCardRef, setShareCardRef] = useState<HTMLDivElement | null>(null)

  const generateNew = async () => {
    setIsGenerating(true)
    await new Promise(resolve => setTimeout(resolve, 800)) // Simulate processing
    setCurrentCorrelation(generateCorrelationData(selectedCategory))
    setIsGenerating(false)
    toast.success("New correlation generated!")
  }

  const toggleFavorite = (correlation: CorrelationData) => {
    setFavorites(current => {
      if (!current) current = []
      const exists = current.find(fav => fav.id === correlation.id)
      if (exists) {
        toast.info("Removed from favorites")
        return current.filter(fav => fav.id !== correlation.id)
      } else {
        toast.success("Added to favorites!")
        return [...current, correlation]
      }
    })
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    toast.success("Citation copied to clipboard!")
  }

  const generateShareText = (correlation: CorrelationData) => {
    const corrType = Math.abs(correlation.correlation) > 0.7 ? "strong" : 
                     Math.abs(correlation.correlation) > 0.4 ? "moderate" : "weak"
    const direction = correlation.correlation > 0 ? "positive" : "negative"
    
    return `🔍 Fascinating ${corrType} ${direction} correlation discovered!\n\n${correlation.title}\nr = ${correlation.correlation > 0 ? '+' : ''}${correlation.correlation}\n\n${correlation.description}\n\n#SpuriousCorrelations #DataScience #Statistics`
  }

  const shareToTwitter = (correlation: CorrelationData) => {
    const text = generateShareText(correlation)
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`
    window.open(url, '_blank', 'width=600,height=400')
    toast.success("Opening Twitter share dialog!")
  }

  const shareToLinkedIn = (correlation: CorrelationData) => {
    const text = generateShareText(correlation)
    const url = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.href)}&summary=${encodeURIComponent(text)}`
    window.open(url, '_blank', 'width=600,height=600')
    toast.success("Opening LinkedIn share dialog!")
  }

  const shareToFacebook = (correlation: CorrelationData) => {
    const text = generateShareText(correlation)
    const url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}&quote=${encodeURIComponent(text)}`
    window.open(url, '_blank', 'width=600,height=400')
    toast.success("Opening Facebook share dialog!")
  }

  const downloadAsImage = async (correlation: CorrelationData) => {
    if (!shareCardRef) {
      toast.error("Share card not found. Try again in a moment.")
      return
    }

    try {
      // Dynamic import to avoid bundling issues
      const html2canvas = (await import('html2canvas')).default
      
      const canvas = await html2canvas(shareCardRef, {
        backgroundColor: '#ffffff',
        scale: 2,
        useCORS: true,
        allowTaint: true,
        height: shareCardRef.offsetHeight,
        width: shareCardRef.offsetWidth
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
  }

  const isFavorited = (id: string) => favorites?.some(fav => fav.id === id) || false

  const CorrelationCard = ({ correlation, isShareable = false }: { correlation: CorrelationData; isShareable?: boolean }) => (
    <Card className="w-full" ref={isShareable ? setShareCardRef : undefined}>
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
          <Badge variant="secondary" className="text-xs">
            {categories[correlation.variable1.category as keyof typeof categories]}
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

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-6xl mx-auto">
        <header className="text-center mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Spurious Correlations Generator
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Discover amusing fake correlations between real-world statistics. 
            Remember: correlation does not imply causation!
          </p>
        </header>

        <Tabs defaultValue="generator" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="generator">Generate</TabsTrigger>
            <TabsTrigger value="favorites">
              Favorites ({favorites?.length || 0})
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="generator" className="space-y-6">
            <div className="flex flex-col sm:flex-row gap-4 items-center justify-center">
              <div className="flex items-center gap-2">
                <Funnel size={18} className="text-muted-foreground" />
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    {Object.entries(categories).map(([key, label]) => (
                      <SelectItem key={key} value={key}>
                        {label}
                      </SelectItem>
                    ))}
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
                    Analyzing Data...
                  </>
                ) : (
                  <>
                    <ArrowClockwise className="mr-2" size={18} />
                    Generate New Correlation
                  </>
                )}
              </Button>
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
        </Tabs>
      </div>
    </div>
  )
}

export default App