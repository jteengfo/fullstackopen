const User = require('../models/user')
const jwt = require('jsonwebtoken')

const errorHandler = (error, request, response, next) => {
    if (error.name === 'MongoServerError' && error.code === 11000) {
        return response.status(400).json({ error: 'username must be unique'})
    }
    next(error)
}

// middleware to get token from Bearer token if exists otherwise null
const tokenExtractor = (request, response, next) => {
    const authorization = request.get('authorization')
    if (authorization && authorization.startsWith('Bearer ')) {
        request.token = authorization.replace('Bearer ', '')
    } else {
        request.token = null
    }
    next()
}

// middleware to find out the user and set it to the request object
const userExtractor = async (request, response, next) => {
    // get token from request
    const token = request.token
    if (!token) {
        return response.status(401).json({
            error: 'invalid token'
        })
    }

    // if token exists, decode token and verify
    const decodedToken = jwt.verify(token, process.env.SECRET)
    if (!decodedToken) {
        return response.status(401).json({
            error: 'invalid token or missing user ID'
        })
    }

    // if decodedToken exists, get user from db
    const user = await User.findById(decodedToken.id)
    if (!user) {
        return response.status(404).json({
            error: 'user not found'
        })
    } else {
        request.user = user
    }
    next()
}

module.exports = {
    errorHandler,
    tokenExtractor,
    userExtractor
}