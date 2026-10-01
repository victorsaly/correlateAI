import { useCallback, useState } from 'react'
import { pairKey } from '@/lib/pair'

export interface SavedPair {
  a: string
  b: string
  savedAt: number
}

const KEY = 'saved-pairs:v1'
// Legacy keys from the pre-redesign app held synthetic correlations; they can't be recomputed.
const LEGACY_KEYS = ['favorite-correlations', 'correlate-ai-intro-seen']

function read(): SavedPair[] {
  try {
    LEGACY_KEYS.forEach((k) => localStorage.removeItem(k))
    const raw = localStorage.getItem(KEY)
    const list = raw ? (JSON.parse(raw) as SavedPair[]) : []
    return Array.isArray(list) ? list.filter((p) => typeof p.a === 'string' && typeof p.b === 'string') : []
  } catch {
    return []
  }
}

function write(list: SavedPair[]) {
  try {
    localStorage.setItem(KEY, JSON.stringify(list))
  } catch {
    // storage blocked: keep in memory only
  }
}

export function useSavedPairs() {
  const [saved, setSaved] = useState<SavedPair[]>(read)

  const isSaved = useCallback(
    (a: string, b: string) => saved.some((p) => pairKey(p.a, p.b) === pairKey(a, b)),
    [saved]
  )

  const toggle = useCallback((a: string, b: string) => {
    setSaved((prev) => {
      const key = pairKey(a, b)
      const next = prev.some((p) => pairKey(p.a, p.b) === key)
        ? prev.filter((p) => pairKey(p.a, p.b) !== key)
        : [{ a, b, savedAt: Date.now() }, ...prev]
      write(next)
      return next
    })
  }, [])

  return { saved, isSaved, toggle }
}
