const mongoose = require('mongoose')

// create schema
const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        minLength: 3,
    },
    name: String,
    passwordHash: String,
    blogs: [
        {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Blog'
        }
    ],
})

// modify schema ('toJSON', { transform })
userSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
        delete returnedObject.passwordHash
    }
})

// create Model using Schema configured
const User = mongoose.model('User', userSchema)

module.exports = User