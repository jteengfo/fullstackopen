import { test, expect } from '@playwright/test'

test.describe('Blog app', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  test('login form is displayed by default', async ({ page }) => {
    await expect(page.getByText('log in to application')).toBeVisible()

    // const usernameElement = await page.getByText('Username')

  })
})