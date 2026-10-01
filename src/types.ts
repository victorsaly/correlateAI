import type { HonestStats } from '@/lib/correlationStats'

/** One series from public/data/real_list.json. */
export interface Dataset {
  id: string
  name: string
  unit: string
  source: string
  sourceUrl: string
  category: string
  description: string
  dataPoints: number
  dateRange: { start: number; end: number }
}

export interface YearValue {
  year: number
  value: number
}

export interface PairPoint {
  year: number
  a: number
  b: number
}

export interface PairResult {
  a: Dataset
  b: Dataset
  points: PairPoint[]
  stats: HonestStats
}
