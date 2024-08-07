const {beforeEach, after, test} = require('node:test')
const assert = require('assert')
const mongoose = require('mongoose')
const supertest = require('supertest')
const helper = require('./test_helper')


const app = require('../app')
const Blog = require('../models/blog')

const api = supertest(app)

beforeEach (async () => {
    await Blog.deleteMany({})

    const blogObjects = helper.initialBlogs.map(
        blog => new Blog(blog)
    )

    const promiseArray = blogObjects.map(blogObject => blogObject.save())

    await Promise.all(promiseArray)
})

test('app returns the correct amount of blog posts', async () => {
    
    const response = await api.get('/api/blogs')

    assert.strictEqual(response.body.length, 2)
})


test('app returns the same id as the unique identifier property of the blog post named id', async () => {

    const blogsAtStart = await helper.blogsInDb()

    const blogToView = blogsAtStart[0]

    const response = await api
        .get(`/api/blogs/${blogToView.id}`)
        .expect(200)
        .expect('Content-Type', /application\/json/)
    
    assert.strictEqual(response.body.id, blogToView.id)
})

test('creating another blog post is a success', async () => {
    const blog = {
        title: "New note added",
        author: "James",
        url: "https://jarte.info",
        likes: "8"
    }

    await api
        .post('/api/blogs/')
        .send(blog)

    const response = await api.get('/api/blogs/')

    assert.strictEqual(response.body.length, 3)
    
})

test('if like property is missing, like defaults to 0', async () => {

    // send a blog without like property
    const newBlog = {
        title: "this blog should have 0 likes",
        author: "James",
        url: "http://google.com",
    }

    const response = await api
        .post('/api/blogs/')
        .send(newBlog)

    // validate blog sent has like property with 0 value 

    assert.strictEqual(response.body.likes, 0)

})


test('if new blog sent missing title, return a 400', async () => {

    const noTitleBlog = {
        author: "James",
        url: "http://google.com",
        likes: 5
    }

    const response = await api
        .post('/api/blogs/')
        .send(noTitleBlog)
        .expect(400)

    console.log(response.body)
})

after(async () => {
    await mongoose.connection.close()
})