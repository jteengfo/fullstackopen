// const mongoose = require('mongoose')

// // if number of arguments passed < 3
// if (process.argv.length < 3) {
//     console.log('give password as argument');
//     process.exit(1);
// }

// // password is the last argument
// const pass = process.argv[2]

// // url to the database
// const url = process.env.MONGODB_URI

// mongoose.set('strictQuery', false)

// mongoose.connect(url)
//     .then(result => {
//         console.log('connected to MongoDB');
//     })
//     .catch(error => {
//         console.log('error connecting to MongoDB', error.message)
//     })

// // document schema
// const noteSchema = new mongoose.Schema({
//     content: String,
//     important: Boolean,
// })

// const Note = mongoose.model('Note', noteSchema)

// creating a note object
// const note = new Note({
//     content: 'Okay another note incoming',
//     important: false,
// })


// saving that note object to the db
// note.save().then(result => {
//     console.log('note successfully saved')
//     mongoose.connection.close()
// })

// parameter in find is search condition -- {} empty obj = get all notes
// could also do {important: true}
// Note.find({important: true}).then(result => {
//     result.forEach(note => {
//         console.log(note);
//     })
//     mongoose.connection.close();
// })
