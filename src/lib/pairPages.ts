import { fmtP } from '@/lib/correlationStats'
import { fmtR } from '@/lib/format'
import { overlapYears } from '@/lib/pair'
import type { Dataset, PairResult } from '@/types'

/**
 * Static, indexable pages for pairs: /pairs/<a>--vs--<b>/. The build
 * (scripts/build-pages.mjs) and the app share these rules, so a link the
 * app writes always points at a page that exists.
 */

export const PAGE_MIN_YEARS = 15
const SEP = '--vs--'
const PATH = /^\/pairs\/([a-z0-9_-]{1,64})--vs--([a-z0-9_-]{1,64})\/?$/

export const hasPairPage = (a: Dataset, b: Dataset) => a.id !== b.id && overlapYears(a, b) >= PAGE_MIN_YEARS

export const pairPath = (aId: string, bId: string) => `/pairs/${aId}${SEP}${bId}/`

/** The ordering search engines index; the reversed page declares this one canonical. */
export const canonicalPairPath = (aId: string, bId: string) => (aId < bId ? pairPath(aId, bId) : pairPath(bId, aId))

export function parsePairPath(pathname: string): { a: string; b: string } | null {
  const m = PATH.exec(pathname)
  return m && m[1] !== m[2] ? { a: m[1], b: m[2] } : null
}

const verdictPhrase: Record<string, string> = {
  'likely-spurious': 'likely spurious',
  'not-significant': 'not significant',
  caution: 'read with caution',
  significant: 'holds up',
  insufficient: 'too little data',
}

export function pairTitle({ a, b, stats }: PairResult) {
  return `${a.name} vs ${b.name}: r = ${fmtR(stats.r)}, ${verdictPhrase[stats.verdict.level]} | CorrelateAI`
}

export function pairDescription({ a, b, points, stats }: PairResult) {
  const span = points.length ? `${points[0].year}–${points[points.length - 1].year}` : ''
  return `${a.name} and ${b.name} correlate at r = ${fmtR(stats.r)} over ${stats.n} years (${span}), p ${
    stats.pValue < 0.0001 ? '' : '= '
  }${fmtP(stats.pValue)}. With the time trend removed, r = ${fmtR(stats.detrendedR)}. ${stats.verdict.label}.`
}
