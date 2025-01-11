const { test, describe, after } = require('node:test')
const assert = require('node:assert')
const listHelper = require("../utils/list_helper")
const supertest = require('supertest')
const app = require('../app')
const helper = require('./test_helper')
const Blog = require('../models/Blog')
const { default: mongoose } = require('mongoose')

const api = supertest(app)

// test('dummy returns one', () => {
//     const blogs = []
//     const result = listHelper.dummy(blogs)
//     assert.strictEqual(result, 1)
// })



// describe('total likes', () => {
//     const listWithOneBlog = [
//         {
//           _id: '5a422aa71b54a676234d17f8',
//           title: 'Go To Statement Considered Harmful',
//           author: 'Edsger W. Dijkstra',
//           url: 'https://homepages.cwi.nl/~storm/teaching/reader/Dijkstra68.pdf',
//           likes: 5,
//           __v: 0
//         }
//       ]
//     test('of empty list is zero', () => {
//         const blogs = []
//         const result = listHelper.totalLikes(blogs)

//         assert.strictEqual(result, 0)
//     })
//     test('when list has only one blog equal the likes of that', () => {
//         const result = listHelper.totalLikes(listWithOneBlog)
//         assert.strictEqual(result, 5)
//     })
//     test('of a bigger list is calculated right', () => {
//         const listWithMultipleBlogs = [
//             {
//               _id: '5a422aa71b54a676234d17f8',
//               title: 'Go To Statement Considered Harmful',
//               author: 'Edsger W. Dijkstra',
//               url: 'https://homepages.cwi.nl/~storm/teaching/reader/Dijkstra68.pdf',
//               likes: 5,
//               __v: 0
//             },
//             {
//               _id: '5a422b3a1b54a676234d17f9',
//               title: 'Understanding the JavaScript Event Loop',
//               author: 'Philip Roberts',
//               url: 'https://2014.jsconf.eu/speakers/philip-roberts-what-the-heck-is-the-event-loop-anyway.html',
//               likes: 12,
//               __v: 0
//             },
//             {
//               _id: '5a422bc61b54a676234d17fa',
//               title: 'The Art of Computer Programming',
//               author: 'Donald Knuth',
//               url: 'https://en.wikipedia.org/wiki/The_Art_of_Computer_Programming',
//               likes: 15,
//               __v: 0
//             },
//             {
//               _id: '5a422ca71b54a676234d17fb',
//               title: 'Clean Code: A Handbook of Agile Software Craftsmanship',
//               author: 'Robert C. Martin',
//               url: 'https://en.wikipedia.org/wiki/Clean_Code',
//               likes: 8,
//               __v: 0
//             },
//             {
//               _id: '5a422d3f1b54a676234d17fc',
//               title: 'You Don’t Know JS: Scope & Closures',
//               author: 'Kyle Simpson',
//               url: 'https://github.com/getify/You-Dont-Know-JS',
//               likes: 20,
//               __v: 0
//             }
//           ]
//         const result = listHelper.totalLikes(listWithMultipleBlogs)
//         assert.strictEqual(result, 60)
//     })
// })

// describe('favorite blog', () => {
//   test('of empty list is null', () => {
//     const result = listHelper.favoriteBlog([])

//     assert.strictEqual(result, null)
//   })

//   test('of a list with one blog is that blog', () => {
//     const listWithOneBlog = [
//       {
//         _id: '5a422aa71b54a676234d17f8',
//         title: 'Go To Statement Considered Harmful',
//         author: 'Edsger W. Dijkstra',
//         url: 'https://homepages.cwi.nl/~storm/teaching/reader/Dijkstra68.pdf',
//         likes: 5,
//         __v: 0
//       }
//     ]

//     const result = listHelper.favoriteBlog(listWithOneBlog)

//     assert.deepStrictEqual(result, listWithOneBlog[0])
//   })

//   test('of a list with many blogs is the one with the most likes', () => {
//     const listWithMultipleBlogs = [
//       {
//         _id: '5a422aa71b54a676234d17f8',
//         title: 'Go To Statement Considered Harmful',
//         author: 'Edsger W. Dijkstra',
//         url: 'https://homepages.cwi.nl/~storm/teaching/reader/Dijkstra68.pdf',
//         likes: 5,
//         __v: 0
//       },
//       {
//         _id: '5a422b3a1b54a676234d17f9',
//         title: 'Understanding the JavaScript Event Loop',
//         author: 'Philip Roberts',
//         url: 'https://2014.jsconf.eu/speakers/philip-roberts-what-the-heck-is-the-event-loop-anyway.html',
//         likes: 12,
//         __v: 0
//       },
//       {
//         _id: '5a422bc61b54a676234d17fa',
//         title: 'The Art of Computer Programming',
//         author: 'Donald Knuth',
//         url: 'https://en.wikipedia.org/wiki/The_Art_of_Computer_Programming',
//         likes: 15,
//         __v: 0
//       },
//       {
//         _id: '5a422ca71b54a676234d17fb',
//         title: 'Clean Code: A Handbook of Agile Software Craftsmanship',
//         author: 'Robert C. Martin',
//         url: 'https://en.wikipedia.org/wiki/Clean_Code',
//         likes: 8,
//         __v: 0
//       },
//       {
//         _id: '5a422d3f1b54a676234d17fc',
//         title: 'You Don’t Know JS: Scope & Closures',
//         author: 'Kyle Simpson',
//         url: 'https://github.com/getify/You-Dont-Know-JS',
//         likes: 20,
//         __v: 0
//       }
//     ]

//     const result = listHelper.favoriteBlog(listWithMultipleBlogs)

//     assert.deepStrictEqual(result, listWithMultipleBlogs[4])
//   })
// })

test('a get request returns all blogs in db', async () => {
  // clear db 
  await Blog.deleteMany({})
  console.log('cleared')

  // store to variable all turned mongoose blog objects from initialblogs array
  const blogObjects = helper.initialBlogs.map(blog => new Blog(blog))

  // store to variable all promises that is to save each blog mongoose objects
  const promiseArray = blogObjects.map(blogObject => blogObject.save())

  // combines all promises into one which gets resolved once all are resolved
  await Promise.all(promiseArray)
  
  const response = await api.get('/api/blogs/')


  assert.strictEqual(response.body.length, helper.initialBlogs.length)
})

test('a note unique identifier is named id', async () => {
  
  const blogsInDb = await api.get('/api/blogs')
  const blogs = blogsInDb.body

  assert(blogs[0].id)                             // verifies that .id exists 
  assert.deepStrictEqual(blogs[0]._id, undefined) // verifies that in models Blog, ._id already has been transformed to id
})

test('making a post request successfully creates a new blog post', async () => {
  // clear db 
  await Blog.deleteMany({})

  // one blog obj
  const oneBlog = {
    title: "The Future of Web Development with AI",
    author: "Samantha Rivera",
    url: "https://techinsights.com/future-web-ai",
    likes: 87,
  }

  // make a post request; send blog to db
  const response = await api
    .post('/api/blogs')
    .send(oneBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  // get blogs from db
  const blogsInDb = await api.get('/api/blogs')
  const blogsArray = blogsInDb.body.map(blog => blog.title)

  assert.strictEqual(blogsInDb.body.length, 1)
  assert(blogsArray.includes('The Future of Web Development with AI'))

})

test('a missing like property defaults to 0 likes', async () => {

  // clear db
  await Blog.deleteMany({})

  // one blog obj
  const oneBlog = {
    title: "The Future of Web Development with AI",
    author: "Samantha Rivera",
    url: "https://techinsights.com/future-web-ai",
  }

  const response = await api
    .post('/api/blogs')
    .send(oneBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)
  
  const blogsInDb = await api.get('/api/blogs')
  const blogsArr = blogsInDb.body.map(blog => blog.likes)

  assert.strictEqual(blogsArr[0], 0)
  
})

test('a post request with missing title or url will return a 400', async () => {

  // clear db
  await Blog.deleteMany({})

  const oneBlogNoTitle = {
    author: "Samantha Rivera",
    url: "https://techinsights.com/future-web-ai",
    likes: 280
  }

  const oneBlogNoUrl = {
    title: "The Future of Web Development with AI",
    author: "Samantha Rivera",
    likes: 280
  }

  const result1 = await api
    .post('/api/blogs')
    .send(oneBlogNoTitle)
    .expect(400)
  
  const result2 = await api
    .post('/api/blogs')
    .send(oneBlogNoUrl)
    .expect(400)
  
})

test('a post is deleted when making a delete request', async () => {

  await Blog.deleteMany({})

  const blogToAdd = {
    title: "The Future of Web Development with AI",
    author: "Samantha Rivera",
    url: "https://techinsights.com/future-web-ai",
    likes: 87,
  }

  await api
    .post('/api/blogs')
    .send(blogToAdd)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  const blogsAtStart = await helper.blogsInDb()

  const blogToDelete = blogsAtStart[0]


  await api
    .delete(`/api/blogs/${blogToDelete.id}`)
    .expect(204)
  
  const blogsAtEnd = await helper.blogsInDb()
  const titles = blogsAtEnd.map(blog => blog.title)

  assert.strictEqual(blogsAtStart.length - 1, blogsAtEnd.length)
  assert(!titles.includes('The Future of Web Development with AI'))

})


test('updating the number of likes succeeds', async () => {
  await Blog.deleteMany({})

  const blogToAdd = {
    title: "The Future of Web Development with AI",
    author: "Samantha Rivera",
    url: "https://techinsights.com/future-web-ai",
    likes: 87,
  }

  await api
    .post('/api/blogs')
    .send(blogToAdd)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  const blogsAtStart = await helper.blogsInDb()

  const blogToUpdate = blogsAtStart[0]


  const updatedBlog = {
    title: "The Future of Web Development with AI",
    author: "Samantha Rivera",
    url: "https://techinsights.com/future-web-ai",
    likes: 500,
  }

  await api
    .put(`/api/blogs/${blogToUpdate.id}`)
    .send(updatedBlog)
    .expect(200)
    .expect('Content-Type', /application\/json/)

  const blogsAtEnd = await helper.blogsInDb()
  const updatedBlogFromDb = blogsAtEnd.find(blog => blog.id === blogToUpdate.id)

  assert.strictEqual(updatedBlogFromDb.likes, 500)
})

after(async () => {
  mongoose.connection.close()
})