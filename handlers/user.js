'use strict'

const userBase = require('./user-base')

const userStatus = (userDetail, callback) => {
  userBase.userStatus(userDetail, callback)
}

module.exports = Object.assign(module.exports, {
  userStatus: userStatus
})
