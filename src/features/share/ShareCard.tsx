import { forwardRef } from 'react'
import { fmtP } from '@/lib/correlationStats'
import { fmtR } from '@/lib/format'
import type { PairResult } from '@/types'
import { PairTimeChart } from '@/features/charts/PairTimeChart'
import { VerdictMark } from '@/features/explore/VerdictMark'
import { Logo } from '@/app/Logo'

/** Fixed 1200×630 card rendered off-screen for PNG export and social previews. */
export const ShareCard = forwardRef<HTMLDivElement, { pair: PairResult; url: string }>(function ShareCard({ pair, url }, ref) {
  const { a, b, stats } = pair
  return (
    <div ref={ref} className="flex h-[630px] w-[1200px] flex-col gap-6 bg-background p-12 text-foreground">
      <div className="flex items-center justify-between">
        <Logo size={44} />
        <div className="tabular text-base text-muted-foreground">{url.replace(/^https?:\/\//, '')}</div>
      </div>
      <div className="text-[34px] font-semibold leading-tight tracking-[-0.02em]">
        <span className="text-series-a">{a.name}</span> <span className="text-muted-foreground">vs</span>{' '}
        <span className="text-series-b">{b.name}</span>
      </div>
      <div className="grid min-h-0 flex-1 grid-cols-[1fr_380px] gap-8">
        <div className="graph-paper min-h-0 rounded-md border p-3">
          <PairTimeChart pair={pair} scale="standardised" detrend={false} animate={false} />
        </div>
        <div className="flex flex-col justify-center gap-4">
          <div className="tabular whitespace-nowrap text-6xl font-semibold leading-none tracking-[-0.03em]">r {fmtR(stats.r)}</div>
          <div className="tabular text-lg text-muted-foreground">
            n = {stats.n} · p {stats.pValue < 0.0001 ? '' : '= '}{fmtP(stats.pValue)}
            <br />
            detrended r {fmtR(stats.detrendedR)}
          </div>
          <div className="whitespace-nowrap"><VerdictMark verdict={stats.verdict} still /></div>
        </div>
      </div>
      <div className="text-sm text-muted-foreground">
        {a.source === b.source ? `Source: ${a.source}.` : `Sources: ${a.source}; ${b.source}.`} Correlation does not imply causation.
      </div>
    </div>
  )
})
