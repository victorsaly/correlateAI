/**
 * correlationStats.ts
 *
 * Honest, dependency-free statistics computed directly from the data points a
 * user is actually looking at — so the UI never shows fabricated numbers
 * (the legacy generator added `Math.random()` to R²).
 *
 * Everything here is pure and unit-testable. The headline feature is
 * `detrendedCorrelation` + `spuriousVerdict`: the single most common way two
 * unrelated series correlate is that both simply trend with time, so we
 * recompute the correlation after removing each series' linear time trend.
 */

export type VerdictLevel =
  | 'insufficient'
  | 'not-significant'
  | 'likely-spurious'
  | 'caution'
  | 'significant'

export interface SpuriousVerdict {
  level: VerdictLevel
  label: string
  explanation: string
}

export interface HonestStats {
  /** number of paired observations */
  n: number
  /** Pearson r on the raw series */
  r: number
  /** coefficient of determination (r²) */
  rSquared: number
  /** two-tailed p-value for H0: ρ = 0 (Student's t) */
  pValue: number
  /** 95% confidence interval for r (Fisher z), or null when n ≤ 3 */
  ci: [number, number] | null
  /** Pearson r after removing each series' linear time trend */
  detrendedR: number
  /** how much the correlation collapses once the shared trend is removed */
  detrendedDrop: number
  /** true when both series are strongly monotonic in time */
  bothTrend: boolean
  verdict: SpuriousVerdict
}

const mean = (xs: number[]): number =>
  xs.length === 0 ? 0 : xs.reduce((a, b) => a + b, 0) / xs.length

/** Pearson product-moment correlation coefficient. Returns 0 if undefined. */
export function pearson(xs: number[], ys: number[]): number {
  const n = Math.min(xs.length, ys.length)
  if (n < 2) return 0
  const mx = mean(xs.slice(0, n))
  const my = mean(ys.slice(0, n))
  let sxy = 0
  let sxx = 0
  let syy = 0
  for (let i = 0; i < n; i++) {
    const dx = xs[i] - mx
    const dy = ys[i] - my
    sxy += dx * dy
    sxx += dx * dx
    syy += dy * dy
  }
  const denom = Math.sqrt(sxx * syy)
  if (denom === 0) return 0
  return clampR(sxy / denom)
}

/** Residuals of `values` after removing the best-fit linear trend vs. time index. */
export function linearDetrend(values: number[]): number[] {
  const n = values.length
  if (n < 2) return values.slice()
  const t = values.map((_, i) => i)
  const mt = mean(t)
  const mv = mean(values)
  let stt = 0
  let stv = 0
  for (let i = 0; i < n; i++) {
    stt += (t[i] - mt) ** 2
    stv += (t[i] - mt) * (values[i] - mv)
  }
  const slope = stt === 0 ? 0 : stv / stt
  const intercept = mv - slope * mt
  return values.map((v, i) => v - (intercept + slope * i))
}

/** Correlation of the two series after each has had its linear time trend removed. */
export function detrendedCorrelation(v1: number[], v2: number[]): number {
  return pearson(linearDetrend(v1), linearDetrend(v2))
}

/** Two-tailed p-value for a Pearson r under H0: ρ = 0 (Student's t, df = n-2). */
export function pValueFromR(r: number, n: number): number {
  if (n < 3) return 1
  const rr = Math.min(Math.abs(r), 0.999999)
  const df = n - 2
  const t = rr * Math.sqrt(df / (1 - rr * rr))
  // two-tailed: p = I_{df/(df+t²)}(df/2, 1/2)
  return regularizedIncompleteBeta(df / 2, 0.5, df / (df + t * t))
}

/** 95% confidence interval for r via the Fisher z-transform. Null when n ≤ 3. */
export function fisherConfidenceInterval(
  r: number,
  n: number,
  z = 1.959963984540054 // 95%
): [number, number] | null {
  if (n <= 3) return null
  const rr = clampR(r)
  const zr = Math.atanh(rr)
  const se = 1 / Math.sqrt(n - 3)
  return [clampR(Math.tanh(zr - z * se)), clampR(Math.tanh(zr + z * se))]
}

const STRONG_TREND = 0.7 // |corr(series, time)| above this = strongly trending

/** Build the full honest-stats bundle from paired (value1, value2) series. */
export function computeHonestStats(v1: number[], v2: number[]): HonestStats {
  const n = Math.min(v1.length, v2.length)
  const a = v1.slice(0, n)
  const b = v2.slice(0, n)
  const r = pearson(a, b)
  const detrendedR = detrendedCorrelation(a, b)
  const pValue = pValueFromR(r, n)
  const ci = fisherConfidenceInterval(r, n)

  const t = a.map((_, i) => i)
  const trend1 = Math.abs(pearson(a, t))
  const trend2 = Math.abs(pearson(b, t))
  const bothTrend = trend1 >= STRONG_TREND && trend2 >= STRONG_TREND
  const detrendedDrop = Math.abs(r) - Math.abs(detrendedR)

  return {
    n,
    r,
    rSquared: r * r,
    pValue,
    ci,
    detrendedR,
    detrendedDrop,
    bothTrend,
    verdict: spuriousVerdict({ n, r, detrendedR, pValue, bothTrend, detrendedDrop }),
  }
}

/** Plain-language judgement about whether a correlation is trustworthy or likely spurious. */
export function spuriousVerdict(args: {
  n: number
  r: number
  detrendedR: number
  pValue: number
  bothTrend: boolean
  detrendedDrop: number
}): SpuriousVerdict {
  const { n, r, detrendedR, pValue, bothTrend, detrendedDrop } = args

  if (n < 5) {
    return {
      level: 'insufficient',
      label: 'Too little data',
      explanation: `Only ${n} data points — far too few to judge whether this relationship is real.`,
    }
  }

  if (pValue > 0.05) {
    return {
      level: 'not-significant',
      label: 'Not statistically significant',
      explanation: `With n = ${n}, this correlation isn't statistically significant (p = ${fmtP(
        pValue
      )}). It could easily be chance.`,
    }
  }

  if (bothTrend && Math.abs(detrendedR) < 0.3) {
    return {
      level: 'likely-spurious',
      label: 'Likely spurious (shared time trend)',
      explanation: `Both series mostly just trend over time. After removing that trend the correlation collapses to ${detrendedR.toFixed(
        2
      )} — the relationship is probably coincidental, not causal.`,
    }
  }

  if (detrendedDrop > 0.4) {
    return {
      level: 'caution',
      label: 'Interpret with caution',
      explanation: `Much of the apparent link is driven by a shared time trend: r falls from ${r.toFixed(
        2
      )} to ${detrendedR.toFixed(2)} once the trend is removed.`,
    }
  }

  return {
    level: 'significant',
    label: 'Holds up after detrending',
    explanation: `Statistically significant (p = ${fmtP(
      pValue
    )}) and the association survives trend removal (detrended r = ${detrendedR.toFixed(
      2
    )}). Correlation still isn't causation, but this one isn't an obvious artifact.`,
  }
}

/** Format a p-value for display. */
export function fmtP(p: number): string {
  if (p < 0.0001) return '< 0.0001'
  if (p < 0.001) return p.toExponential(1)
  return p.toFixed(p < 0.01 ? 4 : 3)
}

function clampR(r: number): number {
  if (Number.isNaN(r)) return 0
  return Math.max(-1, Math.min(1, r))
}

// --- Regularized incomplete beta (for the Student's t p-value) -------------
// Standard Lentz continued-fraction implementation (Numerical Recipes).

function logGamma(x: number): number {
  // Lanczos approximation (g=5). The long coefficients intentionally rely on
  // IEEE-754 rounding, so the no-loss-of-precision rule is disabled here.
  /* eslint-disable no-loss-of-precision */
  const c = [
    76.18009172947146, -86.50532032941677, 24.01409824083091,
    -1.231739572450155, 0.1208650973866179e-2, -0.5395239384953e-5,
  ]
  let ser = 1.000000000190015
  /* eslint-enable no-loss-of-precision */
  let y = x
  let tmp = x + 5.5
  tmp -= (x + 0.5) * Math.log(tmp)
  for (let j = 0; j < 6; j++) {
    y += 1
    ser += c[j] / y
  }
  return -tmp + Math.log((Math.sqrt(2 * Math.PI) * ser) / x)
}

function betaContinuedFraction(a: number, b: number, x: number): number {
  const FPMIN = 1e-30
  const qab = a + b
  const qap = a + 1
  const qam = a - 1
  let c = 1
  let d = 1 - (qab * x) / qap
  if (Math.abs(d) < FPMIN) d = FPMIN
  d = 1 / d
  let h = d
  for (let m = 1; m <= 200; m++) {
    const m2 = 2 * m
    let aa = (m * (b - m) * x) / ((qam + m2) * (a + m2))
    d = 1 + aa * d
    if (Math.abs(d) < FPMIN) d = FPMIN
    c = 1 + aa / c
    if (Math.abs(c) < FPMIN) c = FPMIN
    d = 1 / d
    h *= d * c
    aa = (-(a + m) * (qab + m) * x) / ((a + m2) * (qap + m2))
    d = 1 + aa * d
    if (Math.abs(d) < FPMIN) d = FPMIN
    c = 1 + aa / c
    if (Math.abs(c) < FPMIN) c = FPMIN
    d = 1 / d
    const del = d * c
    h *= del
    if (Math.abs(del - 1) < 3e-7) break
  }
  return h
}

/** Regularized incomplete beta function I_x(a, b). */
export function regularizedIncompleteBeta(a: number, b: number, x: number): number {
  if (x <= 0) return 0
  if (x >= 1) return 1
  const bt = Math.exp(
    logGamma(a + b) - logGamma(a) - logGamma(b) + a * Math.log(x) + b * Math.log(1 - x)
  )
  if (x < (a + 1) / (a + b + 2)) {
    return (bt * betaContinuedFraction(a, b, x)) / a
  }
  return 1 - (bt * betaContinuedFraction(b, a, 1 - x)) / b
}
