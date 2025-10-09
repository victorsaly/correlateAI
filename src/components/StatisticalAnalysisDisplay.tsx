/**
 * Comprehensive Statistical Analysis Display Component
 * 
 * Displays enhanced statistical analysis results with modern detection methods
 * including permutation testing, Box-Cox transformations, coefficient of variation,
 * robust correlations, and non-parametric tests in a user-friendly format.
 */

import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { Progress } from '@/components/ui/progress'
import { 
  TrendingUp, 
  TrendingDown, 
  AlertTriangle, 
  CheckCircle, 
  XCircle, 
  Info,
  BarChart3,
  Activity,
  Shield,
  Zap,
  Target,
  AlertCircle,
  ChevronDown,
  ChevronRight,
  Calculator,
  FlaskConical,
  Microscope,
  Brain,
  TrendingUp as TrendUp
} from 'lucide-react'
import { EnhancedStatisticalResult } from '@/services/advancedStatisticalService'

interface StatisticalAnalysisDisplayProps {
  analysis: EnhancedStatisticalResult
  variable1Name: string
  variable2Name: string
  className?: string
}

export function StatisticalAnalysisDisplay({
  analysis,
  variable1Name,
  variable2Name,
  className = ''
}: StatisticalAnalysisDisplayProps) {
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    overview: true,
    correlations: false,
    permutation: false,
    boxcox: false,
    coefficient: false,
    robust: false,
    nonparametric: false,
    diagnostics: false
  })

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }))
  }

  const getReliabilityColor = (reliability: string) => {
    switch (reliability) {
      case 'Very High': return 'text-green-600 bg-green-50'
      case 'High': return 'text-blue-600 bg-blue-50'
      case 'Medium': return 'text-yellow-600 bg-yellow-50'
      case 'Low': return 'text-orange-600 bg-orange-50'
      case 'Very Low': return 'text-red-600 bg-red-50'
      default: return 'text-gray-600 bg-gray-50'
    }
  }

  const getSpuriousRiskColor = (probability: number) => {
    if (probability >= 70) return 'text-red-600 bg-red-50'
    if (probability >= 50) return 'text-orange-600 bg-orange-50'
    if (probability >= 30) return 'text-yellow-600 bg-yellow-50'
    return 'text-green-600 bg-green-50'
  }

  const getSectionIcon = (section: string) => {
    const icons = {
      overview: Target,
      correlations: BarChart3,
      permutation: FlaskConical,
      boxcox: TrendUp,
      coefficient: Calculator,
      robust: Shield,
      nonparametric: Microscope,
      diagnostics: Activity
    }
    return icons[section as keyof typeof icons] || Info
  }

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Overall Assessment */}
      <Card className="border-l-4 border-l-blue-500">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg flex items-center gap-2">
              <Target className="h-5 w-5 text-blue-600" />
              Statistical Analysis Overview
            </CardTitle>
            <Badge className={getReliabilityColor(analysis.overallAssessment.reliability)}>
              {analysis.overallAssessment.reliability} Reliability
            </Badge>
          </div>
          <CardDescription>
            Comprehensive statistical validation using modern detection methods
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Key Metrics Row */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-3 bg-gray-50 rounded-lg">
              <div className="text-sm text-gray-600">Recommended Method</div>
              <div className="font-semibold text-gray-900 text-sm">
                {analysis.overallAssessment.recommendedMethod}
              </div>
            </div>
            <div className="text-center p-3 bg-gray-50 rounded-lg">
              <div className="text-sm text-gray-600">Confidence Level</div>
              <div className="font-semibold text-gray-900">
                {analysis.overallAssessment.confidenceLevel.toFixed(1)}%
              </div>
            </div>
            <div className="text-center p-3 bg-gray-50 rounded-lg">
              <div className="text-sm text-gray-600">Spurious Risk</div>
              <div className={`font-semibold ${getSpuriousRiskColor(analysis.overallAssessment.spuriousProbability).split(' ')[0]}`}>
                {analysis.overallAssessment.spuriousProbability.toFixed(0)}%
              </div>
            </div>
            <div className="text-center p-3 bg-gray-50 rounded-lg">
              <div className="text-sm text-gray-600">Statistical Power</div>
              <div className="font-semibold text-gray-900">
                {(analysis.permutationTest.statisticalPower * 100).toFixed(0)}%
              </div>
            </div>
          </div>

          {/* Statistical Warnings */}
          {analysis.overallAssessment.statisticalWarnings.length > 0 && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <div className="flex items-start gap-2">
                <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5 flex-shrink-0" />
                <div className="space-y-2">
                  <div className="font-medium text-yellow-800">Statistical Warnings</div>
                  <ul className="text-sm text-yellow-700 space-y-1">
                    {analysis.overallAssessment.statisticalWarnings.map((warning, idx) => (
                      <li key={idx} className="flex items-start gap-1">
                        <span className="text-yellow-600 mt-1">•</span>
                        <span>{warning}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Correlation Methods Comparison */}
      <Collapsible 
        open={expandedSections.correlations} 
        onOpenChange={() => toggleSection('correlations')}
      >
        <CollapsibleTrigger asChild>
          <Card className="cursor-pointer hover:bg-gray-50 transition-colors">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base flex items-center gap-2">
                  <BarChart3 className="h-4 w-4 text-purple-600" />
                  Correlation Methods Comparison
                  {expandedSections.correlations ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                </CardTitle>
                <Badge variant="outline">
                  {Math.abs(analysis.pearsonCorrelation).toFixed(3)} strongest
                </Badge>
              </div>
            </CardHeader>
          </Card>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <Card>
            <CardContent className="pt-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-4 border rounded-lg">
                  <div className="text-sm text-gray-600 mb-1">Pearson (Linear)</div>
                  <div className="text-2xl font-bold text-blue-600">
                    {analysis.pearsonCorrelation.toFixed(3)}
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    Best for linear relationships
                  </div>
                </div>
                <div className="text-center p-4 border rounded-lg">
                  <div className="text-sm text-gray-600 mb-1">Spearman (Rank)</div>
                  <div className="text-2xl font-bold text-green-600">
                    {analysis.spearmanCorrelation.toFixed(3)}
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    Robust to outliers
                  </div>
                </div>
                <div className="text-center p-4 border rounded-lg">
                  <div className="text-sm text-gray-600 mb-1">Kendall Tau</div>
                  <div className="text-2xl font-bold text-orange-600">
                    {analysis.kendallTau.toFixed(3)}
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    Non-parametric
                  </div>
                </div>
              </div>
              
              {Math.abs(analysis.pearsonCorrelation - analysis.spearmanCorrelation) > 0.2 && (
                <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="flex items-start gap-2">
                    <Info className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                    <div className="text-sm text-blue-700">
                      <strong>Correlation Method Divergence:</strong> The difference between Pearson and Spearman 
                      correlations suggests potential non-linear relationships or outlier influence.
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </CollapsibleContent>
      </Collapsible>

      {/* Permutation Test Results */}
      <Collapsible 
        open={expandedSections.permutation} 
        onOpenChange={() => toggleSection('permutation')}
      >
        <CollapsibleTrigger asChild>
          <Card className="cursor-pointer hover:bg-gray-50 transition-colors">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base flex items-center gap-2">
                  <FlaskConical className="h-4 w-4 text-green-600" />
                  Permutation Testing
                  {expandedSections.permutation ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                </CardTitle>
                <Badge variant={analysis.permutationTest.pValueCorrected < 0.05 ? "default" : "destructive"}>
                  p = {analysis.permutationTest.pValueCorrected.toFixed(4)}
                </Badge>
              </div>
            </CardHeader>
          </Card>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <Card>
            <CardContent className="pt-6 space-y-4">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <div className="text-sm text-gray-600">Raw p-value</div>
                  <div className="font-semibold text-gray-900">
                    {analysis.permutationTest.pValue.toFixed(4)}
                  </div>
                </div>
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <div className="text-sm text-gray-600">Corrected p-value</div>
                  <div className="font-semibold text-gray-900">
                    {analysis.permutationTest.pValueCorrected.toFixed(4)}
                  </div>
                </div>
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <div className="text-sm text-gray-600">Effect Size</div>
                  <div className="font-semibold text-gray-900">
                    {analysis.permutationTest.effectSize.toFixed(2)}
                  </div>
                </div>
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <div className="text-sm text-gray-600">Permutations</div>
                  <div className="font-semibold text-gray-900">
                    {analysis.permutationTest.permutationsUsed.toLocaleString()}
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Statistical Power</span>
                  <span>{(analysis.permutationTest.statisticalPower * 100).toFixed(1)}%</span>
                </div>
                <Progress value={analysis.permutationTest.statisticalPower * 100} className="h-2" />
              </div>

              <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
                <strong>Bootstrap Confidence Interval (95%):</strong> [
                {analysis.permutationTest.bootstrapCI[0].toFixed(3)}, 
                {analysis.permutationTest.bootstrapCI[1].toFixed(3)}]
              </div>

              {analysis.permutationTest.pValueCorrected < 0.05 ? (
                <div className="flex items-start gap-2 p-3 bg-green-50 border border-green-200 rounded-lg">
                  <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <div className="text-sm text-green-700">
                    <strong>Statistically Significant:</strong> The correlation is unlikely to be due to chance 
                    (p &lt; 0.05 after multiple comparison correction).
                  </div>
                </div>
              ) : (
                <div className="flex items-start gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
                  <XCircle className="h-4 w-4 text-red-600 mt-0.5 flex-shrink-0" />
                  <div className="text-sm text-red-700">
                    <strong>Not Statistically Significant:</strong> The correlation may be due to random chance. 
                    Consider gathering more data or investigating potential confounding variables.
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </CollapsibleContent>
      </Collapsible>

      {/* Box-Cox Analysis */}
      <Collapsible 
        open={expandedSections.boxcox} 
        onOpenChange={() => toggleSection('boxcox')}
      >
        <CollapsibleTrigger asChild>
          <Card className="cursor-pointer hover:bg-gray-50 transition-colors">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base flex items-center gap-2">
                  <TrendUp className="h-4 w-4 text-orange-600" />
                  Box-Cox Transformation Analysis
                  {expandedSections.boxcox ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                </CardTitle>
                <Badge variant={analysis.boxCoxAnalysis.transformationNeeded ? "destructive" : "default"}>
                  {analysis.boxCoxAnalysis.transformationNeeded ? "Needed" : "Not Needed"}
                </Badge>
              </div>
            </CardHeader>
          </Card>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <Card>
            <CardContent className="pt-6 space-y-4">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <div className="text-sm text-gray-600">λ₁ ({variable1Name})</div>
                  <div className="font-semibold text-gray-900">
                    {analysis.boxCoxAnalysis.optimalLambda1.toFixed(2)}
                  </div>
                </div>
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <div className="text-sm text-gray-600">λ₂ ({variable2Name})</div>
                  <div className="font-semibold text-gray-900">
                    {analysis.boxCoxAnalysis.optimalLambda2.toFixed(2)}
                  </div>
                </div>
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <div className="text-sm text-gray-600">Likelihood Ratio</div>
                  <div className="font-semibold text-gray-900">
                    {analysis.boxCoxAnalysis.likelihoodRatio.toFixed(2)}
                  </div>
                </div>
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <div className="text-sm text-gray-600">Goodness of Fit</div>
                  <div className="font-semibold text-gray-900">
                    {analysis.boxCoxAnalysis.goodnessOfFit.toFixed(3)}
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Transformed Correlation</span>
                  <span className="font-mono">{analysis.boxCoxAnalysis.transformedCorrelation.toFixed(3)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Original Correlation</span>
                  <span className="font-mono">{analysis.pearsonCorrelation.toFixed(3)}</span>
                </div>
              </div>

              {analysis.boxCoxAnalysis.transformationNeeded ? (
                <div className="flex items-start gap-2 p-3 bg-orange-50 border border-orange-200 rounded-lg">
                  <AlertTriangle className="h-4 w-4 text-orange-600 mt-0.5 flex-shrink-0" />
                  <div className="text-sm text-orange-700">
                    <strong>Transformation Recommended:</strong> Box-Cox transformation could reduce spurious 
                    correlations by normalizing the data distribution and reducing heteroscedastic noise.
                  </div>
                </div>
              ) : (
                <div className="flex items-start gap-2 p-3 bg-green-50 border border-green-200 rounded-lg">
                  <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <div className="text-sm text-green-700">
                    <strong>Transformation Not Needed:</strong> The current data distribution is suitable 
                    for correlation analysis without transformation.
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </CollapsibleContent>
      </Collapsible>

      {/* Coefficient of Variation Analysis */}
      <Collapsible 
        open={expandedSections.coefficient} 
        onOpenChange={() => toggleSection('coefficient')}
      >
        <CollapsibleTrigger asChild>
          <Card className="cursor-pointer hover:bg-gray-50 transition-colors">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base flex items-center gap-2">
                  <Calculator className="h-4 w-4 text-indigo-600" />
                  Coefficient of Variation Analysis
                  {expandedSections.coefficient ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                </CardTitle>
                <Badge className={
                  analysis.coefficientVariation.spuriousRisk === 'Critical' ? 'bg-red-100 text-red-800' :
                  analysis.coefficientVariation.spuriousRisk === 'High' ? 'bg-orange-100 text-orange-800' :
                  analysis.coefficientVariation.spuriousRisk === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-green-100 text-green-800'
                }>
                  {analysis.coefficientVariation.spuriousRisk} Risk
                </Badge>
              </div>
            </CardHeader>
          </Card>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <Card>
            <CardContent className="pt-6 space-y-4">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <div className="text-sm text-gray-600">CV₁ ({variable1Name})</div>
                  <div className="font-semibold text-gray-900">
                    {analysis.coefficientVariation.cv1.toFixed(3)}
                  </div>
                </div>
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <div className="text-sm text-gray-600">CV₂ ({variable2Name})</div>
                  <div className="font-semibold text-gray-900">
                    {analysis.coefficientVariation.cv2.toFixed(3)}
                  </div>
                </div>
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <div className="text-sm text-gray-600">CV-Based Correlation</div>
                  <div className="font-semibold text-gray-900">
                    {analysis.coefficientVariation.cvBasedCorrelation.toFixed(3)}
                  </div>
                </div>
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <div className="text-sm text-gray-600">Time-Varying CV</div>
                  <div className="font-semibold text-gray-900">
                    {analysis.coefficientVariation.timeVaryingCV1.length} points
                  </div>
                </div>
              </div>

              <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
                <strong>Coefficient of Variation Formula:</strong> CV = σ/μ (standard deviation / mean)
                <br />
                <strong>Interpretation:</strong> Higher CV values indicate greater relative variability, 
                which can lead to spurious correlations when variables share common denominators.
              </div>

              {analysis.coefficientVariation.spuriousRisk === 'Critical' || analysis.coefficientVariation.spuriousRisk === 'High' ? (
                <div className="flex items-start gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
                  <AlertTriangle className="h-4 w-4 text-red-600 mt-0.5 flex-shrink-0" />
                  <div className="text-sm text-red-700">
                    <strong>High Spurious Correlation Risk:</strong> The coefficient of variation analysis suggests 
                    elevated risk of spurious correlation due to high variability patterns. Consider investigating 
                    potential third variables or common denominators.
                  </div>
                </div>
              ) : (
                <div className="flex items-start gap-2 p-3 bg-green-50 border border-green-200 rounded-lg">
                  <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <div className="text-sm text-green-700">
                    <strong>Low Spurious Risk:</strong> The coefficient of variation patterns suggest 
                    the correlation is less likely to be spurious based on variability analysis.
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </CollapsibleContent>
      </Collapsible>

      {/* Robust Analysis */}
      <Collapsible 
        open={expandedSections.robust} 
        onOpenChange={() => toggleSection('robust')}
      >
        <CollapsibleTrigger asChild>
          <Card className="cursor-pointer hover:bg-gray-50 transition-colors">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base flex items-center gap-2">
                  <Shield className="h-4 w-4 text-teal-600" />
                  Robust Statistical Analysis
                  {expandedSections.robust ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                </CardTitle>
                <Badge variant={analysis.robustAnalysis.outlierInfluence > 0.3 ? "destructive" : "default"}>
                  {analysis.robustAnalysis.leveragePoints.length} outliers
                </Badge>
              </div>
            </CardHeader>
          </Card>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <Card>
            <CardContent className="pt-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <div className="text-sm text-gray-600">Median Correlation</div>
                  <div className="font-semibold text-gray-900">
                    {analysis.robustAnalysis.medianCorrelation.toFixed(3)}
                  </div>
                </div>
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <div className="text-sm text-gray-600">MAD-Based</div>
                  <div className="font-semibold text-gray-900">
                    {analysis.robustAnalysis.madBasedCorrelation.toFixed(3)}
                  </div>
                </div>
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <div className="text-sm text-gray-600">Winsorized</div>
                  <div className="font-semibold text-gray-900">
                    {analysis.robustAnalysis.winsorizedCorrelation.toFixed(3)}
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Outlier Influence</span>
                  <span>{(analysis.robustAnalysis.outlierInfluence * 100).toFixed(1)}%</span>
                </div>
                <Progress value={analysis.robustAnalysis.outlierInfluence * 100} className="h-2" />
              </div>

              {analysis.robustAnalysis.outlierInfluence > 0.2 && (
                <div className="flex items-start gap-2 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <AlertCircle className="h-4 w-4 text-yellow-600 mt-0.5 flex-shrink-0" />
                  <div className="text-sm text-yellow-700">
                    <strong>Outlier Influence Detected:</strong> Results may be sensitive to extreme values. 
                    Consider using robust correlation methods (median-based or winsorized) for more reliable estimates.
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </CollapsibleContent>
      </Collapsible>

      {/* Non-parametric Tests */}
      <Collapsible 
        open={expandedSections.nonparametric} 
        onOpenChange={() => toggleSection('nonparametric')}
      >
        <CollapsibleTrigger asChild>
          <Card className="cursor-pointer hover:bg-gray-50 transition-colors">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base flex items-center gap-2">
                  <Microscope className="h-4 w-4 text-pink-600" />
                  Non-parametric Tests
                  {expandedSections.nonparametric ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                </CardTitle>
                <Badge variant={analysis.nonParametricTests.normalityAssessment === 'Normal' ? "default" : "secondary"}>
                  {analysis.nonParametricTests.normalityAssessment}
                </Badge>
              </div>
            </CardHeader>
          </Card>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <Card>
            <CardContent className="pt-6 space-y-4">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <div className="text-sm text-gray-600">Mann-Whitney U</div>
                  <div className="font-semibold text-gray-900">
                    {analysis.nonParametricTests.mannWhitneyU.toFixed(3)}
                  </div>
                </div>
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <div className="text-sm text-gray-600">Wilcoxon</div>
                  <div className="font-semibold text-gray-900">
                    {analysis.nonParametricTests.wilcoxonRankSum.toFixed(3)}
                  </div>
                </div>
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <div className="text-sm text-gray-600">K-S Test</div>
                  <div className="font-semibold text-gray-900">
                    {analysis.nonParametricTests.kolmogorovSmirnov.toFixed(3)}
                  </div>
                </div>
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <div className="text-sm text-gray-600">Normality</div>
                  <div className="font-semibold text-gray-900 text-xs">
                    {analysis.nonParametricTests.normalityAssessment}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <div className="text-sm text-gray-600">Shapiro-Wilk p₁</div>
                  <div className="font-semibold text-gray-900">
                    {analysis.nonParametricTests.shapiroWilkP1.toFixed(3)}
                  </div>
                </div>
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <div className="text-sm text-gray-600">Shapiro-Wilk p₂</div>
                  <div className="font-semibold text-gray-900">
                    {analysis.nonParametricTests.shapiroWilkP2.toFixed(3)}
                  </div>
                </div>
              </div>

              {analysis.nonParametricTests.normalityAssessment === 'Non-Normal' && (
                <div className="flex items-start gap-2 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <Info className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                  <div className="text-sm text-blue-700">
                    <strong>Non-normal Distribution:</strong> Data deviates from normal distribution. 
                    Consider using Spearman correlation or Kendall's tau for more robust results.
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </CollapsibleContent>
      </Collapsible>

      {/* Advanced Diagnostics */}
      <Collapsible 
        open={expandedSections.diagnostics} 
        onOpenChange={() => toggleSection('diagnostics')}
      >
        <CollapsibleTrigger asChild>
          <Card className="cursor-pointer hover:bg-gray-50 transition-colors">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base flex items-center gap-2">
                  <Activity className="h-4 w-4 text-red-600" />
                  Advanced Diagnostics
                  {expandedSections.diagnostics ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                </CardTitle>
                <Badge variant="outline">
                  {Object.values(analysis.diagnostics).filter(val => typeof val === 'number' && val > 0.5).length} concerns
                </Badge>
              </div>
            </CardHeader>
          </Card>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <Card>
            <CardContent className="pt-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Heteroscedasticity</span>
                    <span className={analysis.diagnostics.heteroscedasticityTest > 0.5 ? 'text-red-600' : 'text-green-600'}>
                      {analysis.diagnostics.heteroscedasticityTest.toFixed(3)}
                    </span>
                  </div>
                  <Progress 
                    value={Math.abs(analysis.diagnostics.heteroscedasticityTest) * 100} 
                    className="h-2" 
                  />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Autocorrelation (Lag-1)</span>
                    <span className={analysis.diagnostics.autocorrelationLag1 > 0.5 ? 'text-red-600' : 'text-green-600'}>
                      {analysis.diagnostics.autocorrelationLag1.toFixed(3)}
                    </span>
                  </div>
                  <Progress 
                    value={Math.abs(analysis.diagnostics.autocorrelationLag1) * 100} 
                    className="h-2" 
                  />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Stationarity</span>
                    <span className={analysis.diagnostics.stationarityTest > 0.7 ? 'text-red-600' : 'text-green-600'}>
                      {analysis.diagnostics.stationarityTest.toFixed(3)}
                    </span>
                  </div>
                  <Progress 
                    value={Math.abs(analysis.diagnostics.stationarityTest) * 100} 
                    className="h-2" 
                  />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Structural Break</span>
                    <span className={analysis.diagnostics.structuralBreakTest > 0.5 ? 'text-red-600' : 'text-green-600'}>
                      {analysis.diagnostics.structuralBreakTest.toFixed(3)}
                    </span>
                  </div>
                  <Progress 
                    value={Math.abs(analysis.diagnostics.structuralBreakTest) * 100} 
                    className="h-2" 
                  />
                </div>
              </div>

              <div className="text-center p-3 bg-gray-50 rounded-lg">
                <div className="text-sm text-gray-600">Multicollinearity Index (VIF)</div>
                <div className="font-semibold text-gray-900">
                  {analysis.diagnostics.multicollinearityIndex.toFixed(2)}
                </div>
              </div>

              <div className="space-y-2">
                {analysis.diagnostics.heteroscedasticityTest > 0.5 && (
                  <div className="text-sm p-2 bg-yellow-50 border border-yellow-200 rounded">
                    <strong>Heteroscedasticity detected:</strong> Consider robust standard errors or data transformation.
                  </div>
                )}
                {analysis.diagnostics.autocorrelationLag1 > 0.5 && (
                  <div className="text-sm p-2 bg-yellow-50 border border-yellow-200 rounded">
                    <strong>Autocorrelation detected:</strong> Time series methods may be more appropriate.
                  </div>
                )}
                {analysis.diagnostics.stationarityTest > 0.7 && (
                  <div className="text-sm p-2 bg-yellow-50 border border-yellow-200 rounded">
                    <strong>Non-stationary trends:</strong> Consider differencing or detrending the data.
                  </div>
                )}
                {analysis.diagnostics.structuralBreakTest > 0.5 && (
                  <div className="text-sm p-2 bg-yellow-50 border border-yellow-200 rounded">
                    <strong>Structural break detected:</strong> Relationship may have changed over time.
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </CollapsibleContent>
      </Collapsible>
    </div>
  )
}

export default StatisticalAnalysisDisplay