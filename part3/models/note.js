require('dotenv').config()
const mongoose = require('mongoose')

// config
mongoose.set('strictQuery', false)
const url = process.env.MONGODB_URI

// connect to db
mongoose.connect(url)
  .then(() => {
    console.log('connected to MongoDB')
  })
  .catch(error => {
    console.log('error connecting to MongoDB:', error.message)
  })

// ini document schema
const noteSchema = new mongoose.Schema({
  content: String,
  important: Boolean,
})

// config to not show both id and __v during fetch
noteSchema.set('toJSON', {
  transform:(document, returnedObject) => {
    // the id may look like a string but actually is obj, so we .toString()
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})


// ini model/constructor
// const Note = mongoose.model('Note', noteSchema);
module.exports = mongoose.model('Note', noteSchema)