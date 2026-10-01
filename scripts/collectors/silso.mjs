/**
 * SILSO (Royal Observatory of Belgium) yearly mean total sunspot number, no key required.
 * https://www.sidc.be/SILSO/DATA/SN_y_tot_V2.0.txt
 * Whitespace-separated: <year>.5  <mean>  <std dev>  <observations>  <definitive flag>
 * Missing values are -1.
 */
import { fetchText } from '../lib/collectorUtils.mjs'

const URL = 'https://www.sidc.be/SILSO/DATA/SN_y_tot_V2.0.txt'

export async function collect() {
  try {
    const points = (await fetchText(URL))
      .split('\n')
      .map((l) => l.trim().split(/\s+/))
      .map(([y, v]) => ({ year: Math.floor(Number(y)), value: Number(v) }))
      .filter((p) => Number.isFinite(p.year) && p.value >= 0)
    return [
      {
        id: 'silso-sunspots',
        meta: {
          name: 'Sunspot Number',
          unit: 'yearly mean',
          category: 'space',
          source: 'SILSO',
          sourceUrl: 'https://www.sidc.be/SILSO/datafiles',
          description: 'Yearly mean total sunspot number (SILSO, Royal Observatory of Belgium).',
        },
        points,
      },
    ]
  } catch (err) {
    console.warn(`  ⚠ SILSO failed: ${err.message}`)
    return []
  }
}
