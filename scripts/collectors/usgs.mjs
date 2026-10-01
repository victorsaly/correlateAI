/**
 * USGS Earthquake Catalog — no key required.
 * Annual counts of significant earthquakes worldwide via the FDSN count endpoint:
 * https://earthquake.usgs.gov/fdsnws/event/1/count?format=text&starttime=YYYY-01-01&endtime=(YYYY+1)-01-01&minmagnitude=M
 */
import { fetchText } from '../lib/collectorUtils.mjs'

const START = 1960
const END = new Date().getFullYear() - 1 // last complete year

const SERIES = [
  { id: 'usgs-quakes-m5', name: 'Major Earthquakes (M5+)', minmag: 5 },
  { id: 'usgs-quakes-m6', name: 'Strong Earthquakes (M6+)', minmag: 6 },
]

async function countForYear(year, minmag) {
  const url = `https://earthquake.usgs.gov/fdsnws/event/1/count?format=text&starttime=${year}-01-01&endtime=${year + 1}-01-01&minmagnitude=${minmag}`
  const text = await fetchText(url)
  const n = parseInt(text.trim(), 10)
  return Number.isFinite(n) ? n : null
}

export async function collect() {
  const out = []
  for (const s of SERIES) {
    const points = []
    for (let year = START; year <= END; year++) {
      try {
        const n = await countForYear(year, s.minmag)
        if (n !== null) points.push({ year, value: n })
      } catch (err) {
        console.warn(`  ⚠ USGS ${s.id} ${year} failed: ${err.message}`)
      }
    }
    out.push({
      id: s.id,
      meta: {
        name: `Worldwide ${s.name}`,
        unit: 'earthquakes per year',
        category: 'geology',
        source: 'USGS',
        sourceUrl: 'https://earthquake.usgs.gov/fdsnws/event/1/',
        description: `Annual worldwide count of magnitude ${s.minmag}+ earthquakes (USGS ComCat).`,
      },
      points,
    })
  }
  return out
}
