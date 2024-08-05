const {beforeEach, after, test} = require('node:test')
const assert = require('assert')
const mongoose = require('mongoose')
const supertest = require('supertest')


const app = require('../app')
const Blog = require('../models/blog')

const api = supertest(app)

// beforeEach (async () => {
//     await Blog.deleteMany({})

//     const blogs = [
//         {
//             title: "Number 1",
//             author: "James",
//             url: "http://google.ca",
//             likes: "2"
//         },

//         {
//             title: "Number 2",
//             author: "Norah",
//             url: "http://google.com",
//             likes: "8"
//         }
//     ]

//     const blogObjects = blogs.map(
//         blog => new Blog(blog)
//     )

//     const promiseArray = blogObjects.map(blogObject => blogObject.save())

//     await Promise.all(promiseArray)
// })

// test('app returns the correct amount of blog posts', async () => {
    
//     const response = await api.get('/api/blogs')

//     assert.strictEqual(response.body.length, 2)
// })


test('app returns the same id as the unique identifier property of the blog post named id', async () => {

    const response = await api.get('/api/blogs/66b12c4104d4b1e094935d44')
    

    assert.strictEqual(response.body.id, '66b12c4104d4b1e094935d44')
})

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