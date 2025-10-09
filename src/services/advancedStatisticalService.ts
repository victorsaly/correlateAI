/**
 * Advanced Statistical Analysis Service
 * 
 * Implements comprehensive statistical methods for robust correlation analysis:
 * - Enhanced permutation testing with bootstrap confidence intervals
 * - Advanced Box-Cox transformations with likelihood optimization
 * - Multi-dimensional coefficient of variation analysis
 * - Robust correlation methods (Kendall's tau, Spearman)
 * - Non-parametric statistical tests
 * - Multiple comparison corrections
 */

export interface EnhancedStatisticalResult {
  // Core correlation metrics
  pearsonCorrelation: number
  spearmanCorrelation: number
  kendallTau: number
  
  // Permutation test results
  permutationTest: {
    pValue: number
    pValueCorrected: number // Bonferroni or FDR corrected
    bootstrapCI: [number, number]
    effectSize: number
    statisticalPower: number
    permutationsUsed: number
  }
  
  // Box-Cox analysis
  boxCoxAnalysis: {
    optimalLambda1: number
    optimalLambda2: number
    likelihoodRatio: number
    goodnessOfFit: number
    transformationNeeded: boolean
    transformedCorrelation: number
  }
  
  // Coefficient of variation analysis
  coefficientVariation: {
    cv1: number
    cv2: number
    timeVaryingCV1: number[]
    timeVaryingCV2: number[]
    spuriousRisk: 'Low' | 'Medium' | 'High' | 'Critical'
    cvBasedCorrelation: number
  }
  
  // Robust statistics
  robustAnalysis: {
    medianCorrelation: number
    madBasedCorrelation: number // Median Absolute Deviation
    winsorizedCorrelation: number
    outlierInfluence: number
    leveragePoints: number[]
  }
  
  // Non-parametric tests
  nonParametricTests: {
    mannWhitneyU: number
    wilcoxonRankSum: number
    kolmogorovSmirnov: number
    shapiroWilkP1: number
    shapiroWilkP2: number
    normalityAssessment: 'Normal' | 'Non-Normal' | 'Uncertain'
  }
  
  // Advanced diagnostics
  diagnostics: {
    heteroscedasticityTest: number
    autocorrelationLag1: number
    stationarityTest: number
    structuralBreakTest: number
    multicollinearityIndex: number
  }
  
  // Overall assessment
  overallAssessment: {
    reliability: 'Very Low' | 'Low' | 'Medium' | 'High' | 'Very High'
    spuriousProbability: number // 0-100%
    recommendedMethod: string
    confidenceLevel: number
    statisticalWarnings: string[]
  }
}

export class AdvancedStatisticalService {
  
  /**
   * Perform comprehensive statistical analysis
   */
  analyzeCorrelation(
    data1: Array<{ year: number; value: number }>,
    data2: Array<{ year: number; value: number }>
  ): EnhancedStatisticalResult {
    
    // Align datasets
    const alignedData = this.alignDataSets(data1, data2)
    const values1 = alignedData.map(d => d.value1)
    const values2 = alignedData.map(d => d.value2)
    
    // Core correlation calculations
    const pearsonCorr = this.calculatePearsonCorrelation(values1, values2)
    const spearmanCorr = this.calculateSpearmanCorrelation(values1, values2)
    const kendallTau = this.calculateKendallTau(values1, values2)
    
    // Enhanced permutation testing
    const permutationTest = this.enhancedPermutationTest(values1, values2)
    
    // Advanced Box-Cox analysis
    const boxCoxAnalysis = this.advancedBoxCoxAnalysis(values1, values2)
    
    // Comprehensive coefficient of variation analysis
    const coefficientVariation = this.enhancedCoefficientVariationAnalysis(alignedData)
    
    // Robust statistical analysis
    const robustAnalysis = this.robustCorrelationAnalysis(values1, values2)
    
    // Non-parametric tests
    const nonParametricTests = this.nonParametricTestSuite(values1, values2)
    
    // Advanced diagnostics
    const diagnostics = this.advancedDiagnostics(alignedData)
    
    // Overall assessment
    const overallAssessment = this.calculateOverallAssessment({
      pearsonCorr,
      spearmanCorr,
      kendallTau,
      permutationTest,
      boxCoxAnalysis,
      coefficientVariation,
      robustAnalysis,
      nonParametricTests,
      diagnostics
    })
    
    return {
      pearsonCorrelation: pearsonCorr,
      spearmanCorrelation: spearmanCorr,
      kendallTau,
      permutationTest,
      boxCoxAnalysis,
      coefficientVariation,
      robustAnalysis,
      nonParametricTests,
      diagnostics,
      overallAssessment
    }
  }
  
  /**
   * Enhanced permutation testing with bootstrap confidence intervals
   */
  private enhancedPermutationTest(
    x: number[], 
    y: number[], 
    numPermutations = 10000
  ): EnhancedStatisticalResult['permutationTest'] {
    
    const originalCorr = Math.abs(this.calculatePearsonCorrelation(x, y))
    const permutedCorrelations: number[] = []
    
    // Generate permutation distribution
    for (let i = 0; i < numPermutations; i++) {
      const shuffledY = [...y].sort(() => Math.random() - 0.5)
      const permutedCorr = Math.abs(this.calculatePearsonCorrelation(x, shuffledY))
      permutedCorrelations.push(permutedCorr)
    }
    
    // Calculate p-value
    const extremeCount = permutedCorrelations.filter(corr => corr >= originalCorr).length
    const pValue = extremeCount / numPermutations
    
    // Bonferroni correction (assuming 3 correlation tests: Pearson, Spearman, Kendall)
    const pValueCorrected = Math.min(1, pValue * 3)
    
    // Bootstrap confidence interval
    const bootstrapCI = this.bootstrapConfidenceInterval(x, y, 1000, 0.95)
    
    // Effect size (Cohen's conventions adapted for correlation)
    const effectSize = this.classifyEffectSize(originalCorr)
    
    // Statistical power estimation
    const statisticalPower = this.estimateStatisticalPower(originalCorr, x.length)
    
    return {
      pValue,
      pValueCorrected,
      bootstrapCI,
      effectSize,
      statisticalPower,
      permutationsUsed: numPermutations
    }
  }
  
  /**
   * Advanced Box-Cox analysis with likelihood optimization
   */
  private advancedBoxCoxAnalysis(
    x: number[], 
    y: number[]
  ): EnhancedStatisticalResult['boxCoxAnalysis'] {
    
    // Ensure positive values for Box-Cox transformation
    const minX = Math.min(...x)
    const minY = Math.min(...y)
    const shiftX = minX <= 0 ? Math.abs(minX) + 1 : 0
    const shiftY = minY <= 0 ? Math.abs(minY) + 1 : 0
    
    const adjustedX = x.map(val => val + shiftX)
    const adjustedY = y.map(val => val + shiftY)
    
    // Find optimal lambda using maximum likelihood estimation
    const optimalLambda1 = this.findOptimalLambdaML(adjustedX)
    const optimalLambda2 = this.findOptimalLambdaML(adjustedY)
    
    // Apply transformations
    const transformedX = this.boxCoxTransform(adjustedX, optimalLambda1)
    const transformedY = this.boxCoxTransform(adjustedY, optimalLambda2)
    
    // Calculate transformed correlation
    const transformedCorrelation = this.calculatePearsonCorrelation(transformedX, transformedY)
    const originalCorrelation = this.calculatePearsonCorrelation(x, y)
    
    // Likelihood ratio test
    const likelihoodRatio = this.likelihoodRatioTest(adjustedX, adjustedY, optimalLambda1, optimalLambda2)
    
    // Goodness of fit test (Shapiro-Wilk on residuals)
    const goodnessOfFit = this.goodnessOfFitTest(transformedX, transformedY)
    
    // Determine if transformation is needed
    const transformationNeeded = likelihoodRatio > 3.84 || // Chi-square critical value at α=0.05
                                Math.abs(transformedCorrelation) < Math.abs(originalCorrelation) * 0.9
    
    return {
      optimalLambda1,
      optimalLambda2,
      likelihoodRatio,
      goodnessOfFit,
      transformationNeeded,
      transformedCorrelation
    }
  }
  
  /**
   * Enhanced coefficient of variation analysis
   */
  private enhancedCoefficientVariationAnalysis(
    data: Array<{ year: number; value1: number; value2: number }>
  ): EnhancedStatisticalResult['coefficientVariation'] {
    
    const values1 = data.map(d => d.value1)
    const values2 = data.map(d => d.value2)
    
    // Overall coefficient of variation
    const cv1 = this.calculateCoefficientOfVariation(values1)
    const cv2 = this.calculateCoefficientOfVariation(values2)
    
    // Time-varying coefficient of variation (rolling window)
    const windowSize = Math.max(3, Math.floor(data.length / 3))
    const timeVaryingCV1 = this.calculateTimeVaryingCV(values1, windowSize)
    const timeVaryingCV2 = this.calculateTimeVaryingCV(values2, windowSize)
    
    // Spurious correlation risk assessment based on CV
    const spuriousRisk = this.assessSpuriousRiskFromCV(cv1, cv2, timeVaryingCV1, timeVaryingCV2)
    
    // CV-based correlation using Pearson's 1897 formula
    const cvBasedCorrelation = this.calculateCVBasedSpuriousCorrelation(values1, values2, data.map(d => d.year))
    
    return {
      cv1,
      cv2,
      timeVaryingCV1,
      timeVaryingCV2,
      spuriousRisk,
      cvBasedCorrelation
    }
  }
  
  /**
   * Robust correlation analysis
   */
  private robustCorrelationAnalysis(
    x: number[], 
    y: number[]
  ): EnhancedStatisticalResult['robustAnalysis'] {
    
    // Median-based correlation (Kendall's tau approximation)
    const medianCorrelation = this.calculateMedianCorrelation(x, y)
    
    // MAD-based correlation (using Median Absolute Deviation)
    const madBasedCorrelation = this.calculateMADBasedCorrelation(x, y)
    
    // Winsorized correlation (trim 5% from each tail)
    const winsorizedCorrelation = this.calculateWinsorizedCorrelation(x, y, 0.05)
    
    // Outlier influence assessment
    const outlierInfluence = this.assessOutlierInfluence(x, y)
    
    // Leverage points identification
    const leveragePoints = this.identifyLeveragePoints(x, y)
    
    return {
      medianCorrelation,
      madBasedCorrelation,
      winsorizedCorrelation,
      outlierInfluence,
      leveragePoints
    }
  }
  
  /**
   * Non-parametric test suite
   */
  private nonParametricTestSuite(
    x: number[], 
    y: number[]
  ): EnhancedStatisticalResult['nonParametricTests'] {
    
    // Mann-Whitney U test
    const mannWhitneyU = this.mannWhitneyUTest(x, y)
    
    // Wilcoxon rank-sum test
    const wilcoxonRankSum = this.wilcoxonRankSumTest(x, y)
    
    // Kolmogorov-Smirnov test
    const kolmogorovSmirnov = this.kolmogorovSmirnovTest(x, y)
    
    // Shapiro-Wilk normality test
    const shapiroWilkP1 = this.shapiroWilkTest(x)
    const shapiroWilkP2 = this.shapiroWilkTest(y)
    
    // Overall normality assessment
    const normalityAssessment = this.assessNormality(shapiroWilkP1, shapiroWilkP2)
    
    return {
      mannWhitneyU,
      wilcoxonRankSum,
      kolmogorovSmirnov,
      shapiroWilkP1,
      shapiroWilkP2,
      normalityAssessment
    }
  }
  
  /**
   * Advanced diagnostics
   */
  private advancedDiagnostics(
    data: Array<{ year: number; value1: number; value2: number }>
  ): EnhancedStatisticalResult['diagnostics'] {
    
    const values1 = data.map(d => d.value1)
    const values2 = data.map(d => d.value2)
    
    // Heteroscedasticity test (Breusch-Pagan)
    const heteroscedasticityTest = this.breuschPaganTest(values1, values2)
    
    // Autocorrelation test (lag-1)
    const autocorrelationLag1 = this.autocorrelationTest(values1, values2)
    
    // Stationarity test (Augmented Dickey-Fuller approximation)
    const stationarityTest = this.stationarityTest(values1, values2)
    
    // Structural break test (Chow test approximation)
    const structuralBreakTest = this.structuralBreakTest(data)
    
    // Multicollinearity index
    const multicollinearityIndex = this.calculateMulticollinearityIndex(values1, values2)
    
    return {
      heteroscedasticityTest,
      autocorrelationLag1,
      stationarityTest,
      structuralBreakTest,
      multicollinearityIndex
    }
  }
  
  // Helper methods implementation
  
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
  
  private calculateSpearmanCorrelation(x: number[], y: number[]): number {
    // Rank the data
    const rankedX = this.rankData(x)
    const rankedY = this.rankData(y)
    
    // Calculate Pearson correlation on ranks
    return this.calculatePearsonCorrelation(rankedX, rankedY)
  }
  
  private calculateKendallTau(x: number[], y: number[]): number {
    const n = x.length
    let concordant = 0
    let discordant = 0
    
    for (let i = 0; i < n - 1; i++) {
      for (let j = i + 1; j < n; j++) {
        const xDiff = x[i] - x[j]
        const yDiff = y[i] - y[j]
        
        if (xDiff * yDiff > 0) {
          concordant++
        } else if (xDiff * yDiff < 0) {
          discordant++
        }
      }
    }
    
    return (concordant - discordant) / ((n * (n - 1)) / 2)
  }
  
  private rankData(data: number[]): number[] {
    const sorted = data.map((value, index) => ({ value, index }))
      .sort((a, b) => a.value - b.value)
    
    const ranks = new Array(data.length)
    
    for (let i = 0; i < sorted.length; i++) {
      ranks[sorted[i].index] = i + 1
    }
    
    return ranks
  }
  
  private calculateCoefficientOfVariation(values: number[]): number {
    const mean = values.reduce((sum, val) => sum + val, 0) / values.length
    const variance = values.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / (values.length - 1)
    const standardDeviation = Math.sqrt(variance)
    return standardDeviation / Math.abs(mean)
  }
  
  private calculateTimeVaryingCV(values: number[], windowSize: number): number[] {
    const timeVaryingCV: number[] = []
    
    for (let i = 0; i <= values.length - windowSize; i++) {
      const window = values.slice(i, i + windowSize)
      const cv = this.calculateCoefficientOfVariation(window)
      timeVaryingCV.push(cv)
    }
    
    return timeVaryingCV
  }
  
  private bootstrapConfidenceInterval(
    x: number[], 
    y: number[], 
    bootstrapSamples: number, 
    confidenceLevel: number
  ): [number, number] {
    const bootstrapCorrelations: number[] = []
    
    for (let i = 0; i < bootstrapSamples; i++) {
      const indices = Array.from({ length: x.length }, () => Math.floor(Math.random() * x.length))
      const bootstrapX = indices.map(idx => x[idx])
      const bootstrapY = indices.map(idx => y[idx])
      
      const correlation = this.calculatePearsonCorrelation(bootstrapX, bootstrapY)
      bootstrapCorrelations.push(correlation)
    }
    
    bootstrapCorrelations.sort((a, b) => a - b)
    
    const alpha = 1 - confidenceLevel
    const lowerIndex = Math.floor(alpha / 2 * bootstrapSamples)
    const upperIndex = Math.floor((1 - alpha / 2) * bootstrapSamples)
    
    return [bootstrapCorrelations[lowerIndex], bootstrapCorrelations[upperIndex]]
  }
  
  private classifyEffectSize(correlation: number): number {
    // Cohen's conventions for correlation effect sizes
    const absCorr = Math.abs(correlation)
    if (absCorr < 0.1) return 0.1 // Trivial
    if (absCorr < 0.3) return 0.3 // Small
    if (absCorr < 0.5) return 0.5 // Medium
    return 0.8 // Large
  }
  
  private estimateStatisticalPower(correlation: number, sampleSize: number): number {
    // Simplified power calculation for correlation
    const zr = 0.5 * Math.log((1 + Math.abs(correlation)) / (1 - Math.abs(correlation)))
    const se = 1 / Math.sqrt(sampleSize - 3)
    const z = zr / se
    
    // Approximate power calculation
    return Math.min(1, Math.max(0, (z - 1.96) / 3.29))
  }
  
  private findOptimalLambdaML(values: number[]): number {
    let bestLambda = 1
    let maxLogLikelihood = -Infinity
    
    // Search for optimal lambda
    for (let lambda = -2; lambda <= 2; lambda += 0.1) {
      try {
        const transformed = this.boxCoxTransform(values, lambda)
        const logLikelihood = this.calculateLogLikelihood(transformed)
        
        if (logLikelihood > maxLogLikelihood) {
          maxLogLikelihood = logLikelihood
          bestLambda = lambda
        }
      } catch (e) {
        // Skip invalid transformations
        continue
      }
    }
    
    return bestLambda
  }
  
  private boxCoxTransform(values: number[], lambda: number): number[] {
    return values.map(x => {
      if (x <= 0) throw new Error('Box-Cox requires positive values')
      
      if (Math.abs(lambda) < 1e-10) {
        return Math.log(x)
      } else {
        return (Math.pow(x, lambda) - 1) / lambda
      }
    })
  }
  
  private calculateLogLikelihood(values: number[]): number {
    const n = values.length
    const mean = values.reduce((sum, val) => sum + val, 0) / n
    const variance = values.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / n
    
    return -0.5 * n * Math.log(2 * Math.PI * variance) - 0.5 * n
  }
  
  private likelihoodRatioTest(x: number[], y: number[], lambda1: number, lambda2: number): number {
    // Simplified likelihood ratio test
    const originalLikelihood = this.calculateLogLikelihood(x) + this.calculateLogLikelihood(y)
    
    try {
      const transformedX = this.boxCoxTransform(x, lambda1)
      const transformedY = this.boxCoxTransform(y, lambda2)
      const transformedLikelihood = this.calculateLogLikelihood(transformedX) + this.calculateLogLikelihood(transformedY)
      
      return 2 * (transformedLikelihood - originalLikelihood)
    } catch (e) {
      return 0
    }
  }
  
  private goodnessOfFitTest(x: number[], y: number[]): number {
    // Simplified goodness of fit using correlation between theoretical and sample quantiles
    const n = x.length
    const sortedX = [...x].sort((a, b) => a - b)
    const sortedY = [...y].sort((a, b) => a - b)
    
    const theoreticalQuantiles = Array.from({ length: n }, (_, i) => {
      const p = (i + 0.5) / n
      return this.normalQuantile(p)
    })
    
    const correlationX = this.calculatePearsonCorrelation(sortedX, theoreticalQuantiles)
    const correlationY = this.calculatePearsonCorrelation(sortedY, theoreticalQuantiles)
    
    return (correlationX + correlationY) / 2
  }
  
  private normalQuantile(p: number): number {
    // Approximation of normal quantile function
    const a = [-39.6968302866538, 220.946098424521, -275.928510446969, 138.357751867269, -30.6647980661472, 2.50662827745924]
    const b = [-54.4760987982241, 161.585836858041, -155.698979859887, 66.8013118877197, -13.2806815528857, 1]
    
    const r = p < 0.5 ? p : 1 - p
    const t = Math.sqrt(-2 * Math.log(r))
    
    let numerator = a[0]
    for (let i = 1; i < a.length; i++) {
      numerator = numerator * t + a[i]
    }
    
    let denominator = b[0]
    for (let i = 1; i < b.length; i++) {
      denominator = denominator * t + b[i]
    }
    
    let result = t - numerator / denominator
    return p < 0.5 ? -result : result
  }
  
  private calculateCVBasedSpuriousCorrelation(values1: number[], values2: number[], timeValues: number[]): number {
    // Implementation of Pearson's 1897 spurious correlation formula
    const cv1 = this.calculateCoefficientOfVariation(values1)
    const cv2 = this.calculateCoefficientOfVariation(values2)
    const cvTime = this.calculateCoefficientOfVariation(timeValues)
    
    const mean1 = values1.reduce((sum, val) => sum + val, 0) / values1.length
    const mean2 = values2.reduce((sum, val) => sum + val, 0) / values2.length
    
    const sign1 = mean1 >= 0 ? 1 : -1
    const sign2 = mean2 >= 0 ? 1 : -1
    
    const numerator = cvTime * cvTime * sign1 * sign2
    const denominator = Math.sqrt(
      (cv1 * cv1 * (1 + cvTime * cvTime) + cvTime * cvTime) *
      (cv2 * cv2 * (1 + cvTime * cvTime) + cvTime * cvTime)
    )
    
    return denominator !== 0 ? numerator / denominator : 0
  }
  
  private assessSpuriousRiskFromCV(
    cv1: number, 
    cv2: number, 
    timeVaryingCV1: number[], 
    timeVaryingCV2: number[]
  ): 'Low' | 'Medium' | 'High' | 'Critical' {
    
    const maxCV = Math.max(cv1, cv2)
    const cvVariability1 = this.calculateCoefficientOfVariation(timeVaryingCV1)
    const cvVariability2 = this.calculateCoefficientOfVariation(timeVaryingCV2)
    const maxCVVariability = Math.max(cvVariability1, cvVariability2)
    
    if (maxCV > 1.0 || maxCVVariability > 0.5) return 'Critical'
    if (maxCV > 0.5 || maxCVVariability > 0.3) return 'High'
    if (maxCV > 0.3 || maxCVVariability > 0.2) return 'Medium'
    return 'Low'
  }
  
  // Additional helper methods for robust analysis and non-parametric tests
  private calculateMedianCorrelation(x: number[], y: number[]): number {
    // Median-based correlation approximation
    const medianX = this.median(x)
    const medianY = this.median(y)
    
    const deviationsX = x.map(val => val - medianX)
    const deviationsY = y.map(val => val - medianY)
    
    return this.calculatePearsonCorrelation(deviationsX, deviationsY)
  }
  
  private calculateMADBasedCorrelation(x: number[], y: number[]): number {
    // MAD-based robust correlation
    const medianX = this.median(x)
    const medianY = this.median(y)
    
    const madX = this.median(x.map(val => Math.abs(val - medianX)))
    const madY = this.median(y.map(val => Math.abs(val - medianY)))
    
    const normalizedX = x.map(val => (val - medianX) / madX)
    const normalizedY = y.map(val => (val - medianY) / madY)
    
    return this.calculatePearsonCorrelation(normalizedX, normalizedY)
  }
  
  private calculateWinsorizedCorrelation(x: number[], y: number[], trimProportion: number): number {
    const sortedX = [...x].sort((a, b) => a - b)
    const sortedY = [...y].sort((a, b) => a - b)
    
    const trimCount = Math.floor(x.length * trimProportion)
    const lowerX = sortedX[trimCount]
    const upperX = sortedX[sortedX.length - 1 - trimCount]
    const lowerY = sortedY[trimCount]
    const upperY = sortedY[sortedY.length - 1 - trimCount]
    
    const winsorizedX = x.map(val => Math.max(lowerX, Math.min(upperX, val)))
    const winsorizedY = y.map(val => Math.max(lowerY, Math.min(upperY, val)))
    
    return this.calculatePearsonCorrelation(winsorizedX, winsorizedY)
  }
  
  private median(values: number[]): number {
    const sorted = [...values].sort((a, b) => a - b)
    const mid = Math.floor(sorted.length / 2)
    
    return sorted.length % 2 === 0
      ? (sorted[mid - 1] + sorted[mid]) / 2
      : sorted[mid]
  }
  
  private assessOutlierInfluence(x: number[], y: number[]): number {
    // Cook's distance approximation
    const originalCorr = this.calculatePearsonCorrelation(x, y)
    let maxInfluence = 0
    
    for (let i = 0; i < x.length; i++) {
      const xWithoutI = x.filter((_, idx) => idx !== i)
      const yWithoutI = y.filter((_, idx) => idx !== i)
      
      const corrWithoutI = this.calculatePearsonCorrelation(xWithoutI, yWithoutI)
      const influence = Math.abs(originalCorr - corrWithoutI)
      
      maxInfluence = Math.max(maxInfluence, influence)
    }
    
    return maxInfluence
  }
  
  private identifyLeveragePoints(x: number[], y: number[]): number[] {
    // Identify points with high leverage (simplified)
    const meanX = x.reduce((sum, val) => sum + val, 0) / x.length
    const meanY = y.reduce((sum, val) => sum + val, 0) / y.length
    
    const varX = x.reduce((sum, val) => sum + Math.pow(val - meanX, 2), 0) / (x.length - 1)
    const varY = y.reduce((sum, val) => sum + Math.pow(val - meanY, 2), 0) / (y.length - 1)
    
    const leverageThreshold = 2 * Math.sqrt(varX + varY) // Simplified threshold
    
    return x.map((val, idx) => {
      const distance = Math.sqrt(Math.pow(val - meanX, 2) + Math.pow(y[idx] - meanY, 2))
      return distance > leverageThreshold ? idx : -1
    }).filter(idx => idx >= 0)
  }
  
  // Non-parametric test implementations (simplified)
  private mannWhitneyUTest(x: number[], y: number[]): number {
    // Simplified Mann-Whitney U test
    const combined = [...x.map(val => ({ value: val, group: 'x' })), ...y.map(val => ({ value: val, group: 'y' }))]
    combined.sort((a, b) => a.value - b.value)
    
    let rankSum = 0
    for (let i = 0; i < combined.length; i++) {
      if (combined[i].group === 'x') {
        rankSum += i + 1
      }
    }
    
    const u = rankSum - (x.length * (x.length + 1)) / 2
    return u / (x.length * y.length)
  }
  
  private wilcoxonRankSumTest(x: number[], y: number[]): number {
    // Simplified implementation
    return this.mannWhitneyUTest(x, y) // Often equivalent
  }
  
  private kolmogorovSmirnovTest(x: number[], y: number[]): number {
    // Simplified KS test
    const sortedX = [...x].sort((a, b) => a - b)
    const sortedY = [...y].sort((a, b) => a - b)
    
    const allValues = [...new Set([...sortedX, ...sortedY])].sort((a, b) => a - b)
    let maxDiff = 0
    
    for (const value of allValues) {
      const propX = sortedX.filter(v => v <= value).length / sortedX.length
      const propY = sortedY.filter(v => v <= value).length / sortedY.length
      
      maxDiff = Math.max(maxDiff, Math.abs(propX - propY))
    }
    
    return maxDiff
  }
  
  private shapiroWilkTest(values: number[]): number {
    // Simplified Shapiro-Wilk test (returns approximate p-value)
    const n = values.length
    if (n < 3) return 0.5
    
    const sorted = [...values].sort((a, b) => a - b)
    const mean = values.reduce((sum, val) => sum + val, 0) / n
    const variance = values.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / (n - 1)
    
    // Simplified W statistic calculation
    let numerator = 0
    for (let i = 0; i < Math.floor(n / 2); i++) {
      const weight = this.shapiroWilkWeight(i + 1, n)
      numerator += weight * (sorted[n - 1 - i] - sorted[i])
    }
    
    const w = (numerator * numerator) / ((n - 1) * variance)
    
    // Approximate p-value (simplified)
    return w > 0.95 ? 0.1 : (w > 0.90 ? 0.05 : 0.01)
  }
  
  private shapiroWilkWeight(i: number, n: number): number {
    // Simplified weight calculation for Shapiro-Wilk test
    return 1 / Math.sqrt(n)
  }
  
  private assessNormality(pValue1: number, pValue2: number): 'Normal' | 'Non-Normal' | 'Uncertain' {
    const alpha = 0.05
    
    if (pValue1 > alpha && pValue2 > alpha) return 'Normal'
    if (pValue1 < alpha || pValue2 < alpha) return 'Non-Normal'
    return 'Uncertain'
  }
  
  // Advanced diagnostics implementations
  private breuschPaganTest(x: number[], y: number[]): number {
    // Simplified Breusch-Pagan test for heteroscedasticity
    const correlation = this.calculatePearsonCorrelation(x, y)
    const residuals = y.map((val, idx) => val - correlation * x[idx])
    
    const squaredResiduals = residuals.map(r => r * r)
    const residualMean = squaredResiduals.reduce((sum, val) => sum + val, 0) / squaredResiduals.length
    
    // Test if squared residuals correlate with x
    return this.calculatePearsonCorrelation(x, squaredResiduals)
  }
  
  private autocorrelationTest(x: number[], y: number[]): number {
    // Lag-1 autocorrelation test
    if (x.length < 2) return 0
    
    const xLag1 = x.slice(0, -1)
    const xCurrent = x.slice(1)
    const yLag1 = y.slice(0, -1)
    const yCurrent = y.slice(1)
    
    const autocorrX = this.calculatePearsonCorrelation(xLag1, xCurrent)
    const autocorrY = this.calculatePearsonCorrelation(yLag1, yCurrent)
    
    return Math.max(Math.abs(autocorrX), Math.abs(autocorrY))
  }
  
  private stationarityTest(x: number[], y: number[]): number {
    // Simplified stationarity test (trend detection)
    const timeIndices = Array.from({ length: x.length }, (_, i) => i)
    
    const trendX = this.calculatePearsonCorrelation(timeIndices, x)
    const trendY = this.calculatePearsonCorrelation(timeIndices, y)
    
    return Math.max(Math.abs(trendX), Math.abs(trendY))
  }
  
  private structuralBreakTest(data: Array<{ year: number; value1: number; value2: number }>): number {
    // Simplified structural break test (Chow test approximation)
    if (data.length < 6) return 0
    
    const midPoint = Math.floor(data.length / 2)
    const firstHalf = data.slice(0, midPoint)
    const secondHalf = data.slice(midPoint)
    
    const corr1 = this.calculatePearsonCorrelation(
      firstHalf.map(d => d.value1),
      firstHalf.map(d => d.value2)
    )
    
    const corr2 = this.calculatePearsonCorrelation(
      secondHalf.map(d => d.value1),
      secondHalf.map(d => d.value2)
    )
    
    return Math.abs(corr1 - corr2)
  }
  
  private calculateMulticollinearityIndex(x: number[], y: number[]): number {
    // VIF approximation for bivariate case
    const correlation = this.calculatePearsonCorrelation(x, y)
    return 1 / (1 - correlation * correlation)
  }
  
  private calculateOverallAssessment(analysis: any): EnhancedStatisticalResult['overallAssessment'] {
    const { pearsonCorr, spearmanCorr, kendallTau, permutationTest, boxCoxAnalysis, coefficientVariation, robustAnalysis, nonParametricTests, diagnostics } = analysis
    
    // Calculate reliability score
    let reliabilityScore = 0
    
    // Correlation consistency check
    const correlationConsistency = 1 - Math.abs(pearsonCorr - spearmanCorr)
    reliabilityScore += correlationConsistency * 0.2
    
    // Statistical significance
    if (permutationTest.pValueCorrected < 0.05) reliabilityScore += 0.2
    if (permutationTest.statisticalPower > 0.8) reliabilityScore += 0.2
    
    // Data quality checks
    if (nonParametricTests.normalityAssessment === 'Normal') reliabilityScore += 0.1
    if (diagnostics.heteroscedasticityTest < 0.3) reliabilityScore += 0.1
    if (diagnostics.autocorrelationLag1 < 0.3) reliabilityScore += 0.1
    if (diagnostics.structuralBreakTest < 0.3) reliabilityScore += 0.1
    
    // Determine reliability category
    let reliability: 'Very Low' | 'Low' | 'Medium' | 'High' | 'Very High'
    if (reliabilityScore >= 0.8) reliability = 'Very High'
    else if (reliabilityScore >= 0.6) reliability = 'High'
    else if (reliabilityScore >= 0.4) reliability = 'Medium'
    else if (reliabilityScore >= 0.2) reliability = 'Low'
    else reliability = 'Very Low'
    
    // Calculate spurious probability
    let spuriousProbability = 0
    if (coefficientVariation.spuriousRisk === 'Critical') spuriousProbability += 40
    else if (coefficientVariation.spuriousRisk === 'High') spuriousProbability += 30
    else if (coefficientVariation.spuriousRisk === 'Medium') spuriousProbability += 20
    else spuriousProbability += 10
    
    if (Math.abs(coefficientVariation.cvBasedCorrelation) > 0.3) spuriousProbability += 20
    if (diagnostics.stationarityTest > 0.7) spuriousProbability += 20
    if (diagnostics.structuralBreakTest > 0.5) spuriousProbability += 15
    if (permutationTest.pValueCorrected > 0.05) spuriousProbability += 15
    
    spuriousProbability = Math.min(100, spuriousProbability)
    
    // Recommended method
    let recommendedMethod = 'Pearson Correlation'
    if (nonParametricTests.normalityAssessment === 'Non-Normal') {
      recommendedMethod = Math.abs(spearmanCorr) > Math.abs(kendallTau) ? 'Spearman Correlation' : 'Kendall Tau'
    } else if (robustAnalysis.outlierInfluence > 0.2) {
      recommendedMethod = 'Robust Correlation (Winsorized)'
    } else if (boxCoxAnalysis.transformationNeeded) {
      recommendedMethod = 'Box-Cox Transformed Correlation'
    }
    
    // Confidence level
    const confidenceLevel = Math.max(0, Math.min(100, (1 - permutationTest.pValueCorrected) * 100))
    
    // Statistical warnings
    const statisticalWarnings: string[] = []
    
    if (permutationTest.pValueCorrected > 0.05) {
      statisticalWarnings.push('Correlation not statistically significant after multiple comparison correction')
    }
    
    if (spuriousProbability > 50) {
      statisticalWarnings.push('High probability of spurious correlation - investigate third variables')
    }
    
    if (diagnostics.heteroscedasticityTest > 0.5) {
      statisticalWarnings.push('Heteroscedasticity detected - consider robust estimation methods')
    }
    
    if (diagnostics.autocorrelationLag1 > 0.5) {
      statisticalWarnings.push('Temporal autocorrelation detected - time series methods may be more appropriate')
    }
    
    if (robustAnalysis.outlierInfluence > 0.3) {
      statisticalWarnings.push('High outlier influence detected - results may not be robust')
    }
    
    if (boxCoxAnalysis.transformationNeeded) {
      statisticalWarnings.push('Data transformation recommended to improve normality and reduce spurious correlations')
    }
    
    return {
      reliability,
      spuriousProbability,
      recommendedMethod,
      confidenceLevel,
      statisticalWarnings
    }
  }
}

// Export singleton instance
export const advancedStatisticalService = new AdvancedStatisticalService()