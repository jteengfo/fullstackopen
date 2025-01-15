const { beforeEach, test, describe, after } = require('node:test')
const assert = require('node:assert')
const supertest = require('supertest')
const app = require('../app')
const User = require('../models/user')
const Blog = require('../models/Blog')
const helper = require('./test_helper')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const { default: mongoose } = require('mongoose')
const { request } = require('node:http')
const api = supertest(app)

describe('when there is initially one user in the db', () => {
    beforeEach( async () => {
        await User.deleteMany({})
        await Blog.deleteMany({})

        const passwordHash = await bcrypt.hash("pokemon", 10)
        const user = new User({
            username: "charizard",
            name: 'Not Charizard',
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

    test('should login successfully with valid credentials', async () => {
        const user = {
            username: "charizard",
            password: "pokemon"
        }

        const response = await api
            .post('/api/login')
            .send(user)
            .expect(200)
            .expect('Content-Type', /application\/json/)

        const decodedToken = jwt.verify(response.body.token, process.env.SECRET)

        assert.strictEqual(decodedToken.username, user.username)
    })

    test('should fail login with invalid credentials', async () => {
        const invalidUser = {
            username: 'invalidUser',
            password: 'password'
        }

        const response = await api
            .post('/api/login')
            .send(invalidUser)
            .expect(401)
            .expect('Content-Type', /application\/json/)

        assert.strictEqual(response.body.error, 'invalid username or password')
        
    })

    test('logged in user can create a blog successfully and is identified', async () => {
        // get all blogs in db
        const blogsAtStart = await helper.blogsInDb()

        // log in to get token 
        const user = {
            username: 'charizard',
            password: 'pokemon'
        }

        const response = await api
            .post('/api/login')
            .send(user)
            .expect(200)
            .expect('Content-Type', /application\/json/)

        // blog object to send to db
        const blog = {
            title: "Understanding Token-Based Authentication",
            author: "Jartef",
            url: "https://example.com/token-authentication",
            likes: 15,   
        }

        const createResponse = await api
            .post('/api/blogs')
            .send(blog)
            .set('Authorization', `Bearer ${response.body.token}`)
            .expect(201)
            .expect('Content-Type', /application\/json/)

        const blogsAtEnd = await helper.blogsInDb()

        assert.strictEqual(blogsAtStart.length + 1, blogsAtEnd.length)
        
        const titles = blogsAtEnd.map(blog => blog.title)
        assert(titles.includes('Understanding Token-Based Authentication'))

        const username = createResponse.body.user.username
        assert.strictEqual(user.username, username)
        
    })

    test('a blog created by logged in user is deleted successfully and is identified', async () => {
        // get all blogs in db 
        const blogsAtStart = await helper.blogsInDb()

        // log in to get token
        const user = {
            username: 'charizard',
            password: 'pokemon'
        }

        const response = await api
            .post('/api/login')
            .send(user)
            .expect(200)
            .expect('Content-Type', /application\/json/)
        
        // blog object to send to db
        const blog = {
            title: "Understanding Token-Based Authentication",
            author: "Jartef",
            url: "https://example.com/token-authentication",
            likes: 15,   
        }
        
        const blogResponse = await api
            .post('/api/blogs')
            .send(blog)
            .set('Authorization', `Bearer ${response.body.token}`)
            .expect(201)
            .expect('Content-Type', /application\/json/)

        const deleteResponse = await api
            .delete(`/api/blogs/${blogResponse.body.id}`)
            .set('Authorization', `Bearer ${response.body.token}`)
            .expect(200)
        
        const blogsAtEnd = await helper.blogsInDb()
        assert.strictEqual(blogsAtStart.length, blogsAtEnd.length)

        const username = deleteResponse.body.user.username
        assert.strictEqual(user.username, username)
    })

    test('a blog created by a different user cannot be deleted', async () => {
        // get all blogs in db 
        const blogsAtStart = await helper.blogsInDb()

        // log in to get token 
        const user1 = {
            username: 'charizard',
            password: 'pokemon'
        }

        const response = await api
            .post('/api/login')
            .send(user1)
            .expect(200)
            .expect('Content-Type', /application\/json/)
        
        // blog object to send to db
        const blog = {
            title: "Understanding Token-Based Authentication",
            author: "Jartef",
            url: "https://example.com/token-authentication",
            likes: 15,   
        }
        
        const blogResponse = await api
            .post('/api/blogs')
            .send(blog)
            .set('Authorization', `Bearer ${response.body.token}`)
            .expect(201)
            .expect('Content-Type', /application\/json/)

        // create new User
        const newUser = {
            username: "spongebob",
            name: "Spongebob Squarepants",
            password: "squidward"
        }

        await api
            .post('/api/users')
            .send(newUser)
            .expect(201)
            .expect('Content-Type', /application\/json/)

        // log in to get token
        const user2 = {
            username: "spongebob",
            password: 'squidward'
        }

        const response2 = await api
            .post('/api/login')
            .send(user2)
            .expect(200)
            .expect('Content-Type', /application\/json/)

        // attempt to delete blog created by a different user
        const deleteResponse = await api
            .delete(`/api/blogs/${blogResponse.body.id}`)
            .set('Authorization', `Bearer ${response2.body.token}`)
            .expect(403)

        assert.strictEqual(deleteResponse.body.error, 'you are not authorized to delete this blog')

    })

    test('a blog created fails if token is not provided', async () => {
        // get all blogs in db 
       const blogsAtStart = await helper.blogsInDb()

        // log in to get token 
        const user1 = {
            username: 'charizard',
            password: 'pokemon'
        }

        const response = await api
            .post('/api/login')
            .send(user1)
            .expect(200)
            .expect('Content-Type', /application\/json/)
        
        // blog object to send to db
        const blog = {
            title: "Understanding Token-Based Authentication",
            author: "Jartef",
            url: "https://example.com/token-authentication",
            likes: 15,   
        }
        
        // request without Authorization
        await api
            .post('/api/blogs')
            .send(blog)
            .expect(401)
            .expect('Content-Type', /application\/json/)
        
        const blogsAtEnd = await helper.blogsInDb()
        assert.strictEqual(blogsAtStart.length, blogsAtEnd.length)
    })

    after(() => {
        mongoose.connection.close()
    })
})
