import { test, expect } from '@playwright/test'
import { loginWith, createNote } from './helper'

test.describe('Note app', () => {
  test.beforeEach( async ({ page, request }) => {
    await request.post('/api/testing/reset')
    await request.post('/api/users', {
      data: {
        name: 'Mario',
        username: 'mario27',
        password: 'salainen'
      }
    })
    await page.goto('/')
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
    await loginWith(page, 'mario27', 'salainen')
    await expect(page.getByText('Mario logged-in')).toBeVisible()
  })

  test('login fails with wrong password', async ({ page }) => {
    await loginWith(page, 'mario27', 'wrongpassword')
    await page.getByRole('button', { name: 'Login' }).click()
    await expect(page.getByText('Wrong Credentials')).toBeVisible()

    // if want to test error message printed in the right place -- use css locator
    const errorDiv = await page.locator('.error')
    await expect(errorDiv).toContainText('Wrong Credentials')

    // if want to check css style; color of message is red and border exists:
    await expect(errorDiv).toHaveCSS('border-style', 'solid')
    await expect(errorDiv).toHaveCSS('color', 'rgb(255, 0, 0)')

    await expect(page.getByText('Mario logged in')).not.toBeVisible()
  })

  test.describe('when logged in', () => {

    test.beforeEach( async ({ page }) => {
      await loginWith(page, 'mario27', 'salainen')
      await expect(page.getByText('Mario logged-in')).toBeVisible()
    })

    test('a new note can be created', async ({ page }) => {
      await createNote(page, 'a note created by playwright')
      await expect(page.getByText('a note created by playwright')).toBeVisible()
    })

    test.describe('several note exists', () => {
      test.beforeEach(async ({ page }) => {
        await createNote(page, 'first note')
        await createNote(page, 'second note')
        await createNote(page, 'third note')
      })

      test('importance can be changed', async ({ page }) => {
        await page.pause()
        // note is inside span check Note.jsx
        const otherNoteText = page.getByText('second note')
        // '..' retrieves the parent element
        const otherNoteElement = otherNoteText.locator('..')

        await otherNoteElement
          .getByRole('button', { name: 'make not important' }).click()
        await expect(otherNoteElement.getByText('make important')).toBeVisible()

      })
    })
  })
})
