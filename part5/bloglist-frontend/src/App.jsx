import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [errorMessage, setErrorMessage] = useState(null)

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
      <div>
        Username
        <input
          type='text'
          value={username}
          name='Username'
          onChange={({target}) => setUsername(target.value)}
        />
      </div>
      <div>
        Password
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

  const errorView = () => (
    <div>
      <p>{errorMessage}</p>
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
    window.localStorage.clear()
    window.location.reload()
  }

  return (
    <div>
      {errorMessage !== null && errorView()}
      {
        user === null
          ? loginForm()
          : <div>
              <h2>blogs</h2>
              <p>{user.name} logged in</p>
              <button onClick={handleLogout}> Logout </button>
              {blogs.map(blog => (
                <Blog key={blog.id} blog={blog}/>
              ))}
            </div>
      }

    </div>
  )
}

export default App