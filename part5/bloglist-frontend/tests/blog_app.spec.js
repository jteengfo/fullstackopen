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

  test.describe('When logged in', () => {
    test.beforeEach(async ({ page }) => {
      await page.getByTestId('username').fill('mario27')
      await page.getByTestId('password').fill('salainen')
      await page.getByRole('button', { name: 'Login' }).click()
    })

    test('a new blog can be created', async ({ page }) => {
      await page.getByRole('button', { name: 'new blog' }).click()

      await page.getByTestId('blog-title').fill('a new blog created from Playwright')
      await page.getByTestId('blog-author').fill('James TEF')
      await page.getByTestId('blog-url').fill('http://example.com')

      await page.getByRole('button', { name: 'create' }).click()

      await expect(page.getByText(
        'A new blog: a new blog created from Playwright by James TEF successfully created'
      ))
        .toBeVisible()
    })

    test('a blog created can be liked', async ({ page }) => {
      await page.getByRole('button', { name: 'new blog' }).click()

      await page.getByTestId('blog-title').fill('a new blog created from Playwright')
      await page.getByTestId('blog-author').fill('James TEF')
      await page.getByTestId('blog-url').fill('http://example.com')

      await page.getByRole('button', { name: 'create' }).click()

      await page.getByRole('button', { name: 'view' }).click()
      await page.getByRole('button', { name: 'like' }).click()
      await expect(page.getByText('likes 1')).toBeVisible()
    })

    test('a blog created can be deleted', async ({ page }) => {
      await page.getByRole('button', { name: 'new blog' }).click()

      await page.getByTestId('blog-title').fill('to be deleted')
      await page.getByTestId('blog-author').fill('James TEF')
      await page.getByTestId('blog-url').fill('http://example.com')

      await page.getByRole('button', { name: 'create' }).click()


      await page.getByRole('button', { name: 'view' }).click()

      await page.getByRole('button', { name: 'delete' }).click()

      await expect(page.getByText('to be deleted', { exact: true })).not.toBeVisible()

    })
  })

})