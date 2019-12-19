const express = require('express')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const Users = require('./model/user_model.js')

const server = express()

const jwtSecret = 'Cool Wow Awesome Neat'

server.use(express.json())

server.post('/api/register', (req, res) => {
  const creds = req.body
  const hash = bcrypt.hashSync(creds.password, 14)
  creds.password = hash
  console.log(creds)
  Users.addUser(creds)
    .then(id => res.status(201).json(creds.username))
    .catch(err => res.status(500).json({msg: 'error adding user'}))
})

server.post('/api/login', (req, res) => {
  creds = req.body
  Users.login(creds)
    .then(user => {
      if (user && bcrypt.compareSync(creds.password, user.password)) {
        const token = generateToken(user)
        res.status(200).json({msn: "logged in", token})
      } else {
        res.status(401).json({msg: 'invalid credentials'})
      }
    })
    .catch(err => res.status(500).json({msg: 'unexpected error while logging in' + err}))
})

server.get('/api/users', authorize, (req, res) => {
  Users.getUsers()
    .then(users => res.status(400).json(users))
    .catch(err => 'error getting users')
})

function generateToken(user) {
  const payload = {
    subject: user.id,
    username: user.username,
  }

  const options = {
    expiresIn: '1d', // show other available options in the library's documentation
  }

  return jwt.sign(payload, jwtSecret, options)
}

function authorize(req, res, next) {
  const { authorization } = req.headers;

  if (authorization) {
    jwt.verify(authorization, jwtSecret, function(err, decodedToken) {
      if (err) {
        res.status(401).json({ message: "Invalid Token" });
      } else {
        req.token = decodedToken;
        next();
      }
    });
  } else {
    res.status(400).json({ message: "Please login and try again" });
  }
}


module.exports = server