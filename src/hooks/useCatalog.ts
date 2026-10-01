import { useEffect, useState } from 'react'
import { loadCatalog } from '@/services/dataService'
import type { Dataset } from '@/types'

export function useCatalog() {
  const [catalog, setCatalog] = useState<Dataset[] | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let live = true
    loadCatalog()
      .then((list) => live && setCatalog(list))
      .catch((e: Error) => live && setError(e.message))
    return () => {
      live = false
    }
  }, [])

  return { catalog, error }
}
