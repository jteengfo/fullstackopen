const { test, describe } = require('node:test')
const assert = require('node:assert')
const listHelper = require("../utils/list_helper")

test('dummy returns one', () => {
    const blogs = []
    const result = listHelper.dummy(blogs)
    assert.strictEqual(result, 1)
})

describe('total likes', () => {
    const listWithOneBlog = [
        {
          _id: '5a422aa71b54a676234d17f8',
          title: 'Go To Statement Considered Harmful',
          author: 'Edsger W. Dijkstra',
          url: 'https://homepages.cwi.nl/~storm/teaching/reader/Dijkstra68.pdf',
          likes: 5,
          __v: 0
        }
      ]
    test('of empty list is zero', () => {
        const blogs = []
        const result = listHelper.totalLikes(blogs)

        assert.strictEqual(result, 0)
    })
    test('when list has only one blog equal the likes of that', () => {
        const result = listHelper.totalLikes(listWithOneBlog)
        assert.strictEqual(result, 5)
    })
    test('of a bigger list is calculated right', () => {
        const listWithMultipleBlogs = [
            {
              _id: '5a422aa71b54a676234d17f8',
              title: 'Go To Statement Considered Harmful',
              author: 'Edsger W. Dijkstra',
              url: 'https://homepages.cwi.nl/~storm/teaching/reader/Dijkstra68.pdf',
              likes: 5,
              __v: 0
            },
            {
              _id: '5a422b3a1b54a676234d17f9',
              title: 'Understanding the JavaScript Event Loop',
              author: 'Philip Roberts',
              url: 'https://2014.jsconf.eu/speakers/philip-roberts-what-the-heck-is-the-event-loop-anyway.html',
              likes: 12,
              __v: 0
            },
            {
              _id: '5a422bc61b54a676234d17fa',
              title: 'The Art of Computer Programming',
              author: 'Donald Knuth',
              url: 'https://en.wikipedia.org/wiki/The_Art_of_Computer_Programming',
              likes: 15,
              __v: 0
            },
            {
              _id: '5a422ca71b54a676234d17fb',
              title: 'Clean Code: A Handbook of Agile Software Craftsmanship',
              author: 'Robert C. Martin',
              url: 'https://en.wikipedia.org/wiki/Clean_Code',
              likes: 8,
              __v: 0
            },
            {
              _id: '5a422d3f1b54a676234d17fc',
              title: 'You Don’t Know JS: Scope & Closures',
              author: 'Kyle Simpson',
              url: 'https://github.com/getify/You-Dont-Know-JS',
              likes: 20,
              __v: 0
            }
          ]
        const result = listHelper.totalLikes(listWithMultipleBlogs)
        assert.strictEqual(result, 60)
    })
})