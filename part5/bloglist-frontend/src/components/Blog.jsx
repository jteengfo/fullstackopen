import { useState } from 'react'

const Blog = ({ blog, handleLike, handleDelete, user }) => {
  // state variables
  const [visible, setVisible] = useState(false)

  // styles
  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  const hideWhenVisible = { display: visible ? '' : 'none' }

  // event handler
  const toggleVisibility = () => {
    setVisible(!visible)
  }

  return (
    <div style={blogStyle} className='blog'>
      <span className='blog-title'>{blog.title} </span>
      <span className='blog-author'>{blog.author} </span>
      <button onClick={toggleVisibility}>view</button>

      <div style={hideWhenVisible} className='blog-details'>
        <span className='blog-url'>{blog.url}</span>
        <br />
        <span>likes </span>
        <span className='blog-likes'>{blog.likes} </span>
        <button onClick={() => handleLike(blog.id)}>like</button>
        <br />
        {user && blog.user.username === user.username && (
          <button onClick={() => handleDelete(blog.id)}>Delete</button>
        )}
      </div>
    </div>
  )
}

export default Blog