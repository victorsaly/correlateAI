import { lazy, Suspense, useState } from 'react'
import { Bookmark, BookmarkCheck, ExternalLink } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'
import { Skeleton } from '@/components/ui/skeleton'
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'
import { fmtValue } from '@/lib/format'
import { cn } from '@/lib/utils'
import type { Dataset, PairResult } from '@/types'
import type { Scale } from '@/features/charts/transform'
import { PairPicker } from './PairPicker'
import { ShareMenu } from './ShareMenu'
import { HeadlineR, StatFigures, Verdict } from './StatsMargin'

type Form = 'time' | 'scatter'

// Recharts is the heaviest dependency; the headline r and verdict render without waiting for it.
const PairTimeChart = lazy(() => import('@/features/charts/PairTimeChart').then((m) => ({ default: m.PairTimeChart })))
const PairScatter = lazy(() => import('@/features/charts/PairScatter').then((m) => ({ default: m.PairScatter })))

interface Props {
  catalog: Dataset[]
  pair: PairResult | null
  loading: boolean
  error: string | null
  saved: boolean
  onChange: (a: string, b: string) => void
  onRandom: () => void
  onToggleSave: () => void
}

export function ExploreView({ catalog, pair, loading, error, saved, onChange, onRandom, onToggleSave }: Props) {
  const [form, setForm] = useState<Form>('time')
  const [scale, setScale] = useState<Scale>('standardised')
  const [detrend, setDetrend] = useState(false)

  return (
    <div className="flex flex-col gap-6">
      <h1 className="sr-only">{pair ? `${pair.a.name} vs ${pair.b.name}` : 'Explore a pair of datasets'}</h1>
      <PairPicker catalog={catalog} a={pair?.a} b={pair?.b} onChange={onChange} onRandom={onRandom} />

      {error && !loading && (
        <div role="alert" className="rounded-md border border-pencil/50 px-4 py-3 text-sm">
          {error}{' '}
          <button className="underline" onClick={onRandom}>Try a random pair</button>
        </div>
      )}

      {!pair ? (
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_22rem]">
          <Skeleton className="h-[26rem] rounded-md" />
          <Skeleton className="h-[26rem] rounded-md" />
        </div>
      ) : (
        <div className={cn('grid gap-x-8 gap-y-6 transition-opacity lg:grid-cols-[minmax(0,1fr)_22rem] lg:grid-rows-[auto_auto_1fr] lg:gap-y-0', loading && 'opacity-60')}>
          {/* Mobile order: headline r, verdict and share, then chart, then figures. Desktop: chart left, margin right. */}
          <div className="lg:col-start-2 lg:row-start-1 lg:border-l lg:pb-5 lg:pl-8">
            <HeadlineR pair={pair} detrend={detrend} />
          </div>

          <div className="flex flex-col gap-5 lg:col-start-2 lg:row-start-3 lg:border-l lg:pl-8">
            <Verdict pair={pair} />
            <ShareMenu pair={pair} />
            <Button variant="ghost" className="self-start px-0 hover:bg-transparent hover:underline" onClick={onToggleSave} aria-pressed={saved}>
              {saved ? <BookmarkCheck /> : <Bookmark />}
              {saved ? 'Saved' : 'Save this pair'}
            </Button>
          </div>

          <section aria-label="Chart" className="flex min-w-0 flex-col gap-3 lg:col-start-1 lg:row-span-3 lg:row-start-1">
            <div className="flex flex-wrap items-center gap-2">
              <ToggleGroup type="single" variant="outline" size="sm" value={form} onValueChange={(v) => v && setForm(v as Form)} aria-label="Chart type">
                <ToggleGroupItem value="time" className="px-3">Over time</ToggleGroupItem>
                <ToggleGroupItem value="scatter" className="px-3">A against B</ToggleGroupItem>
              </ToggleGroup>
              {form === 'time' && (
                <ToggleGroup type="single" variant="outline" size="sm" value={scale} onValueChange={(v) => v && setScale(v as Scale)} aria-label="Scale">
                  <ToggleGroupItem value="standardised" className="px-3">Standardised</ToggleGroupItem>
                  <ToggleGroupItem value="actual" className="px-3">Actual units</ToggleGroupItem>
                </ToggleGroup>
              )}
              <Button
                variant={detrend ? 'default' : 'outline'}
                size="sm"
                aria-pressed={detrend}
                onClick={() => setDetrend((d) => !d)}
                className="sm:ml-auto"
              >
                Remove trend
              </Button>
            </div>

            <Legend a={pair.a} b={pair.b} />

            <div className="graph-paper h-[22rem] rounded-md border p-2 sm:h-[26rem] sm:p-3">
              <Suspense fallback={null}>
                {form === 'time' ? (
                  <PairTimeChart pair={pair} scale={scale} detrend={detrend} />
                ) : (
                  <PairScatter pair={pair} detrend={detrend} />
                )}
              </Suspense>
            </div>
            <p className="text-xs text-muted-foreground">
              {form === 'time' && scale === 'standardised'
                ? 'Standardised: each series shown as distance from its own average, in standard deviations, so both share one axis.'
                : form === 'scatter'
                  ? 'One dot per year. The dashed line is the least-squares fit.'
                  : 'Each series in its own units, sharing the year axis.'}
              {detrend && ' Trend removed: each series minus its straight-line trend over time.'}
            </p>
          </section>

          <div className="lg:col-start-2 lg:row-start-2 lg:border-l lg:pb-5 lg:pl-8">
            <StatFigures pair={pair} detrend={detrend} />
          </div>
        </div>
      )}

      {pair && (
        <div className="grid gap-6 border-t pt-6 md:grid-cols-2">
          <SourceNote ds={pair.a} line="a" />
          <SourceNote ds={pair.b} line="b" />
          <DataTable pair={pair} />
        </div>
      )}
    </div>
  )
}

function Legend({ a, b }: { a: Dataset; b: Dataset }) {
  return (
    <ul className="flex flex-wrap gap-x-6 gap-y-1 text-sm">
      <li className="flex items-center gap-2">
        <span aria-hidden className="h-0.5 w-6 bg-series-a" />
        {a.name}
      </li>
      <li className="flex items-center gap-2">
        <span aria-hidden className="h-0.5 w-6 bg-series-b [mask:repeating-linear-gradient(90deg,#000_0_6px,transparent_6px_10px)]" />
        {b.name}
      </li>
    </ul>
  )
}

function SourceNote({ ds, line }: { ds: Dataset; line: 'a' | 'b' }) {
  return (
    <div className="text-sm">
      <div className="flex items-center gap-2 font-semibold">
        <span aria-hidden className={cn('size-2 rounded-full', line === 'a' ? 'bg-series-a' : 'bg-series-b')} />
        {ds.name}
      </div>
      <p className="mt-1 text-muted-foreground">{ds.description}</p>
      <p className="mt-1 text-muted-foreground">
        {ds.unit} · {ds.dateRange.start}–{ds.dateRange.end} ·{' '}
        <a href={ds.sourceUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-foreground underline">
          {ds.source} <ExternalLink aria-hidden className="size-3" />
        </a>
      </p>
    </div>
  )
}

function DataTable({ pair }: { pair: PairResult }) {
  return (
    <Collapsible className="md:col-span-2">
      <CollapsibleTrigger asChild>
        <Button variant="link" className="px-0">Show the {pair.points.length} paired years as a table</Button>
      </CollapsibleTrigger>
      <CollapsibleContent>
        <div className="max-h-80 overflow-auto rounded-md border">
          <table className="w-full text-sm">
            <thead className="sticky top-0 bg-muted text-left">
              <tr>
                <th className="px-3 py-2 font-semibold">Year</th>
                <th className="px-3 py-2 font-semibold">{pair.a.name} ({pair.a.unit})</th>
                <th className="px-3 py-2 font-semibold">{pair.b.name} ({pair.b.unit})</th>
              </tr>
            </thead>
            <tbody className="tabular">
              {pair.points.map((p) => (
                <tr key={p.year} className="border-t">
                  <td className="px-3 py-1.5">{p.year}</td>
                  <td className="px-3 py-1.5">{fmtValue(p.a)}</td>
                  <td className="px-3 py-1.5">{fmtValue(p.b)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CollapsibleContent>
    </Collapsible>
  )
}
