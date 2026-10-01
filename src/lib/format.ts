const compact = new Intl.NumberFormat('en-US', { notation: 'compact', maximumFractionDigits: 2 })
const plain = new Intl.NumberFormat('en-US', { maximumFractionDigits: 2 })

/** Short human-readable number: 1.2T, 34.5K, 0.82. */
export function fmtValue(v: number): string {
  return Math.abs(v) >= 10_000 ? compact.format(v) : plain.format(v)
}

export function fmtR(r: number): string {
  const s = r.toFixed(2)
  return r > 0 ? `+${s}` : s
}

export function fmtPct(x: number): string {
  return `${Math.round(x * 100)}%`
}

export function strengthLabel(r: number): string {
  const a = Math.abs(r)
  const dir = r >= 0 ? 'positive' : 'negative'
  if (a >= 0.7) return `Strong ${dir}`
  if (a >= 0.4) return `Moderate ${dir}`
  if (a >= 0.2) return `Weak ${dir}`
  return 'No meaningful'
}

export function categoryLabel(c: string): string {
  return c.charAt(0).toUpperCase() + c.slice(1)
}
