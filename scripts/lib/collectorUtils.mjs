#!/usr/bin/env node
/**
 * collectorUtils.mjs — shared helpers for the real-data collectors.
 *
 * Collectors fetch real, no-key public APIs and produce normalized annual
 * series. `writeDataset` writes each series to `public/data/{id}.json` (the
 * path the frontend's real datasets are served from) in the shape:
 *   [{ year: <number>, value: <number> }, ...]
 * and returns a manifest entry. The orchestrator collects those entries into
 * `public/data/real_list.json`, which staticDataService loads as real
 * (isAIGenerated: false) datasets.
 */

import { promises as fs } from 'node:fs'
import path from 'node:path'

export const DATA_DIR = 'public/data'
const MAX_RETRIES = 3
const RETRY_BASE_MS = 800

const sleep = (ms) => new Promise((r) => setTimeout(r, ms))

async function withRetry(fn, label) {
  let lastErr
  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      return await fn()
    } catch (err) {
      lastErr = err
      console.warn(`  ↻ ${label}: attempt ${attempt}/${MAX_RETRIES} failed (${err.message})`)
      if (attempt < MAX_RETRIES) await sleep(RETRY_BASE_MS * attempt)
    }
  }
  throw lastErr
}

/** Fetch JSON with retry. Throws on non-2xx. */
export async function fetchJson(url, { headers } = {}) {
  return withRetry(async () => {
    const res = await fetch(url, { headers: { 'User-Agent': 'CorrelateAI/1.0', ...headers } })
    if (!res.ok) throw new Error(`HTTP ${res.status} for ${url}`)
    return res.json()
  }, url)
}

/** Fetch plain text (e.g. CSV) with retry. Throws on non-2xx. */
export async function fetchText(url, { headers } = {}) {
  return withRetry(async () => {
    const res = await fetch(url, { headers: { 'User-Agent': 'CorrelateAI/1.0', ...headers } })
    if (!res.ok) throw new Error(`HTTP ${res.status} for ${url}`)
    return res.text()
  }, url)
}

/**
 * Collapse rows that each have a year and value into one value per year.
 * agg: 'mean' | 'sum' | 'last'
 */
export function annualize(rows, { year = 'year', value = 'value', agg = 'mean' } = {}) {
  const buckets = new Map()
  for (const row of rows) {
    const y = Number(row[year])
    const v = Number(row[value])
    if (!Number.isFinite(y) || !Number.isFinite(v)) continue
    if (!buckets.has(y)) buckets.set(y, [])
    buckets.get(y).push(v)
  }
  const out = []
  for (const [y, vals] of buckets) {
    let v
    if (agg === 'sum') v = vals.reduce((a, b) => a + b, 0)
    else if (agg === 'last') v = vals[vals.length - 1]
    else v = vals.reduce((a, b) => a + b, 0) / vals.length
    out.push({ year: y, value: Math.round(v * 1e6) / 1e6 })
  }
  return out.sort((a, b) => a.year - b.year)
}

/** Minimal CSV parser (handles quoted fields). Returns array of row objects keyed by header. */
export function parseCsv(text) {
  const rows = []
  const lines = text.split(/\r?\n/).filter((l) => l.length > 0)
  if (lines.length === 0) return rows
  const splitLine = (line) => {
    const cells = []
    let cur = ''
    let inQ = false
    for (let i = 0; i < line.length; i++) {
      const c = line[i]
      if (inQ) {
        if (c === '"' && line[i + 1] === '"') { cur += '"'; i++ }
        else if (c === '"') inQ = false
        else cur += c
      } else if (c === '"') inQ = true
      else if (c === ',') { cells.push(cur); cur = '' }
      else cur += c
    }
    cells.push(cur)
    return cells
  }
  const header = splitLine(lines[0])
  for (let i = 1; i < lines.length; i++) {
    const cells = splitLine(lines[i])
    const obj = {}
    header.forEach((h, j) => { obj[h] = cells[j] })
    rows.push(obj)
  }
  return rows
}

export function slugify(s) {
  return String(s).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
}

async function ensureDir(dir) {
  await fs.mkdir(dir, { recursive: true })
}

/**
 * Write one dataset's data file and return its manifest entry.
 * meta: { name, unit, category, source, sourceUrl, description }
 * points: [{ year, value }]
 */
export async function writeDataset(id, meta, points) {
  const clean = (points || [])
    .filter((p) => Number.isFinite(Number(p.year)) && Number.isFinite(Number(p.value)))
    .map((p) => ({ year: Number(p.year), value: Number(p.value) }))
    .sort((a, b) => a.year - b.year)

  if (clean.length < 5) {
    throw new Error(`dataset "${id}" has only ${clean.length} valid points (min 5)`)
  }

  await ensureDir(DATA_DIR)
  await fs.writeFile(path.join(DATA_DIR, `${id}.json`), JSON.stringify(clean, null, 2))

  return {
    id,
    name: meta.name,
    unit: meta.unit || '',
    source: meta.source,
    sourceUrl: meta.sourceUrl || '',
    category: meta.category,
    description: meta.description || '',
    dataPoints: clean.length,
    dateRange: { start: clean[0].year, end: clean[clean.length - 1].year },
  }
}

/** Write the manifest of real datasets the frontend should load from /data/. */
export async function writeManifest(entries) {
  await ensureDir(DATA_DIR)
  const sorted = [...entries].sort((a, b) => a.id.localeCompare(b.id))
  await fs.writeFile(path.join(DATA_DIR, 'real_list.json'), JSON.stringify(sorted, null, 2))
  return sorted.length
}
