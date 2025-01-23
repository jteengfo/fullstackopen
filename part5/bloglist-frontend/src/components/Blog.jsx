import { useState } from 'react'

const Blog = ({ blog, handleLike, handleDelete }) => {
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
    <div style={blogStyle}>
      {blog.title} <span> </span>
      <button onClick={toggleVisibility}>view</button>
      <div style={hideWhenVisible}>
        {blog.url}
        <br></br>
        <span>likes </span><span>{blog.likes} </span>
        <button onClick={() => handleLike(blog.id)}>like</button>
        <br></br>
        {blog.author}
        <br></br>
        <button onClick={() => handleDelete(blog.id)}>Delete</button>
      </div>
    </div>
  )
}

export default Blog