/**
 * NOAA — no key required.
 *  - Global Monitoring Laboratory annual means (comment lines start with '#'):
 *    https://gml.noaa.gov/webdata/ccgg/trends/co2/co2_annmean_mlo.csv  (year,mean,unc)
 *    https://gml.noaa.gov/webdata/ccgg/trends/ch4/ch4_annmean_gl.csv   (year,mean,unc)
 *  - NCEI Climate at a Glance, global land+ocean annual temperature anomaly:
 *    .../global/time-series/globe/land_ocean/12/12/1850-{end}/data.json
 *    → { data: { "1850": { departure: -0.15 } | { anomaly: -0.15 } | -0.15, ... } }
 */
import { fetchJson, fetchText, parseCsv } from '../lib/collectorUtils.mjs'

const END = new Date().getFullYear() - 1 // last complete year

const GML = [
  {
    url: 'https://gml.noaa.gov/webdata/ccgg/trends/co2/co2_annmean_mlo.csv',
    id: 'noaa-co2-mauna-loa',
    name: 'Atmospheric CO₂ (Mauna Loa)',
    unit: 'ppm',
    sourceUrl: 'https://gml.noaa.gov/ccgg/trends/',
    description: 'Annual mean atmospheric carbon dioxide measured at Mauna Loa Observatory, Hawaii (NOAA GML).',
  },
  {
    url: 'https://gml.noaa.gov/webdata/ccgg/trends/ch4/ch4_annmean_gl.csv',
    id: 'noaa-methane-global',
    name: 'Atmospheric Methane (global)',
    unit: 'ppb',
    sourceUrl: 'https://gml.noaa.gov/ccgg/trends_ch4/',
    description: 'Global annual mean atmospheric methane from marine surface sites (NOAA GML).',
  },
]

const TEMP_URL = `https://www.ncei.noaa.gov/access/monitoring/climate-at-a-glance/global/time-series/globe/land_ocean/12/12/1850-${END}/data.json`

const anomalyOf = (v) => (typeof v === 'number' ? v : (v?.departure ?? v?.anomaly))

export async function collect() {
  const out = []

  for (const s of GML) {
    try {
      const csv = (await fetchText(s.url))
        .split('\n')
        .filter((l) => l.trim() && !l.startsWith('#'))
        .join('\n')
      const points = parseCsv(csv).map((r) => ({ year: Number(r.year), value: Number(r.mean) }))
      out.push({
        id: s.id,
        meta: { name: s.name, unit: s.unit, category: 'climate', source: 'NOAA GML', sourceUrl: s.sourceUrl, description: s.description },
        points,
      })
    } catch (err) {
      console.warn(`  ⚠ NOAA ${s.id} failed: ${err.message}`)
    }
  }

  try {
    const json = await fetchJson(TEMP_URL)
    const points = Object.entries(json?.data || {}).map(([year, v]) => ({ year: Number(year), value: Number(anomalyOf(v)) }))
    out.push({
      id: 'noaa-global-temp-anomaly',
      meta: {
        name: 'Global Temperature Anomaly',
        unit: '°C vs 1901–2000',
        category: 'climate',
        source: 'NOAA NCEI',
        sourceUrl: 'https://www.ncei.noaa.gov/access/monitoring/climate-at-a-glance/global/time-series',
        description: 'Annual global land and ocean surface temperature departure from the 1901–2000 average (NOAA NCEI).',
      },
      points,
    })
  } catch (err) {
    console.warn(`  ⚠ NOAA global temperature failed: ${err.message}`)
  }

  return out
}
