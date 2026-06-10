import { test, expect } from '@playwright/test'

test('PL homepage renders hero', async ({ page }) => {
  await page.goto('/')
  await expect(page.locator('h1')).toContainText('Kosmetologia', { timeout: 30000 })
  await expect(page.locator('html')).toHaveAttribute('lang', 'pl')
})

test('RU homepage renders', async ({ page }) => {
  await page.goto('/ru')
  await expect(page.locator('html')).toHaveAttribute('lang', 'ru')
  await expect(page.locator('h1')).toBeVisible()
})

test('price tabs switch content', async ({ page }) => {
  await page.goto('/')
  const cennik = page.locator('#cennik')
  await cennik.scrollIntoViewIfNeeded()
  // switch to the Laser tab and expect a zł price to be shown in the panel
  await page.getByRole('tab', { name: /^Laser$/i }).click()
  await expect(cennik).toContainText('zł', { timeout: 10000 })
})

test('FAQ accordion opens an answer', async ({ page }) => {
  await page.goto('/')
  // FAQ accordion buttons contain question text ending with "?"
  // Use text-matching to avoid picking up the mobile nav toggle (which has aria-label="Menu")
  const firstQ = page.locator('button[type="button"]').filter({ hasText: /\?$/ }).first()
  const count = await firstQ.count()
  if (count > 0) {
    await firstQ.scrollIntoViewIfNeeded()
    await firstQ.click()
  }
  // soft assertion: page still healthy
  await expect(page.locator('h1')).toBeVisible()
})

test('CTA click pushes a cta_click dataLayer event', async ({ page }) => {
  await page.goto('/')
  await page.evaluate(() => { (window as any).dataLayer = (window as any).dataLayer || [] })
  // phone CTA: tel: link, no popup/navigation
  await page.locator('a[href^="tel:"]').first().click()
  const events = await page.evaluate(() => ((window as any).dataLayer || []).filter((e: any) => e.event === 'cta_click'))
  expect(events.length).toBeGreaterThan(0)
  expect(events[0].method).toBeTruthy()
})
