import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Note from './Note'

test('renders content', () => {
  const note = {
    content: 'Component testing is done with react-testing-library',
    important: true
  }

  render(<Note note={note}/>)

  const element = screen.findByText('Component testing is done with react-testing-library')

  // screen.debug(element)

  expect(element).toBeDefined()

})


test('clicking the button calls event handler once', async () => {
  const note = {
    content: 'Component testing is done with react-testing-library',
    importante: true
  }

  const mockHandler = vi.fn()

  render(
    <Note note={note} toggleImportance={mockHandler}/>
  )

  const user = userEvent.setup()
  const button = screen.getByText('make important')

  await user.click(button)

  // expect mock function to have been called exactly once
  // mock.calls is an array
  expect(mockHandler.mock.calls).toHaveLength(1)
})