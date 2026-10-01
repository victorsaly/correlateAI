#!/usr/bin/env node
/**
 * validate-real-data.mjs
 *
 * Checks public/data/real_list.json and every series it lists before data is
 * committed or deployed: ids the /pairs/ URLs can carry, complete metadata,
 * one finite value per year in ascending order, and manifest counts/ranges
 * that match the files. Exits 1 with every problem listed.
 */
import { promises as fs } from 'node:fs'
import path from 'node:path'

const DATA_DIR = 'public/data'
const ID = /^[a-z0-9_-]{1,64}$/ // same charset src/lib/pairPages.ts parses
const STALE_YEARS = 10

const errors = []
const warnings = []
const fail = (id, msg) => errors.push(`${id}: ${msg}`)

const manifest = JSON.parse(await fs.readFile(path.join(DATA_DIR, 'real_list.json'), 'utf8'))
if (!Array.isArray(manifest) || manifest.length === 0) {
  console.error('✗ real_list.json is empty or not an array')
  process.exit(1)
}

const seen = new Set()
const thisYear = new Date().getFullYear()

for (const d of manifest) {
  const id = d?.id ?? '(missing id)'
  if (!ID.test(id)) fail(id, 'id must match [a-z0-9_-]{1,64}')
  if (seen.has(id)) fail(id, 'duplicate id')
  seen.add(id)
  for (const k of ['name', 'source', 'category', 'description']) if (!d[k]) fail(id, `missing ${k}`)
  if (!/^https:\/\//.test(d.sourceUrl ?? '')) fail(id, 'sourceUrl must be https')

  let rows
  try {
    rows = JSON.parse(await fs.readFile(path.join(DATA_DIR, `${id}.json`), 'utf8'))
  } catch (err) {
    fail(id, `unreadable data file (${err.message})`)
    continue
  }
  if (!Array.isArray(rows) || rows.length < 5) {
    fail(id, `needs ≥5 points, has ${rows?.length ?? 0}`)
    continue
  }
  for (let i = 0; i < rows.length; i++) {
    const { year, value } = rows[i]
    if (!Number.isInteger(year) || !Number.isFinite(value)) {
      fail(id, `bad point at index ${i}: ${JSON.stringify(rows[i])}`)
      break
    }
    if (i > 0 && year <= rows[i - 1].year) {
      fail(id, `years not strictly ascending at ${year}`)
      break
    }
  }
  if (rows.length > 1 && rows.every((r) => r.value === rows[0].value)) fail(id, 'every value is identical')
  if (d.dataPoints !== rows.length) fail(id, `manifest says ${d.dataPoints} points, file has ${rows.length}`)
  const start = rows[0].year
  const end = rows[rows.length - 1].year
  if (d.dateRange?.start !== start || d.dateRange?.end !== end) {
    fail(id, `manifest range ${d.dateRange?.start}–${d.dateRange?.end} ≠ file ${start}–${end}`)
  }
  const have = new Set(rows.map((r) => r.year))
  const missing = []
  for (let y = start; y <= end; y++) if (!have.has(y)) missing.push(y)
  if (JSON.stringify(d.missingYears ?? []) !== JSON.stringify(missing)) {
    fail(id, `missingYears doesn't match the file (file is missing ${missing.length} years)`)
  }
  if (end > thisYear) fail(id, `ends in the future (${end})`)
  if (end < thisYear - STALE_YEARS) warnings.push(`${id}: latest value is from ${end}`)
}

for (const w of warnings) console.warn(`⚠ ${w}`)
if (errors.length) {
  for (const e of errors) console.error(`✗ ${e}`)
  console.error(`\n${errors.length} problem(s) in ${manifest.length} datasets`)
  process.exit(1)
}
console.log(`✓ ${manifest.length} datasets valid (${new Set(manifest.map((d) => d.category)).size} categories)`)
