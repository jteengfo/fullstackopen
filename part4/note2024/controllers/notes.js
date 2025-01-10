// Router
// Note model

const notesRouter = require('express').Router()
const Note = require('../models/note')

// get all notes and return them as JSON
notesRouter.get('/', async (request, response) => {
  const notes = await Note.find({})
  response.json(notes)
})

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
  const note = new Note({
    content: body.content,
    important: body.important || false,
  })
  
  const savedNote = await note.save()
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