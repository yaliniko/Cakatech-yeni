import { test, expect } from '@playwright/test'

test.describe('Frontend', () => {
  test('can go on homepage', async ({ page }) => {
    await page.goto('http://localhost:3000')

    await expect(page).toHaveTitle(/Çakatech/)
    await expect(page.locator('h1').first()).toContainText('Fikirden')
  })

  test('serves English under /en', async ({ page }) => {
    await page.goto('http://localhost:3000/en')

    await expect(page.locator('html')).toHaveAttribute('lang', 'en')
    await expect(page.locator('h1').first()).toContainText('From idea')
  })

  test('shows the site 404 for unknown paths', async ({ page }) => {
    const response = await page.goto('http://localhost:3000/boyle-bir-sayfa-yok')

    expect(response?.status()).toBe(404)
    await expect(page.locator('h1').first()).toContainText('Sayfa bulunamadı')
  })
})
