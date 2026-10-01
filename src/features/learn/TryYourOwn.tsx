import { useMemo, useState } from 'react'
import { computeHonestStats, fmtP } from '@/lib/correlationStats'
import { fmtR } from '@/lib/format'
import { VerdictMark } from '@/features/explore/VerdictMark'

const parse = (s: string) =>
  s
    .split(/[\s,;]+/)
    .map((t) => t.trim())
    .filter(Boolean)
    .map(Number)

const EXAMPLE_A = '12 15 14 18 21 22 25 27 26 30 33 35'
const EXAMPLE_B = '3.1 3.3 3.2 3.8 4.0 4.4 4.3 4.9 5.2 5.1 5.6 6.0'

/** Paste two equal-length columns (in time order) and get the same checks the app runs. */
export function TryYourOwn() {
  const [a, setA] = useState(EXAMPLE_A)
  const [b, setB] = useState(EXAMPLE_B)
  const xs = parse(a)
  const ys = parse(b)
  const invalid = xs.some(Number.isNaN) || ys.some(Number.isNaN)
  const mismatch = xs.length !== ys.length
  const stats = useMemo(() => (invalid || mismatch || xs.length < 3 ? null : computeHonestStats(xs, ys)), [a, b]) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="grid gap-6 md:grid-cols-[minmax(0,1fr)_18rem]">
      <div className="grid gap-4 sm:grid-cols-2">
        <Column id="own-a" label="Series A, in time order" value={a} onChange={setA} count={xs.length} />
        <Column id="own-b" label="Series B, same years" value={b} onChange={setB} count={ys.length} />
      </div>
      <div className="flex flex-col gap-3 md:border-l md:pl-6" aria-live="polite">
        {invalid ? (
          <p className="text-sm text-pencil">Only numbers please, separated by spaces, commas or new lines.</p>
        ) : mismatch ? (
          <p className="text-sm text-pencil">The columns need the same number of values ({xs.length} vs {ys.length}).</p>
        ) : !stats ? (
          <p className="text-sm text-muted-foreground">Enter at least three values in each column.</p>
        ) : (
          <>
            <div className="tabular text-4xl font-semibold tracking-[-0.03em]">r {fmtR(stats.r)}</div>
            <div className="tabular text-sm text-muted-foreground">
              n = {stats.n} · p {fmtP(stats.pValue)} · detrended r {fmtR(stats.detrendedR)}
            </div>
            <div><VerdictMark verdict={stats.verdict} size="sm" /></div>
            <p className="text-sm text-muted-foreground">{stats.verdict.explanation}</p>
          </>
        )}
      </div>
    </div>
  )
}

function Column({ id, label, value, onChange, count }: { id: string; label: string; value: string; onChange: (v: string) => void; count: number }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-sm font-semibold">{label}</label>
      <textarea
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={6}
        spellCheck={false}
        className="tabular rounded-md border border-input bg-card px-3 py-2 leading-relaxed"
      />
      <span className="text-xs text-muted-foreground">{count} values</span>
    </div>
  )
}
