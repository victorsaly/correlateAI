import { useRef, useState } from 'react'
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
import { pairUrl } from '@/lib/shareUrl'
import type { PairResult } from '@/types'
import { ShareCard } from '@/features/share/ShareCard'
import { nodeToPng } from '@/features/share/shareImage'


const intents = {
  X: (text: string, url: string) => `https://x.com/intent/post?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`,
  LinkedIn: (_: string, url: string) => `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
  Bluesky: (text: string, url: string) => `https://bsky.app/intent/compose?text=${encodeURIComponent(`${text} ${url}`)}`,
}

export function ShareMenu({ pair }: { pair: PairResult }) {
  const cardRef = useRef<HTMLDivElement>(null)
  const [rendering, setRendering] = useState(false)
  const url = pairUrl(pair.a.id, pair.b.id)
  const text = shareText(pair)

  const renderPng = async () => {
    setRendering(true)
    // let the off-screen card mount and its chart lay out
    await new Promise((r) => setTimeout(r, 120))
    try {
      return await nodeToPng(cardRef.current!)
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
            <ShareCard ref={cardRef} pair={pair} url={url} />
          </div>,
          document.body
        )}
    </>
  )
}
