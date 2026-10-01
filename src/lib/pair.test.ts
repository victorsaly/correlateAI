import { describe, expect, it } from 'vitest'
import { alignByYear, overlapYears, randomPair } from './pair'
import type { Dataset } from '@/types'

describe('alignByYear', () => {
  it('pairs on shared years, keeps zeros, sorts numerically', () => {
    const a = [
      { year: 2010, value: 1 },
      { year: 1999, value: 0 },
      { year: 2000, value: 2 },
    ]
    const b = [
      { year: 2000, value: 0 },
      { year: 1999, value: 5 },
      { year: 2011, value: 9 },
    ]
    expect(alignByYear(a, b)).toEqual([
      { year: 1999, a: 0, b: 5 },
      { year: 2000, a: 2, b: 0 },
    ])
  })
})

const ds = (id: string, category: string, start: number, end: number): Dataset => ({
  id,
  name: id,
  unit: '',
  source: '',
  sourceUrl: 'https://example.org',
  category,
  description: '',
  dataPoints: end - start + 1,
  dateRange: { start, end },
})

describe('randomPair', () => {
  it('only returns cross-category pairs with enough overlap', () => {
    const catalog = [ds('a', 'x', 1960, 2020), ds('b', 'x', 1960, 2020), ds('c', 'y', 2015, 2020), ds('d', 'y', 1990, 2020)]
    for (let i = 0; i < 20; i++) {
      const [p, q] = randomPair(catalog)!
      expect(p.category).not.toBe(q.category)
      expect([p.id, q.id]).not.toContain('c')
    }
  })

  it('returns null when nothing qualifies', () => {
    expect(randomPair([ds('a', 'x', 2000, 2005), ds('b', 'y', 2000, 2005)])).toBeNull()
  })
})

describe('overlapYears', () => {
  it('counts only years both series have', () => {
    const a = { ...ds('a', 'x', 1990, 2020), missingYears: [1995, 1996, 2010] }
    const b = { ...ds('b', 'y', 2000, 2030), missingYears: [2010, 2015] }
    // 2000–2020 is 21 years; 2010 and 2015 are gaps (1995/1996 fall outside)
    expect(overlapYears(a, b)).toBe(19)
    expect(overlapYears(ds('a', 'x', 1990, 1999), ds('b', 'y', 2000, 2010))).toBe(0)
  })
})
