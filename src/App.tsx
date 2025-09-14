import { useState } from 'react'
import { useKV } from '@github/spark/hooks'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Heart, ArrowClockwise, Copy, TrendUp, BookOpen } from '@phosphor-icons/react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { toast } from 'sonner'

interface CorrelationData {
  id: string
  title: string
  description: string
  correlation: number
  rSquared: number
  data: Array<{ year: number; value1: number; value2: number }>
  variable1: { name: string; unit: string }
  variable2: { name: string; unit: string }
  citation: string
  journal: string
  year: number
}

const datasets = [
  { name: "Ice cream sales", unit: "thousands of gallons", baseValue: 150, trend: 0.05, seasonal: true },
  { name: "Drowning deaths", unit: "fatalities", baseValue: 45, trend: 0.02, seasonal: true },
  { name: "Divorce rate in Maine", unit: "per 1,000", baseValue: 5.2, trend: -0.03, seasonal: false },
  { name: "Margarine consumption", unit: "lbs per capita", baseValue: 8.2, trend: -0.08, seasonal: false },
  { name: "Cat ownership", unit: "cats per household", baseValue: 1.3, trend: 0.04, seasonal: false },
  { name: "Rat infestations", unit: "reports per 1,000 homes", baseValue: 12, trend: 0.06, seasonal: true },
  { name: "Apple sales", unit: "millions sold", baseValue: 280, trend: -0.02, seasonal: true },
  { name: "Lightning strikes", unit: "incidents", baseValue: 400, trend: 0.01, seasonal: true },
  { name: "Netflix subscriptions", unit: "millions", baseValue: 45, trend: 0.15, seasonal: false },
  { name: "Bicycle accidents", unit: "reported incidents", baseValue: 890, trend: 0.03, seasonal: true },
  { name: "Coffee shop density", unit: "shops per sq mile", baseValue: 2.1, trend: 0.07, seasonal: false },
  { name: "Pigeon population", unit: "birds per block", baseValue: 18, trend: 0.02, seasonal: true },
]

const journals = [
  "Journal of Spurious Statistics",
  "International Review of Questionable Data",
  "Proceedings of Correlation Confusion",
  "Annals of Statistical Coincidence",
  "Quarterly Journal of Dubious Findings"
]

function generateCorrelationData(): CorrelationData {
  const var1 = datasets[Math.floor(Math.random() * datasets.length)]
  let var2 = datasets[Math.floor(Math.random() * datasets.length)]
  while (var2 === var1) {
    var2 = datasets[Math.floor(Math.random() * datasets.length)]
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

  const generateNew = async () => {
    setIsGenerating(true)
    await new Promise(resolve => setTimeout(resolve, 800)) // Simulate processing
    setCurrentCorrelation(generateCorrelationData())
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

  const isFavorited = (id: string) => favorites?.some(fav => fav.id === id) || false

  const CorrelationCard = ({ correlation }: { correlation: CorrelationData }) => (
    <Card className="w-full">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <CardTitle className="text-xl font-semibold flex items-center gap-2">
              <TrendUp size={20} />
              {correlation.title}
            </CardTitle>
            <CardDescription className="mt-2">{correlation.description}</CardDescription>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => toggleFavorite(correlation)}
            className="ml-4"
          >
            <Heart 
              size={18} 
              weight={isFavorited(correlation.id) ? "fill" : "regular"}
              className={isFavorited(correlation.id) ? "text-red-500" : ""}
            />
          </Button>
        </div>
        
        <div className="flex gap-2 mt-4">
          <Badge variant="secondary">
            r = {correlation.correlation > 0 ? '+' : ''}{correlation.correlation}
          </Badge>
          <Badge variant="outline">
            R² = {correlation.rSquared.toFixed(3)}
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
            <div className="flex justify-center">
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
            
            <CorrelationCard correlation={currentCorrelation} />
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