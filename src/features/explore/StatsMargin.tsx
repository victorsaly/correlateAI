import { fisherConfidenceInterval, fmtP, pValueFromR } from '@/lib/correlationStats'
import { fmtR, strengthLabel } from '@/lib/format'
import type { PairResult } from '@/types'
import { useCountTo } from './useCountTo'
import { VerdictMark } from './VerdictMark'

/** Headline r for the current view; counts toward the new value when the trend toggle flips. */
export function HeadlineR({ pair, detrend }: { pair: PairResult; detrend: boolean }) {
  const shownR = detrend ? pair.stats.detrendedR : pair.stats.r
  const r = useCountTo(shownR)
  return (
    <div>
      <div className="text-sm text-muted-foreground">{detrend ? 'Correlation, trend removed' : 'Correlation'}</div>
      <div className="tabular text-6xl font-semibold leading-none tracking-[-0.03em]" aria-live="polite">
        <span className="sr-only">r equals </span>
        {fmtR(r)}
      </div>
      <div className="mt-1 text-sm text-muted-foreground">{strengthLabel(shownR)} relationship</div>
    </div>
  )
}

/** Supporting figures; they describe whichever r is shown, so the toggle never mixes raw and detrended numbers. */
export function StatFigures({ pair, detrend }: { pair: PairResult; detrend: boolean }) {
  const { stats } = pair
  const shownR = detrend ? stats.detrendedR : stats.r
  const p = detrend ? pValueFromR(shownR, stats.n) : stats.pValue
  const ci = detrend ? fisherConfidenceInterval(shownR, stats.n) : stats.ci
  return (
    <dl className="grid grid-cols-2 gap-x-4 gap-y-3 border-y py-4 text-sm">
      <Figure term="p-value" value={fmtP(p)} />
      <Figure term="Years (n)" value={String(stats.n)} />
      <Figure term="95% CI" value={ci ? `${ci[0].toFixed(2)} to ${ci[1].toFixed(2)}` : 'n/a'} />
      <Figure term="r²" value={(shownR * shownR).toFixed(2)} />
      <Figure term="Raw r" value={fmtR(stats.r)} quiet={!detrend} />
      <Figure term="Detrended r" value={fmtR(stats.detrendedR)} quiet={detrend} />
    </dl>
  )
}

export function Verdict({ pair }: { pair: PairResult }) {
  return (
    <div className="flex flex-col items-start gap-2">
      <VerdictMark verdict={pair.stats.verdict} />
      <p className="text-sm leading-relaxed text-muted-foreground">{pair.stats.verdict.explanation}</p>
    </div>
  )
}

/** `quiet` marks the figure already shown as the headline: muted ink, still AA. */
function Figure({ term, value, quiet }: { term: string; value: string; quiet?: boolean }) {
  return (
    <div>
      <dt className="text-muted-foreground">{term}</dt>
      <dd className={quiet ? 'tabular text-base text-muted-foreground' : 'tabular text-base'}>{value}</dd>
    </div>
  )
}
