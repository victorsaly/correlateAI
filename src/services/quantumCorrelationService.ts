/**
 * Quantum-Inspired Correlation Analysis Service
 * 
 * This service implements quantum-inspired algorithms for advanced correlation analysis,
 * providing enhanced statistical measures including quantum confidence intervals,
 * entanglement-based correlation metrics, and significance analysis.
 */

export interface QuantumCorrelationResult {
  // Standard correlation metrics
  correlation: number
  rSquared: number
  significance: number // 0-100%
  
  // Quantum-inspired metrics
  quantumConfidence: number // 0-100%
  entanglementStrength: number // 0-1
  coherenceScore: number // 0-1
  quantumSignificance: number // 0-100%
  
  // Analysis details
  strength: 'Very Weak' | 'Weak' | 'Moderate' | 'Strong' | 'Very Strong'
  direction: 'Positive' | 'Negative'
  reliability: 'Low' | 'Medium' | 'High' | 'Very High'
  
  // Quantum state analysis
  quantumState: {
    phase: number
    amplitude: number
    interference: number
    superposition: number
  }
  
  // Statistical measures
  pValue: number
  standardError: number
  confidenceInterval: [number, number]
  
  // Data quality metrics
  dataQuality: number // 0-100%
  temporalStability: number // 0-100%
  noiseLevel: number // 0-1
}

export interface QuantumDataPoint {
  year: number
  value1: number
  value2: number
  quantumWeight: number
  coherence: number
  phase: number
}

export class QuantumCorrelationService {
  /**
   * Calculate quantum-inspired correlation with advanced metrics
   */
  calculateQuantumCorrelation(
    data1: Array<{ year: number; value: number }>,
    data2: Array<{ year: number; value: number }>
  ): QuantumCorrelationResult {
    // Align data and prepare quantum data points
    const alignedData = this.alignDataSets(data1, data2)
    const quantumData = this.prepareQuantumDataPoints(alignedData)
    
    // Standard correlation calculation
    const standardCorr = this.calculatePearsonCorrelation(
      alignedData.map(d => d.value1),
      alignedData.map(d => d.value2)
    )
    
    // Quantum-inspired correlation calculation
    const quantumCorr = this.calculateQuantumInspiredCorrelation(quantumData)
    
    // Enhanced statistical analysis
    const statistics = this.calculateAdvancedStatistics(alignedData, standardCorr)
    
    // Quantum state analysis
    const quantumState = this.analyzeQuantumState(quantumData)
    
    // Data quality assessment
    const dataQuality = this.assessDataQuality(alignedData)
    
    // Determine strength and reliability
    const strength = this.determineCorrelationStrength(Math.abs(quantumCorr))
    const direction = quantumCorr >= 0 ? 'Positive' : 'Negative'
    const reliability = this.determineReliability(statistics.quantumConfidence, dataQuality.quality)
    
    return {
      correlation: quantumCorr,
      rSquared: quantumCorr * quantumCorr,
      significance: statistics.significance,
      quantumConfidence: statistics.quantumConfidence,
      entanglementStrength: quantumState.entanglement,
      coherenceScore: quantumState.coherence,
      quantumSignificance: statistics.quantumSignificance,
      strength,
      direction,
      reliability,
      quantumState: {
        phase: quantumState.phase,
        amplitude: quantumState.amplitude,
        interference: quantumState.interference,
        superposition: quantumState.superposition
      },
      pValue: statistics.pValue,
      standardError: statistics.standardError,
      confidenceInterval: statistics.confidenceInterval,
      dataQuality: dataQuality.quality,
      temporalStability: dataQuality.stability,
      noiseLevel: dataQuality.noise
    }
  }
  
  /**
   * Align two datasets by common years
   */
  private alignDataSets(
    data1: Array<{ year: number; value: number }>,
    data2: Array<{ year: number; value: number }>
  ): Array<{ year: number; value1: number; value2: number }> {
    const commonYears = data1
      .filter(d1 => data2.some(d2 => d2.year === d1.year))
      .map(d => d.year)
      .sort()
    
    return commonYears.map(year => ({
      year,
      value1: data1.find(d => d.year === year)?.value || 0,
      value2: data2.find(d => d.year === year)?.value || 0
    }))
  }
  
  /**
   * Prepare quantum data points with quantum-inspired weights and phases
   */
  private prepareQuantumDataPoints(
    alignedData: Array<{ year: number; value1: number; value2: number }>
  ): QuantumDataPoint[] {
    const n = alignedData.length
    
    return alignedData.map((point, index) => {
      // Calculate quantum weight based on temporal position and data variance
      const temporalWeight = Math.exp(-Math.abs(index - n/2) / (n/4))
      const variance1 = this.calculateLocalVariance(alignedData, index, 'value1')
      const variance2 = this.calculateLocalVariance(alignedData, index, 'value2')
      const varianceWeight = 1 / (1 + Math.sqrt(variance1 * variance2))
      
      // Quantum coherence based on data consistency
      const coherence = this.calculateCoherence(alignedData, index)
      
      // Quantum phase based on data trend and position
      const phase = (2 * Math.PI * index / n) + this.calculateTrendPhase(alignedData, index)
      
      return {
        year: point.year,
        value1: point.value1,
        value2: point.value2,
        quantumWeight: temporalWeight * varianceWeight,
        coherence,
        phase
      }
    })
  }
  
  /**
   * Calculate standard Pearson correlation coefficient
   */
  private calculatePearsonCorrelation(x: number[], y: number[]): number {
    const n = x.length
    if (n !== y.length || n === 0) return 0

    const sumX = x.reduce((a, b) => a + b, 0)
    const sumY = y.reduce((a, b) => a + b, 0)
    const sumXY = x.reduce((sum, xi, i) => sum + xi * y[i], 0)
    const sumX2 = x.reduce((sum, xi) => sum + xi * xi, 0)
    const sumY2 = y.reduce((sum, yi) => sum + yi * yi, 0)

    const numerator = n * sumXY - sumX * sumY
    const denominator = Math.sqrt((n * sumX2 - sumX * sumX) * (n * sumY2 - sumY * sumY))

    return denominator === 0 ? 0 : numerator / denominator
  }
  
  /**
   * Calculate quantum-inspired correlation using weighted coherent states
   */
  private calculateQuantumInspiredCorrelation(quantumData: QuantumDataPoint[]): number {
    const n = quantumData.length
    if (n === 0) return 0
    
    // Weighted means using quantum weights
    const totalWeight = quantumData.reduce((sum, d) => sum + d.quantumWeight, 0)
    const weightedMeanX = quantumData.reduce((sum, d) => sum + d.value1 * d.quantumWeight, 0) / totalWeight
    const weightedMeanY = quantumData.reduce((sum, d) => sum + d.value2 * d.quantumWeight, 0) / totalWeight
    
    // Quantum-inspired covariance with phase coherence
    let quantumCovariance = 0
    let quantumVarianceX = 0
    let quantumVarianceY = 0
    
    for (const point of quantumData) {
      const dx = point.value1 - weightedMeanX
      const dy = point.value2 - weightedMeanY
      
      // Apply quantum coherence and phase factors
      const coherenceFactor = point.coherence * point.quantumWeight
      const phaseFactor = Math.cos(point.phase) // Quantum interference effect
      
      quantumCovariance += dx * dy * coherenceFactor * phaseFactor
      quantumVarianceX += dx * dx * coherenceFactor
      quantumVarianceY += dy * dy * coherenceFactor
    }
    
    const denominator = Math.sqrt(quantumVarianceX * quantumVarianceY)
    return denominator === 0 ? 0 : quantumCovariance / denominator
  }
  
  /**
   * Calculate local variance for quantum weight determination
   */
  private calculateLocalVariance(
    data: Array<{ year: number; value1: number; value2: number }>,
    index: number,
    field: 'value1' | 'value2'
  ): number {
    const windowSize = Math.min(5, data.length)
    const start = Math.max(0, index - Math.floor(windowSize / 2))
    const end = Math.min(data.length, start + windowSize)
    
    const window = data.slice(start, end).map(d => d[field])
    const mean = window.reduce((sum, val) => sum + val, 0) / window.length
    
    return window.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / window.length
  }
  
  /**
   * Calculate quantum coherence based on data consistency
   */
  private calculateCoherence(
    data: Array<{ year: number; value1: number; value2: number }>,
    index: number
  ): number {
    if (data.length < 3) return 1.0
    
    const windowSize = Math.min(3, data.length)
    const start = Math.max(0, index - Math.floor(windowSize / 2))
    const end = Math.min(data.length, start + windowSize)
    
    const window = data.slice(start, end)
    if (window.length < 2) return 1.0
    
    // Calculate local correlation as coherence measure
    const values1 = window.map(d => d.value1)
    const values2 = window.map(d => d.value2)
    const localCorr = this.calculatePearsonCorrelation(values1, values2)
    
    // Convert correlation to coherence (0-1 scale)
    return (Math.abs(localCorr) + 1) / 2
  }
  
  /**
   * Calculate trend-based phase for quantum analysis
   */
  private calculateTrendPhase(
    data: Array<{ year: number; value1: number; value2: number }>,
    index: number
  ): number {
    if (index === 0 || index === data.length - 1) return 0
    
    const prev = data[index - 1]
    const current = data[index]
    const next = data[index + 1]
    
    // Calculate trend directions
    const trend1 = Math.atan2(next.value1 - prev.value1, 2)
    const trend2 = Math.atan2(next.value2 - prev.value2, 2)
    
    // Phase difference represents trend alignment
    return trend1 - trend2
  }
  
  /**
   * Calculate advanced statistics including quantum metrics
   */
  private calculateAdvancedStatistics(
    data: Array<{ year: number; value1: number; value2: number }>,
    correlation: number
  ) {
    const n = data.length
    const absCorr = Math.abs(correlation)
    
    // Standard error calculation
    const standardError = Math.sqrt((1 - correlation * correlation) / (n - 2))
    
    // P-value approximation (two-tailed test)
    const tStat = correlation * Math.sqrt((n - 2) / (1 - correlation * correlation))
    const pValue = this.approximatePValue(Math.abs(tStat), n - 2)
    
    // Confidence interval (95%)
    const criticalValue = 1.96 // Approximate for large samples
    const margin = criticalValue * standardError
    const confidenceInterval: [number, number] = [
      Math.max(-1, correlation - margin),
      Math.min(1, correlation + margin)
    ]
    
    // Quantum confidence based on multiple factors
    const sampleSizeConfidence = Math.min(100, (n / 20) * 100)
    const correlationConfidence = absCorr * 100
    const stabilityConfidence = this.calculateTemporalStability(data)
    
    const quantumConfidence = (
      sampleSizeConfidence * 0.3 +
      correlationConfidence * 0.4 +
      stabilityConfidence * 0.3
    )
    
    // Statistical significance
    const significance = (1 - pValue) * 100
    
    // Quantum significance incorporating uncertainty principles
    const quantumUncertainty = 1 - (quantumConfidence / 100)
    const quantumSignificance = significance * (1 - quantumUncertainty * 0.5)
    
    return {
      standardError,
      pValue,
      confidenceInterval,
      quantumConfidence,
      significance,
      quantumSignificance
    }
  }
  
  /**
   * Analyze quantum state properties
   */
  private analyzeQuantumState(quantumData: QuantumDataPoint[]) {
    const n = quantumData.length
    if (n === 0) {
      return {
        entanglement: 0,
        coherence: 0,
        phase: 0,
        amplitude: 0,
        interference: 0,
        superposition: 0
      }
    }
    
    // Calculate average coherence
    const coherence = quantumData.reduce((sum, d) => sum + d.coherence, 0) / n
    
    // Calculate entanglement strength based on phase correlations
    const phaseCorrelations = quantumData.map(d => Math.cos(d.phase))
    const entanglement = Math.abs(phaseCorrelations.reduce((sum, pc) => sum + pc, 0) / n)
    
    // Calculate average phase
    const avgPhase = quantumData.reduce((sum, d) => sum + d.phase, 0) / n
    
    // Calculate amplitude from quantum weights
    const amplitude = Math.sqrt(quantumData.reduce((sum, d) => sum + d.quantumWeight * d.quantumWeight, 0) / n)
    
    // Calculate interference patterns
    const interference = this.calculateInterference(quantumData)
    
    // Calculate superposition measure
    const superposition = this.calculateSuperposition(quantumData)
    
    return {
      entanglement,
      coherence,
      phase: avgPhase,
      amplitude,
      interference,
      superposition
    }
  }
  
  /**
   * Calculate interference patterns in quantum data
   */
  private calculateInterference(quantumData: QuantumDataPoint[]): number {
    if (quantumData.length < 2) return 0
    
    let interferenceSum = 0
    for (let i = 1; i < quantumData.length; i++) {
      const phaseDiff = quantumData[i].phase - quantumData[i-1].phase
      const coherenceFactor = (quantumData[i].coherence + quantumData[i-1].coherence) / 2
      interferenceSum += Math.cos(phaseDiff) * coherenceFactor
    }
    
    return Math.abs(interferenceSum / (quantumData.length - 1))
  }
  
  /**
   * Calculate superposition measure
   */
  private calculateSuperposition(quantumData: QuantumDataPoint[]): number {
    if (quantumData.length === 0) return 0
    
    // Superposition based on quantum weight distribution
    const weights = quantumData.map(d => d.quantumWeight)
    const maxWeight = Math.max(...weights)
    const minWeight = Math.min(...weights)
    
    if (maxWeight === minWeight) return 1.0
    
    // Entropy-like measure of superposition
    const normalizedWeights = weights.map(w => w / weights.reduce((sum, w) => sum + w, 0))
    const entropy = -normalizedWeights.reduce((sum, p) => sum + (p > 0 ? p * Math.log2(p) : 0), 0)
    const maxEntropy = Math.log2(weights.length)
    
    return maxEntropy > 0 ? entropy / maxEntropy : 0
  }
  
  /**
   * Assess data quality metrics
   */
  private assessDataQuality(data: Array<{ year: number; value1: number; value2: number }>) {
    const n = data.length
    
    // Data completeness
    const completeness = n >= 10 ? 100 : (n / 10) * 100
    
    // Temporal stability
    const stability = this.calculateTemporalStability(data)
    
    // Noise level assessment
    const noise = this.calculateNoiseLevel(data)
    
    // Overall quality score
    const quality = (completeness * 0.4 + stability * 0.4 + (100 - noise * 100) * 0.2)
    
    return {
      quality: Math.max(0, Math.min(100, quality)),
      stability,
      noise
    }
  }
  
  /**
   * Calculate temporal stability of the data
   */
  private calculateTemporalStability(data: Array<{ year: number; value1: number; value2: number }>): number {
    if (data.length < 3) return 50
    
    // Calculate trend consistency for both variables
    const stability1 = this.calculateTrendStability(data.map(d => d.value1))
    const stability2 = this.calculateTrendStability(data.map(d => d.value2))
    
    return (stability1 + stability2) / 2
  }
  
  /**
   * Calculate trend stability for a single variable
   */
  private calculateTrendStability(values: number[]): number {
    if (values.length < 3) return 50
    
    const trends: number[] = []
    for (let i = 1; i < values.length - 1; i++) {
      const trend = values[i+1] - values[i-1]
      trends.push(trend)
    }
    
    if (trends.length === 0) return 50
    
    const mean = trends.reduce((sum, t) => sum + t, 0) / trends.length
    const variance = trends.reduce((sum, t) => sum + Math.pow(t - mean, 2), 0) / trends.length
    const standardDeviation = Math.sqrt(variance)
    
    // Stability inversely related to relative standard deviation
    const coefficientOfVariation = Math.abs(mean) > 0 ? standardDeviation / Math.abs(mean) : standardDeviation
    const stability = 100 / (1 + coefficientOfVariation)
    
    return Math.max(0, Math.min(100, stability))
  }
  
  /**
   * Calculate noise level in the data
   */
  private calculateNoiseLevel(data: Array<{ year: number; value1: number; value2: number }>): number {
    if (data.length < 3) return 0.5
    
    // Calculate noise as deviation from smoothed trend
    const noise1 = this.calculateSignalNoise(data.map(d => d.value1))
    const noise2 = this.calculateSignalNoise(data.map(d => d.value2))
    
    return (noise1 + noise2) / 2
  }
  
  /**
   * Calculate signal-to-noise ratio for a variable
   */
  private calculateSignalNoise(values: number[]): number {
    if (values.length < 3) return 0.1
    
    // Simple moving average as signal
    const windowSize = Math.min(3, values.length)
    const smoothed: number[] = []
    
    for (let i = 0; i < values.length; i++) {
      const start = Math.max(0, i - Math.floor(windowSize / 2))
      const end = Math.min(values.length, start + windowSize)
      const window = values.slice(start, end)
      const avg = window.reduce((sum, v) => sum + v, 0) / window.length
      smoothed.push(avg)
    }
    
    // Calculate noise as deviation from smoothed signal
    const noiseVariance = values.reduce((sum, val, i) => {
      return sum + Math.pow(val - smoothed[i], 2)
    }, 0) / values.length
    
    const signalVariance = smoothed.reduce((sum, val) => {
      const mean = smoothed.reduce((s, v) => s + v, 0) / smoothed.length
      return sum + Math.pow(val - mean, 2)
    }, 0) / smoothed.length
    
    if (signalVariance === 0) return 1.0
    
    const snr = signalVariance / noiseVariance
    return Math.max(0, Math.min(1, 1 / (1 + snr)))
  }
  
  /**
   * Determine correlation strength category
   */
  private determineCorrelationStrength(absCorr: number): 'Very Weak' | 'Weak' | 'Moderate' | 'Strong' | 'Very Strong' {
    if (absCorr >= 0.8) return 'Very Strong'
    if (absCorr >= 0.6) return 'Strong'
    if (absCorr >= 0.4) return 'Moderate'
    if (absCorr >= 0.2) return 'Weak'
    return 'Very Weak'
  }
  
  /**
   * Determine overall reliability
   */
  private determineReliability(quantumConfidence: number, dataQuality: number): 'Low' | 'Medium' | 'High' | 'Very High' {
    const overallScore = (quantumConfidence + dataQuality) / 2
    
    if (overallScore >= 85) return 'Very High'
    if (overallScore >= 70) return 'High'
    if (overallScore >= 50) return 'Medium'
    return 'Low'
  }
  
  /**
   * Approximate p-value for correlation test
   */
  private approximatePValue(tStat: number, df: number): number {
    // Simplified p-value approximation
    // For a more accurate implementation, you'd use the t-distribution
    
    if (df <= 0) return 1.0
    
    // Rough approximation using normal distribution for large df
    if (df > 30) {
      const z = tStat
      return 2 * (1 - this.normalCDF(Math.abs(z)))
    }
    
    // Very rough approximation for small df
    const criticalValues = [12.706, 4.303, 3.182, 2.776, 2.571, 2.447, 2.365, 2.306, 2.262]
    const criticalValue = df <= 9 ? criticalValues[df - 1] : 2.0
    
    return tStat > criticalValue ? 0.05 : 0.1
  }
  
  /**
   * Normal cumulative distribution function approximation
   */
  private normalCDF(x: number): number {
    // Abramowitz and Stegun approximation
    const a1 =  0.254829592
    const a2 = -0.284496736
    const a3 =  1.421413741
    const a4 = -1.453152027
    const a5 =  1.061405429
    const p  =  0.3275911
    
    const sign = x < 0 ? -1 : 1
    x = Math.abs(x) / Math.sqrt(2.0)
    
    const t = 1.0 / (1.0 + p * x)
    const y = 1.0 - (((((a5 * t + a4) * t) + a3) * t + a2) * t + a1) * t * Math.exp(-x * x)
    
    return 0.5 * (1.0 + sign * y)
  }
  
  /**
   * Generate example correlation for GDP Growth ↔ Temperature
   */
  generateExampleGDPTemperatureCorrelation(): {
    data1: Array<{ year: number; value: number }>
    data2: Array<{ year: number; value: number }>
    result: QuantumCorrelationResult
    title: string
    description: string
  } {
    // Generate realistic GDP growth data (1990-2023)
    const gdpData: Array<{ year: number; value: number }> = []
    for (let year = 1990; year <= 2023; year++) {
      // Base GDP growth with some realistic variation
      const baseGrowth = 2.5 + Math.sin((year - 1990) * 0.3) * 1.5
      const noise = (Math.random() - 0.5) * 2
      const climateFactor = Math.sin((year - 1990) * 0.1) * 0.8 // Long-term climate cycle
      
      gdpData.push({
        year,
        value: Math.max(0, baseGrowth + noise + climateFactor)
      })
    }
    
    // Generate temperature anomaly data correlated with GDP
    const tempData: Array<{ year: number; value: number }> = []
    for (let year = 1990; year <= 2023; year++) {
      const gdpValue = gdpData.find(d => d.year === year)?.value || 0
      
      // Temperature influenced by GDP (industrial activity) + natural variation
      const gdpInfluence = (gdpValue - 2.5) * 0.15 // GDP effect on temperature
      const naturalCycle = Math.sin((year - 1990) * 0.2) * 0.4
      const climateChange = (year - 1990) * 0.02 // Global warming trend
      const noise = (Math.random() - 0.5) * 0.6
      
      tempData.push({
        year,
        value: gdpInfluence + naturalCycle + climateChange + noise
      })
    }
    
    // Calculate quantum correlation
    const result = this.calculateQuantumCorrelation(gdpData, tempData)
    
    return {
      data1: gdpData,
      data2: tempData,
      result,
      title: "GDP Growth ↔ Global Temperature Anomaly",
      description: "Analysis of correlation between economic growth and climate patterns using quantum-inspired algorithms. This correlation explores the complex relationship between industrial economic activity and global temperature changes, accounting for temporal dependencies and quantum coherence effects in the data."
    }
  }
}

// Export singleton instance
export const quantumCorrelationService = new QuantumCorrelationService()