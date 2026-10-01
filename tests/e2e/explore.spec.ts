import { DEFAULT, expect, headline, rValue, test } from './fixtures'

test('home shows a real pair with its verdict and sources', async ({ page }) => {
  await page.goto('/')
  await expect(page).toHaveTitle(/US Internet Users vs US Forest Area: r = \+0\.91/)
  await expect(headline(page)).toContainText('Likely spurious')
  await expect(page.getByRole('link', { name: /World Bank/ }).first()).toHaveAttribute('href', /worldbank/)
  await expect(page.getByRole('img', { name: /^Line chart of/ })).toBeVisible()
})

test('a shared pair link reproduces the same numbers after reload', async ({ page }) => {
  await page.goto('/pairs/wb-gdp--vs--owid-obesity/')
  const r = await rValue(page)
  await page.reload()
  expect(await rValue(page)).toBe(r)
})

test('legacy ?a=&b= links move onto the pair page', async ({ page }) => {
  await page.goto('/?a=wb-gdp&b=owid-obesity')
  await expect(page).toHaveURL(/\/pairs\/wb-gdp--vs--owid-obesity\/$/)
})

test('removing the trend switches every figure to the detrended r', async ({ page }) => {
  await page.goto(DEFAULT)
  expect(await rValue(page)).toBe('+0.91')
  await page.getByRole('button', { name: 'Remove trend' }).click()
  await expect(page.getByRole('button', { name: 'Remove trend' })).toHaveAttribute('aria-pressed', 'true')
  await expect(headline(page)).toContainText('with the trend removed, r equals -0.01')
})

test('swap reverses the pair in the URL; back returns to it', async ({ page }) => {
  await page.goto(DEFAULT)
  await page.getByRole('button', { name: 'Swap A and B' }).click()
  await expect(page).toHaveURL(/wb-forest-area--vs--wb-internet-users/)
  await page.goBack()
  await expect(page).toHaveURL(/wb-internet-users--vs--wb-forest-area/)
})

test('random pair lands on another pair page', async ({ page }) => {
  await page.goto(DEFAULT)
  await page.getByRole('button', { name: 'Random pair' }).click()
  await expect(page).not.toHaveURL(/wb-internet-users--vs--wb-forest-area/)
  await expect(page).toHaveURL(/\/pairs\/[a-z0-9-]+--vs--[a-z0-9-]+\/$/)
  await expect(headline(page)).toContainText('Verdict')
})

test('an unknown dataset falls back to a random pair with a notice', async ({ page }) => {
  await page.goto('/?a=not-a-series&b=wb-gdp')
  await expect(page.getByText('That dataset is no longer available')).toBeVisible()
  await expect(headline(page)).toContainText('Verdict')
})

test('saved pairs survive a reload', async ({ page }) => {
  await page.goto(DEFAULT)
  await page.getByRole('button', { name: 'Save this pair' }).click()
  await page.goto('/?view=saved')
  await page.reload()
  await expect(page.getByRole('heading', { name: 'Saved pairs' })).toBeVisible()
  await expect(page.getByRole('button', { name: /^US Internet Users vs US Forest Area/ })).toBeVisible()
})
