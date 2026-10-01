import { describe, expect, it } from 'vitest'
import { parseUrlState, toSearch } from './shareUrl'

describe('shareUrl', () => {
  it('round-trips a pair and view', () => {
    const state = { a: 'wb-gdp', b: 'owid-obesity', view: 'gallery' as const }
    expect(parseUrlState(toSearch(state))).toEqual(state)
  })

  it('omits the default view', () => {
    expect(toSearch({ a: 'x', b: 'y', view: 'explore' })).toBe('?a=x&b=y')
    expect(toSearch({ view: 'explore' })).toBe('')
  })

  it('rejects malformed or identical ids and unknown views', () => {
    expect(parseUrlState('?a=../etc&b=wb-gdp')).toEqual({ a: undefined, b: undefined, view: 'explore' })
    expect(parseUrlState('?a=wb-gdp&b=wb-gdp').a).toBeUndefined()
    expect(parseUrlState('?view=quantum').view).toBe('explore')
  })

  it('ignores legacy ?share= links', () => {
    expect(parseUrlState('?share=abc123')).toEqual({ a: undefined, b: undefined, view: 'explore' })
  })
})
