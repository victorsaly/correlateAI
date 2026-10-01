import { linearDetrend } from '@/lib/correlationStats'
import type { PairPoint } from '@/types'

export type Scale = 'standardised' | 'actual'

const zScores = (xs: number[]) => {
  const m = xs.reduce((s, x) => s + x, 0) / xs.length
  const sd = Math.sqrt(xs.reduce((s, x) => s + (x - m) ** 2, 0) / xs.length) || 1
  return xs.map((x) => (x - m) / sd)
}

/**
 * Values plotted for a pair. "standardised" puts both series on one axis as
 * z-scores (the scale Pearson r actually compares); "actual" keeps units.
 * With `detrend`, each series is replaced by its residual from a linear trend.
 */
export function plotSeries(points: PairPoint[], scale: Scale, detrend: boolean) {
  let a = points.map((p) => p.a)
  let b = points.map((p) => p.b)
  if (detrend) {
    a = linearDetrend(a)
    b = linearDetrend(b)
  }
  if (scale === 'standardised') {
    a = zScores(a)
    b = zScores(b)
  }
  return points.map((p, i) => ({ year: p.year, a: a[i], b: b[i], rawA: p.a, rawB: p.b }))
}

/** Round-numbered year ticks (every 1, 2, 5, 10, 20, 25 or 50 years); labels and grid share them. */
export function yearTicks(first: number, last: number, maxTicks = 8): number[] {
  const step = [1, 2, 5, 10, 20, 25, 50].find((s) => (last - first) / s <= maxTicks) ?? 100
  const ticks: number[] = []
  for (let y = Math.ceil(first / step) * step; y <= last; y += step) ticks.push(y)
  return ticks
}

/** Ordinary least squares fit y = slope·x + intercept. */
export function olsFit(xs: number[], ys: number[]) {
  const n = xs.length
  const mx = xs.reduce((s, x) => s + x, 0) / n
  const my = ys.reduce((s, y) => s + y, 0) / n
  let sxy = 0
  let sxx = 0
  for (let i = 0; i < n; i++) {
    sxy += (xs[i] - mx) * (ys[i] - my)
    sxx += (xs[i] - mx) ** 2
  }
  const slope = sxx === 0 ? 0 : sxy / sxx
  return { slope, intercept: my - slope * mx }
}
