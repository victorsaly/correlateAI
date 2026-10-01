/**
 * Our World in Data — public Chart Data API (since Nov 2024), no key required.
 * https://ourworldindata.org/grapher/{slug}.csv?csvType=full  (columns: Entity, Code, Year, <metric...>)
 * We pull the full CSV, keep one country's rows (US by default), and take the
 * metric column. Some charts append annotation columns ("World region according
 * to OWID", "... (Original Year)", "... (Projected)"), so those are skipped
 * unless a chart names its column explicitly.
 * Grapher slugs evolve (old slugs usually redirect), so any slug that 404s or
 * yields too few points is skipped.
 */
import { fetchText, parseCsv } from '../lib/collectorUtils.mjs'

const ANNOTATION_COL = /world region according to owid|\(original year\)|\(projected\)/i

const CHARTS = [
  { slug: 'annual-co2-emissions-per-country', id: 'owid-co2-emissions', name: 'US Annual CO₂ Emissions', unit: 'tonnes', category: 'environment' },
  { slug: 'co-emissions-per-capita', id: 'owid-co2-per-capita', name: 'US CO₂ Emissions per Capita', unit: 'tonnes', category: 'environment' },
  { slug: 'share-of-individuals-using-the-internet', id: 'owid-internet-share', name: 'US Internet Usage', unit: '% of population', category: 'technology' },
  { slug: 'share-of-adults-defined-as-obese', id: 'owid-obesity', name: 'US Adult Obesity', unit: '% of adults', category: 'health' },
  { slug: 'per-capita-energy-use', id: 'owid-energy-per-capita', name: 'US Energy Use per Capita', unit: 'kWh', category: 'energy' },
  { slug: 'total-alcohol-consumption-per-capita-litres-of-pure-alcohol', id: 'owid-alcohol', name: 'US Alcohol Consumption', unit: 'litres/person', category: 'health' },
  { slug: 'renewable-share-energy', id: 'owid-renewable-share', name: 'US Renewable Energy Share', unit: '% of primary energy', category: 'energy' },
  { slug: 'marriage-rate-per-1000-inhabitants', id: 'owid-marriage-rate', name: 'US Marriage Rate', unit: 'per 1,000 people', category: 'society' },
  { slug: 'homicide-rate-unodc', id: 'owid-homicide-rate', name: 'US Homicide Rate', unit: 'per 100,000 people', category: 'society' },
  { slug: 'annual-working-hours-per-worker', id: 'owid-working-hours', name: 'US Annual Working Hours per Worker', unit: 'hours', category: 'society' },
  { slug: 'children-born-per-woman', id: 'owid-fertility-rate', name: 'US Fertility Rate', unit: 'children per woman', category: 'demographics' },
  { slug: 'median-age', id: 'owid-median-age', name: 'US Median Age', unit: 'years', category: 'demographics' },
  { slug: 'meat-supply-per-person', id: 'owid-meat-consumption', name: 'US Meat Consumption per Person', unit: 'kg/year', category: 'food' },
  { slug: 'per-capita-egg-consumption-kilograms-per-year', id: 'owid-egg-consumption', name: 'US Egg Consumption per Person', unit: 'kg/year', category: 'food' },
  { slug: 'per-capita-milk-consumption', id: 'owid-milk-consumption', name: 'US Milk Consumption per Person', unit: 'kg/year', category: 'food' },
  { slug: 'air-passengers-carried', id: 'owid-air-passengers', name: 'US Air Passengers Carried', unit: 'passengers', category: 'transport' },
  { slug: 'electricity-generation', id: 'owid-electricity-generation', name: 'US Electricity Generation', unit: 'TWh', category: 'energy' },
  { slug: 'wind-generation', id: 'owid-wind-generation', name: 'US Wind Power Generation', unit: 'TWh', category: 'energy' },
  { slug: 'solar-energy-consumption', id: 'owid-solar-energy', name: 'US Solar Energy Consumption', unit: 'TWh', category: 'energy' },
  { slug: 'nuclear-energy-generation', id: 'owid-nuclear-generation', name: 'US Nuclear Power Generation', unit: 'TWh', category: 'energy' },
  { slug: 'coal-consumption-by-country-terawatt-hours-twh', id: 'owid-coal-consumption', name: 'US Coal Consumption', unit: 'TWh', category: 'energy' },
  { slug: 'oil-consumption-by-country', id: 'owid-oil-consumption', name: 'US Oil Consumption', unit: 'TWh', category: 'energy' },
  { slug: 'gas-consumption-by-country', id: 'owid-gas-consumption', name: 'US Natural Gas Consumption', unit: 'TWh', category: 'energy' },
]

/** The metric column: the chart's named column, else the first non-annotation column after Year. */
export function metricColumn(header, named) {
  if (named) return header.includes(named) ? named : null
  return header.slice(3).find((h) => !ANNOTATION_COL.test(h)) ?? null
}

export async function collect() {
  const out = []
  for (const c of CHARTS) {
    const code = c.code ?? 'USA'
    const url = `https://ourworldindata.org/grapher/${c.slug}.csv?csvType=full`
    try {
      const csv = await fetchText(url)
      const rows = parseCsv(csv)
      if (rows.length === 0) { console.warn(`  ⚠ OWID ${c.slug}: empty`); continue }
      const valueCol = metricColumn(Object.keys(rows[0]), c.column)
      if (!valueCol) { console.warn(`  ⚠ OWID ${c.slug}: no metric column`); continue }
      const points = rows
        .filter((r) => r.Code === code && r[valueCol] !== '')
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
