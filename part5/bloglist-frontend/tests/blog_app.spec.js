import { test, expect } from '@playwright/test'

test.describe('Blog app', () => {

  test.beforeEach(async ({ page, request }) => {
    await page.goto('/')

    // empty db
    await request.post('/api/testing/reset')

    // create user for the backend
    await request.post('/api/users', {
      data: {
        name: 'Mario Luigi',
        username: 'mario27',
        password: 'salainen',
      }
    })
  })

  test('login form is displayed by default', async ({ page }) => {
    await expect(page.getByText('log in to application')).toBeVisible()

    await expect(page.getByTestId('username')).toBeVisible()
    await expect(page.getByTestId('password')).toBeVisible()
  })

  test.describe('Login', () => {

    test('succeeds with correct credentials', async ({ page }) => {
      await page.getByTestId('username').fill('mario27')
      await page.getByTestId('password').fill('salainen')
      await page.getByRole('button', { name: 'Login' }).click()

      await expect(page.getByText('blogs')).toBeVisible()
    })

    test('fails with wrong credentials', async ({ page }) => {
      await page.getByTestId('username').fill('mario27')
      await page.getByTestId('password').fill('wrongpassword')
      await page.getByRole('button', { name: 'Login' }).click()

      await expect(page.getByText('Wrong Credentials')).toBeVisible()

    })

  })

})