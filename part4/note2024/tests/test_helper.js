// code included here are for verification steps that
// will be used to all other tests made later on.
// Therefore, its a good idea to extract them to a helper function file
// i.e. this file

const Note = require('../models/note')
const User = require('../models/user')

// initial Notes
const initialNotes = [
  {
    content: 'HTML is easy',
    important: false
  },
  {
    content: 'browser can only execute Javascript',
    important: true
  }
]

const nonExistingId = async () => {
  // create a note
  const note = new Note ({ content: 'willRemoveThisSoon' })

  // save and delete it from db
  await note.save()
  await note.deleteOne()

  // we get the id 
  return note._id.toString()
}

const notesInDb = async () => {
  const notes = await Note.find({})
  return notes.map(note => note.toJSON())
}

const usersInDb = async () => {
  const users = await User.find({})

  return users.map(user => user.toJSON())
}

module.exports = {
  initialNotes,
  nonExistingId,
  notesInDb,
  usersInDb
}