import { test as base, expect, type Page } from '@playwright/test'

/** Fails any test that logs a console error or throws in the page. */
export const test = base.extend<{ page: Page }>({
  page: async ({ page }, use) => {
    const errors: string[] = []
    page.on('pageerror', (e) => errors.push(e.message))
    page.on('console', (m) => m.type() === 'error' && errors.push(m.text()))
    await use(page)
    expect(errors, 'console errors').toEqual([])
  },
})
export { expect }

export const DEFAULT = '/pairs/wb-internet-users--vs--wb-forest-area/'

/** The settled headline r, read from the screen-reader status (the visible number animates). */
export const headline = (page: Page) => page.getByRole('status').filter({ hasText: 'r equals' })

export async function rValue(page: Page) {
  await expect(headline(page)).toContainText('Verdict')
  const text = await headline(page).innerText()
  return text.match(/r equals ([+-]?\d\.\d\d)/)![1]
}
