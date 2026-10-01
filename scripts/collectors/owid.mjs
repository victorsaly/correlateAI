/**
 * Our World in Data — public Chart Data API (since Nov 2024), no key required.
 * https://ourworldindata.org/grapher/{slug}.csv  (columns: Entity, Code, Year, <metric...>)
 * We pull the full CSV, keep US rows, and use the first metric column as the value.
 * Grapher slugs evolve, so any slug that 404s or yields too few US points is skipped.
 */
import { fetchText, parseCsv } from '../lib/collectorUtils.mjs'

const COUNTRY_CODE = 'USA'

const CHARTS = [
  { slug: 'annual-co2-emissions-per-country', id: 'owid-co2-emissions', name: 'US Annual CO₂ Emissions', unit: 'tonnes', category: 'environment' },
  { slug: 'co-emissions-per-capita', id: 'owid-co2-per-capita', name: 'US CO₂ Emissions per Capita', unit: 'tonnes', category: 'environment' },
  { slug: 'share-of-individuals-using-the-internet', id: 'owid-internet-share', name: 'US Internet Usage', unit: '% of population', category: 'technology' },
  { slug: 'share-of-adults-defined-as-obese', id: 'owid-obesity', name: 'US Adult Obesity', unit: '% of adults', category: 'health' },
  { slug: 'primary-energy-consumption-per-capita', id: 'owid-energy-per-capita', name: 'US Energy Use per Capita', unit: 'kWh', category: 'environment' },
  { slug: 'total-alcohol-consumption-per-capita-litres-of-pure-alcohol', id: 'owid-alcohol', name: 'US Alcohol Consumption', unit: 'litres/person', category: 'health' },
  { slug: 'renewable-share-energy', id: 'owid-renewable-share', name: 'US Renewable Energy Share', unit: '% of primary energy', category: 'environment' },
]

export async function collect() {
  const out = []
  for (const c of CHARTS) {
    const url = `https://ourworldindata.org/grapher/${c.slug}.csv`
    try {
      const csv = await fetchText(url)
      const rows = parseCsv(csv)
      if (rows.length === 0) { console.warn(`  ⚠ OWID ${c.slug}: empty`); continue }
      const header = Object.keys(rows[0])
      const valueCol = header[3] // Entity, Code, Year, <metric>
      if (!valueCol) { console.warn(`  ⚠ OWID ${c.slug}: no metric column`); continue }
      const points = rows
        .filter((r) => r.Code === COUNTRY_CODE)
        .map((r) => ({ year: Number(r.Year), value: Number(r[valueCol]) }))
        .filter((p) => Number.isFinite(p.year) && Number.isFinite(p.value))
      out.push({
        id: c.id,
        meta: {
          name: c.name,
          unit: c.unit,
          category: c.category,
          source: 'Our World in Data',
          sourceUrl: `https://ourworldindata.org/grapher/${c.slug}`,
          description: `${c.name} (Our World in Data: ${valueCol}).`,
        },
        points,
      })
    } catch (err) {
      console.warn(`  ⚠ OWID ${c.slug} failed: ${err.message}`)
    }
  }
  return out
}
