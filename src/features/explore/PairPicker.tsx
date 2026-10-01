import { ArrowLeftRight, Shuffle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select'
import { categoryLabel } from '@/lib/format'
import { cn } from '@/lib/utils'
import type { Dataset } from '@/types'

interface Props {
  catalog: Dataset[]
  a?: Dataset
  b?: Dataset
  onChange: (a: string, b: string) => void
  onRandom: () => void
}

/** The worksheet line: [A] vs [B], with swap, random, and the years both series cover. */
export function PairPicker({ catalog, a, b, onChange, onRandom }: Props) {
  const groups = Object.entries(
    catalog.reduce<Record<string, Dataset[]>>((acc, d) => ((acc[d.category] ??= []).push(d), acc), {})
  ).sort(([x], [y]) => x.localeCompare(y))

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-col gap-2 md:flex-row md:items-center">
        <SeriesSelect label="Series A" value={a?.id} groups={groups} exclude={b?.id} line="a" onValueChange={(id) => b && onChange(id, b.id)} />
        <span aria-hidden className="self-center text-lg text-muted-foreground italic">vs</span>
        <SeriesSelect label="Series B" value={b?.id} groups={groups} exclude={a?.id} line="b" onValueChange={(id) => a && onChange(a.id, id)} />
        <div className="flex gap-2 md:ml-2">
          <Button variant="outline" size="icon" className="size-11 md:size-9" aria-label="Swap A and B" disabled={!a || !b} onClick={() => a && b && onChange(b.id, a.id)}>
            <ArrowLeftRight />
          </Button>
          <Button variant="outline" className="h-11 flex-1 md:h-9" onClick={onRandom}>
            <Shuffle /> Random pair
          </Button>
        </div>
      </div>
      {a && b && <OverlapBar a={a} b={b} />}
    </div>
  )
}

function SeriesSelect({ label, value, groups, exclude, line, onValueChange }: {
  label: string
  value?: string
  groups: [string, Dataset[]][]
  exclude?: string
  line: 'a' | 'b'
  onValueChange: (id: string) => void
}) {
  return (
    <Select value={value} onValueChange={onValueChange}>
      <SelectTrigger aria-label={label} className="h-11 w-full min-w-0 justify-start bg-card text-base md:flex-1 *:data-[slot=select-value]:flex-1 *:data-[slot=select-value]:text-left">
        <span
          aria-hidden
          className={cn('h-0.5 w-5 shrink-0', line === 'a' ? 'bg-series-a' : 'bg-series-b [mask:repeating-linear-gradient(90deg,#000_0_5px,transparent_5px_8px)]')}
        />
        <SelectValue placeholder={label} />
      </SelectTrigger>
      <SelectContent className="max-h-[60dvh]">
        {groups.map(([cat, list]) => (
          <SelectGroup key={cat}>
            <SelectLabel>{categoryLabel(cat)}</SelectLabel>
            {list.map((d) => (
              <SelectItem key={d.id} value={d.id} disabled={d.id === exclude}>
                {d.name}
              </SelectItem>
            ))}
          </SelectGroup>
        ))}
      </SelectContent>
    </Select>
  )
}

/** Each series' coverage on a shared year ruler; the overlap is what r is computed on. */
function OverlapBar({ a, b }: { a: Dataset; b: Dataset }) {
  const min = Math.min(a.dateRange.start, b.dateRange.start)
  const max = Math.max(a.dateRange.end, b.dateRange.end)
  const span = Math.max(1, max - min)
  const pos = (y: number) => `${((y - min) / span) * 100}%`
  const lo = Math.max(a.dateRange.start, b.dateRange.start)
  const hi = Math.min(a.dateRange.end, b.dateRange.end)

  return (
    <div className="grid grid-cols-[auto_1fr_auto] items-center gap-x-3 text-xs text-muted-foreground">
      <span className="tabular">{min}</span>
      <div className="relative h-4" aria-label={`Both series cover ${lo} to ${hi}`} role="img">
        <div className="absolute top-1 h-0.5 bg-series-a" style={{ left: pos(a.dateRange.start), right: `calc(100% - ${pos(a.dateRange.end)})` }} />
        <div className="absolute top-2.5 h-0.5 bg-series-b [mask:repeating-linear-gradient(90deg,#000_0_5px,transparent_5px_8px)]" style={{ left: pos(b.dateRange.start), right: `calc(100% - ${pos(b.dateRange.end)})` }} />
        {hi >= lo && (
          <div className="absolute -inset-y-0.5 border-x border-foreground/60 bg-foreground/10" style={{ left: pos(lo), right: `calc(100% - ${pos(hi)})` }} />
        )}
      </div>
      <span className="tabular">{max}</span>
    </div>
  )
}
