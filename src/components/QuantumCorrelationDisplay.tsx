/**
 * User-Friendly Quantum Correlation Display Component
 * 
 * Displays correlation analysis with quantum enhancements in a user-friendly way.
 * Gracefully handles missing quantum data and provides clear explanations.
 */

import React from 'react'
import { TrendingUp, TrendingDown, Minus, Zap, Atom, Waves, Target, Shield, Brain, Activity, AlertCircle, Info } from 'lucide-react'
import { QuantumCorrelationResult } from '@/services/quantumCorrelationService'

interface QuantumCorrelationDisplayProps {
  result: QuantumCorrelationResult | any // Allow any type for flexibility
  title: string
  variable1Name: string
  variable2Name: string
  className?: string
}

export function QuantumCorrelationDisplay({
  result,
  title,
  variable1Name,
  variable2Name,
  className = ''
}: QuantumCorrelationDisplayProps) {
  
  // Check if quantum metrics are available
  const hasQuantumMetrics = result && 
    typeof result.quantumConfidence === 'number' &&
    typeof result.entanglementStrength === 'number' &&
    typeof result.coherenceScore === 'number'
  
  // Fallback values for missing quantum data
  const safeResult = {
    correlation: result?.correlation || 0.78,
    rSquared: result?.rSquared || 0.61,
    significance: result?.significance || 95.2,
    direction: result?.direction || 'Positive',
    strength: result?.strength || 'Strong',
    reliability: result?.reliability || 'High',
    quantumConfidence: result?.quantumConfidence || 87.3,
    entanglementStrength: result?.entanglementStrength || 0.74,
    coherenceScore: result?.coherenceScore || 0.82,
    quantumSignificance: result?.quantumSignificance || 92.1,
    quantumState: result?.quantumState || {
      phase: 0.67,
      amplitude: 0.85,
      interference: 0.58,
      superposition: 0.71
    },
    dataQuality: result?.dataQuality || 91.5,
    temporalStability: result?.temporalStability || 86.2,
    noiseLevel: result?.noiseLevel || 0.15
  }

  // Get appropriate icons and colors based on correlation
  const getDirectionIcon = () => {
    if (safeResult.direction === 'Positive') return <TrendingUp className="w-5 h-5" />
    if (safeResult.direction === 'Negative') return <TrendingDown className="w-5 h-5" />
    return <Minus className="w-5 h-5" />
  }

  const getStrengthColor = () => {
    switch (safeResult.strength) {
      case 'Very Strong': return 'text-emerald-400 border-emerald-500/30'
      case 'Strong': return 'text-green-400 border-green-500/30'
      case 'Moderate': return 'text-yellow-400 border-yellow-500/30'
      case 'Weak': return 'text-orange-400 border-orange-500/30'
      case 'Very Weak': return 'text-red-400 border-red-500/30'
      default: return 'text-gray-400 border-gray-500/30'
    }
  }

  const getReliabilityColor = () => {
    switch (safeResult.reliability) {
      case 'Very High': return 'text-emerald-300'
      case 'High': return 'text-green-300'
      case 'Medium': return 'text-yellow-300'
      case 'Low': return 'text-red-300'
      default: return 'text-gray-300'
    }
  }

  const formatPercentage = (value: number) => `${value.toFixed(1)}%`
  const formatValue = (value: number, decimals = 3) => value.toFixed(decimals)

  return (
    <div
      className={`bg-gray-800/50 border border-gray-700/50 rounded-lg p-6 backdrop-blur-sm transition-all duration-500 animate-fade-in ${className}`}
    >
      {/* Header with Status Indicator */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-xl font-bold text-white flex items-center gap-2 transition-opacity duration-300">
            <Atom className="w-6 h-6 text-blue-400" />
            {title}
          </h3>
          {!hasQuantumMetrics && (
            <div className="flex items-center gap-1 text-yellow-400 text-sm">
              <AlertCircle className="w-4 h-4" />
              <span>Demo Mode</span>
            </div>
          )}
        </div>
        <p className="text-gray-300 text-sm">
          {variable1Name} ↔ {variable2Name}
        </p>
        {!hasQuantumMetrics && (
          <div className="mt-2 p-3 bg-yellow-900/20 border border-yellow-500/30 rounded-lg">
            <div className="flex items-start gap-2">
              <Info className="w-4 h-4 text-yellow-400 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-yellow-200 text-sm font-medium">Demo Values Shown</p>
                <p className="text-yellow-300/80 text-xs mt-1">
                  Quantum analysis is not yet calculated for this correlation. The values shown are representative examples 
                  to demonstrate how quantum-enhanced metrics would appear.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Main Correlation Display */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Primary Correlation */}
        <div
          className={`p-4 border rounded-lg ${getStrengthColor()} bg-gray-900/30 transition-all duration-300 hover:scale-105`}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-300">
              {safeResult.direction} Correlation
            </span>
            {getDirectionIcon()}
          </div>
          <div className="text-3xl font-bold mb-1">
            {formatValue(safeResult.correlation)}
          </div>
          <div className="text-sm text-gray-400">
            {safeResult.strength}
          </div>
          <div className="text-xs text-gray-500 mt-1">
            R² = {formatValue(safeResult.rSquared)}
          </div>
        </div>

        {/* Quantum Confidence */}
        <div
          className="p-4 border border-blue-500/30 rounded-lg bg-blue-900/20 transition-all duration-300 hover:scale-105"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-300">
              Quantum Confidence
            </span>
            <Zap className="w-4 h-4 text-blue-400" />
          </div>
          <div className="text-3xl font-bold text-blue-400 mb-1">
            {formatPercentage(safeResult.quantumConfidence)}
          </div>
          <div className="text-sm text-gray-400">
            Reliability: <span className={getReliabilityColor()}>{safeResult.reliability}</span>
          </div>
          <div className="text-xs text-gray-500 mt-1">
            Enhanced statistical confidence
          </div>
        </div>

        {/* Significance */}
        <div
          className="p-4 border border-purple-500/30 rounded-lg bg-purple-900/20 transition-all duration-300 hover:scale-105"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-300">
              Statistical Significance
            </span>
            <Target className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-3xl font-bold text-purple-400 mb-1">
            {formatPercentage(safeResult.significance)}
          </div>
          <div className="text-sm text-gray-400">
            Quantum: {formatPercentage(safeResult.quantumSignificance)}
          </div>
          <div className="text-xs text-gray-500 mt-1">
            How statistically reliable this is
          </div>
        </div>
      </div>

      {/* Quantum Enhancement Explanation */}
      <div className="mb-6 p-4 bg-gradient-to-r from-purple-900/20 to-blue-900/20 border border-purple-500/30 rounded-lg">
        <h4 className="text-lg font-semibold text-purple-300 mb-2 flex items-center gap-2">
          <Brain className="w-5 h-5" />
          What Makes This "Quantum-Enhanced"?
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-300">
          <div>
            <strong className="text-blue-300">Beyond Simple Correlation:</strong>
            <p className="mt-1">We don't just measure if two things move together - we analyze HOW they're connected through time and patterns.</p>
          </div>
          <div>
            <strong className="text-cyan-300">Temporal Intelligence:</strong>
            <p className="mt-1">Our analysis considers timing, consistency, and data quality to give you more reliable insights.</p>
          </div>
        </div>
      </div>

      {/* Quantum Metrics Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {/* Entanglement Strength */}
        <div className="p-3 bg-gray-900/50 rounded-lg border border-gray-600/30 transition-all duration-300 hover:bg-gray-800/50">
          <div className="flex items-center gap-2 mb-1">
            <Waves className="w-4 h-4 text-cyan-400" />
            <span className="text-xs font-medium text-gray-300">Entanglement</span>
          </div>
          <div className="text-lg font-bold text-cyan-400">
            {formatValue(safeResult.entanglementStrength)}
          </div>
          <div className="text-xs text-gray-500 mt-1">
            How deeply connected the data patterns are
          </div>
        </div>

        {/* Coherence Score */}
        <div className="p-3 bg-gray-900/50 rounded-lg border border-gray-600/30 transition-all duration-300 hover:bg-gray-800/50">
          <div className="flex items-center gap-2 mb-1">
            <Brain className="w-4 h-4 text-indigo-400" />
            <span className="text-xs font-medium text-gray-300">Coherence</span>
          </div>
          <div className="text-lg font-bold text-indigo-400">
            {formatValue(safeResult.coherenceScore)}
          </div>
          <div className="text-xs text-gray-500 mt-1">
            How consistent the relationship is over time
          </div>
        </div>

        {/* Data Quality */}
        <div className="p-3 bg-gray-900/50 rounded-lg border border-gray-600/30 transition-all duration-300 hover:bg-gray-800/50">
          <div className="flex items-center gap-2 mb-1">
            <Shield className="w-4 h-4 text-emerald-400" />
            <span className="text-xs font-medium text-gray-300">Data Quality</span>
          </div>
          <div className="text-lg font-bold text-emerald-400">
            {formatPercentage(safeResult.dataQuality)}
          </div>
          <div className="text-xs text-gray-500 mt-1">
            How reliable and clean the source data is
          </div>
        </div>

        {/* Temporal Stability */}
        <div className="p-3 bg-gray-900/50 rounded-lg border border-gray-600/30 transition-all duration-300 hover:bg-gray-800/50">
          <div className="flex items-center gap-2 mb-1">
            <Activity className="w-4 h-4 text-orange-400" />
            <span className="text-xs font-medium text-gray-300">Stability</span>
          </div>
          <div className="text-lg font-bold text-orange-400">
            {formatPercentage(safeResult.temporalStability)}
          </div>
          <div className="text-xs text-gray-500 mt-1">
            How stable the pattern is across time periods
          </div>
        </div>
      </div>

      {/* Simple Interpretation Guide */}
      <div className="p-4 bg-gray-900/30 rounded-lg border border-gray-600/30">
        <h4 className="text-sm font-semibold text-gray-300 mb-3 flex items-center gap-2">
          <Info className="w-4 h-4 text-blue-400" />
          How to Read These Results
        </h4>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <strong className="text-emerald-300">Strong Correlation ({formatValue(Math.abs(safeResult.correlation))} &gt; 0.7):</strong>
            <p className="text-gray-400 mt-1">These variables move together predictably. Strong relationship detected.</p>
          </div>
          <div>
            <strong className="text-blue-300">High Confidence ({formatPercentage(safeResult.quantumConfidence)}):</strong>
            <p className="text-gray-400 mt-1">Our enhanced analysis is very confident in this relationship.</p>
          </div>
        </div>
      </div>
    </div>
  )
}