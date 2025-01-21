import { useState, useEffect } from 'react'
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
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')

  useEffect(() => {
    if (user) {
      blogService.getAll().then(blogs =>
        setBlogs( blogs )
      ) 
    }
  }, [user]) 


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
          onChange={({target}) => setUsername(target.value)}
        />
      </div>
      <div>
        Password <span> </span>
        <input
          type='password'
          value={password}
          name='Password'
          onChange={({ target }) => setPassword(target.value)}
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
        <BlogForm
          title={title}
          author={author}
          url={url}
          handleSubmit={handleBlogCreate}
          handleTitleChange={({ target }) => setTitle(target.value)}
          handleAuthorChange={({ target }) => setAuthor(target.value)}
          handleURLChange={({ target }) => setUrl(target.value)}
        />
      </Togglable>
      
      <br></br>
      {blogs.map(blog => (
        <Blog key={blog.id} blog={blog}/>
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

  const handleBlogCreate = async (event) => {
    event.preventDefault()
    try {

      // send blog obj to db
      await blogService.create({
        title: title,
        author: author,
        url: url
      })

      // get updated blog list 
      const updatedBlogList = await blogService.getAll()
      setBlogs(updatedBlogList)
      setBlogMessage(`A new blog: ${title} by ${author} successfully created`)
      setTimeout(() => {
        setBlogMessage(null)
      }, 5000)

      // reset fields
      setTitle('')
      setAuthor('')
      setUrl('')

    } catch (exception) {
      setErrorMessage('Error Creating Blog')
      setTimeout(() => {
        setErrorMessage(null)
      }, 3000)
    }

  }

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