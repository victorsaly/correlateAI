import { expect, test } from './fixtures'

test('pair pages are prerendered for crawlers (no JS needed)', async ({ request }) => {
  const html = await (await request.get('/pairs/wb-gdp--vs--owid-obesity/')).text()
  expect(html).toMatch(/<title>US GDP \(current US\$\) vs US Adult Obesity: r = [+-]\d\.\d\d/)
  expect(html).toContain('<h1>US GDP (current US$) vs US Adult Obesity</h1>')
  expect(html).toContain('"@type":"Dataset"')
  // both orderings share one canonical URL
  const reversed = await (await request.get('/pairs/owid-obesity--vs--wb-gdp/')).text()
  const canonical = /<link rel="canonical" href="([^"]+)"/
  expect(html.match(canonical)![1]).toBe(reversed.match(canonical)![1])
})

test('sitemap lists pair pages; 404 page is real and not indexed', async ({ request }) => {
  const sitemap = await (await request.get('/sitemap.xml')).text()
  expect(sitemap.match(/<loc>/g)!.length).toBeGreaterThan(500)
  // GitHub Pages serves 404.html (with status 404) for unknown paths; vite preview
  // falls back to the SPA instead, so check the page itself.
  const notFound = await (await request.get('/404.html')).text()
  expect(notFound).toContain('<meta name="robots" content="noindex" />')
  expect(notFound).not.toContain('location.replace')
})
