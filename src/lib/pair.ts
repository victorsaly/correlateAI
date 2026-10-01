import { computeHonestStats } from '@/lib/correlationStats'
import { loadSeries } from '@/services/dataService'
import type { Dataset, PairPoint, PairResult, YearValue } from '@/types'

export const MIN_OVERLAP = 10

/** Pair two series on the years they share, in ascending year order. */
export function alignByYear(a: YearValue[], b: YearValue[]): PairPoint[] {
  const bByYear = new Map(b.map((p) => [p.year, p.value]))
  const points: PairPoint[] = []
  for (const p of a) {
    const bv = bByYear.get(p.year)
    if (bv !== undefined) points.push({ year: p.year, a: p.value, b: bv })
  }
  return points.sort((x, y) => x.year - y.year)
}

export function overlapYears(a: Dataset, b: Dataset): number {
  const start = Math.max(a.dateRange.start, b.dateRange.start)
  const end = Math.min(a.dateRange.end, b.dateRange.end)
  return Math.max(0, end - start + 1)
}

export function computePair(a: Dataset, b: Dataset, sa: YearValue[], sb: YearValue[]): PairResult {
  const points = alignByYear(sa, sb)
  const stats = computeHonestStats(
    points.map((p) => p.a),
    points.map((p) => p.b)
  )
  return { a, b, points, stats }
}

export async function loadPair(a: Dataset, b: Dataset): Promise<PairResult> {
  const [sa, sb] = await Promise.all([loadSeries(a.id), loadSeries(b.id)])
  return computePair(a, b, sa, sb)
}

/**
 * Pick two different series that share at least `minOverlap` years. Pairs
 * from the same source family (e.g. two CO₂ measures) are skipped because
 * they correlate trivially.
 */
export function randomPair(
  catalog: Dataset[],
  { minOverlap = MIN_OVERLAP, rng = Math.random } = {}
): [Dataset, Dataset] | null {
  const candidates: [Dataset, Dataset][] = []
  for (let i = 0; i < catalog.length; i++) {
    for (let j = 0; j < catalog.length; j++) {
      const a = catalog[i]
      const b = catalog[j]
      if (i === j || a.category === b.category) continue
      if (overlapYears(a, b) >= minOverlap) candidates.push([a, b])
    }
  }
  if (candidates.length === 0) return null
  return candidates[Math.floor(rng() * candidates.length)]
}

export const pairKey = (aId: string, bId: string) => `${aId}~${bId}`
