import { fmtValue } from '@/lib/format'
import type { Dataset } from '@/types'

interface Row {
  year: number
  rawA: number
  rawB: number
}

export function PairTooltip({ active, payload, a, b }: {
  active?: boolean
  payload?: { payload: Row }[]
  a: Dataset
  b: Dataset
}) {
  const row = active && payload?.[0]?.payload
  if (!row) return null
  return (
    <div className="rounded-md border bg-popover px-3 py-2 text-xs shadow-[0_4px_16px_rgb(0_0_0/0.12)]">
      <div className="tabular mb-1 font-semibold">{row.year}</div>
      <TooltipLine swatch="bg-series-a" name={a.name} value={`${fmtValue(row.rawA)} ${a.unit}`} />
      <TooltipLine swatch="bg-series-b" name={b.name} value={`${fmtValue(row.rawB)} ${b.unit}`} dashed />
    </div>
  )
}

function TooltipLine({ swatch, name, value, dashed }: { swatch: string; name: string; value: string; dashed?: boolean }) {
  return (
    <div className="flex items-center gap-2 py-0.5">
      <span
        aria-hidden
        className={`h-0.5 w-4 shrink-0 ${swatch} ${dashed ? '[mask:repeating-linear-gradient(90deg,#000_0_4px,transparent_4px_7px)]' : ''}`}
      />
      <span className="max-w-[16rem] truncate text-muted-foreground">{name}</span>
      <span className="tabular ml-auto pl-3 text-foreground">{value}</span>
    </div>
  )
}
