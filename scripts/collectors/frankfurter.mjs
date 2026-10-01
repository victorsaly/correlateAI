/**
 * Frankfurter — ECB reference foreign-exchange rates, no key required.
 * https://api.frankfurter.dev/v1/{start}..{end}?base=USD&symbols=EUR,GBP,JPY
 * Returns { rates: { "YYYY-MM-DD": { EUR: x, GBP: y, JPY: z }, ... } }.
 * We aggregate to an annual mean rate per currency.
 */
import { fetchJson, annualize } from '../lib/collectorUtils.mjs'

const START = '1999-01-01'
const END = `${new Date().getFullYear() - 1}-12-31`

const CURRENCIES = [
  { code: 'EUR', id: 'fx-usd-eur', name: 'US Dollar to Euro' },
  { code: 'GBP', id: 'fx-usd-gbp', name: 'US Dollar to British Pound' },
  { code: 'JPY', id: 'fx-usd-jpy', name: 'US Dollar to Japanese Yen' },
]

export async function collect() {
  const symbols = CURRENCIES.map((c) => c.code).join(',')
  const url = `https://api.frankfurter.dev/v1/${START}..${END}?base=USD&symbols=${symbols}`
  let json
  try {
    json = await fetchJson(url)
  } catch (err) {
    console.warn(`  ⚠ Frankfurter failed: ${err.message}`)
    return []
  }
  const rates = json?.rates || {}
  const out = []
  for (const c of CURRENCIES) {
    const rows = Object.entries(rates)
      .map(([date, obj]) => ({ year: Number(date.slice(0, 4)), value: obj?.[c.code] }))
      .filter((r) => Number.isFinite(r.value))
    out.push({
      id: c.id,
      meta: {
        name: c.name,
        unit: `${c.code} per USD`,
        category: 'financial',
        source: 'Frankfurter (ECB)',
        sourceUrl: 'https://frankfurter.dev/',
        description: `Annual mean ${c.name} exchange rate (European Central Bank reference rates).`,
      },
      points: annualize(rows, { agg: 'mean' }),
    })
  }
  return out
}
