import { useMemo } from 'react'
import { CartesianGrid, Line, LineChart, ReferenceLine, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { fmtValue } from '@/lib/format'
import type { PairResult } from '@/types'
import { PairTooltip } from './ChartTooltip'
import { plotSeries, yearTicks, type Scale } from './transform'

const AXIS = { stroke: 'var(--border)', tick: { fill: 'var(--muted-foreground)', fontSize: 12 }, tickLine: false }
const DASH = '6 4'
const reducedMotion = () => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

/** Both series on one standardised axis, or in their own units as two stacked panels. */
export function PairTimeChart({ pair, scale, detrend, animate = true }: { pair: PairResult; scale: Scale; detrend: boolean; animate?: boolean }) {
  // memoised: the animated r in the margin re-renders every frame, and fresh data would restart the line animation
  const data = useMemo(() => plotSeries(pair.points, scale, detrend), [pair, scale, detrend])
  const xAxis = useYearAxis(pair)
  const label = `${pair.a.name} and ${pair.b.name}, ${pair.points[0]?.year}–${pair.points[pair.points.length - 1]?.year}${detrend ? ', trend removed' : ''}`

  if (scale === 'actual') {
    return (
      <div role="img" aria-label={`${label}, actual values`} className="flex h-full flex-col gap-2">
        <Panel data={data} pair={pair} which="a" xAxis={xAxis} />
        <Panel data={data} pair={pair} which="b" showYears xAxis={xAxis} />
      </div>
    )
  }

  return (
    <div role="img" aria-label={`${label}, standardised`} className="h-full">
      <ResponsiveContainer width="100%" height="100%">
        {/* same Line paths across the trend toggle, so the lines tween into their residuals */}
        <LineChart data={data} margin={{ top: 12, right: 12, bottom: 4, left: 0 }}>
          <CartesianGrid stroke="var(--grid-major)" syncWithTicks />
          <XAxis {...xAxis} />
          <YAxis {...AXIS} width={40} allowDecimals={false} tickFormatter={(v: number) => (v > 0 ? `+${v}` : v < 0 ? `−${-v}` : '0')} domain={[(min: number) => Math.floor(min), (max: number) => Math.ceil(max)]} />
          <ReferenceLine y={0} stroke="var(--muted-foreground)" strokeOpacity={0.5} />
          <Tooltip content={<PairTooltip a={pair.a} b={pair.b} />} cursor={{ stroke: 'var(--muted-foreground)', strokeDasharray: '2 3' }} />
          <Line dataKey="a" type="linear" stroke="var(--series-a)" strokeWidth={2} dot={false} activeDot={{ r: 4, strokeWidth: 2, stroke: 'var(--card)' }} isAnimationActive={animate && !reducedMotion()} animationDuration={700} animationEasing="ease-out" />
          <Line dataKey="b" type="linear" stroke="var(--series-b)" strokeWidth={2} strokeDasharray={DASH} dot={false} activeDot={{ r: 4, strokeWidth: 2, stroke: 'var(--card)' }} isAnimationActive={animate && !reducedMotion()} animationDuration={700} animationEasing="ease-out" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}

function Panel({ data, pair, which, showYears, xAxis }: {
  data: ReturnType<typeof plotSeries>
  pair: PairResult
  which: 'a' | 'b'
  showYears?: boolean
  xAxis: ReturnType<typeof useYearAxis>
}) {
  const ds = which === 'a' ? pair.a : pair.b
  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <div className="text-xs text-muted-foreground">{ds.unit}</div>
      <div className="min-h-0 flex-1">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 6, right: 12, bottom: 0, left: 0 }} syncId="actual">
            <CartesianGrid stroke="var(--grid-major)" syncWithTicks />
            <XAxis {...xAxis} hide={!showYears} />
            <YAxis {...AXIS} width={52} tickFormatter={fmtValue} domain={['auto', 'auto']} />
            <Tooltip content={<PairTooltip a={pair.a} b={pair.b} />} cursor={{ stroke: 'var(--muted-foreground)', strokeDasharray: '2 3' }} />
            <Line dataKey={which} type="linear" stroke={`var(--series-${which})`} strokeWidth={2} strokeDasharray={which === 'b' ? DASH : undefined} dot={false} animationDuration={700} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

/** Numeric year axis with explicit round ticks, so the major grid registers with the labels. */
function useYearAxis(pair: PairResult) {
  return useMemo(() => {
    const first = pair.points[0]?.year ?? 0
    const last = pair.points[pair.points.length - 1]?.year ?? 0
    return {
      ...AXIS,
      dataKey: 'year',
      type: 'number' as const,
      domain: [first, last],
      ticks: yearTicks(first, last),
      interval: 0 as const,
      padding: { left: 12, right: 4 },
      tickMargin: 6,
    }
  }, [pair])
}
