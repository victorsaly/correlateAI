import { hasPairPage, pairPath, parsePairPath } from '@/lib/pairPages'
import type { PairResult } from '@/types'

export type View = 'explore' | 'saved' | 'gallery' | 'learn'

export const VIEWS: View[] = ['explore', 'saved', 'gallery', 'learn']

const ID_PATTERN = /^[a-z0-9_-]{1,64}$/

export interface UrlState {
  a?: string
  b?: string
  view: View
}

export function parseUrlState(search: string, pathname = '/'): UrlState {
  const params = new URLSearchParams(search)
  const fromPath = parsePairPath(pathname)
  const a = fromPath?.a ?? params.get('a') ?? undefined
  const b = fromPath?.b ?? params.get('b') ?? undefined
  const view = params.get('view') as View | null
  const valid = a && b && a !== b && ID_PATTERN.test(a) && ID_PATTERN.test(b)
  return {
    a: valid ? a : undefined,
    b: valid ? b : undefined,
    view: view && VIEWS.includes(view) ? view : 'explore',
  }
}

/** Query string for a state; 'explore' is the default view and is omitted. */
export function toSearch({ a, b, view }: UrlState): string {
  const params = new URLSearchParams()
  if (a && b) {
    params.set('a', a)
    params.set('b', b)
  }
  if (view !== 'explore') params.set('view', view)
  const s = params.toString()
  return s ? `?${s}` : ''
}

/** Production links always name the canonical host, so cards exported from previews or forks stay correct. */
export const siteOrigin = () => (import.meta.env.PROD ? 'https://correlateai.victorsaly.com' : window.location.origin)

/**
 * Path + query for a state. Pairs with a static page get their /pairs/… path
 * (indexable, own preview); other pairs fall back to /?a=&b=.
 */
export function urlFor(state: UrlState, hasPage: boolean): string {
  if (state.a && state.b && hasPage) {
    return `${pairPath(state.a, state.b)}${state.view !== 'explore' ? `?view=${state.view}` : ''}`
  }
  return `/${toSearch(state)}`
}

/** Absolute, reproducible link to a pair. */
export function pairUrl(aId: string, bId: string, hasPage = false, base = siteOrigin()): string {
  return `${base}${urlFor({ a: aId, b: bId, view: 'explore' }, hasPage)}`
}

/** The link to share for a computed pair: its static page when one exists. */
export const sharePairUrl = ({ a, b }: PairResult) => pairUrl(a.id, b.id, hasPairPage(a, b))
