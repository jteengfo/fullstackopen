const mongoose = require('mongoose')
require('dotenv').config()

// url to the database
const url = process.env.TEST_MONGODB_URI

mongoose.set('strictQuery', false)

mongoose.connect(url)
  .then(() => {
    console.log('connected to MongoDB')
  })
  .catch(error => {
    console.log('error connecting to MongoDB', error.message)
  })

// document schema
const noteSchema = new mongoose.Schema({
  content: String,
  important: Boolean,
})

const Note = mongoose.model('Note', noteSchema)

// creating a note object
const note = new Note({
  content: 'second note',
  important: false,
})


// saving that note object to the db
note.save().then(() => {
  console.log('note successfully saved')
  mongoose.connection.close()
})

// parameter in find is search condition -- {} empty obj = get all notes
// could also do {important: true}
// Note.find({ important: true }).then(result => {
//   result.forEach(note => {
//     console.log(note)
//   })
//   mongoose.connection.close()
// })
