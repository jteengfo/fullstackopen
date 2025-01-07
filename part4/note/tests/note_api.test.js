const { test, after, beforeEach, describe } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const Note = require('../models/note')
const helper = require('./test_helper')
const User = require('../models/user')
const bcrypt = require('bcrypt')


const api = supertest(app)

// by doing this, were able to make sure the state of the database
// IS THE SAME before we start testing
// i.e. delete all entries and add exactly two same notes to the db

beforeEach( async () => {
  // creating a test user
  await User.deleteMany({})

  const user = {
    username: 'testUser',
    name: 'test',
    password: 'testpassword'
  }

  await api
    .post('/api/users')
    .send(user)
    .expect(201)

  // log in
  const credentials = {
    username: 'testUser',
    password: 'testpassword'
  }

  await api
    .post('/api/login')
    .send(credentials)
    .expect(200)

  // get token
  // const token = loginResponse.body.token

  await Note.deleteMany({})

  const noteObjects = helper.initialNotes.map(
    note => new Note({
      ...note,
      user: user._id
    })
  )
  const promiseArray = noteObjects.map(noteObject => noteObject.save())

  await Promise.all(promiseArray)
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

test('a valid note can be added', async () => {

  // // simulate log in

  const credentials = {
    username: 'testUser',
    password: 'testpassword'
  }

  const loginResponse = await api
    .post('/api/login')
    .send(credentials)
    .expect(200)

  // get token
  const token = loginResponse.body.token
  // console.log(token)

  const newNote = {
    content: 'async/await simplifies making async calls',
    important: true,
  }

  await api
    .post('/api/notes')
    .set('Authorization', `Bearer ${token}`)
    .send(newNote)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  const notesAtEnd = await helper.notesInDb()
  assert.strictEqual(notesAtEnd.length, helper.initialNotes.length + 1)

  const contents = notesAtEnd.map(element => element.content)
  assert(contents.includes('async/await simplifies making async calls'))
})

test('a note without content is not added', async () => {

  // log in
  const credentials = {
    username: 'testUser',
    password: 'testpassword'
  }

  const loginResponse = await api
    .post('/api/login')
    .send(credentials)
    .expect(200)

  const token = loginResponse.body.token

  const newNote = {
    important: true,
  }

  await api
    .post('/api/notes')
    .set('Authorization', `Bearer ${token}`)
    .send(newNote)
    .expect(400)

  const notesAtEnd = await helper.notesInDb()
  assert.strictEqual(notesAtEnd.length, helper.initialNotes.length)
})

test('notes are returned as json', async () => {
  await api
    .get('/api/notes')
    .expect(200)
    .expect('Content-type', /application\/json/)
})


test('there are two notes', async () => {
  const response = await api.get('/api/notes')

  assert.strictEqual(response.body.length, helper.initialNotes.length)
})

test('the first note is about HTTP methods', async () => {
  const response = await api.get('/api/notes/')

  const contents = response.body.map(e => e.content)
  assert(contents.includes('HTML is easy'))
})

describe('where there is initially one user in db', async () => {

  beforeEach(async () => {
    await User.deleteMany({})

    const passwordHash = await bcrypt.hash('sekret', 10)
    const user = new User({ username: 'root', password: passwordHash })

    await user.save()
  })

  // test('creation succeeds with a fresh username', async () => {
  //   const usersAtStart = await helper.usersInDb()

  //   const newUser = {
  //     username: 'mluukkai',
  //     name: 'Matti Luukkainen',
  //     password: 'salainen'
  //   }

  //   await api
  //     .post('/api/users')
  //     .send(newUser)
  //     .expect(201)
  //     .expect('Content-Type', /application\/json/)

  //   const usersAtEnd = await helper.usersInDb()
  //   assert.strictEqual(usersAtEnd.length, usersAtStart.length + 1)

  //   const usernames = usersAtEnd.map(user => user.username)
  //   assert(usernames.includes(newUser.username))
  // })

  test('creation fails with proper status code and message if username already taken', async () => {
    const usersAtStart = await helper.usersInDb()

    console.log(usersAtStart)

    const newUser = {
      username: 'root',
      name: 'Superuser',
      password: 'super',
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    const usersAtEnd = await helper.usersInDb()

    assert(result.body.error.includes('expected `username` to be unique'))
    assert.strictEqual(usersAtEnd.length, usersAtStart.length)
  })
})


after( async () => {
  await mongoose.connection.close()
})