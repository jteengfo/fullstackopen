const blogsRouter = require('express').Router()
const Blog = require('../models/Blog')
const User = require('../models/user')
const jwt = require('jsonwebtoken')


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
    
    // decode the token to get id
    // request.token from tokenExtractor middleware
    const decodedToken = jwt.verify(request.token, process.env.SECRET)
    
    if (!decodedToken.id) {
        return response.status(401).json({
            error: 'token invalid'
        })
    }

    if (request.body.url === undefined || request.body.title === undefined) {
        return response.status(400).end()
    }

    // means token is valid; get user
    const user = await User.findById(decodedToken.id)

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

    // decode token to get id 
    const decodedToken = jwt.verify(request.token, process.env.SECRET)

    if(!decodedToken.id) {
        return response.status(403).json({
            error: 'user not found'
        })
    }

    // valid id; find user from db
    const user = await User.findById(decodedToken.id)
    user.blogs = user.blogs.filter(blog => blog.id !== request.params.id)

    if (user.blogs.length > 0 ) {
        await user.save()
        // delete the blog from db
        await Blog.findByIdAndDelete(request.params.id)
        response.status(204).end()
    } else {
        response.status(403).json({
            error: 'you are not authorized to delete this blog'
        })
    }

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