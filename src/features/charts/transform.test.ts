import { describe, expect, it } from 'vitest'
import { yearTicks } from './transform'

describe('yearTicks', () => {
  it('uses evenly spaced round years within the range', () => {
    expect(yearTicks(1990, 2023)).toEqual([1990, 1995, 2000, 2005, 2010, 2015, 2020])
    expect(yearTicks(1960, 2024)).toEqual([1960, 1970, 1980, 1990, 2000, 2010, 2020])
    expect(yearTicks(2000, 2020)).toEqual([2000, 2005, 2010, 2015, 2020])
  })
})
