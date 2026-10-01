import { describe, expect, it } from 'vitest'
import { canonicalPairPath, hasPairPage, pairPath, parsePairPath } from './pairPages'
import { parseUrlState, urlFor } from './shareUrl'
import type { Dataset } from '@/types'

const ds = (id: string, start: number, end: number) =>
  ({ id, name: id, unit: '', source: '', sourceUrl: 'https://x.org', category: 'c', description: '', dataPoints: end - start + 1, dateRange: { start, end } }) as Dataset

describe('pair pages', () => {
  it('round-trips paths and rejects junk', () => {
    expect(parsePairPath(pairPath('wb-gdp', 'owid-obesity'))).toEqual({ a: 'wb-gdp', b: 'owid-obesity' })
    expect(parsePairPath('/pairs/wb-gdp--vs--wb-gdp/')).toBeNull()
    expect(parsePairPath('/pairs/../etc--vs--x/')).toBeNull()
  })

  it('canonical path is order-independent', () => {
    expect(canonicalPairPath('b', 'a')).toBe(canonicalPairPath('a', 'b'))
  })

  it('only pairs with enough shared years get a page', () => {
    expect(hasPairPage(ds('a', 1990, 2020), ds('b', 2000, 2020))).toBe(true)
    expect(hasPairPage(ds('a', 1990, 2020), ds('b', 2010, 2020))).toBe(false)
  })

  it('urlFor uses the page path when there is one, query otherwise', () => {
    expect(urlFor({ a: 'x', b: 'y', view: 'explore' }, true)).toBe('/pairs/x--vs--y/')
    expect(urlFor({ a: 'x', b: 'y', view: 'gallery' }, true)).toBe('/pairs/x--vs--y/?view=gallery')
    expect(urlFor({ a: 'x', b: 'y', view: 'explore' }, false)).toBe('/?a=x&b=y')
    expect(parseUrlState('', '/pairs/x--vs--y/')).toEqual({ a: 'x', b: 'y', view: 'explore' })
  })
})
