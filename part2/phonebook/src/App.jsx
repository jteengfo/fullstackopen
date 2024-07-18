import { useEffect } from 'react'
import { useState } from 'react'
import axios from  'axios'
import contactService from './services/contacts'
import Persons from './components/Persons'

// const Contact = ({name, number}) => <li key={name}>{name} {number}</li>

const Filter = ({filter, handleFilterChange}) => <input value={filter} onChange={handleFilterChange}/>

const PersonForm = ({addContact, newName, handleNameChange, newNumber, handleNumberChange}) => {
  return (
    <div>
      <form onSubmit={addContact}>
        <div>
          name: <input value={newName} onChange={handleNameChange}/>
        </div>
        <div> number: <input value={newNumber} placeholder='000-000-0000' onChange={handleNumberChange}/></div>
        <div>
          <button type="submit">add</button>
        </div>
      </form>
    </div>
  )
}

const Notification = ({message, color}) => {

  const notificationStyle = {
    fontSize: 16,
    color: color === 'green' ? 'green' : 'red', // green otherwise red
    borderStyle: 'solid',
    padding: 5,
    borderRadius: 5,
    background: 'lightgrey',
  }

  if (message === null) {
    return null
  } else {
    return (
      <div style={notificationStyle}>
        {message}
      </div>
    )
  }
}

// const AddContactBanner = ({id}) => {
//   const AddContactStyle = {
//     fontSize: 16,
//     color: 'green',
//     borderStyle: 'solid',
//     padding: 5,
//     borderRadius: 5,
//     background: 'lightgrey',
//   }

//   return(
//     <div style={AddContactStyle}>
//        Added {id}
//     </div>
//   )
// }

const App = () => {
  const [persons, setPersons] = useState([]) 
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [newFilter, setNewFilter] = useState('')
  const [showAll, setShowAll] = useState(true)
  // const [Banner, setBanner] = useState(null)
  // const [errorMessage, setErrorMessage] = useState('')
  const [notification, setNotification] = useState({message: null, color: 'green'})

  useEffect(() => {
    contactService
      .getAll()
      .then(initialPersons => {
        setPersons(initialPersons)
      })
  }, [])

  const addContact = (event) => {
    event.preventDefault()
    // const name = persons.find(p => p.name === newName)
    const existingContact = persons.find(p => p.name === newName)
    if (existingContact && window.confirm(`${newName} is already added to phonebook,
      replace the old number with a new one?`)) {
        const updatedContactObject = {
          ...existingContact,
          number: newNumber
        }
        contactService
          .update(existingContact.id, updatedContactObject)
          .then(updatedContact => {
            console.log(updatedContact);
            setPersons(persons.map(p => p.id !== updatedContact.id ? p : updatedContact))
            setNewName('')
            setNewNumber('')
            setNotification(
              { message: `${updatedContact.name} number updated`, color: 'green'}
            )
            setTimeout(() => {
              setNotification({message: null, color: 'green'})
            }, 3000);
          })
          .catch(error => {
            setNotification(
              {message: `${newName} has already been removed from the server`, color: 'red'}
            )
            setTimeout(() => {
              setNotification({message: null, color: 'green'})
            }, 3000)
          })
            
        
    } else {
      const contactObject = {
        name: newName,
        number: newNumber,
        // id: persons.length + 1
      }
      contactService
        .create('/api/persons', contactObject)
        .then(newContact => {
          setPersons(persons.concat(newContact))
          setNewName('')
          setNewNumber('')
          setNotification(
            {message: `Added ${newContact.name}`, color: 'green'}
          )
          setTimeout(()=> {
            setNotification(
              {message: null, color: 'green'})
          }, 3000)
        })
        .catch(error => {
          console.log(error.response.data.error)
          setNotification({
            message: `${error.response.data.error}`,
            color: 'red'
          })
          setTimeout(() => {
            setNotification({
              message: null,
              color: 'green'
            })
          }, 3000)
        })
    }
  }

  const deleteContact = (id) => {

    const person = persons.find(p => p.id === id)

    if (person && window.confirm(`Delete ${person.name}?`)) {
      contactService
        .removeUser(id)
        .then(deleteContact => {
          setPersons(persons.filter(p => p.id !== id))
          setNotification({message: `Deleted ${person.name}`, color: 'green'})
          setTimeout(() => {
            setNotification({message: null, color: 'green'})
          }, 3000);
        })
    }
    
  }

  const handleNameChange = (event) => {
    setNewName(event.target.value)
  }

  const handleNumberChange = (event) => {
    setNewNumber(event.target.value)
  }

  const handleFilterChange = (event) => {
    setNewFilter(event.target.value)
  }

  const personsToShow = persons.filter(person =>
    person.name.toLowerCase().includes(newFilter.toLowerCase())
  );
  // console.log('persons to show', personsToShow)
  return (
    <div>
      <h2>Phonebook</h2>
      <div>
        filter shown with <Filter filter={newFilter} handleFilterChange={handleFilterChange}/>
      </div>
      <Notification message={notification.message} color={notification.color} />
      <h2>Add New Contact</h2>
      <PersonForm
        addContact={addContact}
        handleNameChange={handleNameChange}
        handleNumberChange={handleNumberChange}
        newName={newName}
        newNumber={newNumber}/>
      <h2>Numbers</h2>
      <ul>
        <Persons personsToShow={personsToShow} deleteContact={deleteContact}/>
      </ul>
    </div>
  )
}

export default App