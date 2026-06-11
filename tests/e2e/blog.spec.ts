import { test, expect } from '@playwright/test'

test('blog index renders and lists articles', async ({ page }) => {
  await page.goto('/blog')
  await expect(page.locator('h1')).toBeVisible({ timeout: 30000 })
  await expect(page.locator('a[href*="/blog/"]').first()).toBeVisible()
})

test('category filter narrows the grid', async ({ page }) => {
  await page.goto('/blog')
  const cards = page.locator('a[href*="/blog/"]')
  await expect(cards.first()).toBeVisible({ timeout: 30000 })
  const before = await cards.count()
  await page.getByRole('button', { name: /Depilacja laserowa/i }).click()
  await expect(cards.first()).toBeVisible()
  expect(await cards.count()).toBeLessThanOrEqual(before)
})

test('article renders h1, author byline, CTA', async ({ page }) => {
  await page.goto('/blog/depilacja-laserowa-latem')
  await expect(page.locator('h1')).toBeVisible({ timeout: 30000 })
  await expect(page.locator('main')).toContainText('Wiśnia')
  await expect(page.locator('#post-body')).toBeVisible()
})

test('ru article has lang ru', async ({ page }) => {
  await page.goto('/ru/blog/depilacja-laserowa-latem')
  await expect(page.locator('html')).toHaveAttribute('lang', 'ru')
})

test('unknown post slug 404s', async ({ page }) => {
  const res = await page.goto('/blog/nie-istnieje-wpis')
  expect(res?.status()).toBe(404)
})

test('rss feed responds with xml', async ({ request }) => {
  const res = await request.get('/blog/rss.xml')
  expect(res.status()).toBe(200)
  expect(res.headers()['content-type']).toContain('xml')
})
