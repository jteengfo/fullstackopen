const blogsRouter = require('express').Router()
const Blog = require('../models/Blog')
const User = require('../models/user')

// blogsRouter.get('', (request, response) => {
//     Blog.find({})
//         .then(blogs => {
//             response.json(blogs)
//         })
// })

blogsRouter.get('', async (request, response) => {
    const blogs = await Blog.find({}).populate('user', { username: 1, name: 1})
    response.json(blogs)
})

blogsRouter.get('/:id', (request, response, next) => {
    Blog.findById(request.params.id)
        .then(blog => {
            if (blog) {
                response.json(blog)
            } else {
                response.status(404).end()
            }
        })
        .catch(error => next(error))
})

blogsRouter.post('/', async (request, response) => {

    const body = request.body

    if (request.body.url === undefined || request.body.title === undefined) {
        return response.status(400).end()
    }


    const user = await User.findById(body.userId)

    const blog = new Blog({
        title: body.title,
        author: body.author,
        url: body.url,
        likes: body.likes || 0,
        user: user.id
    })

    const savedBlog = await blog.save()
    user.blogs = user.blogs.concat(savedBlog._id)
    await user.save()
    response.status(201).json(savedBlog)
})


blogsRouter.delete('/:id', async (request, response) => {
    await Blog.findByIdAndDelete(request.params.id)
    response.status(204).end()
})

blogsRouter.put('/:id', async (request, response) => {
    const body = request.body

    const blog = {
        title: body.title,
        author: body.author,
        url: body.url,
        likes: body.likes,
    }

    const updatedNote = await Blog.findByIdAndUpdate(request.params.id, blog, { new: true})

    if (updatedNote) {
        response.status(200).json(updatedNote)
    } else {
        response.status(400).end()
    }

})

module.exports = blogsRouter