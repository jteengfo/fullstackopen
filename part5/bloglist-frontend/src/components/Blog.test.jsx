import { render, screen } from '@testing-library/react'
import Blog from './Blog'
import { expect } from 'vitest'
import userEvent from '@testing-library/user-event'

// 5.13
test('renders blog\'s title and author but not render its URL or number of likes by default', () => {

  const blog = {
    title: 'Understanding React Hooks',
    author: 'Jane Doe',
    url: 'https://example.com/react-hooks',
    likes: 120
  }

  render(<Blog blog={blog}/>)

  // check if title and author are in the document
  expect(screen.getByText('Understanding React Hooks')).toBeVisible()
  expect(screen.getByText('Jane Doe')).toBeVisible()

  // checks if URL and likes are NOT visible (not exist; not the same; one can not be visible but still exists) by default
  const url = screen.getByText('https://example.com/react-hooks')
  expect(url).not.toBeVisible()

  const likes = screen.getByText('120')
  expect(likes).not.toBeVisible()
})

// 5.14
test('blog\'s url and likes are shown when the view button is clicked', async () => {

  const blog = {
    title: 'Understanding React Hooks',
    author: 'Jane Doe',
    url: 'https://example.com/react-hooks',
    likes: 120
  }

  render(<Blog blog={blog}/>)

  // initialize user
  const user = userEvent.setup()
  const button = screen.getByText('view')

  // click button
  await user.click(button)

  // expect both url and likes are visible on screen
  const url = screen.getByText('https://example.com/react-hooks')
  expect(url).toBeVisible()

  const likes = screen.getByText('120')
  expect(likes).toBeVisible()

})

// 5.15
test('event handler is received as props twice when the like button is clicked twice', async () => {

  // define mock handler
  const mockHandleLike = vi.fn()

  // define blog
  const blog = {
    title: 'Understanding React Hooks',
    author: 'Jane Doe',
    url: 'https://example.com/react-hooks',
    likes: 120
  }

  render(<Blog blog={blog} handleLike={mockHandleLike}/>)

  // define user
  const user = userEvent.setup()
  const viewButton = screen.getByText('view')

  await user.click(viewButton)

  const likeButton = screen.getByText('like')

  await user.click(likeButton)
  await user.click(likeButton)

  expect(mockHandleLike.mock.calls).toHaveLength(2)
})
