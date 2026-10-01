export type View = 'explore' | 'saved' | 'gallery' | 'learn'

export const VIEWS: View[] = ['explore', 'saved', 'gallery', 'learn']

const ID_PATTERN = /^[a-z0-9_-]{1,64}$/

export interface UrlState {
  a?: string
  b?: string
  view: View
}

export function parseUrlState(search: string): UrlState {
  const params = new URLSearchParams(search)
  const a = params.get('a') ?? undefined
  const b = params.get('b') ?? undefined
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
const origin = () => (import.meta.env.PROD ? 'https://correlateai.victorsaly.com' : window.location.origin)

/** Absolute, reproducible link to a pair. */
export function pairUrl(aId: string, bId: string, base = origin()): string {
  return `${base}${import.meta.env.BASE_URL}${toSearch({ a: aId, b: bId, view: 'explore' })}`
}
