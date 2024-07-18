const blogsRouter = require('./controllers/blogs')
const express = require('express')
const cors = require('cors')
const config = require('./utils/config')
const middleware = require('./utils/middleware')
const logger = require('./utils/logger')
const mongoose = require('mongoose')
const app = express()

mongoose.set('strictQuery', false)

logger.info('Connecting to: ', config.MONGODB_URL)

mongoose.connect(config.MONGODB_URL)
    .then(() => {
        logger.info('Connected to MongoDB')
    })
    .catch(error => {
        logger.info('Error connecting to MongoDB: ', error.message)
    })

app.use(cors())
app.use(express.static('dist'))
app.use(express.json())
app.use(middleware.requestLogger)

app.use('/api/blogs', blogsRouter) // means we only use blogs Router if '/api/blogs'?

app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)

module.exports = app 