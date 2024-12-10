const bcrypt = require('bcrypt')
const usersRouter = require('express').Router()
const User = require('../models/user')


usersRouter.get('', async (request, response) => {
    const users = await User.find({}).populate('blogs', { title : 1, author : 1, url : 1, id : 1})
    response.json(users)
})

// creating a user
usersRouter.post('/', async (request, response) => {

    // deconstructor
    const { username, name, password } = request.body

    // find the user in db
    const userFind = await User.findOne({ username })

    // check if user exists
    if (userFind) {
        return response.status(400).json({
            error: 'username is already taken.'
        })
    }

    // validate pass is >= 3 char long
    if (password.length <= 3) {
        return response.status(400).json({
            error: 'password should be at least 3 characters long'
        })
    }

    if (username.length <= 3) {
        return response.status(400).json({
            error: 'username is shorter than minimum allowed length'
        })
    }

    // otherwise, save user to db but first hash password
    const passwordHash = await bcrypt.hash(password, 10)

    // create obj to be sent to db
    const userObj = new User({
        username,
        name,
        passwordHash
    })

    // save user to db
    const savedUser = await userObj.save()
    return response.status(201).json(savedUser)
})

module.exports = usersRouter