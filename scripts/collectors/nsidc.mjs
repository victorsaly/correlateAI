/**
 * NSIDC Sea Ice Index (G02135), no key required.
 * https://noaadata.apps.nsidc.org/NOAA/G02135/north/monthly/data/N_09_extent_v4.0.csv
 * Columns: year, mo, source_dataset, region, extent, area (padded with spaces;
 * missing values are -9999). September is the annual Arctic minimum.
 */
import { fetchText, parseCsv } from '../lib/collectorUtils.mjs'

const URL = 'https://noaadata.apps.nsidc.org/NOAA/G02135/north/monthly/data/N_09_extent_v4.0.csv'

export async function collect() {
  try {
    const rows = parseCsv((await fetchText(URL)).replace(/[ \t]+/g, ''))
    const points = rows
      .map((r) => ({ year: Number(r.year), value: Number(r.extent) }))
      .filter((p) => p.value > 0)
    return [
      {
        id: 'nsidc-arctic-sea-ice',
        meta: {
          name: 'Arctic Sea Ice Extent (September)',
          unit: 'million km²',
          category: 'climate',
          source: 'NSIDC',
          sourceUrl: 'https://nsidc.org/data/g02135',
          description: 'Mean Arctic sea ice extent in September, the yearly minimum (NSIDC Sea Ice Index).',
        },
        points,
      },
    ]
  } catch (err) {
    console.warn(`  ⚠ NSIDC failed: ${err.message}`)
    return []
  }
}
