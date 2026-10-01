import { useState } from 'react'
import { CircleCheck, CircleHelp, CircleSlash, TrendingUp, TriangleAlert } from 'lucide-react'
import type { SpuriousVerdict, VerdictLevel } from '@/lib/correlationStats'
import { cn } from '@/lib/utils'

/*
  The red-pencil verdict: a pencil ring drawn around the label. Meaning is
  carried three ways (ink, icon, ring form) so it never rests on colour alone.
*/
type Ring = 'solid' | 'dashed' | 'dotted' | 'double'

const STYLE: Record<VerdictLevel, { ink: string; ring: Ring; Icon: typeof CircleCheck }> = {
  significant: { ink: 'text-affirm', ring: 'solid', Icon: CircleCheck },
  caution: { ink: 'text-caution', ring: 'dashed', Icon: TriangleAlert },
  'likely-spurious': { ink: 'text-pencil', ring: 'double', Icon: TrendingUp },
  'not-significant': { ink: 'text-pencil', ring: 'solid', Icon: CircleSlash },
  insufficient: { ink: 'text-muted-foreground', ring: 'dotted', Icon: CircleHelp },
}

const DASH: Record<Ring, string | undefined> = { solid: undefined, double: undefined, dashed: '0.035 0.022', dotted: '0.006 0.018' }

export function VerdictMark({ verdict, size = 'md', still = false }: { verdict: SpuriousVerdict; size?: 'sm' | 'md'; still?: boolean }) {
  const { ink, ring, Icon } = STYLE[verdict.level]
  const md = size === 'md'
  return (
    <span className={cn('relative inline-flex items-center gap-1.5 font-semibold leading-tight', md ? 'px-6 py-3.5 text-[15px]' : 'px-3 py-1.5 text-xs', ink)}>
      {/* keyed by level so the ring is re-drawn whenever the verdict changes */}
      <PencilRing key={verdict.level} ring={ring} weight={md ? 2 : 1.5} animate={md && !still} />
      <Icon aria-hidden className={cn('relative', md ? 'size-4' : 'size-3.5')} />
      <span className="relative">{verdict.label}</span>
    </span>
  )
}

/** A hand-drawn ellipse, slightly overshooting its start like a pencil loop. */
function PencilRing({ ring, weight, animate }: { ring: Ring; weight: number; animate: boolean }) {
  const loop = 'M 6 52 C 2 22 60 4 150 6 C 240 8 298 22 296 48 C 294 76 230 96 150 95 C 66 94 8 82 4 56 C 3 44 14 30 34 22'
  const second = 'M 10 46 C 10 20 70 9 152 11 C 236 13 291 27 290 50 C 289 74 226 90 150 90 C 70 90 12 78 10 50'
  const mask = useMaskId()
  return (
    <svg aria-hidden viewBox="0 0 300 100" preserveAspectRatio="none" className="pointer-events-none absolute inset-0 size-full overflow-visible">
      <defs>
        {/* the mask is what animates, so dashed and dotted rings draw on without losing their pattern */}
        <mask id={mask} maskUnits="userSpaceOnUse" x="-20" y="-20" width="340" height="140">
          <path d={loop} pathLength={1} fill="none" stroke="#fff" strokeWidth={16} strokeDasharray="1" strokeDashoffset={animate ? 1 : 0}
            className={animate ? 'animate-[pencil-draw_520ms_cubic-bezier(0.16,1,0.3,1)_forwards]' : undefined} />
          {ring === 'double' && (
            <path d={second} pathLength={1} fill="none" stroke="#fff" strokeWidth={16} strokeDasharray="1" strokeDashoffset={animate ? 1 : 0}
              className={animate ? 'animate-[pencil-draw_420ms_cubic-bezier(0.16,1,0.3,1)_380ms_forwards]' : undefined} />
          )}
        </mask>
      </defs>
      <g mask={`url(#${mask})`} fill="none" stroke="currentColor" strokeLinecap="round" vectorEffect="non-scaling-stroke">
        <path d={loop} pathLength={1} strokeWidth={weight} strokeDasharray={DASH[ring]} vectorEffect="non-scaling-stroke" />
        {ring === 'double' && <path d={second} pathLength={1} strokeWidth={weight * 0.8} vectorEffect="non-scaling-stroke" />}
      </g>
    </svg>
  )
}

let maskCount = 0
/** Stable per mount; useId's colons are awkward inside url(#…). */
function useMaskId() {
  const [id] = useState(() => `pencil-${++maskCount}`)
  return id
}
