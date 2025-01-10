// goal is to execute test involving http request through the rest api 

const { test, after, beforeEach } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const Note = require('../models/note')
const helper = require('./test_helper')

const api = supertest(app)

// beforeEach function
beforeEach( async () => {
    // delete all notes in db
    await Note.deleteMany({})
    console.log('cleared')

    // assign to noteObject all notes (in array) from initialNotes turned to Note object (mongoose objects)
    const noteObjects = helper.initialNotes
      .map(note => new Note(note))
    
    // assign to promiseArray all promises (array) of saving notes to db
    const promiseArray = noteObjects.map(note => note.save())

    // tranforms an array of promises into one that is then resolved once all are also resolved 
    await Promise.all(promiseArray)
})

test('notes are returned as json', async () => {
    await api
        .get('/api/notes')
        .expect(200)
        .expect('Content-Type', /application\/json/)
})

test('there are two notes', async() => {
    const response = await api.get('/api/notes')

    assert.strictEqual(response.body.length, helper.initialNotes.length)
})

test('the first note is about HTTP methods', async() => {
    const response = await api.get('/api/notes')

    const contents = response.body.map(note => note.content)

    assert(contents.includes('HTML is easy'))
})

// test a note can be added and returns a 201
test('a valid note can be added', async() => {
  // create note
  const newNote = {
    content: 'async/await simplifies making async calls',
    important: true,
  }

  // sent note to db 
  await api
    .post('/api/notes')
    .send(newNote)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  // get all notes
  const notesAtEnd = await helper.notesInDb()
  // map through all notes and get content
  const contents = notesAtEnd.map(result => result.content)

  // verify response length and initial notes + 1 are equal
  assert.strictEqual(notesAtEnd.length, helper.initialNotes.length + 1)

  // verify newNote content is included in contents
  assert(contents.includes('async/await simplifies making async calls'))

})

// test that a note without content will be added
test('a note without content is not added', async() => {
  // create new note
  const newNote = {
    important: true,
  }
  // send note to db
  await api
    .post('/api/notes/')
    .send(newNote)
    .expect(400)
  
  // get all notes from db
  const response = await api.get('/api/notes')

  // if note isnt added, response length === initialnotes length
  assert.strictEqual(response.body.length, helper.initialNotes.length)
})

test('a specific note can be viewed', async () => {
  const notesAtStart = await helper.notesInDb()

  const noteToView = notesAtStart[0]

  const resultNote = await api
    .get(`/api/notes/${noteToView.id}`)
    .expect(200)
    .expect('Content-Type', /application\/json/)

  assert.deepStrictEqual(resultNote.body, noteToView)
})

test('a note can be deleted', async () => {

  const notesAtStart = await helper.notesInDb()

  const noteToDelete = notesAtStart[0]

  await api
    .delete(`/api/notes/${noteToDelete.id}`)
    .expect(204)
  
  const notesAtEnd = await helper.notesInDb()
  const contents = notesAtEnd.map(note => note.content)

  assert(!contents.includes(noteToDelete.content))

  assert.strictEqual(notesAtEnd.length, helper.initialNotes.length - 1)
})

after(async () => {
    await mongoose.connection.close()
})