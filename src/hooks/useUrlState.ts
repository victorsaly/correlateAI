import { useCallback, useEffect, useState } from 'react'
import { parseUrlState, toSearch, type UrlState } from '@/lib/shareUrl'

/** Two-way sync between app state and the query string (?a=&b=&view=). */
export function useUrlState() {
  const [state, setState] = useState<UrlState>(() => parseUrlState(window.location.search))

  useEffect(() => {
    const onPop = () => setState(parseUrlState(window.location.search))
    window.addEventListener('popstate', onPop)
    return () => window.removeEventListener('popstate', onPop)
  }, [])

  const update = useCallback((patch: Partial<UrlState>, { replace = false } = {}) => {
    setState((prev) => {
      const next = { ...prev, ...patch }
      const url = `${window.location.pathname}${toSearch(next)}`
      if (url !== `${window.location.pathname}${window.location.search}`) {
        window.history[replace ? 'replaceState' : 'pushState'](null, '', url)
      }
      return next
    })
  }, [])

  return [state, update] as const
}
