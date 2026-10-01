import { lazy, Suspense, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { Download, Link2, Share2 } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { downloadBlob, downloadCsv, downloadJson, fileStem, shareText } from '@/lib/export'
import { sharePairUrl } from '@/lib/shareUrl'
import type { PairResult } from '@/types'


const intents = {
  X: (text: string, url: string) => `https://x.com/intent/post?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`,
  LinkedIn: (_: string, url: string) => `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
  Bluesky: (text: string, url: string) => `https://bsky.app/intent/compose?text=${encodeURIComponent(`${text} ${url}`)}`,
}

const ShareCard = lazy(() => import('@/features/share/ShareCard').then((m) => ({ default: m.ShareCard })))

export function ShareMenu({ pair }: { pair: PairResult }) {
  const cardRef = useRef<HTMLDivElement>(null)
  const [rendering, setRendering] = useState(false)
  const url = sharePairUrl(pair)
  const text = shareText(pair)

  const renderPng = async () => {
    setRendering(true)
    try {
      // the card and its chart load lazily: wait until the chart has drawn its lines
      const [{ nodeToPng }, node] = await Promise.all([import('@/features/share/shareImage'), waitForCard(cardRef)])
      return await nodeToPng(node)
    } finally {
      setRendering(false)
    }
  }

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(url)
      toast.success('Link copied', { description: 'Anyone opening it sees this exact pair and these numbers.' })
    } catch {
      toast.error('Could not copy the link', { description: url })
    }
  }

  const nativeShare = async () => {
    try {
      const blob = await renderPng()
      const file = new File([blob], `${fileStem(pair)}.png`, { type: 'image/png' })
      const data: ShareData = { title: 'CorrelateAI', text, url }
      if (navigator.canShare?.({ ...data, files: [file] })) data.files = [file]
      await navigator.share(data)
    } catch (e) {
      if ((e as Error).name !== 'AbortError') copyLink()
    }
  }

  const downloadPng = async () => {
    try {
      downloadBlob(`${fileStem(pair)}.png`, await renderPng())
    } catch {
      toast.error('Could not create the image. Try again, or download the CSV instead.')
    }
  }

  return (
    <>
      <div className="flex flex-wrap gap-2">
        <Button onClick={'share' in navigator ? nativeShare : copyLink} disabled={rendering}>
          <Share2 /> Share
        </Button>
        <Button variant="outline" onClick={copyLink}>
          <Link2 /> Copy link
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" disabled={rendering}>
              <Download /> Download
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start">
            <DropdownMenuItem onSelect={downloadPng}>Image (PNG)</DropdownMenuItem>
            <DropdownMenuItem onSelect={() => downloadCsv(pair)}>Data (CSV)</DropdownMenuItem>
            <DropdownMenuItem onSelect={() => downloadJson(pair)}>Data and statistics (JSON)</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuLabel className="text-xs font-normal text-muted-foreground">Post to</DropdownMenuLabel>
            {Object.entries(intents).map(([name, make]) => (
              <DropdownMenuItem key={name} asChild>
                <a href={make(text, url)} target="_blank" rel="noopener noreferrer">{name}</a>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      {rendering &&
        createPortal(
          <div aria-hidden className="pointer-events-none fixed top-0 left-[-10000px]">
            <Suspense fallback={null}>
              <ShareCard ref={cardRef} pair={pair} url={url} />
            </Suspense>
          </div>,
          document.body
        )}
    </>
  )
}

async function waitForCard(ref: React.RefObject<HTMLDivElement | null>, timeout = 5000): Promise<HTMLDivElement> {
  const start = performance.now()
  while (performance.now() - start < timeout) {
    const node = ref.current
    if (node?.querySelector('.recharts-line-curve')) {
      await new Promise((r) => requestAnimationFrame(() => r(null)))
      return node
    }
    await new Promise((r) => setTimeout(r, 30))
  }
  throw new Error('Share card did not render')
}
