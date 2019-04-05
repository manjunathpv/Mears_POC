'use strict'

import cogniUtil from './cogni-util'
import commonUtil from './common-util'
import sessions from './sessions'
import userBase from './../handlers/user-base'

const logger = cogniUtil.logger
const errors = cogniUtil.errorHandler

const generateTransactionID = () => {
  return commonUtil.generateRandomChars(15)
}

const authenticateUser = (token, callback) => {
  sessions.getUserInfoFromSession(token, (error, user) => {
    if (error) {
      logger.error('Error: Unable to parse user token')
      return callback(error, null)
    }
    callback(errors.noError(), userBase.getUserEntities(user))
  })
}

module.exports = {
  generateTransactionID: generateTransactionID,
  authenticateUser: authenticateUser
}
