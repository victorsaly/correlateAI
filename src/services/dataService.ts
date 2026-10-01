import type { Dataset, YearValue } from '@/types'

/**
 * Loads the catalog of real, source-linked series (public/data/real_list.json,
 * written by scripts/collect-real-sources.mjs) and their yearly values.
 * Every request is cached, so repeated calls are free.
 */

const BASE = `${import.meta.env.BASE_URL}data`

let catalogPromise: Promise<Dataset[]> | null = null
const seriesCache = new Map<string, Promise<YearValue[]>>()

export function loadCatalog(): Promise<Dataset[]> {
  catalogPromise ??= fetchJson<Dataset[]>(`${BASE}/real_list.json`)
    .then((list) => list.filter((d) => d.sourceUrl && d.dataPoints > 0))
    .catch((err) => {
      catalogPromise = null
      throw err
    })
  return catalogPromise
}

export function loadSeries(id: string): Promise<YearValue[]> {
  let p = seriesCache.get(id)
  if (!p) {
    p = fetchJson<YearValue[]>(`${BASE}/${encodeURIComponent(id)}.json`)
      .then((rows) =>
        rows
          .filter((r) => Number.isFinite(r.year) && Number.isFinite(r.value))
          .map((r) => ({ year: r.year, value: r.value }))
      )
      .catch((err) => {
        seriesCache.delete(id)
        throw err
      })
    seriesCache.set(id, p)
  }
  return p
}

async function fetchJson<T>(url: string): Promise<T> {
  const res = await fetch(url)
  if (!res.ok) throw new Error(`Failed to load ${url} (${res.status})`)
  return res.json() as Promise<T>
}
