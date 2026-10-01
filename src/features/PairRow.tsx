import { ChevronRight } from 'lucide-react'
import { fmtR } from '@/lib/format'
import type { PairResult } from '@/types'
import { VerdictMark } from '@/features/explore/VerdictMark'

/** One worked pair as a ruled line: names, raw and detrended r, verdict. */
export function PairRow({ pair, onOpen, action }: { pair: PairResult; onOpen: () => void; action?: React.ReactNode }) {
  const { a, b, stats } = pair
  return (
    <li className="group relative grid rounded-sm has-[button:focus-visible]:outline-2 has-[button:focus-visible]:outline-offset-2 has-[button:focus-visible]:outline-ring grid-cols-[minmax(0,1fr)_auto] items-center gap-x-6 gap-y-2 border-b py-4 sm:grid-cols-[minmax(0,1fr)_4.5rem_5.5rem_17rem_2.5rem]">
      <button onClick={onOpen} className="min-w-0 text-left outline-none after:absolute after:inset-0">
        <span className="font-semibold group-hover:underline">{a.name}</span>
        <span className="text-muted-foreground"> vs </span>
        <span className="font-semibold group-hover:underline">{b.name}</span>
        <span className="block text-xs text-muted-foreground">
          {stats.n} years · {a.source}{a.source !== b.source && `, ${b.source}`}
        </span>
      </button>
      <Figure label="r" value={fmtR(stats.r)} />
      <Figure label="detrended" value={fmtR(stats.detrendedR)} className="max-sm:hidden" />
      <div className="max-sm:col-span-2 max-sm:row-start-2 sm:justify-self-end"><VerdictMark verdict={stats.verdict} size="sm" /></div>
      <div className="relative z-10 flex items-center justify-end gap-1 max-sm:col-start-2 max-sm:row-start-1">
        {action}
        <ChevronRight aria-hidden className="size-4 text-muted-foreground max-sm:hidden" />
      </div>
    </li>
  )
}

function Figure({ label, value, className }: { label: string; value: string; className?: string }) {
  return (
    <div className={`text-right max-sm:hidden ${className ?? ''}`}>
      <div className="tabular text-lg leading-none">{value}</div>
      <div className="text-xs text-muted-foreground">{label}</div>
    </div>
  )
}
