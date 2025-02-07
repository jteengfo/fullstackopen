import { useState } from 'react'

const BlogForm = ({ createBlog }) => {
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')

  // event handler
  const addBlog = (event) => {
    event.preventDefault()
    createBlog({
      title: title,
      author: author,
      url: url
    })

    setTitle('')
    setAuthor('')
    setUrl('')
  }
  return (
    <div>
      <form onSubmit={addBlog}>
        <div>
                    Title:
          <input
            type='text'
            value={title}
            name='Title'
            onChange={({ target }) => setTitle(target.value)}
            id='blog-title'
            data-testid='blog-title'
          />
        </div>
        <div>
                    Author:
          <input
            type='text'
            value={author}
            name='Author'
            onChange={({ target }) => setAuthor(target.value)}
            id='blog-author'
            data-testid='blog-author'
          />
        </div>
        <div>
                    URL:
          <input
            type='text'
            value={url}
            name='URL'
            onChange={({ target }) => setUrl(target.value)}
            id='blog-url'
            data-testid='blog-url'
          />
        </div>
        <button>Create</button>
      </form>
    </div>
  )
}

export default BlogForm