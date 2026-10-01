/**
 * World Bank Open Data — no key required.
 * https://api.worldbank.org/v2/country/USA/indicator/{indicator}?format=json&date=1960:2024&per_page=500
 * Response: [ <paging meta>, [ { date: "2021", value: 332099760, ... }, ... ] ]
 */
import { fetchJson } from '../lib/collectorUtils.mjs'

const START = 1960
const END = new Date().getFullYear()
const COUNTRY = 'USA'

// indicator code -> dataset metadata
const INDICATORS = [
  ['NY.GDP.MKTP.CD', { id: 'wb-gdp', name: 'US GDP (current US$)', unit: 'USD', category: 'economics' }],
  ['NY.GDP.PCAP.CD', { id: 'wb-gdp-per-capita', name: 'US GDP per Capita', unit: 'USD', category: 'economics' }],
  ['SP.POP.TOTL', { id: 'wb-population', name: 'US Population', unit: 'people', category: 'demographics' }],
  ['SP.DYN.LE00.IN', { id: 'wb-life-expectancy', name: 'US Life Expectancy', unit: 'years', category: 'health' }],
  ['SP.URB.TOTL.IN.ZS', { id: 'wb-urban-population', name: 'US Urban Population', unit: '% of total', category: 'demographics' }],
  ['SP.RUR.TOTL.ZS', { id: 'wb-rural-population', name: 'US Rural Population', unit: '% of total', category: 'demographics' }],
  ['SP.DYN.CBRT.IN', { id: 'wb-birth-rate', name: 'US Birth Rate', unit: 'per 1,000 people', category: 'demographics' }],
  ['SP.DYN.CDRT.IN', { id: 'wb-death-rate', name: 'US Death Rate', unit: 'per 1,000 people', category: 'demographics' }],
  ['IT.NET.USER.ZS', { id: 'wb-internet-users', name: 'US Internet Users', unit: '% of population', category: 'technology' }],
  ['IT.CEL.SETS.P2', { id: 'wb-mobile-subscriptions', name: 'US Mobile Subscriptions', unit: 'per 100 people', category: 'technology' }],
  ['SL.UEM.TOTL.ZS', { id: 'wb-unemployment', name: 'US Unemployment Rate', unit: '% of labor force', category: 'economics' }],
  ['FP.CPI.TOTL.ZG', { id: 'wb-inflation', name: 'US Inflation Rate', unit: '% annual', category: 'economics' }],
  ['NE.EXP.GNFS.ZS', { id: 'wb-exports', name: 'US Exports', unit: '% of GDP', category: 'economics' }],
  ['NE.IMP.GNFS.ZS', { id: 'wb-imports', name: 'US Imports', unit: '% of GDP', category: 'economics' }],
  ['MS.MIL.XPND.GD.ZS', { id: 'wb-military-spending', name: 'US Military Expenditure', unit: '% of GDP', category: 'economics' }],
  ['AG.LND.FRST.ZS', { id: 'wb-forest-area', name: 'US Forest Area', unit: '% of land', category: 'environment' }],
  ['SE.SEC.ENRR', { id: 'wb-school-enrollment', name: 'US Secondary School Enrollment', unit: '% gross', category: 'education' }],
  ['NV.AGR.TOTL.ZS', { id: 'wb-agriculture-gdp', name: 'US Agriculture Value Added', unit: '% of GDP', category: 'economics' }],
  ['SH.XPD.CHEX.GD.ZS', { id: 'wb-health-spending', name: 'US Health Expenditure', unit: '% of GDP', category: 'health' }],
  ['EN.GHG.CO2.PC.CE.AR5', { id: 'wb-co2-per-capita', name: 'US CO₂ Emissions per Capita', unit: 'tonnes', category: 'environment' }],
]

const SOURCE = 'World Bank'

export async function collect() {
  const out = []
  for (const [code, m] of INDICATORS) {
    const url = `https://api.worldbank.org/v2/country/${COUNTRY}/indicator/${code}?format=json&date=${START}:${END}&per_page=500`
    try {
      const json = await fetchJson(url)
      const rows = Array.isArray(json) ? json[1] : null
      if (!rows) { console.warn(`  ⚠ World Bank ${code}: no data array`); continue }
      const points = rows
        .filter((r) => r.value !== null && r.value !== undefined)
        .map((r) => ({ year: Number(r.date), value: Number(r.value) }))
      out.push({
        id: m.id,
        meta: {
          name: m.name,
          unit: m.unit,
          category: m.category,
          source: SOURCE,
          sourceUrl: `https://data.worldbank.org/indicator/${code}`,
          description: `${m.name} (World Bank indicator ${code}).`,
        },
        points,
      })
    } catch (err) {
      console.warn(`  ⚠ World Bank ${code} failed: ${err.message}`)
    }
  }
  return out
}
