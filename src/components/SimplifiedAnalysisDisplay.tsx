import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'
import { ChevronDown, ChevronRight, Info, Lightbulb, Shield, BarChart3, Zap } from 'lucide-react'
import { TrendUp } from '@phosphor-icons/react'

interface CorrelationData {
  id: string
  title: string
  description: string
  correlation: number
  rSquared: number
  data: Array<{ year: number; value1: number; value2: number }>
  variable1: { name: string; unit: string; category: string; baseValue: number }
  variable2: { name: string; unit: string; category: string; baseValue: number }
  citation: string
  journal: string
  year: number
  isRealData: boolean
  dataSource: string
  quantumMetrics?: any
  advancedStats?: any
  advancedQuantumAnalysis?: any
  valentiniAnalysis?: any
}

interface SimplifiedAnalysisProps {
  correlation: CorrelationData
}

// Helper function to convert technical findings to plain English
const getConfidenceLevel = (value: number): { level: string; color: string; description: string } => {
  if (value >= 0.8) return { 
    level: "Very High", 
    color: "bg-green-100 text-green-800",
    description: "We're very confident in this finding"
  }
  if (value >= 0.6) return { 
    level: "High", 
    color: "bg-blue-100 text-blue-800",
    description: "This finding appears reliable"
  }
  if (value >= 0.4) return { 
    level: "Medium", 
    color: "bg-yellow-100 text-yellow-800",
    description: "There's some uncertainty here"
  }
  if (value >= 0.2) return { 
    level: "Low", 
    color: "bg-orange-100 text-orange-800",
    description: "This finding is less certain"
  }
  return { 
    level: "Very Low", 
    color: "bg-red-100 text-red-800",
    description: "We can't be confident in this finding"
  }
}

const getCorrelationStrength = (corr: number): { strength: string; color: string; description: string } => {
  const abs = Math.abs(corr)
  if (abs >= 0.8) return {
    strength: "Very Strong",
    color: "text-purple-600",
    description: "These variables move together very closely"
  }
  if (abs >= 0.6) return {
    strength: "Strong", 
    color: "text-blue-600",
    description: "These variables have a clear relationship"
  }
  if (abs >= 0.4) return {
    strength: "Moderate",
    color: "text-green-600", 
    description: "There's a noticeable connection"
  }
  if (abs >= 0.2) return {
    strength: "Weak",
    color: "text-yellow-600",
    description: "There might be a small connection"
  }
  return {
    strength: "Very Weak",
    color: "text-gray-600",
    description: "Little to no clear relationship"
  }
}

const SimplifiedSummaryCard: React.FC<{ 
  title: string
  icon: React.ReactNode
  summary: string
  confidence: string
  confidenceColor: string
  insights: string[]
  details?: React.ReactNode
}> = ({ title, icon, summary, confidence, confidenceColor, insights, details }) => {
  const [isExpanded, setIsExpanded] = useState(false)

  return (
    <Card className="border border-gray-200 hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {icon}
            <CardTitle className="text-lg">{title}</CardTitle>
          </div>
          <Badge className={confidenceColor}>
            {confidence}
          </Badge>
        </div>
        <CardDescription className="text-sm text-gray-600">
          {summary}
        </CardDescription>
      </CardHeader>
      
      <CardContent className="pt-0">
        <div className="space-y-2 mb-4">
          {insights.map((insight, index) => (
            <div key={index} className="flex items-start gap-2">
              <Lightbulb className="w-4 h-4 text-yellow-500 mt-0.5 flex-shrink-0" />
              <span className="text-sm">{insight}</span>
            </div>
          ))}
        </div>

        {details && (
          <Collapsible open={isExpanded} onOpenChange={setIsExpanded}>
            <CollapsibleTrigger asChild>
              <Button variant="ghost" size="sm" className="w-full justify-center gap-2">
                {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                {isExpanded ? 'Hide Technical Details' : 'Show Technical Details'}
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent className="mt-3 border-t pt-3">
              {details}
            </CollapsibleContent>
          </Collapsible>
        )}
      </CardContent>
    </Card>
  )
}

export const SimplifiedAnalysisDisplay: React.FC<SimplifiedAnalysisProps> = ({ correlation }) => {
  // State for collapsible sections
  const [showAdvancedStats, setShowAdvancedStats] = useState(false)
  const [showQuantumAnalysis, setShowQuantumAnalysis] = useState(false)
  
  const corrStrength = getCorrelationStrength(correlation.correlation)
  const direction = correlation.correlation > 0 ? "positive" : "negative"
  
  // Basic Correlation Summary
  const basicInsights = [
    `Correlation strength: ${corrStrength.strength} (${Math.abs(correlation.correlation * 100).toFixed(0)}%)`,
    `Direction: ${direction === "positive" ? "When one goes up, the other tends to go up" : "When one goes up, the other tends to go down"}`,
    `Data points analyzed: ${correlation.data.length} time periods`
  ]

  // Statistical Analysis Summary
  const statsConfidence = correlation.advancedStats ? 
    getConfidenceLevel(1 - (correlation.advancedStats.permutationTest?.pValue || 0.5)) : 
    getConfidenceLevel(0.5)

  const statsInsights = correlation.advancedStats ? [
    `Statistical reliability: ${correlation.advancedStats.overallAssessment?.reliability || "Unknown"}`,
    `Chance this is coincidence: ${((correlation.advancedStats.overallAssessment?.spuriousProbability || 0.5) * 100).toFixed(1)}%`,
    correlation.advancedStats.boxCoxTransformation?.isRecommended ? 
      "Data patterns suggest deeper mathematical relationships" : 
      "Standard statistical patterns detected"
  ] : ["Statistical analysis not available"]

  // Quantum Analysis Summary
  const quantumInsights = correlation.quantumMetrics ? [
    `Quantum coherence detected: ${(correlation.quantumMetrics.coherence || 0) > 0.3 ? "Yes" : "No"}`,
    `Information content: ${(correlation.quantumMetrics.entanglement || 0) > 0.5 ? "High" : "Low"}`,
    `Quantum uncertainty: ${(correlation.quantumMetrics.uncertainty || 0).toFixed(1)}%`
  ] : ["Quantum analysis not available"]

  // Advanced Quantum Summary
  const advQuantumInsights = correlation.advancedQuantumAnalysis ? [
    `Bell state classification: ${correlation.advancedQuantumAnalysis.quantumEntanglement?.bellStateClassification || "Unknown"}`,
    `Entanglement strength: ${correlation.advancedQuantumAnalysis.quantumEntanglement?.entanglementStrength || "N/A"}`,
    `Non-local effects: ${correlation.advancedQuantumAnalysis.nonLocalCorrelations?.quantumAdvantage ? "Detected" : "Not detected"}`
  ] : ["Advanced quantum analysis not available"]

  // Valentini Analysis Summary
  const valentiniStrength = correlation.valentiniAnalysis?.nonequilibriumAnalysis?.nonequilibriumStrength || "none"
  const equilibriumDeviation = correlation.valentiniAnalysis?.nonequilibriumAnalysis?.equilibriumDeviation || 0
  const signalingCapability = correlation.valentiniAnalysis?.nonequilibriumAnalysis?.signalingCapability || 0
  
  const valentiniInsights = correlation.valentiniAnalysis ? [
    `Quantum equilibrium status: ${valentiniStrength === "none" ? "Standard quantum behavior (in equilibrium)" : `Nonequilibrium detected (${valentiniStrength} level)`}`,
    `Hidden variable signatures: ${correlation.valentiniAnalysis.hiddenVariableAnalysis?.localHiddenVariables?.detected ? "Present" : "None detected (expected for classical data)"}`,
    `Faster-than-light signaling potential: ${signalingCapability > 0 ? `Possible (${(signalingCapability * 100).toFixed(2)}%)` : "Not possible (standard physics)"}`
  ] : ["Valentini analysis not available"]

  return (
    <div className="space-y-6">
      {/* Main Finding Summary */}
      <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-2 border-blue-200">
        <CardHeader>
          <div className="flex items-center gap-2">
            <TrendUp className="w-6 h-6 text-blue-600" />
            <CardTitle className="text-xl">Correlation Discovery</CardTitle>
          </div>
          <CardDescription className="text-lg">
            {correlation.variable1.name} and {correlation.variable2.name} show a{" "}
            <span className={`font-semibold ${corrStrength.color}`}>
              {corrStrength.strength.toLowerCase()}
            </span>{" "}
            {direction} relationship
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-gray-700 mb-4">{corrStrength.description}</p>
          <div className="bg-white p-4 rounded-lg border space-y-3">
            <p className="text-sm text-gray-600">
              <strong>What this means:</strong> {correlation.description}
            </p>
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
              <div className="flex items-start gap-2">
                <Info className="w-4 h-4 text-amber-600 mt-0.5" />
                <div>
                  <p className="text-amber-800 font-medium text-sm mb-1">Spurious Correlation Check</p>
                  <p className="text-amber-700 text-xs">
                    This correlation has been analyzed using multiple validation methods (statistical and quantum) 
                    to determine if it represents a real relationship or could be coincidental.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Analysis Sections */}
      <div className="space-y-4">
        {/* Basic Correlation Analysis - Always Visible */}
        <SimplifiedSummaryCard
          title="Basic Correlation Analysis"
          icon={<BarChart3 className="w-5 h-5 text-blue-500" />}
          summary="How closely these variables move together over time"
          confidence={corrStrength.strength}
          confidenceColor={`${corrStrength.color} bg-blue-50`}
          insights={basicInsights}
        />

        {/* Comprehensive Statistical Analysis - Compact Format */}
        <Card className="border-green-200 bg-white">
          <Collapsible open={showAdvancedStats} onOpenChange={setShowAdvancedStats}>
            <CollapsibleTrigger asChild>
              <CardHeader className="hover:bg-green-50 cursor-pointer pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Shield className="w-5 h-5 text-green-500" />
                    <div>
                      <CardTitle className="text-base">📊 Comprehensive Statistical Analysis</CardTitle>
                      <CardDescription className="text-sm">
                        Advanced statistical tests, p-values, and reliability measures
                      </CardDescription>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className={statsConfidence.color}>
                      {statsConfidence.level} Confidence
                    </Badge>
                    {showAdvancedStats ? (
                      <ChevronDown className="w-4 h-4 text-gray-500" />
                    ) : (
                      <ChevronRight className="w-4 h-4 text-gray-500" />
                    )}
                  </div>
                </div>
              </CardHeader>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <CardContent className="pt-0">
                <SimplifiedSummaryCard
                  title="Statistical Reliability Check"
                  icon={<Shield className="w-5 h-5 text-green-500" />}
                  summary="P-values, permutation tests, and traditional methods to detect coincidental patterns"
                  confidence={statsConfidence.level}
                  confidenceColor={statsConfidence.color}
                  insights={statsInsights}
                />
              </CardContent>
            </CollapsibleContent>
          </Collapsible>
        </Card>

        {/* Quantum-Inspired Analysis - Compact Format */}
        <Card className="border-purple-200 bg-white">
          <Collapsible open={showQuantumAnalysis} onOpenChange={setShowQuantumAnalysis}>
            <CollapsibleTrigger asChild>
              <CardHeader className="hover:bg-purple-50 cursor-pointer pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="text-lg">⚛️</div>
                    <div>
                      <CardTitle className="text-base">⚛️ Quantum-Inspired Analysis</CardTitle>
                      <CardDescription className="text-sm">
                        Holistic quantum approach using multi-dimensional calculation methods
                      </CardDescription>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="bg-purple-100 text-purple-800">
                      Experimental Method
                    </Badge>
                    {showQuantumAnalysis ? (
                      <ChevronDown className="w-4 h-4 text-gray-500" />
                    ) : (
                      <ChevronRight className="w-4 h-4 text-gray-500" />
                    )}
                  </div>
                </div>
              </CardHeader>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <CardContent className="pt-0 space-y-4">
                <SimplifiedSummaryCard
                  title="Quantum Information Analysis"
                  icon={<div className="text-lg">⚛️</div>}
                  summary="Uses quantum calculation methods to detect spurious correlations through multi-dimensional data analysis"
                  confidence="Experimental"
                  confidenceColor="bg-purple-100 text-purple-800"
                  insights={quantumInsights}
                />

                <SimplifiedSummaryCard
                  title="Bell Inequality Tests"
                  icon={<div className="text-lg">🌌</div>}
                  summary="Tests for advanced correlation patterns and quantum data properties vs classical coincidence"
                  confidence="Research Level"
                  confidenceColor="bg-indigo-100 text-indigo-800"
                  insights={advQuantumInsights}
                />

                <SimplifiedSummaryCard
                  title="Comprehensive Quantum Analysis"
                  icon={<div className="text-lg">🔬</div>}
                  summary={valentiniStrength === "none" ? 
                    "Standard calculation methods - validates classical correlation approach" : 
                    "Enhanced quantum signatures detected - suggests deeper multi-dimensional correlations!"
                  }
                  confidence={valentiniStrength === "none" ? "Standard Methods" : "Advanced Quantum"}
                  confidenceColor={valentiniStrength === "none" ? "bg-gray-100 text-gray-800" : "bg-pink-100 text-pink-800"}
                  insights={valentiniInsights}
                />
              </CardContent>
            </CollapsibleContent>
          </Collapsible>
        </Card>
      </div>

      {/* Educational Note */}
      <Card className="bg-gray-50 border-gray-200">
        <CardContent className="pt-6">
          <div className="flex items-start gap-3">
            <Info className="w-5 h-5 text-blue-500 mt-0.5" />
            <div>
              <h4 className="font-medium text-gray-900 mb-1">Understanding These Results</h4>
              <p className="text-sm text-gray-600">
                This analysis uses multiple layers of mathematical and scientific methods to understand relationships in data. 
                The basic correlation tells you if variables move together. Advanced methods help verify if the relationship 
                is real and explore deeper quantum calculation patterns that might exist in the data through holistic analysis approaches.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default SimplifiedAnalysisDisplay