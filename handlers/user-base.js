'use strict'

import _ from 'lodash'

import * as cogniUtil from './../helpers/cogni-util'
import sessions from './../helpers/sessions'

const logger = cogniUtil.logger
const errors = cogniUtil.errorHandler

const _authentication = (username, password, callback) => {

}

const authenticate = (credentials, callback) => {
  _authentication(credentials.username, credentials.password, (error, status) => {
    if (!error) {
      return callback(errors.noError(), status)
    }
    getUser(credentials.username, (error, user) => {
      if (error) {
        return callback(error, null)
      }
      if (getPropertyFromUserEntity(user, 'userPassword', false) !== credentials.password) {
        logger.error('Error: Incorrect password for user with username: ', credentials.username, error)
        return callback(errors.unauthorizedAccess(false), null)
      }
      logger.error('User with username: ', credentials.username, ' account must be locked. ', error)
      callback(errors.notAllowed(false), null)
    })
  })
}

const userStatus = (userDetail, callback) => {
  getUser(userDetail.username, (error, user) => {
    if (error) {
      logger.error('Error: Unable to search the user with username: ', userDetail.username)
      return callback(error, null)
    }
    if (userDetail.phone_number !== getPropertyFromUserEntity(user, 'telephoneNumber', false)) {
      logger.error('Error: The phone number is not matching with the registered phone number.')
      return callback(errors.unauthorizedAccess(false), null)
    }
    const userStatus = getPropertyFromUserEntity(user, 'lockoutTime', false)
    callback(errors.noError(), { user_status: { account_locked: userStatus !== '0' } })
  })
}

const getUserEntities = (user) => {
  const userDetails = {
    name: getPropertyFromUserEntity(user.json, 'name'),
    username: getPropertyFromUserEntity(user.json, 'userPrincipalName'),
    phone_number: getPropertyFromUserEntity(user.json, 'telephoneNumber'),
    account_status: getPropertyFromUserEntity(user.json, 'lockoutTime')
  }
  return userDetails
}

const getUser = (param, callback) => {
  if (!param.session_id) {

  }
  sessions.getUserInfoFromSession(param.session_id, (error, user) => {
    if (error) {
      logger.error('Error: getting the user with session_id: ', param.session_id, error)
      return callback(error, null)
    }
    if (!user) {
      logger.error('Error: User doesn\'t exist')
      callback(errors.resourceNotFound(false), null)
      return
    }
    callback(null, getUserEntities(user))
  })
}

const getPropertyFromUserEntity = (user, property, isAll = false) => {
  const userDetails = _.find(user.attributes, { type: property })
  if (isAll) {
    return userDetails.vals
  }
  return userDetails.vals[0]
}

module.exports = Object.assign(module.exports, {
  authenticate: authenticate,
  userStatus: userStatus,
  getUser: getUser,
  getUserEntities: getUserEntities,
  getPropertyFromUserEntity: getPropertyFromUserEntity
})
