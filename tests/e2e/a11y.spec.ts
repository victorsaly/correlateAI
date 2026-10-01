import AxeBuilder from '@axe-core/playwright'
import { DEFAULT, expect, headline, test } from './fixtures'

for (const scheme of ['light', 'dark'] as const) {
  for (const [name, url] of [['explore', DEFAULT], ['gallery', '/?view=gallery'], ['saved', '/?view=saved'], ['learn', '/?view=learn']]) {
    test(`no WCAG 2.2 AA violations: ${name} (${scheme})`, async ({ page }) => {
      await page.emulateMedia({ colorScheme: scheme })
      await page.goto(url)
      await expect(page.locator('main h1').first()).toBeAttached()
      if (name === 'explore') await expect(headline(page)).toContainText('Verdict')
      if (name === 'gallery') await expect(page.getByRole('heading', { name: 'Holds up after removing the trend' })).toBeVisible()
      const { violations } = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa']).analyze()
      expect(violations.map((v) => `${v.id}: ${v.nodes.map((n) => n.target.join(' ')).join(', ')}`)).toEqual([])
    })
  }
}

test('skip link moves focus past the header', async ({ page, isMobile }) => {
  test.skip(isMobile, 'keyboard path is a desktop check')
  await page.goto(DEFAULT)
  await page.keyboard.press('Tab')
  await expect(page.getByRole('link', { name: 'Skip to content' })).toBeFocused()
  await page.keyboard.press('Enter')
  await expect(page.locator('#main')).toBeFocused()
})
