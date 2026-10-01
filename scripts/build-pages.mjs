#!/usr/bin/env node
/**
 * Post-build SEO pass (runs after `vite build`):
 *  - prerenders /pairs/<a>--vs--<b>/index.html for every pair with a page
 *    (same rule the app uses), each with its own title, description,
 *    canonical, Open Graph tags, JSON-LD and a readable summary of the stats
 *  - writes sitemap.xml from those pages
 * Statistics come from the app's own TypeScript (bundled here with esbuild),
 * so a prerendered page can never disagree with the live app.
 */
import fs from 'node:fs/promises'
import path from 'node:path'
import { build } from 'esbuild'

const root = path.resolve(import.meta.dirname, '..')
const dist = path.join(root, 'dist')
const ORIGIN = 'https://correlateai.victorsaly.com'

const bundle = await build({
  stdin: {
    contents: `export * from '@/lib/pair'; export * from '@/lib/pairPages'; export { fmtP } from '@/lib/correlationStats'; export { fmtR, fmtValue } from '@/lib/format'`,
    resolveDir: root,
    loader: 'ts',
  },
  bundle: true,
  write: false,
  format: 'esm',
  platform: 'node',
  alias: { '@': path.join(root, 'src') },
  define: { 'import.meta.env.BASE_URL': '"/"', 'import.meta.env.PROD': 'true' },
  logLevel: 'silent',
})
const lib = await import(`data:text/javascript;base64,${Buffer.from(bundle.outputFiles[0].text).toString('base64')}`)

const readJson = async (f) => JSON.parse(await fs.readFile(path.join(root, 'public/data', f), 'utf8'))
const catalog = await readJson('real_list.json')
const series = new Map(await Promise.all(catalog.map(async (d) => [d.id, await readJson(`${d.id}.json`)])))
const template = await fs.readFile(path.join(dist, 'index.html'), 'utf8')
const today = new Date().toISOString().slice(0, 10)

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')

function setMeta(html, { title, description, url, canonical, jsonLd, body, preloads }) {
  return html
    .replace(/<title>[\s\S]*?<\/title>/, `<title>${esc(title)}</title>`)
    .replace(/(<meta name="description" content=")[^"]*(")/, `$1${esc(description)}$2`)
    .replace(/(<link rel="canonical" href=")[^"]*(")/, `$1${canonical}$2`)
    .replace(/(<meta property="og:url" content=")[^"]*(")/, `$1${url}$2`)
    .replace(/(<meta property="og:title" content=")[^"]*(")/, `$1${esc(title)}$2`)
    .replace(/(<meta property="og:description" content=")[^"]*(")/, `$1${esc(description)}$2`)
    .replace(/(<meta name="twitter:title" content=")[^"]*(")/, `$1${esc(title)}$2`)
    .replace(/(<meta name="twitter:description" content=")[^"]*(")/, `$1${esc(description)}$2`)
    .replace('</head>', `    <script type="application/ld+json">${JSON.stringify(jsonLd)}</script>\n</head>`)
    .replace('<div id="root"></div>', `<div id="root">${body}</div>`)
    .replace(/<link rel="preload" href="\/data\/[^"]+" as="fetch" crossorigin data-series>\n\s*<link rel="preload" href="\/data\/[^"]+" as="fetch" crossorigin data-series>/, preloads)
}

const dataset = (d, years) => ({
  '@type': 'Dataset',
  name: d.name,
  description: d.description,
  url: d.sourceUrl,
  creator: { '@type': 'Organization', name: d.source },
  temporalCoverage: `${years[0]}/${years[1]}`,
  variableMeasured: d.unit,
})

const pages = []
for (const a of catalog) {
  for (const b of catalog) {
    if (!lib.hasPairPage(a, b)) continue
    const pair = lib.computePair(a, b, series.get(a.id), series.get(b.id))
    if (pair.points.length < 3) continue
    pages.push(pair)
  }
}

// Related pairs for internal links: the strongest other pages sharing a series.
const canonicalPages = pages.filter((p) => p.a.id < p.b.id)
const related = (p) =>
  canonicalPages
    .filter((q) => q !== p && (q.a.id === p.a.id || q.b.id === p.b.id || q.a.id === p.b.id || q.b.id === p.a.id))
    .sort((x, y) => Math.abs(y.stats.r) - Math.abs(x.stats.r))
    .slice(0, 6)

for (const pair of pages) {
  const { a, b, stats, points } = pair
  const years = [points[0].year, points[points.length - 1].year]
  const pagePath = lib.pairPath(a.id, b.id)
  const canonical = `${ORIGIN}${lib.canonicalPairPath(a.id, b.id)}`
  const title = lib.pairTitle(pair)
  const description = lib.pairDescription(pair)
  const body = `
<main style="max-width:72rem;margin:0 auto;padding:2rem 1rem;font-family:system-ui,sans-serif;line-height:1.5">
  <p><a href="/">CorrelateAI</a> › Pairs</p>
  <h1>${esc(a.name)} vs ${esc(b.name)}</h1>
  <p>${esc(description)}</p>
  <p><strong>Verdict: ${esc(stats.verdict.label)}.</strong> ${esc(stats.verdict.explanation)}</p>
  <dl>
    <dt>Pearson r</dt><dd>${lib.fmtR(stats.r)}</dd>
    <dt>p-value</dt><dd>${lib.fmtP(stats.pValue)}</dd>
    <dt>Years compared (n)</dt><dd>${stats.n} (${years[0]}–${years[1]})</dd>
    <dt>95% confidence interval</dt><dd>${stats.ci ? `${stats.ci[0].toFixed(2)} to ${stats.ci[1].toFixed(2)}` : 'n/a'}</dd>
    <dt>Correlation with the time trend removed</dt><dd>${lib.fmtR(stats.detrendedR)}</dd>
  </dl>
  <h2>Sources</h2>
  <ul>
    <li>${esc(a.name)} (${esc(a.unit)}): <a href="${esc(a.sourceUrl)}">${esc(a.source)}</a>. ${esc(a.description)}</li>
    <li>${esc(b.name)} (${esc(b.unit)}): <a href="${esc(b.sourceUrl)}">${esc(b.source)}</a>. ${esc(b.description)}</li>
  </ul>
  <h2>Related pairs</h2>
  <ul>${related(pair)
    .map((q) => `<li><a href="${lib.pairPath(q.a.id, q.b.id)}">${esc(q.a.name)} vs ${esc(q.b.name)}</a> (r = ${lib.fmtR(q.stats.r)})</li>`)
    .join('')}</ul>
  <p>Correlation does not imply causation. <a href="/?view=learn">How the verdict is worked out</a>.</p>
</main>`
  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebPage',
        name: title,
        description,
        url: canonical,
        isPartOf: { '@type': 'WebSite', name: 'CorrelateAI', url: `${ORIGIN}/` },
        about: [dataset(a, years), dataset(b, years)],
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'CorrelateAI', item: `${ORIGIN}/` },
          { '@type': 'ListItem', position: 2, name: `${a.name} vs ${b.name}`, item: canonical },
        ],
      },
    ],
  }
  const preloads = [a, b].map((d) => `<link rel="preload" href="/data/${d.id}.json" as="fetch" crossorigin data-series>`).join('\n    ')
  const html = setMeta(template, { title, description, url: `${ORIGIN}${pagePath}`, canonical, jsonLd, body, preloads })
  const dir = path.join(dist, pagePath)
  await fs.mkdir(dir, { recursive: true })
  await fs.writeFile(path.join(dir, 'index.html'), html)
}

const urls = [`${ORIGIN}/`, `${ORIGIN}/?view=learn`, `${ORIGIN}/?view=gallery`, ...canonicalPages.map((p) => `${ORIGIN}${lib.pairPath(p.a.id, p.b.id)}`)]
await fs.writeFile(
  path.join(dist, 'sitemap.xml'),
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls
    .map((u) => `  <url><loc>${esc(u)}</loc><lastmod>${today}</lastmod></url>`)
    .join('\n')}\n</urlset>\n`
)
console.log(`prerendered ${pages.length} pair pages (${canonicalPages.length} canonical), sitemap with ${urls.length} URLs`)
