#!/usr/bin/env node
/**
 * collect-real-sources.mjs
 *
 * Runs every real, no-key collector, writes each series to public/data/{id}.json,
 * and writes public/data/real_list.json — the manifest staticDataService loads as
 * real (isAIGenerated: false) datasets for correlation.
 *
 * Per-source and per-dataset failures are isolated: one uncooperative API never
 * aborts the run. Exits 0 as long as at least one dataset is written.
 */
import { writeDataset, writeManifest } from './lib/collectorUtils.mjs'
import { collect as worldbank } from './collectors/worldbank.mjs'
import { collect as usgs } from './collectors/usgs.mjs'
import { collect as openmeteo } from './collectors/openmeteo.mjs'
import { collect as frankfurter } from './collectors/frankfurter.mjs'
import { collect as owid } from './collectors/owid.mjs'

const COLLECTORS = [
  ['World Bank', worldbank],
  ['USGS', usgs],
  ['Open-Meteo', openmeteo],
  ['Frankfurter', frankfurter],
  ['Our World in Data', owid],
]

async function main() {
  console.log('🌐 Collecting real, no-key data sources...\n')
  const manifest = []
  let written = 0
  let skipped = 0

  for (const [label, collect] of COLLECTORS) {
    console.log(`📡 ${label}...`)
    let datasets = []
    try {
      datasets = await collect()
    } catch (err) {
      console.warn(`  ⚠ ${label} collector errored: ${err.message}`)
      continue
    }
    for (const ds of datasets) {
      try {
        const entry = await writeDataset(ds.id, ds.meta, ds.points)
        manifest.push(entry)
        written++
        console.log(`  ✓ ${ds.id} (${entry.dataPoints} pts, ${entry.dateRange.start}–${entry.dateRange.end})`)
      } catch (err) {
        skipped++
        console.warn(`  ⊘ ${ds.id} skipped: ${err.message}`)
      }
    }
  }

  if (written === 0) {
    console.error('\n💥 No datasets written — leaving manifest untouched.')
    process.exit(1)
  }

  const count = await writeManifest(manifest)
  console.log(`\n✅ Wrote ${written} datasets (${skipped} skipped) → public/data/real_list.json (${count} entries)`)
}

main().catch((err) => {
  console.error('💥 collect-real-sources failed:', err)
  process.exit(1)
})
