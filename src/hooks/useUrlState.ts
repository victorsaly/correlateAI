import { useCallback, useEffect, useState } from 'react'
import { parseUrlState, urlFor, type UrlState } from '@/lib/shareUrl'

/**
 * Two-way sync between app state and the URL: /pairs/<a>--vs--<b>/ for pairs
 * with a static page, /?a=&b= otherwise, plus ?view=.
 */
export function useUrlState(hasPage: (a: string, b: string) => boolean) {
  const read = () => parseUrlState(window.location.search, window.location.pathname)
  const [state, setState] = useState<UrlState>(read)

  useEffect(() => {
    const onPop = () => setState(read())
    window.addEventListener('popstate', onPop)
    return () => window.removeEventListener('popstate', onPop)
  }, [])

  const update = useCallback(
    (patch: Partial<UrlState>, { replace = false } = {}) => {
      setState((prev) => {
        const next = { ...prev, ...patch }
        const url = urlFor(next, !!(next.a && next.b && hasPage(next.a, next.b)))
        if (url !== `${window.location.pathname}${window.location.search}`) {
          window.history[replace ? 'replaceState' : 'pushState'](null, '', url)
        }
        return next
      })
    },
    [hasPage]
  )

  return [state, update] as const
}
