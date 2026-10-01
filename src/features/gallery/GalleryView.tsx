import { useEffect, useMemo, useState } from 'react'
import { Skeleton } from '@/components/ui/skeleton'
import { computePair, overlapYears } from '@/lib/pair'
import { loadSeries } from '@/services/dataService'
import type { Dataset, PairResult } from '@/types'
import { PairRow } from '@/features/PairRow'

const MIN_YEARS = 15
const PER_SECTION = 8

/**
 * Every cross-category pair with enough shared years, computed in the browser.
 * A series that fails to load is left out (and counted) rather than blocking the page.
 */
function useAllPairs(catalog: Dataset[]) {
  const [pairs, setPairs] = useState<PairResult[] | null>(null)
  const [failed, setFailed] = useState(0)
  useEffect(() => {
    let live = true
    Promise.allSettled(catalog.map((d) => loadSeries(d.id).then((s) => [d.id, s] as const))).then((results) => {
      const series = new Map(results.flatMap((r) => (r.status === 'fulfilled' ? [r.value] : [])))
      const out: PairResult[] = []
      for (let i = 0; i < catalog.length; i++) {
        for (let j = i + 1; j < catalog.length; j++) {
          const a = catalog[i]
          const b = catalog[j]
          if (!series.has(a.id) || !series.has(b.id)) continue
          if (a.category === b.category || overlapYears(a, b) < MIN_YEARS) continue
          const p = computePair(a, b, series.get(a.id)!, series.get(b.id)!)
          if (p.stats.n >= MIN_YEARS) out.push(p)
        }
      }
      if (live) {
        setFailed(catalog.length - series.size)
        setPairs(out)
      }
    })
    return () => {
      live = false
    }
  }, [catalog])
  return { pairs, failed }
}

export function GalleryView({ catalog, onOpen }: { catalog: Dataset[]; onOpen: (a: string, b: string) => void }) {
  const { pairs, failed } = useAllPairs(catalog)

  const sections = useMemo(() => {
    if (!pairs) return null
    const byAbsR = (x: PairResult, y: PairResult) => Math.abs(y.stats.r) - Math.abs(x.stats.r)
    const byDetrended = (x: PairResult, y: PairResult) => Math.abs(y.stats.detrendedR) - Math.abs(x.stats.detrendedR)
    return [
      {
        title: 'Looks strong, probably coincidence',
        blurb: 'Very high correlations that collapse once each series’ trend over time is removed. Classic spurious correlations.',
        list: pairs.filter((p) => p.stats.verdict.level === 'likely-spurious').sort(byAbsR).slice(0, PER_SECTION),
      },
      {
        title: 'Holds up after removing the trend',
        blurb: 'Significant, and the year-to-year movements still line up. Worth a closer look, though correlation still isn’t causation.',
        list: pairs.filter((p) => p.stats.verdict.level === 'significant').sort(byDetrended).slice(0, PER_SECTION),
      },
      {
        title: 'Read with caution',
        blurb: 'Either much of the link was the shared drift, or the year-to-year movements run the opposite way once the trend is removed.',
        list: pairs.filter((p) => p.stats.verdict.level === 'caution').sort(byAbsR).slice(0, PER_SECTION),
      },
    ]
  }, [pairs])

  const significantCount = pairs?.filter((p) => p.stats.pValue < 0.05).length ?? 0

  return (
    <div className="flex flex-col gap-10">
      <header className="max-w-[65ch]">
        <h1 className="text-2xl font-semibold tracking-[-0.02em]">Gallery</h1>
        <p className="mt-2 text-muted-foreground">
          Pairs picked out of every combination of the series in the catalog. Searching this many pairs guarantees
          some striking results by chance alone, which is exactly the point.
        </p>
        {pairs && (
          <p className="tabular mt-3 text-sm">
            {pairs.length} pairs tested · {significantCount} have p &lt; 0.05 · about {Math.round(pairs.length * 0.05)} would by luck alone if nothing were related
          </p>
        )}
        {failed > 0 && (
          <p role="status" className="mt-2 text-sm text-destructive">
            {failed} of {catalog.length} series couldn’t be loaded, so pairs using them are missing. Reload to try again.
          </p>
        )}
      </header>

      {!sections
        ? Array.from({ length: 3 }, (_, i) => <Skeleton key={i} className="h-64 rounded-md" />)
        : sections.map((s) => (
            <section key={s.title} aria-labelledby={s.title}>
              <h2 id={s.title} className="text-lg font-semibold">{s.title}</h2>
              <p className="mt-1 max-w-[65ch] text-sm text-muted-foreground">{s.blurb}</p>
              {s.list.length === 0 ? (
                <p className="mt-4 text-sm text-muted-foreground">No pairs in the current data fall here.</p>
              ) : (
                <ul className="mt-2 border-t">
                  {s.list.map((p) => (
                    <PairRow key={`${p.a.id}~${p.b.id}`} pair={p} onOpen={() => onOpen(p.a.id, p.b.id)} />
                  ))}
                </ul>
              )}
            </section>
          ))}
    </div>
  )
}
