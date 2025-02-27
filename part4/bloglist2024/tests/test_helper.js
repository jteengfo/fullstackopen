const Blog = require('../models/Blog')
const User = require('../models/user')


const initialBlogs = [
    {
      title: "Understanding JavaScript Closures",
      author: "John Smith",
      url: "http://example.com/js-closures",
      likes: 45,
    },
    {
      title: "The Rise of React.js",
      author: "Jane Doe",
      url: "http://example.com/react-rise",
      likes: 27,
    },
    {
      title: "CSS Grid vs Flexbox",
      author: "Emily Johnson",
      url: "http://example.com/css-grid-vs-flexbox",
      likes: 32,
    },
  ]

const blogsInDb = async () => {
    const blogs = await Blog.find({})
    return blogs.map(blog => blog.toJSON())
}

const usersInDb = async () => {
  const users = await User.find({})
  return users.map(user => user.toJSON())
}

module.exports ={
    blogsInDb,
    initialBlogs,
    usersInDb
}