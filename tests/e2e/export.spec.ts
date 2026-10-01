import fs from 'node:fs/promises'
import { DEFAULT, expect, test } from './fixtures'

test.beforeEach(async ({ page }) => {
  await page.goto(DEFAULT)
  await page.getByRole('button', { name: 'Download' }).click()
})

test('PNG export produces a share card image', async ({ page }) => {
  const [dl] = await Promise.all([page.waitForEvent('download'), page.getByRole('menuitem', { name: 'Image (PNG)' }).click()])
  const file = await fs.readFile((await dl.path())!)
  expect(dl.suggestedFilename()).toBe('wb-internet-users_vs_wb-forest-area.png')
  expect(file.subarray(1, 4).toString()).toBe('PNG')
  expect(file.length).toBeGreaterThan(50_000)
})

test('CSV export carries sources, stats and the canonical link', async ({ page }) => {
  const [dl] = await Promise.all([page.waitForEvent('download'), page.getByRole('menuitem', { name: 'Data (CSV)' }).click()])
  const csv = await fs.readFile((await dl.path())!, 'utf8')
  expect(csv).toContain('data.worldbank.org/indicator/IT.NET.USER.ZS')
  expect(csv).toMatch(/r = 0\.9\d+, n = 34/)
  expect(csv).toContain('https://correlateai.victorsaly.com/pairs/wb-internet-users--vs--wb-forest-area/')
})
