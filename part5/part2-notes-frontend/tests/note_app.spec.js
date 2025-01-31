import { test, expect } from '@playwright/test'

test.describe('Note app', () => {
  test.beforeEach( async ({ page, request }) => {
    console.log('hmmmaslkdj')
    await request.post('http://localhost:3001/api/testing/reset')
    await request.post('http://localhost:3001/api/users', {
      data: {
        name: 'Mario',
        username: 'mario27',
        password: 'salainen'
      }
    })
    await page.goto('http://localhost:5173/')
  })

  test('front page can be opened', async ({ page }) => {
    // assign to locator element
    const locator = await page.getByText('Notes')
    // ensures locator is visible in page
    await expect(locator).toBeVisible()

    // done using auxilliary variable
    await expect(page.getByText(
      'Note app, Department of Computer Science, University of Helsinki 2024'
    )).toBeVisible()
  })


  test('user can log in', async ({ page }) => {

    await page.getByRole('button', { name: 'log in' }).click()

    await page.getByTestId('username').fill('mario27')
    await page.getByTestId('password').fill('salainen')

    await page.getByRole('button', { name: 'Login' }).click()

    await expect(page.getByText('Mario logged-in')).toBeVisible()
  })

  test.describe('when logged in', () => {

    test.beforeEach( async ({ page }) => {
      await page.getByRole('button', { name: 'log in' }).click()
      await page.getByTestId('username').fill('mario27')
      await page.getByTestId('password').fill('salainen')
      await page.getByRole('button', { name: 'Login' }).click()

      await expect(page.getByText('Mario logged-in')).toBeVisible()
    })

    test('a new note can be created', async ({ page }) => {
      await page.getByRole('button', { name: 'new note' }).click()
      await page.getByRole('textbox').fill('a note created by playwright')
      await page.getByRole('button', { name: 'save' }).click()
      await expect(page.getByText('a note created by playwright')).toBeVisible()
    })

    test.describe('a note exists', () => {
      test.beforeEach(async ({ page }) => {
        await page.getByRole('button', { name: 'new note' }).click()
        await page.getByRole('textbox').fill('another note by playwright')
        await page.getByRole('button', { name: 'save' }).click()
      })

      test('importance can be changed', async ({ page }) => {
        await expect(page.getByText('another note by playwright')).toBeVisible()
        await page.getByRole('button', { name: 'make not important' }).click()
        await expect(page.getByText('make important')).toBeVisible()
      })
    })
  })
})
