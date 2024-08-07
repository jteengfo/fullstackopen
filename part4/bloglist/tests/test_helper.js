const Blog = require('../models/blog')

// initialize Blogs
const initialBlogs = [
    {
        title: "Number 1",
        author: "James",
        url: "http://google.ca",
        likes: "2"
    },

    {
        title: "Number 2",
        author: "Norah",
        url: "http://google.com",
        likes: "8"
    }
]

// actions

const blogsInDb = async () => {
    const blogs = await Blog.find({})
    return blogs.map(blog => blog.toJSON())
}


module.exports = {
    initialBlogs,
    blogsInDb
}