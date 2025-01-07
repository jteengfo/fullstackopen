const notesRouter = require('express').Router()
const Note = require('../models/note')
const User = require('../models/user')
const jwt = require('jsonwebtoken')

// without async/await
// notesRouter.get('/', async(request, response, next) => {
//   Note.find({})
//     .then(notes => {
//       response.json(notes)
//     })
//     .catch(error => next(error))
// })


// helper function for token; isolates token from the authorization header
// request.get is used to get the value from the authorization header
const getTokenFrom = request => {
  const authorization = request.get('authorization')
  if (authorization && authorization.startsWith('Bearer ')) {
    return authorization.replace('Bearer ', '')
  }
  return null
}


notesRouter.get('/', async(request, response) => {
  const notes = await Note.find({}).populate('user', { username: 1, name: 1 })
  response.json(notes)
})

notesRouter.get('/:id', async (request, response) => {

  const note = await Note.findById(request.params.id)
  if (note) {
    response.json(note)
  } else {
    response.status(404).end()
  }

})

notesRouter.delete('/:id', async (request, response, next) => {
  try {
    await Note.findByIdAndDelete(request.params.id)
    response.status(204).end()
  } catch (exception) {
    next(exception)
  }
})

notesRouter.post('/', async (request, response) => {

  const body = request.body

  const decodedToken = jwt.verify(getTokenFrom(request), process.env.SECRET)

  if (!decodedToken.id) {
    return response.status(401).json({ error: 'token invalid' })
  }

  const user = await User.findById(decodedToken.id)

  if (!body.content) {
    return response.status(400).end()
  }

  const note = new Note({
    content: body.content,
    important: body.important === undefined ? false : body.important,
    user: user.id
  })

  const savedNote = await note.save()

  user.notes = user.notes.concat(savedNote._id)
  await user.save()

  response.status(201).json(savedNote)
})

notesRouter.put('/:id', (request, response, next) => {
  // const body = request.body

  // const note = {
  //   content: body.content,
  //   important: body.important
  // }

  // normally updatedNote is the original note found by the method from the db but
  // with the {new : true} parameter added, it uses the new js object, note, instead
  Note.findByIdAndUpdate(
    request.params.id,
    // eslint-disable-next-line no-undef
    { content, important },
    { new : true, runValidators: true, context: 'query' }
  )
    .then(updatedNote => {
      console.log(updatedNote)
      response.json(updatedNote)
    })
    .catch(error => next(error))
})

module.exports = notesRouter