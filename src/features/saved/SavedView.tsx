import { useEffect, useState } from 'react'
import { X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { loadPair } from '@/lib/pair'
import type { SavedPair } from '@/hooks/useSavedPairs'
import type { Dataset, PairResult } from '@/types'
import { PairRow } from '@/features/PairRow'

export function SavedView({ catalog, saved, onOpen, onRemove, onExplore }: {
  catalog: Dataset[]
  saved: SavedPair[]
  onOpen: (a: string, b: string) => void
  onRemove: (a: string, b: string) => void
  onExplore: () => void
}) {
  const [pairs, setPairs] = useState<PairResult[]>([])
  const [failed, setFailed] = useState<SavedPair[]>([])

  // Each pair loads independently, so one failure doesn't hide the rest.
  useEffect(() => {
    let live = true
    const byId = new Map(catalog.map((d) => [d.id, d]))
    const valid = saved.filter((s) => byId.has(s.a) && byId.has(s.b))
    Promise.allSettled(valid.map((s) => loadPair(byId.get(s.a)!, byId.get(s.b)!))).then((results) => {
      if (!live) return
      setPairs(results.flatMap((r) => (r.status === 'fulfilled' ? [r.value] : [])))
      setFailed(valid.filter((_, i) => results[i].status === 'rejected'))
    })
    return () => {
      live = false
    }
  }, [catalog, saved])

  if (saved.length === 0) {
    return (
      <div className="max-w-[65ch] py-12">
        <h1 className="text-2xl font-semibold tracking-[-0.02em]">Nothing saved yet</h1>
        <p className="mt-2 text-muted-foreground">
          Save a pair from Explore to keep it here. Saved pairs are recomputed from the latest data each time you open them,
          and they stay in this browser only.
        </p>
        <Button className="mt-6" onClick={onExplore}>Explore pairs</Button>
      </div>
    )
  }

  return (
    <div>
      <h1 className="text-2xl font-semibold tracking-[-0.02em]">Saved pairs</h1>
      <p className="mt-2 text-sm text-muted-foreground">Recomputed from the latest data. Stored in this browser only.</p>
      {failed.length > 0 && (
        <p role="status" className="mt-3 text-sm text-destructive">
          {failed.length === 1 ? '1 saved pair' : `${failed.length} saved pairs`} couldn’t be loaded. Check your connection and reopen this tab.
        </p>
      )}
      <ul className="mt-4 border-t">
        {pairs.map((p) => (
          <PairRow
            key={`${p.a.id}~${p.b.id}`}
            pair={p}
            onOpen={() => onOpen(p.a.id, p.b.id)}
            action={
              <Button variant="ghost" size="icon" aria-label={`Remove ${p.a.name} vs ${p.b.name}`} onClick={() => onRemove(p.a.id, p.b.id)}>
                <X />
              </Button>
            }
          />
        ))}
      </ul>
    </div>
  )
}
