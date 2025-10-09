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
    `Spurious correlation probability: ${((correlation.advancedStats.overallAssessment?.spuriousProbability || 0.5) * 100).toFixed(1)}% chance this is coincidental`,
    `Statistical reliability: ${correlation.advancedStats.overallAssessment?.reliability || "Unknown"} - comprehensive validation applied`,
    correlation.advancedStats.boxCoxTransformation?.isRecommended ? 
      "Box-Cox transformation recommended - reduces spurious correlation risk from data patterns" : 
      "Standard statistical validation - no transformation needed for spurious detection"
  ] : ["Statistical spurious correlation analysis not available"]

  // Quantum Information Theory Analysis Summary
  const quantumInsights = correlation.quantumMetrics ? [
    `Information entropy validation: ${(correlation.quantumMetrics.coherence || 0) > 0.3 ? "High information content detected" : "Standard information patterns"}`,
    `Quantum information content: ${(correlation.quantumMetrics.entanglement || 0) > 0.5 ? "Complex multi-dimensional relationships" : "Classical correlation patterns"}`,
    `Information uncertainty: ${(correlation.quantumMetrics.uncertainty || 0).toFixed(1)}% - measures spurious correlation likelihood through quantum methods`
  ] : ["Quantum information theory analysis not available"]

  // Advanced Quantum Information Theory Summary
  const advQuantumInsights = correlation.advancedQuantumAnalysis ? [
    `Bell information validation: ${correlation.advancedQuantumAnalysis.quantumEntanglement?.bellStateClassification || "Classical correlation patterns"}`,
    `Information entanglement strength: ${correlation.advancedQuantumAnalysis.quantumEntanglement?.entanglementStrength || "Standard correlation level"}`,
    `Non-classical information effects: ${correlation.advancedQuantumAnalysis.nonLocalCorrelations?.quantumAdvantage ? "Detected - advanced validation methods confirm correlation" : "Not detected - standard correlation validation sufficient"}`
  ] : ["Advanced quantum information theory analysis not available"]

  // Multi-Dimensional Quantum Information Analysis Summary
  const valentiniStrength = correlation.valentiniAnalysis?.nonequilibriumAnalysis?.nonequilibriumStrength || "none"
  const equilibriumDeviation = correlation.valentiniAnalysis?.nonequilibriumAnalysis?.equilibriumDeviation || 0
  const signalingCapability = correlation.valentiniAnalysis?.nonequilibriumAnalysis?.signalingCapability || 0
  
  const valentiniInsights = correlation.valentiniAnalysis ? [
    `Information equilibrium status: ${valentiniStrength === "none" ? "Standard information patterns (classical correlation)" : `Enhanced information detected (${valentiniStrength} complexity level)`}`,
    `Hidden information variables: ${correlation.valentiniAnalysis.hiddenVariableAnalysis?.localHiddenVariables?.detected ? "Complex information patterns present" : "Standard correlation patterns (expected for classical relationships)"}`,
    `Advanced information validation: ${signalingCapability > 0 ? `Enhanced validation possible (${(signalingCapability * 100).toFixed(2)}% confidence in quantum information methods)` : "Standard validation sufficient (classical correlation analysis appropriate)"}`
  ] : ["Multi-dimensional quantum information analysis not available"]

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
                  <p className="text-amber-800 font-medium text-sm mb-1">🎯 Spurious Correlation Detection - Primary Focus</p>
                  <p className="text-amber-700 text-xs">
                    CorrelateAI's main purpose is detecting spurious (false) correlations. This analysis uses comprehensive 
                    statistical methods and quantum information theory to provide multiple validation approaches and ensure 
                    robust verification of whether correlations are real or coincidental.
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
                        Complete coverage: P-values, permutation tests, Box-Cox transformations, and robustness measures
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
                  title="Advanced Statistical Validation"
                  icon={<Shield className="w-5 h-5 text-green-500" />}
                  summary="Comprehensive spurious correlation detection using all traditional statistical methods and robustness tests"
                  confidence={statsConfidence.level}
                  confidenceColor={statsConfidence.color}
                  insights={statsInsights}
                />
              </CardContent>
            </CollapsibleContent>
          </Collapsible>
        </Card>

        {/* Quantum Information Theory Analysis - Compact Format */}
        <Card className="border-purple-200 bg-white">
          <Collapsible open={showQuantumAnalysis} onOpenChange={setShowQuantumAnalysis}>
            <CollapsibleTrigger asChild>
              <CardHeader className="hover:bg-purple-50 cursor-pointer pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="text-lg">⚛️</div>
                    <div>
                      <CardTitle className="text-base">⚛️ Quantum Information Theory Analysis</CardTitle>
                      <CardDescription className="text-sm">
                        Holistic approach with multiple validation methods using quantum information theory
                      </CardDescription>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="bg-purple-100 text-purple-800">
                      Multiple Validation
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
                  title="Information Entropy Analysis"
                  icon={<div className="text-lg">📊</div>}
                  summary="Uses quantum information theory to detect spurious correlations through information entropy and uncertainty measures"
                  confidence="Holistic Method"
                  confidenceColor="bg-purple-100 text-purple-800"
                  insights={quantumInsights}
                />

                <SimplifiedSummaryCard
                  title="Bell Inequality Validation"
                  icon={<div className="text-lg">🌌</div>}
                  summary="Quantum information theory approach testing for deeper correlation patterns beyond classical statistics"
                  confidence="Advanced Validation"
                  confidenceColor="bg-indigo-100 text-indigo-800"
                  insights={advQuantumInsights}
                />

                <SimplifiedSummaryCard
                  title="Multi-Dimensional Verification"
                  icon={<div className="text-lg">🔬</div>}
                  summary={valentiniStrength === "none" ? 
                    "Standard validation confirms classical correlation analysis" : 
                    "Enhanced quantum information patterns suggest complex multi-dimensional relationships!"
                  }
                  confidence={valentiniStrength === "none" ? "Standard Verification" : "Advanced Quantum Info"}
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
              <h4 className="font-medium text-gray-900 mb-1">🎯 CorrelateAI's Spurious Correlation Detection</h4>
              <p className="text-sm text-gray-600">
                CorrelateAI's primary mission is detecting spurious (false) correlations that appear meaningful but are actually coincidental. 
                We use comprehensive statistical analysis covering all traditional methods, plus quantum information theory for 
                holistic validation with multiple verification approaches. This ensures robust detection of whether relationships are real or spurious.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default SimplifiedAnalysisDisplay