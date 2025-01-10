require('dotenv').config()

// grabs the port from the .env file
const PORT = process.env.PORT

// grabs the MONGODB_URI from the .env file
const MONGODB_URI = process.env.NODE_ENV == 'test'
  ? process.env.TEST_MONGODB_URI
  : process.env.MONGODB_URI

module.exports = {
  MONGODB_URI,
  PORT
}