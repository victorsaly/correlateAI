import { toBlob } from 'html-to-image'

/** Rasterise a DOM node at 2x. html-to-image lets the browser paint oklch/CSS vars itself. */
export async function nodeToPng(node: HTMLElement): Promise<Blob> {
  const blob = await toBlob(node, {
    pixelRatio: 2,
    cacheBust: true,
    backgroundColor: getComputedStyle(document.body).backgroundColor,
  })
  if (!blob) throw new Error('Could not render image')
  return blob
}
