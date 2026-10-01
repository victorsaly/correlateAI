import { fmtP } from '@/lib/correlationStats'
import { fmtR } from '@/lib/format'
import { sharePairUrl } from '@/lib/shareUrl'
import type { PairResult } from '@/types'

function download(filename: string, blob: Blob) {
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  link.click()
  URL.revokeObjectURL(url)
}

export const fileStem = ({ a, b }: PairResult) => `${a.id}_vs_${b.id}`

const csvCell = (s: string | number) => {
  const str = String(s)
  return /[",\n]/.test(str) ? `"${str.replace(/"/g, '""')}"` : str
}

export function downloadCsv(pair: PairResult) {
  const { a, b, points, stats } = pair
  const lines = [
    `# ${a.name} (${a.unit}) — ${a.source}: ${a.sourceUrl}`,
    `# ${b.name} (${b.unit}) — ${b.source}: ${b.sourceUrl}`,
    `# r = ${stats.r.toFixed(4)}, n = ${stats.n}, p = ${fmtP(stats.pValue)}, detrended r = ${stats.detrendedR.toFixed(4)}`,
    `# ${sharePairUrl(pair)}`,
    ['year', a.name, b.name].map(csvCell).join(','),
    ...points.map((p) => [p.year, p.a, p.b].join(',')),
  ]
  download(`${fileStem(pair)}.csv`, new Blob([lines.join('\n')], { type: 'text/csv' }))
}

export function downloadJson(pair: PairResult) {
  const { a, b, points, stats } = pair
  const body = {
    url: sharePairUrl(pair),
    series: [a, b],
    stats: {
      n: stats.n,
      r: stats.r,
      rSquared: stats.rSquared,
      pValue: stats.pValue,
      ci95: stats.ci,
      detrendedR: stats.detrendedR,
      verdict: stats.verdict,
    },
    points,
  }
  download(
    `${fileStem(pair)}.json`,
    new Blob([JSON.stringify(body, null, 2)], { type: 'application/json' })
  )
}

export function downloadBlob(filename: string, blob: Blob) {
  download(filename, blob)
}

/** Factual one-line summary used for social posts. */
export function shareText({ a, b, stats }: PairResult) {
  return `${a.name} vs ${b.name}: r = ${fmtR(stats.r)} (n = ${stats.n}, p ${stats.pValue < 0.0001 ? '' : '= '}${fmtP(stats.pValue)}). Verdict: ${stats.verdict.label}.`
}
