const errorHandler = (error, request, response, next) => {
    if (error.name === 'MongoServerError' && error.code === 11000) {
        return response.status(400).json({ error: 'username must be unique'})
    }
    next(error)
}

// helper function to get token from Bearer token if exists otherwise null
const tokenExtractor = (request, response, next) => {
    const authorization = request.get('authorization')
    if (authorization && authorization.startsWith('Bearer ')) {
        request.token = authorization.replace('Bearer ', '')
    } else {
        request.token = null
    }
    next()
}

module.exports = {
    errorHandler,
    tokenExtractor
}