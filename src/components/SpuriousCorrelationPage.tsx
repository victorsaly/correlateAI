import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'
import { Brain, Calculator, ChevronDown, TrendingUp, AlertTriangle, BookOpen, ArrowLeft, Atom, Zap } from 'lucide-react'
import { SpuriousCorrelationCalculator } from './SpuriousCorrelationCalculator'
import { QuantumCorrelationDisplay } from './QuantumCorrelationDisplay'
import { quantumCorrelationService } from '@/services/quantumCorrelationService'

interface SpuriousCorrelationPageProps {
  onBack?: () => void
}

export function SpuriousCorrelationPage({ onBack }: SpuriousCorrelationPageProps) {
  const [expandedSections, setExpandedSections] = useState<{
    examples: boolean
    methodology: boolean
    calculator: boolean
    quantum: boolean
    advanced: boolean
  }>({
    examples: true,
    methodology: false,
    calculator: false,
    quantum: true,
    advanced: false
  })

  // Sample data for quantum analysis demonstration
  const [quantumResult, setQuantumResult] = useState(() => {
    // Generate sample correlation data
    const sampleData1 = Array.from({ length: 10 }, (_, i) => ({
      year: 2014 + i,
      value: 100 + Math.random() * 50 + i * 5
    }))
    const sampleData2 = Array.from({ length: 10 }, (_, i) => ({
      year: 2014 + i,
      value: 200 + Math.random() * 80 + i * 7
    }))
    return quantumCorrelationService.calculateQuantumCorrelation(sampleData1, sampleData2)
  })

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }))
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
      {/* Header */}
      <div className="border-b border-gray-700 bg-gray-900/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-6xl mx-auto p-4">
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <div className="flex items-center gap-4">
              {onBack && (
                <Button
                  onClick={onBack}
                  variant="ghost"
                  size="sm"
                  className="text-gray-400 hover:text-white"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back
                </Button>
              )}
              <div className="flex items-center gap-3">
                <Brain className="w-8 h-8 text-purple-400" />
                <div>
                  <h1 className="text-2xl font-bold">Advanced Statistical Analysis</h1>
                  <p className="text-sm text-gray-400">Quantum-inspired correlation and spurious relationship detection</p>
                </div>
              </div>
            </div>
            <Badge variant="outline" className="bg-blue-500/20 border-blue-400 text-blue-200 shadow-md shadow-blue-500/25 shrink-0 font-medium">
              <Calculator className="w-3 h-3 mr-1" />
              Pearson 1897 Formula
            </Badge>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto p-4 space-y-6">
        
        {/* Introduction Card */}
        <Card className="bg-gray-800/50 border-gray-700">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <BookOpen className="w-5 h-5 text-cyan-400" />
              Understanding Spurious Correlations
            </CardTitle>
            <CardDescription className="text-gray-300">
              Spurious correlation occurs when two variables appear statistically correlated due to a common denominator or confounding variable, 
              despite being uncorrelated in reality. This sophisticated analysis tool implements Karl Pearson's exact 1897 mathematical formula 
              for detecting and quantifying spurious correlation strength.
            </CardDescription>
          </CardHeader>
        </Card>

        {/* Real-World Examples Section */}
        <Card className="bg-gray-800/50 border-gray-700">
          <Collapsible open={expandedSections.examples} onOpenChange={() => toggleSection('examples')}>
            <CollapsibleTrigger asChild>
              <CardHeader className="cursor-pointer hover:bg-gray-700/50 transition-colors">
                <CardTitle className="flex items-center justify-between text-white">
                  <span className="flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-orange-400" />
                    Real-World Examples
                  </span>
                  <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform ${expandedSections.examples ? 'rotate-180' : ''}`} />
                </CardTitle>
              </CardHeader>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  
                  {/* Example 1: Food Store vs Restaurant */}
                  <div className="p-4 bg-gray-700/50 rounded-lg border border-gray-600">
                    <h4 className="font-semibold text-orange-300 mb-2">Food Store vs Restaurant Spending</h4>
                    <p className="text-sm text-gray-300 mb-3">
                      Strong correlation (r = 0.986) between food store sales and restaurant spending appears highly significant, 
                      but both are driven by population size as a common denominator.
                    </p>
                    <div className="space-y-2 text-xs">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Raw Correlation:</span>
                        <span className="font-mono text-orange-300">0.986</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Common Denominator:</span>
                        <span className="text-gray-300">Population Size</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Spurious Strength:</span>
                        <span className="font-mono text-red-400">High</span>
                      </div>
                    </div>
                  </div>

                  {/* Example 2: Ice Cream vs Drowning */}
                  <div className="p-4 bg-gray-700/50 rounded-lg border border-gray-600">
                    <h4 className="font-semibold text-red-300 mb-2">Ice Cream Sales vs Drowning Deaths</h4>
                    <p className="text-sm text-gray-300 mb-3">
                      Classic example where both variables increase during summer months, creating false causation 
                      despite no direct relationship between ice cream consumption and drowning incidents.
                    </p>
                    <div className="space-y-2 text-xs">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Raw Correlation:</span>
                        <span className="font-mono text-red-300">0.78</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Confounding Variable:</span>
                        <span className="text-gray-300">Season/Temperature</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Causation:</span>
                        <span className="text-red-400">None</span>
                      </div>
                    </div>
                  </div>

                  {/* Example 3: Economic Ratios */}
                  <div className="p-4 bg-gray-700/50 rounded-lg border border-gray-600">
                    <h4 className="font-semibold text-yellow-300 mb-2">Economic Ratio Analysis</h4>
                    <p className="text-sm text-gray-300 mb-3">
                      GDP-to-population vs debt-to-population ratios show high correlation primarily due to 
                      population being the shared denominator, not economic causation.
                    </p>
                    <div className="space-y-2 text-xs">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Formula Type:</span>
                        <span className="text-gray-300">X/Z vs Y/Z</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Detection Method:</span>
                        <span className="text-gray-300">Pearson Analysis</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Risk Level:</span>
                        <span className="text-yellow-400">Medium</span>
                      </div>
                    </div>
                  </div>

                  {/* Example 4: Scientific Research */}
                  <div className="p-4 bg-gray-700/50 rounded-lg border border-gray-600">
                    <h4 className="font-semibold text-blue-300 mb-2">Research Publication Bias</h4>
                    <p className="text-sm text-gray-300 mb-3">
                      Number of published studies vs positive results correlation can be misleading when 
                      publication bias favors studies with significant findings.
                    </p>
                    <div className="space-y-2 text-xs">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Bias Type:</span>
                        <span className="text-gray-300">Publication Selection</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Detection:</span>
                        <span className="text-gray-300">Statistical Testing</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Impact:</span>
                        <span className="text-blue-400">Research Validity</span>
                      </div>
                    </div>
                  </div>

                </div>
              </CardContent>
            </CollapsibleContent>
          </Collapsible>
        </Card>

        {/* Investigation Methodology */}
        <Card className="bg-gray-800/50 border-gray-700">
          <Collapsible open={expandedSections.methodology} onOpenChange={() => toggleSection('methodology')}>
            <CollapsibleTrigger asChild>
              <CardHeader className="cursor-pointer hover:bg-gray-700/50 transition-colors">
                <CardTitle className="flex items-center justify-between text-white">
                  <span className="flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5 text-yellow-400" />
                    Detection Methodology
                  </span>
                  <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform ${expandedSections.methodology ? 'rotate-180' : ''}`} />
                </CardTitle>
              </CardHeader>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <CardContent className="space-y-6">
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  
                  {/* Step-by-Step Process */}
                  <div className="space-y-4">
                    <h4 className="font-semibold text-yellow-300 mb-3">Investigation Steps</h4>
                    
                    <div className="space-y-3">
                      <div className="flex gap-3">
                        <div className="w-6 h-6 bg-yellow-500 text-black rounded-full flex items-center justify-center text-xs font-bold">1</div>
                        <div>
                          <h5 className="font-medium text-gray-200">Identify Common Denominators</h5>
                          <p className="text-sm text-gray-400">Look for shared variables that could artificially inflate correlation</p>
                        </div>
                      </div>
                      
                      <div className="flex gap-3">
                        <div className="w-6 h-6 bg-yellow-500 text-black rounded-full flex items-center justify-center text-xs font-bold">2</div>
                        <div>
                          <h5 className="font-medium text-gray-200">Calculate Coefficient of Variation</h5>
                          <p className="text-sm text-gray-400">Measure relative variability for each variable (CV = σ/μ)</p>
                        </div>
                      </div>
                      
                      <div className="flex gap-3">
                        <div className="w-6 h-6 bg-yellow-500 text-black rounded-full flex items-center justify-center text-xs font-bold">3</div>
                        <div>
                          <h5 className="font-medium text-gray-200">Apply Pearson Formula</h5>
                          <p className="text-sm text-gray-400">Use the 1897 exact formula for spurious correlation quantification</p>
                        </div>
                      </div>
                      
                      <div className="flex gap-3">
                        <div className="w-6 h-6 bg-yellow-500 text-black rounded-full flex items-center justify-center text-xs font-bold">4</div>
                        <div>
                          <h5 className="font-medium text-gray-200">Statistical Testing</h5>
                          <p className="text-sm text-gray-400">Perform permutation tests to validate findings</p>
                        </div>
                      </div>
                      
                      <div className="flex gap-3">
                        <div className="w-6 h-6 bg-yellow-500 text-black rounded-full flex items-center justify-center text-xs font-bold">5</div>
                        <div>
                          <h5 className="font-medium text-gray-200">Risk Assessment</h5>
                          <p className="text-sm text-gray-400">Categorize spurious correlation strength and provide recommendations</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Mathematical Foundation */}
                  <div className="space-y-4">
                    <h4 className="font-semibold text-blue-300 mb-3">Mathematical Foundation</h4>
                    
                    <div className="p-4 bg-blue-900/30 border border-blue-700/50 rounded-lg">
                      <h5 className="font-semibold text-blue-200 mb-2">Pearson's Exact Formula (1897)</h5>
                      <div className="font-mono text-sm text-blue-300 mb-2 break-all">
                        r(x/z,y/z) = V₁/z² × sgn(E(x)) × sgn(E(y)) / √[(Vₓ²(1+V₁/z²)+V₁/z²)(Vᵧ²(1+V₁/z²)+V₁/z²)]
                      </div>
                      <p className="text-xs text-blue-400">
                        Where V = coefficient of variation (σ/μ), E = expected value, sgn = sign function
                      </p>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="p-3 bg-gray-700/50 rounded border border-gray-600">
                        <h6 className="text-sm font-medium text-gray-200 mb-1">Coefficient of Variation</h6>
                        <div className="font-mono text-xs text-gray-300">CV = σ/μ</div>
                        <p className="text-xs text-gray-400 mt-1">Measures relative variability</p>
                      </div>
                      
                      <div className="p-3 bg-gray-700/50 rounded border border-gray-600">
                        <h6 className="text-sm font-medium text-gray-200 mb-1">Box-Cox Transformation</h6>
                        <div className="font-mono text-xs text-gray-300">y(λ) = (y^λ - 1) / λ</div>
                        <p className="text-xs text-gray-400 mt-1">Normalizes data distribution</p>
                      </div>
                      
                      <div className="p-3 bg-gray-700/50 rounded border border-gray-600">
                        <h6 className="text-sm font-medium text-gray-200 mb-1">Permutation Testing</h6>
                        <div className="font-mono text-xs text-gray-300">p-value = N(r_perm ≥ r_obs) / n_permutations</div>
                        <p className="text-xs text-gray-400 mt-1">Validates statistical significance</p>
                      </div>
                    </div>
                  </div>
                  
                </div>
              </CardContent>
            </CollapsibleContent>
          </Collapsible>
        </Card>

        {/* Spurious Correlation Calculator */}
        <Card className="bg-gray-800/50 border-gray-700">
          <Collapsible open={expandedSections.calculator} onOpenChange={() => toggleSection('calculator')}>
            <CollapsibleTrigger asChild>
              <CardHeader className="cursor-pointer hover:bg-gray-700/50 transition-colors">
                <CardTitle className="flex items-center justify-between text-white">
                  <span className="flex items-center gap-2">
                    <Calculator className="w-5 h-5 text-green-400" />
                    Spurious Correlation Calculator
                  </span>
                  <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform ${expandedSections.calculator ? 'rotate-180' : ''}`} />
                </CardTitle>
              </CardHeader>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <CardContent>
                <SpuriousCorrelationCalculator />
              </CardContent>
            </CollapsibleContent>
          </Collapsible>
        </Card>

        {/* Quantum-Inspired Correlation Analysis */}
        <Card className="bg-gray-800/50 border-gray-700">
          <Collapsible open={expandedSections.quantum} onOpenChange={() => toggleSection('quantum')}>
            <CollapsibleTrigger asChild>
              <CardHeader className="cursor-pointer hover:bg-gray-700/50 transition-colors">
                <CardTitle className="flex items-center justify-between text-white">
                  <span className="flex items-center gap-2">
                    <Atom className="w-5 h-5 text-purple-400" />
                    Quantum-Inspired Analysis
                  </span>
                  <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform ${expandedSections.quantum ? 'rotate-180' : ''}`} />
                </CardTitle>
              </CardHeader>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <CardContent>
                <div className="space-y-6">
                  <div className="bg-gradient-to-r from-purple-900/20 to-blue-900/20 border border-purple-500/30 rounded-lg p-4">
                    <h4 className="text-lg font-semibold text-purple-300 mb-3 flex items-center gap-2">
                      <Zap className="w-5 h-5" />
                      Quantum Correlation Metrics
                    </h4>
                    <p className="text-gray-300 mb-4">
                      Our quantum-inspired analysis uses advanced algorithms to detect non-linear relationships, 
                      entanglement patterns, and coherence levels that traditional correlation methods might miss.
                    </p>
                    
                    {/* Live Quantum Analysis Demo */}
                    <div className="bg-gray-900/50 rounded-lg p-4 border border-gray-600/50">
                      <h5 className="text-md font-medium text-cyan-300 mb-3">Live Analysis Example</h5>
                      <QuantumCorrelationDisplay
                        result={quantumResult}
                        title="Sample Quantum Analysis"
                        variable1Name="Economic Indicator A"
                        variable2Name="Market Factor B"
                      />
                    </div>

                    {/* Quantum vs Classical Comparison */}
                    <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="bg-gray-900/30 p-4 rounded-lg border border-blue-500/20">
                        <h6 className="font-semibold text-blue-300 mb-2">🔬 Quantum-Inspired Metrics</h6>
                        <ul className="text-sm text-gray-300 space-y-1">
                          <li>• Quantum Confidence: {(quantumResult.quantumConfidence).toFixed(1)}%</li>
                          <li>• Entanglement Strength: {quantumResult.entanglementStrength.toFixed(3)}</li>
                          <li>• Coherence Score: {quantumResult.coherenceScore.toFixed(3)}</li>
                          <li>• Quantum Significance: {(quantumResult.quantumSignificance).toFixed(1)}%</li>
                        </ul>
                      </div>
                      <div className="bg-gray-900/30 p-4 rounded-lg border border-green-500/20">
                        <h6 className="font-semibold text-green-300 mb-2">📊 Classical Metrics</h6>
                        <ul className="text-sm text-gray-300 space-y-1">
                          <li>• Pearson Correlation: {quantumResult.correlation.toFixed(3)}</li>
                          <li>• R-Squared: {quantumResult.rSquared.toFixed(3)}</li>
                          <li>• Statistical Significance: {(quantumResult.significance).toFixed(1)}%</li>
                          <li>• Direction: {quantumResult.direction}</li>
                        </ul>
                      </div>
                    </div>

                    {/* Key Advantages */}
                    <div className="mt-6 bg-purple-900/20 border border-purple-500/30 rounded-lg p-4">
                      <h6 className="font-semibold text-purple-300 mb-3">🚀 Quantum Analysis Advantages</h6>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-gray-300">
                        <div>• Detects non-linear relationships</div>
                        <div>• Measures data entanglement patterns</div>
                        <div>• Evaluates coherence levels</div>
                        <div>• Provides quantum confidence intervals</div>
                        <div>• Identifies hidden correlations</div>
                        <div>• Advanced significance testing</div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </CollapsibleContent>
          </Collapsible>
        </Card>

        {/* Advanced Statistical Methods */}
        <Card className="bg-gray-800/50 border-gray-700">
          <Collapsible open={expandedSections.advanced} onOpenChange={() => toggleSection('advanced')}>
            <CollapsibleTrigger asChild>
              <CardHeader className="cursor-pointer hover:bg-gray-700/50 transition-colors">
                <CardTitle className="flex items-center justify-between text-white">
                  <span className="flex items-center gap-2">
                    <Brain className="w-5 h-5 text-purple-400" />
                    Advanced Statistical Methods
                  </span>
                  <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform ${expandedSections.advanced ? 'rotate-180' : ''}`} />
                </CardTitle>
              </CardHeader>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <CardContent className="space-y-6">
                
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                  
                  <div className="p-4 bg-purple-900/30 border border-purple-700/50 rounded-lg">
                    <h4 className="font-semibold text-purple-300 mb-2">Time Series Analysis</h4>
                    <p className="text-sm text-gray-300 mb-3">
                      Detects spurious correlations in temporal data by analyzing trend components and seasonal patterns.
                    </p>
                    <ul className="text-xs text-gray-400 space-y-1">
                      <li>• Trend decomposition</li>
                      <li>• Seasonal adjustment</li>
                      <li>• Lag correlation analysis</li>
                      <li>• Granger causality tests</li>
                    </ul>
                  </div>
                  
                  <div className="p-4 bg-green-900/30 border border-green-700/50 rounded-lg">
                    <h4 className="font-semibold text-green-300 mb-2">Multivariate Control</h4>
                    <p className="text-sm text-gray-300 mb-3">
                      Controls for multiple confounding variables simultaneously using partial correlation techniques.
                    </p>
                    <ul className="text-xs text-gray-400 space-y-1">
                      <li>• Partial correlation analysis</li>
                      <li>• Multiple regression control</li>
                      <li>• Instrumental variables</li>
                      <li>• Propensity score matching</li>
                    </ul>
                  </div>
                  
                  <div className="p-4 bg-orange-900/30 border border-orange-700/50 rounded-lg">
                    <h4 className="font-semibold text-orange-300 mb-2">Non-parametric Methods</h4>
                    <p className="text-sm text-gray-300 mb-3">
                      Distribution-free approaches for robust spurious correlation detection without normality assumptions.
                    </p>
                    <ul className="text-xs text-gray-400 space-y-1">
                      <li>• Spearman rank correlation</li>
                      <li>• Kendall's tau</li>
                      <li>• Bootstrap resampling</li>
                      <li>• Robust statistical tests</li>
                    </ul>
                  </div>
                  
                </div>

                <Separator className="bg-gray-600" />

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  
                  <div>
                    <h4 className="font-semibold text-cyan-300 mb-3">Research Applications</h4>
                    <div className="space-y-3">
                      <div className="p-3 bg-cyan-900/20 rounded border border-cyan-700/30">
                        <h5 className="text-sm font-medium text-cyan-200 mb-1">Epidemiological Studies</h5>
                        <p className="text-xs text-gray-400">Control for population demographics and geographic confounders</p>
                      </div>
                      <div className="p-3 bg-cyan-900/20 rounded border border-cyan-700/30">
                        <h5 className="text-sm font-medium text-cyan-200 mb-1">Economic Research</h5>
                        <p className="text-xs text-gray-400">Account for GDP, population size, and temporal trends</p>
                      </div>
                      <div className="p-3 bg-cyan-900/20 rounded border border-cyan-700/30">
                        <h5 className="text-sm font-medium text-cyan-200 mb-1">Social Sciences</h5>
                        <p className="text-xs text-gray-400">Identify confounding variables in behavioral correlations</p>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold text-red-300 mb-3">Common Pitfalls</h4>
                    <div className="space-y-3">
                      <div className="p-3 bg-red-900/20 rounded border border-red-700/30">
                        <h5 className="text-sm font-medium text-red-200 mb-1">Simpson's Paradox</h5>
                        <p className="text-xs text-gray-400">Correlation reverses when data is properly grouped</p>
                      </div>
                      <div className="p-3 bg-red-900/20 rounded border border-red-700/30">
                        <h5 className="text-sm font-medium text-red-200 mb-1">Data Dredging</h5>
                        <p className="text-xs text-gray-400">Multiple comparisons inflate false discovery rates</p>
                      </div>
                      <div className="p-3 bg-red-900/20 rounded border border-red-700/30">
                        <h5 className="text-sm font-medium text-red-200 mb-1">Survivorship Bias</h5>
                        <p className="text-xs text-gray-400">Missing data creates artificial correlations</p>
                      </div>
                    </div>
                  </div>
                  
                </div>
              </CardContent>
            </CollapsibleContent>
          </Collapsible>
        </Card>

        {/* Footer */}
        <Card className="bg-gray-800/30 border-gray-700">
          <CardContent className="p-4">
            <div className="text-center space-y-2">
              <p className="text-sm text-gray-400">
                Based on Karl Pearson's 1897 mathematical foundations and modern ScienceDirect research
              </p>
              <div className="flex items-center justify-center gap-4 text-xs text-gray-500">
                <span>• Mathematical rigor</span>
                <span>• Peer-reviewed algorithms</span>
                <span>• Statistical validation</span>
              </div>
            </div>
          </CardContent>
        </Card>

      </div>
    </div>
  )
}