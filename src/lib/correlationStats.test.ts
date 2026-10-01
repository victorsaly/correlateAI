import { describe, expect, it } from 'vitest'
import { computeHonestStats, fisherConfidenceInterval, pearson, pValueFromR } from './correlationStats'

describe('correlationStats', () => {
  it('pearson of a perfect line is 1', () => {
    expect(pearson([1, 2, 3, 4], [2, 4, 6, 8])).toBeCloseTo(1, 10)
    expect(pearson([1, 2, 3, 4], [8, 6, 4, 2])).toBeCloseTo(-1, 10)
  })

  it('p-value matches the t-distribution reference (r=0.5, n=20)', () => {
    expect(pValueFromR(0.5, 20)).toBeCloseTo(0.0248, 3)
  })

  it('Fisher CI brackets r', () => {
    const ci = fisherConfidenceInterval(0.5, 20)!
    expect(ci[0]).toBeCloseTo(0.07, 1)
    expect(ci[1]).toBeCloseTo(0.77, 1)
  })

  it('flags two independent trending series as likely spurious', () => {
    // deterministic, uncorrelated wiggles on top of two linear trends
    const n = 30
    const a = Array.from({ length: n }, (_, i) => i * 2 + Math.sin(i * 1.7) * 3)
    const b = Array.from({ length: n }, (_, i) => 100 + i * 5 + Math.cos(i * 2.9) * 7)
    const stats = computeHonestStats(a, b)
    expect(stats.r).toBeGreaterThan(0.9)
    expect(stats.verdict.level).toBe('likely-spurious')
  })

  it('never says "holds up" when detrending flips the sign', () => {
    const n = 30
    // both rise over time, but their wiggles move in opposite directions
    const a = Array.from({ length: n }, (_, i) => i + Math.sin(i * 1.3) * 6)
    const b = Array.from({ length: n }, (_, i) => i - Math.sin(i * 1.3) * 6)
    const stats = computeHonestStats(a, b)
    expect(Math.sign(stats.r)).not.toBe(Math.sign(stats.detrendedR))
    expect(stats.verdict.level).toBe('caution')
  })

  it('reports insufficient data for tiny samples', () => {
    expect(computeHonestStats([1, 2, 3], [3, 1, 2]).verdict.level).toBe('insufficient')
  })
})
