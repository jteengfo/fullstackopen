// const http = require("http") // this is a commonJS module synxtax; ES6 Modules would be import http from 'http'
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
require('dotenv').config()
const Note = require('./models/note')



// configuration
const app = express()

morgan.token('post', (request) => {
  if (request.method === 'POST' && request.body) {
    return JSON.stringify(request.body)
  }
  return ''
})

const logNonPost = (request, response, next) => {
  if (request.method !== 'POST') {
    morgan('tiny')(request, response, next)
  } else {
    next()
  }
}

// these are called middleware
app.use(express.json()) // json to object to be tied to the request body before put to route
app.use(morgan('tiny'))
app.use(logNonPost)
app.use(cors())

app.use(morgan(':method :url :status :response-time ms :post', {
  skip: (request) => request.method !== 'POST' || !request.body
}))
const requestLogger = (request, response, next) => {
  console.log('Method:', request.method)
  console.log('Path:  ', request.path)
  console.log('Body:  ', request.body)
  console.log('---')
  next()
}

// let notes = [
//     {
//       id: 1,
//       content: "HTML is easy",
//       important: true
//     },
//     {
//       id: 2,
//       content: "Browser can execute only JavaScript",
//       important: false
//     },
//     {
//       id: 3,
//       content: "GET and POST are the most important methods of HTTP protocol",
//       important: true
//     }
//   ]

app.get('/', (request, response) => {
  response.send('<h1>Hello World</h1>')
})

app.get('/api/notes', (request, response, next) => {
  Note.find({})
    .then(notes => {
      response.json(notes)
    })
    .catch(error => next(error))
})

app.get('/api/notes/:id', (request, response, next) => {
  // const id = Number(request.params.id)
  // const note = notes.find(note => note.id === id)


  // if (note) {
  //     response.json(note)
  // } else {
  //     response.status(404).end()
  // }
  Note.findById(request.params.id)
    .then(note => {
      // we find the note
      if (note) {
        response.json(note)
      } else {
        // note does not exist
        response.status(404).end()
      }
    })
  // if findbyid throw an error if id is invalid
  // .catch(error => {
  //   console.log(error)
  //   response.status(400).send({error: 'malformatted id'})
  // })
    .catch(error => next(error))

})

app.delete('/api/notes/:id', (request, response, next) => {
  // const id = Number(request.params.id)
  // notes = notes.filter(note => note.id !== id) // we only retain notes that is not that id

  // response.status(204).end()
  Note.findByIdAndDelete(request.params.id)
    .then(() => {
      response.status(204).end()
    })
    .catch(error => next(error))
})


// const generateID = () => {
//   const maxID = notes.length > 0
//     ? Math.max(...notes.map(n => n.id))
//     : 0;

//     return maxID + 1
// }

app.post('/api/notes', (request, response, next) => {

  const body = request.body

  if (!body.content) {
    return response.status(400).json({
      error: 'content missing'
    })
  }

  // const note = {
  //   content: body.content,
  //   important: Boolean(body.important) || false,
  //   id: generateID()
  // }

  const note = new Note({
    content: body.content,
    important: body.important || false
  })

  // notes = notes.concat(note)
  // response.json(note)
  note.save()
    .then( savedNote => {
      response.json(savedNote)
    })
    .catch(error => next(error))

})

app.put('/api/notes/:id', (request, response, next) => {
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

// apparently middlewares can also be used after routes
const unknownEndpoint = (request, response) => {
  response.status(404).send({ 'error': 'unknown endpoint' })
}


app.use(requestLogger)
app.use(unknownEndpoint)

const errorHandler = (error, request, response, next) => {
  console.log(error.message)

  // .json sets content-type to app/json and is used to be more
  // explicit of sending a json data.
  // is used more often as convention to improve readability
  // and consistency
  if (error.name === 'CastError') {
    return response.status(404).send({ error: 'malformatted' })
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  }

  next(error)
}

app.use(errorHandler)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on ${PORT}`)
})

