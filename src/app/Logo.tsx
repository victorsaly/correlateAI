import logo from './logo.json'
import { cn } from '@/lib/utils'

type Variant = keyof Omit<typeof logo, '_comment'>

/** The mark, themed through CSS variables so it follows light/dark with the rest of the page. */
export function LogoMark({ size = 32, variant = size >= 40 ? 'full' : 'small', className }: { size?: number; variant?: Variant; className?: string }) {
  const g = logo[variant]
  const t = g.tile
  return (
    <svg viewBox="0 0 64 64" width={size} height={size} aria-hidden className={cn('shrink-0', className)}>
      <rect x={t.x} y={t.y} width={t.size} height={t.size} rx={t.radius} fill="var(--card)"
        stroke={t.border ? 'var(--border)' : 'none'} strokeWidth={t.border} />
      {g.grid.map((d) => <path key={d} d={d} stroke="var(--grid-major)" strokeWidth={1} />)}
      <path d={g.a.d} fill="none" stroke="var(--series-a)" strokeWidth={g.a.width} strokeLinecap="round" strokeLinejoin="round" />
      <path d={g.b.d} fill="none" stroke="var(--series-b)" strokeWidth={g.b.width} strokeDasharray={g.b.dash} strokeLinejoin="round" />
      <path d={g.ring.d} fill="none" stroke="var(--pencil)" strokeWidth={g.ring.width} strokeLinecap="round" />
    </svg>
  )
}

/** Mark + wordmark, as used in the header and on share cards. */
export function Logo({ size = 32, className }: { size?: number; className?: string }) {
  return (
    <span className={cn('inline-flex items-center gap-2.5', className)}>
      <LogoMark size={size} />
      <span className="font-semibold tracking-[-0.02em]" style={{ fontSize: size * 0.62 }}>
        Correlate<span className="text-muted-foreground">AI</span>
      </span>
    </span>
  )
}
