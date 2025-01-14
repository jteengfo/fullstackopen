const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const User = require('../models/user')
const { request } = require('../app')

const loginRouter = require('express').Router()

loginRouter.post('/', async (request, response) => {
    // grab the username password client inputted 
    const { username, password } = request.body 

    // check if user exists from db using username
    const user = await User.findOne({ username })

    // check if password sent is correct
    const passwordCorrect = user === null 
        ? false 
        : await bcrypt.compare(password, user.passwordHash)
    
    // if false then return 401 
    if(!(user && passwordCorrect)) {
        return response.status(401).json({
            error: 'invalid username or password'
        })
    }

    // means valid; initialize token content
    const userForToken = {
        username: user.username,
        id: user._id
    }

    // create token 
    const token = jwt.sign(userForToken, process.env.SECRET)

    response
        .status(200)
        .send({
            token,
            username: user.username,
            name: user.name
        })
})

module.exports = loginRouter