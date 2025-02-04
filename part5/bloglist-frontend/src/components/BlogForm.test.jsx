import { render, screen } from '@testing-library/react'
import { expect } from 'vitest'
import userEvent from '@testing-library/user-event'
import BlogForm from './BlogForm'


// 5.16
test('event handler is called received as props when new blog is created', async() => {
  // define mock handler
  const mockCreateBlog = vi.fn()

  // define user

  const user = userEvent.setup()

  // define blog
  const blog = {
    title: 'Understanding React Hooks',
    author: 'Jane Doe',
    url: 'https://example.com/react-hooks',
    likes: 120
  }

  // render form with mockhandler
  const { container } = render(<BlogForm createBlog={mockCreateBlog}/>)

  // fill out form fields
  const titleInput = container.querySelector('#blog-title')
  const authorInput = container.querySelector('#blog-author')
  const urlInput = container.querySelector('#blog-url')

  await user.type(titleInput, 'Understanding React Hooks')
  await user.type(authorInput, 'Jane Doe')
  await user.type(urlInput, 'https://example.com/react-hooks')

  // submit form
  const submitButton = screen.getByText('Create')
  await user.click(submitButton)

  // verify mockhandler called correctly
  expect(mockCreateBlog.mock.calls).toHaveLength(1)
  expect(mockCreateBlog.mock.calls[0][0]).toStrictEqual({
    title: 'Understanding React Hooks',
    author: 'Jane Doe',
    url: 'https://example.com/react-hooks'
  })

})