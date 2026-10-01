#!/usr/bin/env node
/**
 * collect-real-sources.mjs
 *
 * Runs every real, no-key collector, writes each series to public/data/{id}.json,
 * and writes public/data/real_list.json — the manifest the app loads.
 *
 * Per-source and per-dataset failures are isolated: one uncooperative API never
 * aborts the run. A series that was in the previous manifest but failed this run
 * (or came back with far fewer points, e.g. a partial outage) keeps its last good
 * file and manifest entry, so saved pairs and /pairs/ pages never silently vanish.
 *
 * Writes a JSON run report to $COLLECT_REPORT (if set) so CI can alert on
 * failures after committing whatever did succeed. Exits 1 only if nothing at
 * all could be written.
 */
import { promises as fs } from 'node:fs'
import path from 'node:path'
import { DATA_DIR, writeDataset, writeManifest } from './lib/collectorUtils.mjs'
import { collect as worldbank } from './collectors/worldbank.mjs'
import { collect as usgs } from './collectors/usgs.mjs'
import { collect as openmeteo } from './collectors/openmeteo.mjs'
import { collect as frankfurter } from './collectors/frankfurter.mjs'
import { collect as owid } from './collectors/owid.mjs'
import { collect as noaa } from './collectors/noaa.mjs'
import { collect as nsidc } from './collectors/nsidc.mjs'
import { collect as silso } from './collectors/silso.mjs'
import { collect as treasury } from './collectors/treasury.mjs'

const COLLECTORS = [
  ['World Bank', worldbank],
  ['USGS', usgs],
  ['Open-Meteo', openmeteo],
  ['Frankfurter', frankfurter],
  ['Our World in Data', owid],
  ['NOAA', noaa],
  ['NSIDC', nsidc],
  ['SILSO', silso],
  ['U.S. Treasury', treasury],
]

// A refetched series with fewer than this share of its previous points is
// treated as a partial failure and the previous version is kept.
const MIN_RETAINED = 0.9

async function readJson(file, fallback) {
  try {
    return JSON.parse(await fs.readFile(file, 'utf8'))
  } catch {
    return fallback
  }
}

async function main() {
  console.log('🌐 Collecting real, no-key data sources...\n')
  const previous = new Map((await readJson(path.join(DATA_DIR, 'real_list.json'), [])).map((e) => [e.id, e]))
  const manifest = new Map()
  const report = { startedAt: new Date().toISOString(), sources: [], carriedForward: [], dropped: [], added: [] }

  for (const [label, collect] of COLLECTORS) {
    console.log(`📡 ${label}...`)
    const src = { source: label, written: 0, skipped: [], error: null }
    report.sources.push(src)
    let datasets = []
    try {
      datasets = await collect()
    } catch (err) {
      src.error = err.message
      console.warn(`  ⚠ ${label} collector errored: ${err.message}`)
      continue
    }
    for (const ds of datasets) {
      const prev = previous.get(ds.id)
      if (prev && ds.points.length < prev.dataPoints * MIN_RETAINED) {
        src.skipped.push({ id: ds.id, reason: `only ${ds.points.length} pts (had ${prev.dataPoints})` })
        console.warn(`  ⊘ ${ds.id}: only ${ds.points.length} pts vs ${prev.dataPoints} before — keeping previous`)
        continue
      }
      try {
        const entry = await writeDataset(ds.id, ds.meta, ds.points)
        manifest.set(entry.id, entry)
        src.written++
        if (!prev) report.added.push(entry.id)
        console.log(`  ✓ ${ds.id} (${entry.dataPoints} pts, ${entry.dateRange.start}–${entry.dateRange.end})`)
      } catch (err) {
        src.skipped.push({ id: ds.id, reason: err.message })
        console.warn(`  ⊘ ${ds.id} skipped: ${err.message}`)
      }
    }
    if (src.written === 0 && !src.error) src.error = 'no datasets returned'
  }

  // Keep the last good version of anything that didn't refresh this run.
  for (const [id, entry] of previous) {
    if (manifest.has(id)) continue
    const fileExists = await fs.access(path.join(DATA_DIR, `${id}.json`)).then(() => true, () => false)
    if (fileExists) {
      manifest.set(id, entry)
      report.carriedForward.push(id)
    } else {
      report.dropped.push(id)
    }
  }

  const written = report.sources.reduce((n, s) => n + s.written, 0)
  if (written === 0) {
    console.error('\n💥 No datasets written — leaving manifest untouched.')
    process.exit(1)
  }

  const count = await writeManifest([...manifest.values()])
  report.total = count
  report.refreshed = written
  console.log(`\n✅ Refreshed ${written} datasets → public/data/real_list.json (${count} entries)`)
  if (report.added.length) console.log(`   ＋ new: ${report.added.join(', ')}`)
  if (report.carriedForward.length) console.warn(`   ↺ kept previous (not refreshed): ${report.carriedForward.join(', ')}`)
  if (report.dropped.length) console.warn(`   ✗ dropped (no previous file): ${report.dropped.join(', ')}`)

  if (process.env.COLLECT_REPORT) {
    await fs.writeFile(process.env.COLLECT_REPORT, JSON.stringify(report, null, 2))
  }
}

main().catch((err) => {
  console.error('💥 collect-real-sources failed:', err)
  process.exit(1)
})
