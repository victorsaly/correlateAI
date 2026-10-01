#!/usr/bin/env node
/**
 * Generates favicons and app icons from src/app/logo.json, so the in-app mark
 * and every icon share one geometry. Run: npm run brand
 */
import fs from 'node:fs/promises'
import path from 'node:path'
import sharp from 'sharp'

const root = path.resolve(import.meta.dirname, '..')
const logo = JSON.parse(await fs.readFile(path.join(root, 'src/app/logo.json'), 'utf8'))
const out = (f) => path.join(root, 'public', f)

// Mirrors the light/dark tokens in src/index.css.
const THEME = {
  light: { paper: '#f7f8f4', plate: '#fbfcf9', border: '#cbd5cf', grid: 'rgba(120,160,150,0.32)', a: '#1a62ab', b: '#b8631a', pencil: '#b8322a' },
  dark: { paper: '#0a2a4c', plate: '#0c3057', border: '#2d5d8f', grid: 'rgba(235,245,255,0.24)', a: '#279fc6', b: '#d07f2a', pencil: '#ff8f80' },
}

/** Mark body. With `css` set, colours come from classes so one SVG can switch theme. */
function body(g, c) {
  const t = g.tile
  return [
    `<rect x="${t.x}" y="${t.y}" width="${t.size}" height="${t.size}" rx="${t.radius}" fill="${c.plate}"${t.border ? ` stroke="${c.border}" stroke-width="${t.border}"` : ''}/>`,
    ...g.grid.map((d) => `<path d="${d}" stroke="${c.grid}" stroke-width="1"/>`),
    `<path d="${g.a.d}" fill="none" stroke="${c.a}" stroke-width="${g.a.width}" stroke-linecap="round" stroke-linejoin="round"/>`,
    `<path d="${g.b.d}" fill="none" stroke="${c.b}" stroke-width="${g.b.width}" stroke-dasharray="${g.b.dash}" stroke-linejoin="round"/>`,
    `<path d="${g.ring.d}" fill="none" stroke="${c.pencil}" stroke-width="${g.ring.width}" stroke-linecap="round"/>`,
  ].join('\n  ')
}

const svg = (g, c, { size = 64, pad = 0, bg } = {}) => {
  const vb = 64 + pad * 2
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="${-pad} ${-pad} ${vb} ${vb}">
  ${bg ? `<rect x="${-pad}" y="${-pad}" width="${vb}" height="${vb}" fill="${bg}"/>` : ''}
  ${body(g, c)}
</svg>`
}

const png = (s) => sharp(Buffer.from(s)).png().toBuffer()

// favicon.svg follows the browser's colour scheme.
const L = THEME.light
const D = THEME.dark
const themed = body(logo.small, { plate: 'var(--plate)', border: 'none', grid: 'none', a: 'var(--a)', b: 'var(--b)', pencil: 'var(--pencil)' })
await fs.writeFile(out('favicon.svg'), `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
  <style>
    svg { --plate: ${L.plate}; --a: ${L.a}; --b: ${L.b}; --pencil: ${L.pencil}; }
    @media (prefers-color-scheme: dark) { svg { --plate: ${D.plate}; --a: ${D.a}; --b: ${D.b}; --pencil: ${D.pencil}; } }
  </style>
  ${themed}
</svg>
`)

const small = (n) => png(svg(logo.small, L, { size: n }))
const f16 = await small(16)
const f32 = await small(32)
const f48 = await small(48)
await fs.writeFile(out('favicon-16x16.png'), f16)
await fs.writeFile(out('favicon-32x32.png'), f32)

// .ico with embedded PNGs (supported by every current browser)
const imgs = [[16, f16], [32, f32], [48, f48]]
const header = Buffer.alloc(6 + imgs.length * 16)
header.writeUInt16LE(0, 0); header.writeUInt16LE(1, 2); header.writeUInt16LE(imgs.length, 4)
let offset = header.length
imgs.forEach(([n, buf], i) => {
  const e = 6 + i * 16
  header.writeUInt8(n, e); header.writeUInt8(n, e + 1); header.writeUInt16LE(1, e + 4); header.writeUInt16LE(32, e + 6)
  header.writeUInt32LE(buf.length, e + 8); header.writeUInt32LE(offset, e + 12)
  offset += buf.length
})
await fs.writeFile(out('favicon.ico'), Buffer.concat([header, ...imgs.map(([, b]) => b)]))

// Home-screen icons: full mark on the paper ground; maskable keeps it inside the 80% safe zone.
await fs.writeFile(out('apple-touch-icon.png'), await png(svg(logo.full, L, { size: 180, pad: 6, bg: L.paper })))
await fs.writeFile(out('icon-192.png'), await png(svg(logo.full, L, { size: 192, pad: 4, bg: L.paper })))
await fs.writeFile(out('icon-512.png'), await png(svg(logo.full, L, { size: 512, pad: 4, bg: L.paper })))
await fs.writeFile(out('icon-maskable-512.png'), await png(svg(logo.full, L, { size: 512, pad: 14, bg: L.paper })))

console.log('brand assets written to public/')
