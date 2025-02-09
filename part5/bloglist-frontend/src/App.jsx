import { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'

import BlogForm from './components/BlogForm'
import Togglable from './components/Togglable'


// style
const OKStyle = {
  color: 'green',
  fontStyle: 'italic',
  fontSize: 16,
}

const errorStyle = {
  color: 'red',
  fontStyle: 'italic',
  fontSize: 16
}

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [errorMessage, setErrorMessage] = useState(null)
  const [blogMessage, setBlogMessage] = useState(null)
  const [likeTrigger, setLikeTrigger] = useState(false)

  // event handlers

  const handleLogin = async (event) => {
    event.preventDefault()

    try {
      // handle post request
      const user = await loginService.login({
        username, password
      })

      // save user to local storage
      window.localStorage.setItem(
        'loggedBlogUserApp', JSON.stringify(user)
      )

      blogService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')
    } catch (exception) {
      setErrorMessage('Error: Wrong Credentials')
      setTimeout(() => {
        setErrorMessage(null)
      }, 3000)
    }

  }

  const handleLogout = async (event) => {
    event.preventDefault()
    try {
      window.localStorage.clear()
      window.location.reload()
    } catch (exception) {
      console.log(exception)
    }
  }

  const handleBlogCreate = async (blogObject) => {
    try {
      // send blog obj to db
      await blogService.create(blogObject)

      // get updated blog list
      let updatedBlogList = await blogService.getAll()
      setBlogs(updatedBlogList)
      setBlogMessage(`A new blog: ${blogObject.title} by ${blogObject.author} successfully created`)
      setTimeout(() => {
        setBlogMessage(null)
      }, 5000)

    } catch (exception) {
      setErrorMessage('Error Creating Blog')
      console.log('exception: ', exception)
      setTimeout(() => {
        setErrorMessage(null)
      }, 3000)
    }

  }

  const handleBlogDelete = async (id) => {
    try {
      // delete
      await blogService.deleteBlog(id)
      // update blogs
      let updatedBlogs = await blogService.getAll()
      setBlogs(updatedBlogs)

    } catch (exception) {
      console.log('Error Deleting Blog, ', exception)
    }
  }

  const handleLikeButton = async (id) => {
    try {
      // get blog obj from blogs using id
      const blogToUpdate = blogs.find(blog => blog.id === id)

      // construct updated blog obj
      const updatedBlog = {
        ...blogToUpdate,
        likes: blogToUpdate.likes + 1   // increment by one
      }

      // send updated blog obj to db
      await blogService.update(id, updatedBlog)

      // update current blogs
      let updatedBlogList = await blogService.getAll()
      setBlogs(updatedBlogList)

      setLikeTrigger(!likeTrigger)
    } catch (exception) {
      console.log('Error: ', exception)
    }
  }

  // helper functions
  const loginForm = () => (
    <form>
      <h2>Log in to application</h2>
      <div>
        Username<span> </span>
        <input
          type='text'
          value={username}
          name='Username'
          onChange={({ target }) => setUsername(target.value)}
          data-testid='username'
        />
      </div>
      <div>
        Password <span> </span>
        <input
          type='password'
          value={password}
          name='Password'
          onChange={({ target }) => setPassword(target.value)}
          data-testid='password'
        />
      </div>
      <button onClick={handleLogin}>Login</button>
    </form>
  )

  const blogForm = () => (
    <div>
      <h2>blogs</h2>
      <span>{user.name} logged in </span>
      <button onClick={handleLogout}> Logout </button>
      <br></br>
      <br></br>
      <Togglable buttonLabel='New Blog'>
        <h2>create new blog</h2>
        <BlogForm createBlog={handleBlogCreate}/>
      </Togglable>
      <br></br>
      {blogs.map(blog => (
        <Blog key={blog.id} blog={blog} handleLike={handleLikeButton} handleDelete={handleBlogDelete} user={user}/>
      ))}
    </div>

  )

  const errorView = () => (
    <div style={errorStyle}>
      <p>{errorMessage}</p>
    </div>
  )

  const blogAddView = () => (
    <div style={OKStyle}>
      <p>{blogMessage}</p>
    </div>
  )

  // useEffects

  useEffect(() => {
    if (user) {
      blogService.getAll().then(blogs => {
        blogs.sort((a,b) => a.likes - b.likes)
        setBlogs( blogs )
      })
    }
  }, [user, likeTrigger])


  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogUserApp')
    // if it exists
    if (loggedUserJSON) {
      // get user from json to js obj
      const user = JSON.parse(loggedUserJSON)
      // set user to state var
      setUser(user)
      // set token from user
      blogService.setToken(user.token)
    }
  }, [])

  return (
    <div>
      {errorMessage !== null && errorView()}
      {blogMessage !== null && blogAddView()}
      {
        user === null
          ? loginForm()
          : blogForm()
      }

    </div>
  )
}

export default App