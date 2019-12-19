const db = require('../data/dbConfig.js')

function addUser(user) {
  return db('user').insert(user)
}

function login(user) {
  const {username} = user
  return db('user').where({username}).first()
}

function getUsers() {
  return db('user').column('id', 'username').orderBy('id')
}

module.exports = {
  addUser,
  getUsers,
  login
}