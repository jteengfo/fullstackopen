const {beforeEach, after, test, describe} = require('node:test')
const assert = require('assert')
const mongoose = require('mongoose')
const supertest = require('supertest')
const helper = require('./test_helper')
const bcrypt = require('bcrypt')


const app = require('../app')
const Blog = require('../models/blog')
const User = require('../models/user')
const { error } = require('console')

const api = supertest(app)

// beforeEach (async () => {
//     await Blog.deleteMany({})

//     const blogObjects = helper.initialBlogs.map(
//         blog => new Blog(blog)
//     )

//     const promiseArray = blogObjects.map(blogObject => blogObject.save())

//     await Promise.all(promiseArray)
// })

// test('app returns the correct amount of blog posts', async () => {
    
//     const response = await api.get('/api/blogs')

//     assert.strictEqual(response.body.length, 2)
// })

// test('app returns the same id as the unique identifier property of the blog post named id', async () => {

//     const blogsAtStart = await helper.blogsInDb()

//     const blogToView = blogsAtStart[0]

//     const response = await api
//         .get(`/api/blogs/${blogToView.id}`)
//         .expect(200)
//         .expect('Content-Type', /application\/json/)
    
//     assert.strictEqual(response.body.id, blogToView.id)
// })

// test('creating another blog post is a success', async () => {
//     const blog = {
//         title: "New note added",
//         author: "James",
//         url: "https://jarte.info",
//         likes: "8"
//     }

//     await api
//         .post('/api/blogs/')
//         .send(blog)

//     const response = await api.get('/api/blogs/')

//     assert.strictEqual(response.body.length, 3)
    
// })

// test('if like property is missing, like defaults to 0', async () => {

//     // send a blog without like property
//     const newBlog = {
//         title: "this blog should have 0 likes",
//         author: "James",
//         url: "http://google.com",
//     }

//     const response = await api
//         .post('/api/blogs/')
//         .send(newBlog)

//     // validate blog sent has like property with 0 value 

//     assert.strictEqual(response.body.likes, 0)

// })


// test('if new blog sent missing title, return a 400', async () => {

//     const noTitleBlog = {
//         author: "James",
//         url: "http://google.com",
//         likes: 5
//     }

//     const response = await api
//         .post('/api/blogs/')
//         .send(noTitleBlog)
//         .expect(400)

//     console.log(response.body)
// })

// test('deleting a blog is a success', async () => {

//     const blogsAtStart = await helper.blogsInDb()

//     const blogToDelete = blogsAtStart[0]

//     await api
//         .delete(`/api/blogs/${blogToDelete.id}`)
//         .expect(204)
    
//     const blogsAtEnd = await helper.blogsInDb()
//     const contents = blogsAtEnd.map(blog => blog.title)

//     assert(!contents.includes('Number 1'))

//     assert.strictEqual(blogsAtEnd.length, blogsAtStart.length - 1)
// })

// test('updating a blog is a success', async () => {

//     const blogsAtStart = await helper.blogsInDb()

//     const blogToUpdate = blogsAtStart[0]

//     console.log(blogsAtStart)

//     // const updatedBlog = {
//     //     title: "Hot Sauce",
//     //     author: "deadpool",
//     //     url: "http://lfg.com",
//     //     likes: 1000
//     // }

//     const updatedBlog = {
//         author: "deadpool",
//     }

//     await api
//         .put(`/api/blogs/${blogToUpdate.id}`)
//         .send(updatedBlog)
//         .expect(201)

//     const blogsAtEnd = await helper.blogsInDb()

//     const blogs = blogsAtEnd.map(blog => blog.author)

//     assert(blogs.includes("deadpool"))
// })

describe("when testing functionality of users", async () => {

    beforeEach( async () => {

        // delete all users in db
        await User.deleteMany({})

        // create and save one user to db
        const passwordHash = bcrypt.hash('testpassword', 10)
        const user = new User({
            username: 'testUser',
            password: passwordHash,
            name: "Test User"
        })

        await user.save()
    })

    test('user creation fails with proper status code and message if useranme is already taken', async () => {

        const usersAtStart = await helper.usersInDb()

        const newUser = {
            username: 'testUser',
            password: 'testpassword',
            name: 'Test User2'
        }

        const result = await api
            .post('/api/users')
            .send(newUser)
            .expect(400)
            .expect('Content-Type', /application\/json/)

        const usersAtEnd = await helper.usersInDb()

        assert(result.body.error.includes('username is already taken.'))
        assert.strictEqual(usersAtEnd.length, usersAtStart.length)
    })

    test('user creation fails with proper status code and message if username < 3 characters long', async () => {
        const usersAtStart = await helper.usersInDb()

        const newUser = {
            username: 'le',
            name: 'Levi Taichou',
            password: 'testpassword'
        }

        const result = await api
            .post('/api/users')
            .send(newUser)
            .expect(400)
            .expect('Content-Type', /application\/json/)

        assert(result.body.error.includes('username is shorter than minimum allowed length'))

        const usersAtEnd = await helper.usersInDb()

        assert.strictEqual(usersAtStart.length, usersAtEnd.length)
    })

    test('user creation fails with proper status code and message if password is < 3 characters long', async () => {
        const usersAtStart = await helper.usersInDb()

        const newUser = {
            username: 'luigi27',
            name: 'Luigi Mansion',
            password: '12'
        }

        const result = await api
            .post('/api/users')
            .send(newUser)
            .expect(400)
            .expect('Content-Type', /application\/json/)
        
        assert(result.body.error.includes('password should be at least 3 characters long'))
        
        const usersAtEnd = await helper.usersInDb()

        assert.strictEqual(usersAtEnd.length, usersAtStart.length)
    })
})
after(async () => {
    await mongoose.connection.close()
})