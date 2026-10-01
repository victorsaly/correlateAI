import { lazy, Suspense, useCallback, useEffect, useState } from 'react'
import { Github } from 'lucide-react'
import { toast, Toaster } from 'sonner'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { AppFooter } from '@/app/AppFooter'
import { Logo } from '@/app/Logo'
import { ThemeToggle } from '@/app/ThemeToggle'
import { ExploreView } from '@/features/explore/ExploreView'
import { useCatalog } from '@/hooks/useCatalog'
import { useSavedPairs } from '@/hooks/useSavedPairs'
import { useTheme } from '@/hooks/useTheme'
import { useUrlState } from '@/hooks/useUrlState'
import { loadPair, randomPair } from '@/lib/pair'
import { canonicalPairPath, hasPairPage, pairDescription, pairTitle } from '@/lib/pairPages'
import { siteOrigin, VIEWS, type View } from '@/lib/shareUrl'
import type { PairResult } from '@/types'

const GalleryView = lazy(() => import('@/features/gallery/GalleryView').then((m) => ({ default: m.GalleryView })))
const LearnView = lazy(() => import('@/features/learn/LearnView').then((m) => ({ default: m.LearnView })))
const SavedView = lazy(() => import('@/features/saved/SavedView').then((m) => ({ default: m.SavedView })))

/** First pair a new visitor sees: a textbook trend-driven correlation. */
const DEFAULT_PAIR = { a: 'wb-internet-users', b: 'wb-forest-area' }

const LABELS: Record<View, string> = { explore: 'Explore', gallery: 'Gallery', saved: 'Saved', learn: 'How it works' }

export default function App() {
  const theme = useTheme()
  const { catalog, error: catalogError } = useCatalog()
  const hasPage = useCallback((aId: string, bId: string) => {
    const a = catalog?.find((d) => d.id === aId)
    const b = catalog?.find((d) => d.id === bId)
    return !!a && !!b && hasPairPage(a, b)
  }, [catalog])
  const [url, setUrl] = useUrlState(hasPage)
  const { saved, isSaved, toggle } = useSavedPairs()
  const [pair, setPair] = useState<PairResult | null>(null)
  const [loading, setLoading] = useState(false)
  const [pairError, setPairError] = useState<string | null>(null)

  const openPair = useCallback((a: string, b: string) => {
    setUrl({ a, b, view: 'explore' })
    window.scrollTo({ top: 0 })
  }, [setUrl])

  const random = useCallback(() => {
    if (!catalog) return
    const p = randomPair(catalog)
    if (p) setUrl({ a: p[0].id, b: p[1].id, view: 'explore' })
  }, [catalog, setUrl])

  // Once the catalog is known, move ?a=&b= links for pairs with a static page onto that page's path.
  useEffect(() => {
    if (catalog) setUrl({}, { replace: true })
  }, [catalog, setUrl])

  useEffect(() => {
    if (!catalog) return
    const aId = url.a ?? DEFAULT_PAIR.a
    const bId = url.b ?? DEFAULT_PAIR.b
    const a = catalog.find((d) => d.id === aId)
    const b = catalog.find((d) => d.id === bId)
    if (!a || !b) {
      toast.error('That dataset is no longer available', { description: 'Showing a random pair instead.' })
      random()
      return
    }
    if (pair && pair.a.id === a.id && pair.b.id === b.id) return
    let live = true
    setLoading(true)
    setPairError(null)
    loadPair(a, b)
      .then((p) => live && setPair(p))
      .catch(() => live && setPairError('This pair could not be loaded. Check your connection, or'))
      .finally(() => live && setLoading(false))
    return () => {
      live = false
    }
  }, [catalog, url.a, url.b]) // eslint-disable-line react-hooks/exhaustive-deps

  // Title, description and canonical follow the pair on screen (pair pages are prerendered with the same values).
  useEffect(() => {
    if (!pair || url.view !== 'explore') {
      document.title = `${url.view === 'explore' ? 'CorrelateAI: is that correlation real or a coincidence?' : `${LABELS[url.view]} | CorrelateAI`}`
      setHead(`${siteOrigin()}/${url.view === 'explore' ? '' : `?view=${url.view}`}`)
      return
    }
    document.title = pairTitle(pair)
    const page = hasPairPage(pair.a, pair.b)
    setHead(page ? `${siteOrigin()}${canonicalPairPath(pair.a.id, pair.b.id)}` : `${siteOrigin()}/`, pairDescription(pair))
  }, [pair, url.view])

  return (
    <div className="flex min-h-dvh flex-col">
      <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 focus:rounded-md focus:bg-primary focus:px-4 focus:py-2 focus:text-primary-foreground">
        Skip to content
      </a>
      <Tabs value={url.view} onValueChange={(v) => setUrl({ view: v as View })} className="flex-1 gap-0">
        <header className="border-b">
          <div className="mx-auto flex max-w-6xl flex-wrap items-start gap-x-4 gap-y-1 px-4 pt-4 sm:px-6">
            <div className="flex min-w-0 flex-1 items-center gap-4 py-1">
              <a href={import.meta.env.BASE_URL} aria-label="CorrelateAI home" className="shrink-0 rounded-md">
                <Logo size={36} draw />
              </a>
              <p className="hidden border-l pl-4 text-sm leading-snug text-muted-foreground sm:block">
                Real public data, honest statistics.
                <br />
                Is the correlation real, or a coincidence?
              </p>
            </div>
            <div className="flex items-center gap-1">
              <ThemeToggle pref={theme.pref} isDark={theme.isDark} onChange={theme.setTheme} />
              <a href="https://github.com/victorsaly/correlateAI" target="_blank" rel="noopener noreferrer" aria-label="Source on GitHub"
                className="inline-flex size-9 items-center justify-center rounded-md hover:bg-accent">
                <Github className="size-4" />
              </a>
            </div>
            <TabsList className="-mb-px h-auto w-full justify-start gap-6 overflow-x-auto rounded-none bg-transparent p-0">
              {VIEWS.map((v) => (
                <TabsTrigger key={v} value={v}
                  className="h-11 flex-none rounded-none border-0 border-b-2 border-transparent bg-transparent px-0 text-[15px] text-muted-foreground shadow-none data-[state=active]:border-foreground data-[state=active]:bg-transparent data-[state=active]:text-foreground data-[state=active]:shadow-none dark:data-[state=active]:bg-transparent">
                  {LABELS[v]}
                  {v === 'saved' && saved.length > 0 && <span className="tabular ml-1.5 text-xs text-muted-foreground">{saved.length}</span>}
                </TabsTrigger>
              ))}
            </TabsList>
          </div>
        </header>

        <main id="main" tabIndex={-1} className="mx-auto w-full max-w-6xl px-4 py-8 outline-none sm:px-6">
          {catalogError ? (
            <div role="alert" className="max-w-[60ch]">
              <h2 className="text-xl font-semibold">The data catalog didn’t load</h2>
              <p className="mt-2 text-muted-foreground">Check your connection and reload the page. ({catalogError})</p>
            </div>
          ) : !catalog ? null : (
            <Suspense fallback={null}>
              <TabsContent className="rounded-md focus-visible:outline-2 focus-visible:outline-solid focus-visible:outline-offset-4 focus-visible:outline-ring" value="explore">
                <ExploreView catalog={catalog} pair={pair} loading={loading} error={pairError}
                  saved={!!pair && isSaved(pair.a.id, pair.b.id)}
                  onChange={openPair} onRandom={random}
                  onToggleSave={() => pair && toggle(pair.a.id, pair.b.id)} />
              </TabsContent>
              <TabsContent className="rounded-md focus-visible:outline-2 focus-visible:outline-solid focus-visible:outline-offset-4 focus-visible:outline-ring" value="gallery"><GalleryView catalog={catalog} onOpen={openPair} /></TabsContent>
              <TabsContent className="rounded-md focus-visible:outline-2 focus-visible:outline-solid focus-visible:outline-offset-4 focus-visible:outline-ring" value="saved">
                <SavedView catalog={catalog} saved={saved} onOpen={openPair} onRemove={toggle} onExplore={() => setUrl({ view: 'explore' })} />
              </TabsContent>
              <TabsContent className="rounded-md focus-visible:outline-2 focus-visible:outline-solid focus-visible:outline-offset-4 focus-visible:outline-ring" value="learn"><LearnView catalog={catalog} /></TabsContent>
            </Suspense>
          )}
        </main>
      </Tabs>
      <AppFooter count={catalog?.length ?? 0} />
      <Toaster theme={theme.isDark ? 'dark' : 'light'} position="bottom-center" toastOptions={{ className: 'font-sans' }} />
    </div>
  )
}

function setHead(canonical: string, description?: string) {
  document.querySelector('link[rel="canonical"]')?.setAttribute('href', canonical)
  if (description) document.querySelector('meta[name="description"]')?.setAttribute('content', description)
}
