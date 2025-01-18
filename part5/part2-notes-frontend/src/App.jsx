import { useState, useEffect } from 'react'
import Note from './components/Note'
import Notification from './components/Notification'
import noteService from './services/notes'
import loginService from './services/login'

const Footer = () => {
  const footerStyle = {
    color: 'green',
    fontStyle: 'italic',
    fontSize: 16,
  }

  return (
    <div style={footerStyle}>
      <br/>
      <em>
        Note app, Department of Computer Science, University of Helsinki 2024
      </em>
    </div>
  )
}

const App = () => {
  const [notes, setNotes] = useState([])
  const [newNote, setNewNote] = useState('')
  const [showAll, setShowAll] = useState(false)
  const [errorMessage, setErrorMessage] = useState(null)

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)

  useEffect(() => {
    noteService
      .getAll()
      .then(initialNotes => {
        setNotes(initialNotes)
      })
  }, [])


  useEffect(() => {
    // get user in JSON format 
    const loggedUserJSON = window.localStorage.getItem('loggedNoteappUser')

    // if exists, parse back JS obj, set user and send token to noteService
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      noteService.setToken(user.token)
    }
  }, [])

  const addNote = (event) => {
    event.preventDefault()
    const noteObject = {
      content: newNote,
      important: Math.random() > 0.5,
      id: notes.length + 1,
    }
    
    noteService
      .create(noteObject)
      .then(returnedNote => {
          setNotes(notes.concat(returnedNote))
          setNewNote('')
      })
  }
  // helper functions 
  /**
   * arrow functions with parenthesis (not curly braces)
   * invokes an implicit return otherwise when using curly braces
   * we need to explicitly type return ie.:
   * return (
   *  <form ...
   * )
   */
  const loginForm = () => (
    <form onSubmit={handleLogin}>
      <div>
        username
          <input
            type='text'
            value={username}
            name='Username'
            onChange={({ target }) => setUsername(target.value)}
          />
      </div>
      <div>
        password
          <input
            type='password'
            value={password}
            name='Password'
            onChange={({ target }) => setPassword(target.value)}
          />
      </div>
      <button type='submit'> login </button>
    </form>
  )

  const noteForm = () => (
    <form onSubmit={addNote}>
      <input
          value={newNote}
          onChange={handleNoteChange}
        />
      <button type="submit">save</button>
    </form> 
  )

  // event handlers
  const handleLogin = async (event) => {
    event.preventDefault()
    
    try {
      const user = await loginService.login({
        username, password
      })

      // saving logged in user details to local storage
      window.localStorage.setItem(
        'loggedNoteappUser', JSON.stringify(user)
      )

      noteService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')
    } catch (exception) {
      setErrorMessage('Wrong Credentials')
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    }
  }

  const handleLogout = async (event) => {
    event.preventDefault()
    try {
      console.log('pressed logout')
      window.localStorage.removeItem('loggedNoteappUser')
      window.location.reload()
    } catch (exception) {
      console.log(exception)
    }
  }

  const handleNoteChange = (event) => {
    setNewNote(event.target.value)
  }

  const toggleImportanceOf = (id) => {
    const note = notes.find(n => n.id === id)
    const changedNote = {...note, important: !note.important}

    noteService
      .update(id, changedNote)
      .then(returnedNote => {
        setNotes(notes.map(note => note.id !== id ? note : returnedNote))
      })
      .catch(error => {
        setErrorMessage(
          `Note ${note.content} was already removed from the server`
          )
        setTimeout(() => {
          setErrorMessage(null)
        }, 5000)
        setNotes(notes.filter(notes => notes.id !== id))
      })
  }

  const notesToShow = showAll
    ? notes
    : notes.filter(note => note.important)

  return (
    <div>
      <h1>Notes</h1>

      <Notification message={errorMessage}/>
      
      {
        user === null
          ? loginForm()
          : <div>
              <p>{user.name} logged-in </p>
              {noteForm()}
              <button onClick={handleLogout}> Logout </button>
            </div>
      }

      <div>
        <button onClick={() => setShowAll(!showAll)}>
          show {showAll ? 'important' : 'all' }
        </button>
      </div>      
      <ul>
        {notesToShow.map(note => 
          <Note 
            key={note.id} 
            note={note} 
            toggleImportance={()=> toggleImportanceOf(note.id)} />
        )}
      </ul>
      <Footer/>
    </div>
  )
}

export default App