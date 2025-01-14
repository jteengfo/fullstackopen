const bcrypt = require('bcrypt')
const User = require('../models/user')

const userRouter = require('express').Router()

userRouter.get('/', async (request, response) => {
    const users = await User.find({}).populate('blogs', {title: 1, author: 1, url: 1})
    response.json(users)
})

userRouter.post('/', async (request, response) => {
    try {
        // get username, name, pass from request
        const { username, name, password } = request.body 
        const saltRounds = 10
        
        // hash password
        if (!password || password.length < 3) {
            return response.status(400).json({ error: "password must be at least 3 characters required"})
        } else if (!username || username.length < 3) {
            return response.status(400).json({ error: "username must be at least 3 characters required"})
        }

        const passwordHashed = await bcrypt.hash(password, saltRounds)
        
        // create user object
        const user = new User({
            username,
            name,
            passwordHash: passwordHashed
        })

        // save user to db
        savedUser = await user.save()
        response.status(201).json(savedUser)
    } catch (error) {
        if (error.name === "MongoServerError" && error.code === 11000) {
            // Handle duplicate key error
            return response.status(400).json({ error: "username must be unique" })
        }
        next(error)
    }
        
    
})

module.exports = userRouter