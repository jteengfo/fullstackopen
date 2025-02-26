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

    // create another user for the backend
    await request.post('/api/users', {
      data: {
        name: 'Chet Geppiti',
        username: 'chtgpt',
        password: 'deepseek'
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

    test('only user created blog can see the delete button', async ({ page }) => {
      // create new blog
      await page.getByRole('button', { name: 'new blog' }).click()
      await page.getByTestId('blog-title').fill('to be deleted')
      await page.getByTestId('blog-author').fill('James TEF')
      await page.getByTestId('blog-url').fill('http://example.com')
      await page.getByRole('button', { name: 'create' }).click()

      // logout current user
      await page.getByRole('button', { name: 'logout' }).click()

      // login as diff user
      await page.getByTestId('username').fill('chtgpt')
      await page.getByTestId('password').fill('deepseek')
      await page.getByRole('button', { name: 'Login' }).click()

      // click view and delete button dne
      await page.getByRole('button', { name: 'view' }).click()
      expect(page.getByRole('button', { name: 'delete' })).not.toBeVisible()
    })
    test.describe('several blogs exist', () => {

      test.beforeEach( async ({ page }) => {
        // create first blog
        await page.getByRole('button', { name: 'new blog' }).click()
        await page.getByTestId('blog-title').fill('first blog')
        await page.getByTestId('blog-author').fill('James TEF')
        await page.getByTestId('blog-url').fill('http://example.com')
        await page.getByRole('button', { name: 'Create' }).click()

        await page.getByText('first blog', { exact: true }).waitFor()


        // create second blog
        await page.getByTestId('blog-title').fill('second blog')
        await page.getByTestId('blog-author').fill('James TEF')
        await page.getByTestId('blog-url').fill('http://example.com')
        await page.getByRole('button', { name: 'Create' }).click()

        await page.getByText('second blog', { exact: true }).waitFor()

      })

      test('blogs are arranged in the order according to likes', async ({ page }) => {
        test.setTimeout(30000)
        // // first blog
        const firstBlogContainer = page.getByText('first blog James TEF')

        await firstBlogContainer.getByRole('button', { name: 'view' }).click()

        await firstBlogContainer.getByRole('button', { name: 'like' }).click()

        await expect(firstBlogContainer.getByText('likes 1')).toBeVisible()

        await firstBlogContainer.getByRole('button', { name: 'like' }).click()

        await expect(firstBlogContainer.getByText('likes 2')).toBeVisible()

        // click view second blog

        const secondBlogContainer = page.getByText('second blog James TEF')

        await secondBlogContainer.getByRole('button', { name: 'view' }).click()

        await secondBlogContainer.getByRole('button', { name: 'like' }).click()

        await expect(secondBlogContainer.getByText('likes 1')).toBeVisible()

        await secondBlogContainer.getByRole('button', { name: 'like' }).click()

        await expect(secondBlogContainer.getByText('likes 2')).toBeVisible()

        await secondBlogContainer.getByRole('button', { name: 'like' }).click()

        await expect(secondBlogContainer.getByText('likes 3')).toBeVisible()

        await page.waitForTimeout(1000)

        const blogs = await page.locator('.blog').all()

        const firstBlogText = await blogs[0].textContent()
        expect(firstBlogText).toContain('second blog')

        const secondBlogText = await blogs[1].textContent()
        expect(secondBlogText).toContain('first blog')

      })
    })
  })

})