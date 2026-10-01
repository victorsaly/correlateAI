import logo from './logo.json'
import { cn } from '@/lib/utils'

type Variant = keyof Omit<typeof logo, '_comment'>

/**
 * The ringed r: the correlation coefficient, checked in red pencil. Themed through CSS variables so it
 * follows light/dark with the rest of the page. With `draw`, the ring draws itself once on mount, like the Verdict Mark.
 */
export function LogoMark({ size = 32, variant = size >= 40 ? 'full' : 'small', draw = false, className }: { size?: number; variant?: Variant; draw?: boolean; className?: string }) {
  const g = logo[variant]
  const t = g.tile
  return (
    <svg viewBox="0 0 64 64" width={size} height={size} aria-hidden className={cn('shrink-0', className)}>
      <rect x={t.x} y={t.y} width={t.size} height={t.size} rx={t.radius} fill="var(--card)"
        stroke={t.border ? 'var(--border)' : 'none'} strokeWidth={t.border} />
      {g.r.d.map((d) => <path key={d} d={d} fill="none" stroke="var(--foreground)" strokeWidth={g.r.width} strokeLinecap="round" />)}
      <path d={g.ring.d} fill="none" stroke="var(--pencil)" strokeWidth={g.ring.width} strokeLinecap="round"
        {...(draw && { pathLength: 1, strokeDasharray: '1 2', strokeDashoffset: 1.05, className: 'animate-[pencil-draw_520ms_cubic-bezier(0.16,1,0.3,1)_200ms_both]' })} />
    </svg>
  )
}

/** Mark + wordmark, as used in the header and on share cards. The wordmark is underlined in the same pencil. */
export function Logo({ size = 32, draw = false, className }: { size?: number; draw?: boolean; className?: string }) {
  return (
    <span className={cn('inline-flex items-center gap-2.5', className)}>
      <LogoMark size={size} draw={draw} />
      <span className="relative font-semibold tracking-[-0.02em]" style={{ fontSize: size * 0.62 }}>
        Correlate<span className="text-muted-foreground">AI</span>
        <svg viewBox="0 0 100 8" preserveAspectRatio="none" aria-hidden
          className={cn('absolute -left-[0.04em] -right-[0.08em] top-[calc(100%-0.32em)] h-[0.32em] w-[calc(100%+0.12em)] overflow-visible',
            draw && 'animate-[pencil-sweep_420ms_cubic-bezier(0.16,1,0.3,1)_580ms_both]')}>
          <path d="M 1 5.5 C 18 3.8 38 6.6 58 5 C 74 3.8 88 4.6 99 2.6" fill="none" stroke="var(--pencil)"
            strokeWidth={size * 0.07} strokeLinecap="round" vectorEffect="non-scaling-stroke" />
        </svg>
      </span>
    </span>
  )
}
