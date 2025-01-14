// Router
// Note model

const notesRouter = require('express').Router()
const Note = require('../models/note')
const User = require('../models/user')
const jwt = require('jsonwebtoken')

// get all notes and return them as JSON
notesRouter.get('/', async (request, response) => {
  const notes = await Note.find({}).populate('user', { username: 1, name: 1})
  response.json(notes)
})


// get token helper function
const getTokenFrom = request => {
  const authorization = request.get('authorization')
  if (authorization && authorization.startsWith('Bearer ')) {
    return authorization.replace('Bearer ', '')
  }
  return null
}

// get a single note 
notesRouter.get('/:id', async (request, response) => {
  const note = await Note.findById(request.params.id)
  if (note) {
    response.json(note)
  } else {
    response.status(404).end()
  }
})

// create a note 
notesRouter.post('/', async (request, response, next) => {
  // create a note body from response
  const body = request.body

  // token
  const decodedToken = jwt.verify(getTokenFrom(request), process.env.SECRET)
  if(!decodedToken.id) {
    return response.status(401).json({ error: 'token invalid'})
  }

  // get user by id
  const user = await User.findById(decodedToken.id)

  // create new Note that includes user id 
  const note = new Note({
    content: body.content,
    important: body.important || false,
    user: user.id
  })
  
  const savedNote = await note.save()

  // concat new note created to array of notes for the user
  user.notes = user.notes.concat(savedNote._id)
  await user.save()

  response.status(201).json(savedNote)

})

notesRouter.delete('/:id', async (request, response) => {
  await Note.findByIdAndDelete(request.params.id)
  response.status(204).end()
})


// update a note
notesRouter.put('/:id', (request, response, next) => {

  const body = request.body

  const note = {
    content: body.content,
    important: body.important,
  }

  // {new: true} returns the updates note instead of the original one (default) 
  Note.findByIdAndUpdate(request.params.id, note, { new: true})
    .then(updatedNote => {
      response.json(updatedNote)
    })
    .catch(error => next(error))
})

module.exports = notesRouter 