import React, { useState, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Calculator, Brain, AlertTriangle, CheckCircle, XCircle } from 'lucide-react'

interface PearsonResult {
  spuriousCorrelation: number
  coefficientOfVariationX: number
  coefficientOfVariationY: number
  coefficientOfVariationZ: number
  riskLevel: 'low' | 'medium' | 'high' | 'critical'
  interpretation: string
  recommendation: string
}

export function SpuriousCorrelationCalculator() {
  const [xValues, setXValues] = useState<string>('10,12,15,18,22,25,28,30,33,35')
  const [yValues, setYValues] = useState<string>('50,55,60,70,80,85,90,95,100,105')
  const [zValues, setZValues] = useState<string>('1,2,3,4,5,6,7,8,9,10')
  const [result, setResult] = useState<PearsonResult | null>(null)
  const [error, setError] = useState<string>('')

  const parseValues = useCallback((input: string): number[] => {
    return input.split(',').map(v => parseFloat(v.trim())).filter(v => !isNaN(v))
  }, [])

  const calculateCoefficientOfVariation = useCallback((values: number[]): number => {
    if (values.length === 0) return 0
    const mean = values.reduce((sum, val) => sum + val, 0) / values.length
    if (Math.abs(mean) < 1e-10) return 0
    const variance = values.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / (values.length - 1)
    const standardDeviation = Math.sqrt(variance)
    return standardDeviation / Math.abs(mean)
  }, [])

  const calculatePearsonSpuriousCorrelation = useCallback((
    x: number[], 
    y: number[], 
    z: number[]
  ): PearsonResult => {
    // Calculate coefficient of variation for each variable (Equation 1 from ScienceDirect)
    const vX = calculateCoefficientOfVariation(x)
    const vY = calculateCoefficientOfVariation(y)
    const vZ = calculateCoefficientOfVariation(z)
    
    // Calculate means for sign function
    const meanX = x.reduce((sum, val) => sum + val, 0) / x.length
    const meanY = y.reduce((sum, val) => sum + val, 0) / y.length
    
    // Sign function
    const sgnX = meanX >= 0 ? 1 : -1
    const sgnY = meanY >= 0 ? 1 : -1
    
    // Karl Pearson's exact formula (Equation 2 from ScienceDirect)
    // r(x/z,y/z) = V(1/z²)sgn(E(x))sgn(E(y)) / sqrt((Vx²(1+V(1/z²))+V(1/z²))(Vy²(1+V(1/z²))+V(1/z²)))
    const vOneOverZSquared = Math.pow(vZ, 2)
    
    const numerator = vOneOverZSquared * sgnX * sgnY
    const denomX = vX * vX * (1 + vOneOverZSquared) + vOneOverZSquared
    const denomY = vY * vY * (1 + vOneOverZSquared) + vOneOverZSquared
    const denominator = Math.sqrt(denomX * denomY)
    
    const spuriousCorr = denominator !== 0 ? numerator / denominator : 0
    const absSpurious = Math.abs(spuriousCorr)
    
    // Determine risk level and interpretation
    let riskLevel: 'low' | 'medium' | 'high' | 'critical'
    let interpretation: string
    let recommendation: string
    
    if (absSpurious > 0.7) {
      riskLevel = 'critical'
      interpretation = 'CRITICAL: Very high spurious correlation detected. The observed correlation is likely artificial and misleading.'
      recommendation = 'Avoid using these variables together. Consider normalizing by different denominators or using raw values.'
    } else if (absSpurious > 0.5) {
      riskLevel = 'high'
      interpretation = 'HIGH RISK: Substantial spurious correlation present. Correlation may be significantly inflated by common denominator.'
      recommendation = 'Exercise extreme caution. Investigate alternative measures and consider Box-Cox transformations.'
    } else if (absSpurious > 0.3) {
      riskLevel = 'medium'
      interpretation = 'MODERATE RISK: Some spurious correlation detected. Results should be interpreted with caution.'
      recommendation = 'Consider the role of the common denominator in your analysis and look for confounding variables.'
    } else {
      riskLevel = 'low'
      interpretation = 'LOW RISK: Minimal spurious correlation detected. Observed correlation is likely genuine.'
      recommendation = 'Correlation appears reliable, but still verify through additional statistical tests and domain knowledge.'
    }
    
    return {
      spuriousCorrelation: spuriousCorr,
      coefficientOfVariationX: vX,
      coefficientOfVariationY: vY,
      coefficientOfVariationZ: vZ,
      riskLevel,
      interpretation,
      recommendation
    }
  }, [calculateCoefficientOfVariation])

  const calculateSpuriousCorrelation = useCallback(() => {
    setError('')
    
    try {
      const x = parseValues(xValues)
      const y = parseValues(yValues)
      const z = parseValues(zValues)
      
      if (x.length === 0 || y.length === 0 || z.length === 0) {
        setError('Please provide valid numeric values for all variables')
        return
      }
      
      if (x.length !== y.length || y.length !== z.length) {
        setError('All variables must have the same number of values')
        return
      }
      
      if (x.length < 3) {
        setError('Need at least 3 data points for meaningful analysis')
        return
      }
      
      const result = calculatePearsonSpuriousCorrelation(x, y, z)
      setResult(result)
    } catch (err) {
      setError('Error calculating spurious correlation. Please check your input values.')
    }
  }, [xValues, yValues, zValues, parseValues, calculatePearsonSpuriousCorrelation])

  const getRiskIcon = (riskLevel: string) => {
    switch (riskLevel) {
      case 'critical': return <AlertTriangle className="w-4 h-4 text-red-600" />
      case 'high': return <AlertTriangle className="w-4 h-4 text-orange-600" />
      case 'medium': return <AlertTriangle className="w-4 h-4 text-yellow-600" />
      case 'low': return <CheckCircle className="w-4 h-4 text-green-600" />
      default: return <AlertTriangle className="w-4 h-4 text-gray-600" />
    }
  }

  const getRiskColor = (riskLevel: string) => {
    switch (riskLevel) {
      case 'critical': return 'bg-red-100 text-red-800 border-red-200'
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-200'
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'low': return 'bg-green-100 text-green-800 border-green-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  return (
    <div className="w-full bg-gray-800 text-gray-100">
      <div className="p-4 border-b border-gray-700">
        <div className="flex items-center gap-2 mb-2">
          <Calculator className="w-5 h-5" />
          <h3 className="text-lg font-semibold">Spurious Correlation Calculator</h3>
          <Badge variant="outline" className="ml-2 text-xs">
            <Brain className="w-3 h-3 mr-1" />
            Pearson 1897 Formula
          </Badge>
        </div>
        <p className="text-sm text-gray-400">
          Calculate spurious correlation strength using Karl Pearson's exact formula for common denominator effects.
        </p>
      </div>
      
      <div className="p-4 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div>
            <Label htmlFor="x-values" className="text-sm font-medium text-gray-300">
              Variable X Values
            </Label>
            <Input
              id="x-values"
              value={xValues}
              onChange={(e) => setXValues(e.target.value)}
              placeholder="10,12,15,18,22"
              className="mt-1 bg-gray-700 border-gray-600 text-gray-100"
            />
            <p className="text-xs text-gray-500 mt-1">Numerator in x/z ratio</p>
          </div>
          
          <div>
            <Label htmlFor="y-values" className="text-sm font-medium text-gray-300">
              Variable Y Values
            </Label>
            <Input
              id="y-values"
              value={yValues}
              onChange={(e) => setYValues(e.target.value)}
              placeholder="50,55,60,70,80"
              className="mt-1 bg-gray-700 border-gray-600 text-gray-100"
            />
            <p className="text-xs text-gray-500 mt-1">Numerator in y/z ratio</p>
          </div>
          
          <div>
            <Label htmlFor="z-values" className="text-sm font-medium text-gray-300">
              Common Denominator Z
            </Label>
            <Input
              id="z-values"
              value={zValues}
              onChange={(e) => setZValues(e.target.value)}
              placeholder="1,2,3,4,5"
              className="mt-1 bg-gray-700 border-gray-600 text-gray-100"
            />
            <p className="text-xs text-gray-500 mt-1">Shared denominator</p>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <Button onClick={calculateSpuriousCorrelation} className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700">
            <Calculator className="w-4 h-4" />
            Calculate
          </Button>
          
          {error && (
            <Badge variant="destructive" className="flex items-center gap-1">
              <AlertTriangle className="w-3 h-3" />
              {error}
            </Badge>
          )}
        </div>
        
        {result && (
          <div className="space-y-4 border-t border-gray-700 pt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <h4 className="text-md font-semibold flex items-center gap-2 text-gray-200">
                  <Brain className="w-4 h-4" />
                  Analysis Results
                </h4>
                
                <div className="p-3 bg-gray-700 rounded-lg">
                  <div className="text-sm font-medium mb-1 text-gray-300">Spurious Correlation</div>
                  <div className="text-xl font-bold text-gray-100">
                    {result.spuriousCorrelation.toFixed(4)}
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    Range: -1 to +1 (higher = more spurious)
                  </div>
                </div>
                
                <div className="grid grid-cols-3 gap-2 text-sm">
                  <div className="p-2 bg-gray-700 rounded text-center">
                    <div className="font-medium text-gray-300">CV(X)</div>
                    <div className="text-sm text-gray-100">{result.coefficientOfVariationX.toFixed(3)}</div>
                  </div>
                  <div className="p-2 bg-gray-700 rounded text-center">
                    <div className="font-medium text-gray-300">CV(Y)</div>
                    <div className="text-sm text-gray-100">{result.coefficientOfVariationY.toFixed(3)}</div>
                  </div>
                  <div className="p-2 bg-gray-700 rounded text-center">
                    <div className="font-medium text-gray-300">CV(Z)</div>
                    <div className="text-sm text-gray-100">{result.coefficientOfVariationZ.toFixed(3)}</div>
                  </div>
                </div>
              </div>
              
              <div className="space-y-3">
                <h4 className="text-md font-semibold text-gray-200">Risk Assessment</h4>
                
                <div className={`p-3 rounded-lg border ${getRiskColor(result.riskLevel)}`}>
                  <div className="flex items-center gap-2 mb-2">
                    {getRiskIcon(result.riskLevel)}
                    <span className="font-semibold text-sm uppercase">{result.riskLevel} Risk</span>
                  </div>
                  <p className="text-xs mb-2">{result.interpretation}</p>
                  <div className="text-xs">
                    <strong>Recommendation:</strong> {result.recommendation}
                  </div>
                </div>
              </div>
            </div>
            
            <div className="p-3 bg-blue-900/30 border border-blue-700/50 rounded-lg">
              <h5 className="font-semibold text-blue-200 mb-2 text-sm">Scientific Formula Used</h5>
              <div className="font-mono text-xs text-blue-300 mb-2 break-all">
                r(x/z,y/z) = V₁/z² × sgn(E(x)) × sgn(E(y)) / √[(Vₓ²(1+V₁/z²)+V₁/z²)(Vᵧ²(1+V₁/z²)+V₁/z²)]
              </div>
              <p className="text-xs text-blue-400">
                V = coefficient of variation (σ/μ), E = expected value, sgn = sign function.
                Quantifies correlation artificially induced by common denominator z.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}