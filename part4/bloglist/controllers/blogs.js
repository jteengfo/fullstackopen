const blogsRouter = require('express').Router()
const Blog = require('../models/blog')

// blogsRouter.get('/', (request, response) => {
//     Blog.find({})
//         .then(blogs => {
//             return response.json(blogs)
//         })
// })

blogsRouter.get('/', async (request, response) => {

    const blogs = await Blog.find({})
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

    if (!body.url || !body.title) {
        return response.status(400).end()
    }

    if (!body.like) {

        const blog = new Blog({
            title: body.title,
            author: body.author,
            url: body.url,
            likes: 0
        })

        const savedBlog = await blog.save()
        response.json(savedBlog)
        } 
    else {
        const blog = new Blog({
            title: body.title,
            author: body.author,
            url: body.url,
            likes: body.likes
        })

        const savedBlog = await blog.save()
        response.json(savedBlog)
        }
    
})


// blogsRouter.post('/', (request, response, next) => {
//     const body = request.body

//     const blog = new Blog({
//         title: body.title,
//         author: body.author,
//         url: body.url,
//         likes: body.likes
//     })

//     blog.save()
//         .then(savedBlog => {
//             response.status(201).json(savedBlog)
//         })
//         .catch(error => next(error))
// })

blogsRouter.delete('/:id', (request, response, next) => {
    Blog.findByIdAndDelete(request.params.id)
        .then(() => {
            response.status(204).end()
        })
        .catch(error => next(error))
})

blogsRouter.put('/:id', (request, response, next) => {
    const body = request.body

    const blog = {
        title: body.title,
        author: body.title,
        url: body.url,
        likes: body.likes
    }

    Blog.findByIdAndUpdate(request.params.id, blog, { new : true })
        .then(updatedBlog => {
            response.json(updatedBlog)
        })
        .catch(error => next(error))
})

module.exports = blogsRouter