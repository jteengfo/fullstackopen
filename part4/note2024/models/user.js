const mongoose = require('mongoose')

// initialize schema
const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    name: String,
    passwordHash: String,
    notes: [                                    // an array of Mongo ids
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Note'
        }
    ]
})

// transform schema to remove .__id and .__v
userSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
        delete returnedObject.passwordHash  // should never be revealed
    }
})

// create model using user schema
const User = mongoose.model('User', userSchema)

module.exports = User