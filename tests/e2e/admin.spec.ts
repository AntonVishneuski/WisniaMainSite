import { test, expect } from '@playwright/test'

test('admin login screen renders', async ({ page }) => {
  await page.goto('/admin')
  await expect(page.locator('input[type="email"], input[name="email"]').first()).toBeVisible({ timeout: 30000 })
})
