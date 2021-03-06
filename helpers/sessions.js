'use strict'

const moment = require('moment')

const workflow = require('./../handlers/workflow')
const crypto = require('./crypto')

const sessionHashSpliter = ':'

const _createSessionHash = (userKey) => {
  return userKey + sessionHashSpliter + moment().unix()
}

const _explodeSessionHash = (hash) => {
  const sessionDetails = hash.split(sessionHashSpliter)
  return sessionDetails[0]
}

const buildSession = (user) => {
  return { session_id: crypto.encrypt(_createSessionHash(user.username)) }
}

const getUserInfoFromSession = (session_id, callback) => {
  const username = _explodeSessionHash(crypto.decrypt(session_id))
  workflow.searchUser(username, (error, user) => {
    if (error) {
      console.log('Error: Unable to get the user with email: ', email)
      return callback(error, null)
    }
    callback(null, user)
  })
}

module.exports = Object.assign(module.exports, {
  buildSession: buildSession,
  getUserInfoFromSession: getUserInfoFromSession
})
