const { beforeEach, test, describe, after } = require('node:test')
const assert = require('node:assert')
const supertest = require('supertest')
const app = require('../app')
const User = require('../models/user')
const helper = require('./test_helper')
const bcrypt = require('bcrypt')
const { default: mongoose } = require('mongoose')
const api = supertest(app)

describe('when there is initially one user in the db', () => {
    beforeEach( async () => {
        await User.deleteMany({})

        const passwordHash = await bcrypt.hash("password", 10)
        const user = new User({
            username: "Root",
            passwordHash
        })

        await user.save()
    })

    test('returns all users', async () => {
        usersAtStart = await helper.usersInDb()

        assert.strictEqual(usersAtStart.length, 1)
    })

    test('user requires a username to be at least 3 characters', async () => {
        const usersAtStart = await helper.usersInDb()

        const newUser = {
            username: "te",
            name: "Tess Sset",
            password: "test"
        }

        await api
            .post('/api/users')
            .send(newUser)
            .expect(400)
            .expect('Content-Type', /application\/json/)
        
        const usersAtEnd = await helper.usersInDb()
        assert.strictEqual(usersAtStart.length, usersAtEnd.length)
    })

    test('user requires a password to be at leasat 3 characters', async () => {
        const usersAtStart = await helper.usersInDb()

        const newUser = {
            username: 'tess24',
            name: "Tessaract Cube",
            password: "to"
        }

        await api
            .post('/api/users')
            .send(newUser)
            .expect(400)
            .expect('Content-Type', /application\/json/)
        
        const usersAtEnd = await helper.usersInDb()
        assert.strictEqual(usersAtStart.length, usersAtEnd.length)
    })

    test('username must be unique', async () => {
        const usersAtStart = await helper.usersInDb()

        // add new user
        const user1 = {
            username: "test",
            name: "Not Test",
            password: "password"
        }

        await api
            .post('/api/users')
            .send(user1)
            .expect(201)
            .expect('Content-Type', /application\/json/)
        
        // add duplicate user
        const user2 = {
            username: "test",
            name: "Not Test",
            password: "password"
        }

        const result = await api
            .post('/api/users')
            .send(user2)
            .expect(400)
            .expect('Content-Type', /application\/json/)
        
        // Check the error message
        assert.strictEqual(result.body.error, "username must be unique");

        // Verify the database still contains only the first user
        const usersAtEnd = await helper.usersInDb();
        assert.strictEqual(usersAtEnd.length, usersAtStart.length + 1);
    })

    after(() => {
        mongoose.connection.close()
    })
})
