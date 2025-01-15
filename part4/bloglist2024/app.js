const express = require('express')
const app = express()

require('express-async-errors')

const cors = require('cors')
const mongoose = require('mongoose')
const config = require('./utils/config')
const logger = require('./utils/logger')
const middleware = require('./utils/middleware')

mongoose.set('strictQuery', false)

logger.info(`connecting to ${config.MONGODB_URI}`)

mongoose.connect(config.MONGODB_URI)
    .then(() => {
        logger.info('connected to MongoDB')
    })
    .catch((error) => {
        logger.error('error connecting to MongoDB:', error.message)
    })

app.use(cors())
app.use(express.json())

// middleware to be used before Routes
app.use(middleware.tokenExtractor)

app.use('/api/blogs', middleware.userExtractor, require('./controllers/blog'))
app.use('/api/users', require('./controllers/user'))
app.use('/api/login', require('./controllers/login'))


module.exports = app