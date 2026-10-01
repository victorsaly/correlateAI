/**
 * Open-Meteo Historical Weather (ERA5 reanalysis) — no key required.
 * https://archive-api.open-meteo.com/v1/archive?latitude=&longitude=&start_date=&end_date=&daily=temperature_2m_mean&timezone=UTC
 * Returns daily means; we aggregate to annual mean temperature per city.
 */
import { fetchJson, annualize } from '../lib/collectorUtils.mjs'

const START = '1960-01-01'
const END = `${new Date().getFullYear() - 1}-12-31` // last complete year

const CITIES = [
  { id: 'climate-temp-newyork', name: 'New York', lat: 40.71, lon: -74.01 },
  { id: 'climate-temp-london', name: 'London', lat: 51.51, lon: -0.13 },
  { id: 'climate-temp-tokyo', name: 'Tokyo', lat: 35.68, lon: 139.69 },
  { id: 'climate-temp-sydney', name: 'Sydney', lat: -33.87, lon: 151.21 },
]

export async function collect() {
  const out = []
  for (const c of CITIES) {
    const url = `https://archive-api.open-meteo.com/v1/archive?latitude=${c.lat}&longitude=${c.lon}&start_date=${START}&end_date=${END}&daily=temperature_2m_mean&timezone=UTC`
    try {
      const json = await fetchJson(url)
      const times = json?.daily?.time || []
      const temps = json?.daily?.temperature_2m_mean || []
      const rows = times.map((t, i) => ({ year: Number(t.slice(0, 4)), value: temps[i] }))
      const points = annualize(rows, { agg: 'mean' })
      out.push({
        id: c.id,
        meta: {
          name: `${c.name} Average Temperature`,
          unit: '°C',
          category: 'climate',
          source: 'Open-Meteo (ERA5)',
          sourceUrl: 'https://open-meteo.com/en/docs/historical-weather-api',
          description: `Annual mean 2m air temperature for ${c.name} from the ERA5 reanalysis.`,
        },
        points,
      })
    } catch (err) {
      console.warn(`  ⚠ Open-Meteo ${c.name} failed: ${err.message}`)
    }
  }
  return out
}
