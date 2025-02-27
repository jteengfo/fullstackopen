const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')

// blogsRouter.get('/', (request, response) => {
//     Blog.find({})
//         .then(blogs => {
//             return response.json(blogs)
//         })
// })

blogsRouter.get('/', async (request, response) => {

    const blogs = await Blog.find({}).populate('user', { username : 1, name: 1, id: 1 })
    response.json(blogs)
})
  
blogsRouter.get('/:id', (request, response, next) => {
    Blog.findById(request.params.id)
        .then(blog => {
            if (blog) {
                response.json(blog)
            } else {
                return response.status(404).end
            }
        })
        .catch(error => next(error))
})

blogsRouter.post('/', async (request, response) => {

    const body = request.body

    const user = await User.findById(body.userId)

    if (!body.url || !body.title) {
        return response.status(400).end()
    }

    if (!body.likes) {

        const blog = new Blog({
            title: body.title,
            author: body.author,
            url: body.url,
            likes: 0,
            user: user.id
        })

        const savedBlog = await blog.save()
        user.blogs = user.blogs.concat(savedBlog._id)
        await user.save()
        response.json(savedBlog)
        } 
    else {
        const blog = new Blog({
            title: body.title,
            author: body.author,
            url: body.url,
            likes: body.likes,
            user: user.id
        })

        const savedBlog = await blog.save()
        user.blogs = user.blogs.concat(savedBlog._id)
        await user.save()
        response.json(savedBlog)
        }
    
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
        likes: body.likes
    }

    const updatedBlog = await Blog.findByIdAndUpdate(request.params.id, blog, {new : true} )
    response.status(201).json(updatedBlog)
})

module.exports = blogsRouter