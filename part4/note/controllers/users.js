const bcrypt = require('bcrypt')
const usersRouter = require('express').Router()
const User = require('../models/user')

usersRouter.get('/', async (request, response) => {

  const users = await User.find({}).populate('blog')

  response.json(users)
})

usersRouter.post('/', async (request, response) => {

  const { username, name, password } = request.body

  const userFind = await User.findOne({ username })

  if (userFind) {
    return response.status(400).json({
      error: 'username already taken. expected `username` to be unique'
    })
  }

  const saltRounds = 10
  const passwordHash = await bcrypt.hash(password, saltRounds)

  const user = new User({
    username,
    name,
    passwordHash
  })

  const savedUser = await user.save()

  response.status(201).json(savedUser)
})

module.exports = usersRouter