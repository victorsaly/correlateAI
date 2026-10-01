import { useMemo } from 'react'
import { CartesianGrid, ReferenceLine, ResponsiveContainer, Scatter, ScatterChart, Tooltip, XAxis, YAxis } from 'recharts'
import { fmtValue } from '@/lib/format'
import type { PairResult } from '@/types'
import { PairTooltip } from './ChartTooltip'
import { olsFit, plotSeries } from './transform'

const AXIS = { stroke: 'var(--border)', tick: { fill: 'var(--muted-foreground)', fontSize: 12 }, tickLine: false }

/** A against B, one dot per year, with the least-squares line r describes. */
export function PairScatter({ pair, detrend }: { pair: PairResult; detrend: boolean }) {
  const data = useMemo(() => plotSeries(pair.points, 'actual', detrend), [pair, detrend])
  const xs = data.map((d) => d.a)
  const ys = data.map((d) => d.b)
  const { slope, intercept } = olsFit(xs, ys)
  const x0 = Math.min(...xs)
  const x1 = Math.max(...xs)

  return (
    <div role="img" aria-label={`Scatter plot of ${pair.b.name} against ${pair.a.name}, one point per year${detrend ? ', trend removed' : ''}, with a least-squares line. The data table below lists every value`} className="h-full">
      <ResponsiveContainer width="100%" height="100%">
        <ScatterChart margin={{ top: 12, right: 16, bottom: 20, left: 0 }}>
          <CartesianGrid stroke="var(--grid-major)" />
          <XAxis type="number" dataKey="a" name={pair.a.name} {...AXIS} tickFormatter={fmtValue} domain={['auto', 'auto']}
            label={{ value: `${pair.a.name} (${pair.a.unit})`, position: 'insideBottom', offset: -12, fill: 'var(--series-a)', fontSize: 12 }} />
          <YAxis type="number" dataKey="b" name={pair.b.name} {...AXIS} width={56} tickFormatter={fmtValue} domain={['auto', 'auto']} />
          <ReferenceLine
            segment={[{ x: x0, y: slope * x0 + intercept }, { x: x1, y: slope * x1 + intercept }]}
            stroke="var(--foreground)" strokeOpacity={0.55} strokeWidth={1.5} strokeDasharray="4 3" ifOverflow="extendDomain"
          />
          <Tooltip content={<PairTooltip a={pair.a} b={pair.b} />} cursor={false} />
          <Scatter data={data} fill="var(--series-a)" stroke="var(--card)" strokeWidth={1.5} shape="circle" isAnimationActive={false} />
        </ScatterChart>
      </ResponsiveContainer>
    </div>
  )
}
