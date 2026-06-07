#!/usr/bin/env node
/**
 * prune-unchanged-data.mjs
 *
 * Runs after the automated data generation step and BEFORE the git commit step.
 *
 * Problem it solves: the data generators stamp a fresh `lastUpdated` /
 * `timestamp` / `generatedAt` into every file on every run, so even data that
 * is byte-identical week to week (e.g. World Bank annual indicators) still
 * produces a git diff and gets committed. That created ~weekly no-op commits.
 *
 * What it does: for every file modified vs HEAD under the data dirs, it compares
 * the new content against the committed version with those volatile timestamp
 * fields stripped out. If the *real* data is unchanged, it reverts the file to
 * HEAD so the existing `git diff --staged --quiet` commit gate skips it.
 *
 * Net effect: only genuinely-changed data (e.g. live weather) gets committed;
 * weeks with no real change produce no commit at all.
 *
 * Fail-safe: any unexpected error exits 0 and leaves files untouched, so the
 * workflow falls back to its previous "commit everything" behaviour.
 */

import { execFileSync } from 'node:child_process'
import { readFileSync } from 'node:fs'

const PATHS = ['public/ai-data', 'data-summary.md']

// Object keys (case-insensitive) treated as volatile metadata, ignored when
// deciding whether the underlying data actually changed.
const VOLATILE_KEYS = new Set(
  [
    'lastupdated',
    'lastupdate',
    'timestamp',
    'generatedat',
    'generated_at',
    'lastmodified',
    'last_modified',
    'updatedat',
    'updated_at',
    'fetchedat',
    'retrievedat',
    'createdat',
    'date_generated',
    'dategenerated',
  ].map((k) => k.toLowerCase())
)

// Matches ISO-8601 timestamps embedded in text files (e.g. data-summary.md).
const ISO_TS = /\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d+)?Z?/g

function git(args) {
  return execFileSync('git', args, { encoding: 'utf8' })
}

/** Recursively drop volatile keys, then stable-stringify for comparison. */
function stripVolatile(value) {
  if (Array.isArray(value)) return value.map(stripVolatile)
  if (value && typeof value === 'object') {
    const out = {}
    for (const key of Object.keys(value).sort()) {
      if (VOLATILE_KEYS.has(key.toLowerCase())) continue
      out[key] = stripVolatile(value[key])
    }
    return out
  }
  return value
}

function normalizeJson(text) {
  return JSON.stringify(stripVolatile(JSON.parse(text)))
}

function normalizeText(text) {
  // Drop ISO timestamps so a file whose only change is a date compares equal.
  return text.replace(ISO_TS, '').trim()
}

function headVersion(file) {
  try {
    return git(['show', `HEAD:${file}`])
  } catch {
    return null // not tracked at HEAD (genuinely new) -> keep
  }
}

function isUnchanged(file) {
  const head = headVersion(file)
  if (head === null) return false
  let current
  try {
    current = readFileSync(file, 'utf8')
  } catch {
    return false // file removed -> genuine change, keep
  }
  try {
    if (file.endsWith('.json')) {
      return normalizeJson(current) === normalizeJson(head)
    }
    return normalizeText(current) === normalizeText(head)
  } catch {
    // Parse failure -> don't risk discarding; treat as changed.
    return false
  }
}

function main() {
  let modified
  try {
    modified = git(['diff', '--name-only', 'HEAD', '--', ...PATHS])
      .split('\n')
      .map((l) => l.trim())
      .filter(Boolean)
  } catch (err) {
    console.error('prune: could not list modified files, skipping prune:', err.message)
    return
  }

  if (modified.length === 0) {
    console.log('prune: no modified data files.')
    return
  }

  const reverted = []
  const kept = []
  for (const file of modified) {
    if (isUnchanged(file)) {
      try {
        git(['checkout', 'HEAD', '--', file])
        reverted.push(file)
      } catch (err) {
        console.error(`prune: failed to revert ${file}, leaving as-is:`, err.message)
        kept.push(file)
      }
    } else {
      kept.push(file)
    }
  }

  console.log(
    `prune: ${reverted.length} timestamp-only file(s) reverted, ${kept.length} with real changes kept.`
  )
  if (reverted.length) console.log('  reverted:\n   - ' + reverted.join('\n   - '))
  if (kept.length) console.log('  kept:\n   - ' + kept.join('\n   - '))
}

try {
  main()
} catch (err) {
  console.error('prune: unexpected error, leaving files untouched:', err.message)
  process.exit(0)
}
