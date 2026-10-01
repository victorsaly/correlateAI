import { useEffect, useRef, useState } from 'react'

/** Animates a number toward `target`, on the same 700ms ease-out as the chart lines so both settle in step. */
export function useCountTo(target: number, duration = 700) {
  const [value, setValue] = useState(target)
  const from = useRef(target)

  useEffect(() => {
    const start = from.current
    if (start === target || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      from.current = target
      setValue(target)
      return
    }
    const t0 = performance.now()
    let raf = 0
    const tick = (now: number) => {
      const t = Math.min(1, (now - t0) / duration)
      const eased = 1 - Math.pow(1 - t, 2)
      const v = start + (target - start) * eased
      from.current = v
      setValue(v)
      if (t < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [target, duration])

  return value
}
