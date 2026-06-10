import { test, expect } from '@playwright/test'

test('laser service page renders with price aside + h1', async ({ page }) => {
  await page.goto('/uslugi/depilacja-laserowa-warszawa')
  await expect(page.locator('h1')).toBeVisible({ timeout: 30000 })
  await expect(page.locator('main')).toContainText('zł')
})

test('ru service page loads with lang ru', async ({ page }) => {
  await page.goto('/ru/uslugi/depilacja-laserowa-warszawa')
  await expect(page.locator('html')).toHaveAttribute('lang', 'ru')
  await expect(page.locator('h1')).toBeVisible()
})

test('header Usługi dropdown navigates to a service page', async ({ page }) => {
  // Use a desktop viewport so the desktop nav (min-[960px]) is visible
  await page.setViewportSize({ width: 1280, height: 800 })
  await page.goto('/')

  // The desktop nav button has aria-controls="services-dropdown" and text "Usługi"
  const trigger = page.locator('button[aria-controls="services-dropdown"]')
  await expect(trigger).toBeVisible({ timeout: 30000 })
  await trigger.click()

  // After click, the dropdown panel with role="menu" should appear
  const dropdown = page.locator('#services-dropdown')
  await expect(dropdown).toBeVisible()

  // Click the first service link (menuitem inside the dropdown)
  const link = dropdown.locator('[role="menuitem"]').first()
  await expect(link).toBeVisible()
  await link.click()

  await expect(page).toHaveURL(/\/uslugi\//)
  await expect(page.locator('h1')).toBeVisible()
})

test('unknown service slug 404s', async ({ page }) => {
  const res = await page.goto('/uslugi/nie-istnieje')
  expect(res?.status()).toBe(404)
})
