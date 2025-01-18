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
      console.log('blogs are: ', blogs)  
    }
  }, [user])

  useEffect(() => {
    console.log('Updated blogs:', blogs)
  }, [blogs])

  // useEffect(() => {
  //   const loggedUserJSON = window.localStorage.getItem('loggedBlog')
  // })

  // helper functions 
  const loginForm = (event) => (
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


  // event handlers

  const handleLogin = async (event) => {
    event.preventDefault()

    try {
      // handle post request
      const user = await loginService.login({
        username, password
      })

      // // save user to local storage
      // windows.localStorage.setItem(
      //   'loggedBlogUserApp', JSON.stringify(user)
      // )

      blogService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')
    } catch (exception) {
      setErrorMessage('Error: Wrong Credentials')
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    }
    
  }

  return (
    <div>
    
      {
        user === null
          ? loginForm()
          : <div>
              <h2>blogs</h2>
              <p>{user.name} logged in</p>
              {blogs.map(blog => (
                <Blog key={blog.id} blog={blog}/>
              ))}
            </div>
      }

    </div>
  )
}

export default App