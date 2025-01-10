// configuration

require('dotenv').config()

// grab port from env file
const PORT = process.env.PORT

// grab MONGODB_URI from env file
const MONGODB_URI = process.env.NODE_ENV === 'test' || process.env.NODE_ENV ==='development'
    ? process.env.TEST_MONGODB_URI
    : process.env.MONGODB_URI

module.exports = {
    MONGODB_URI,
    PORT
}