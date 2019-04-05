'use strict'

const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
// const ls = require('lodash')

const cogniUtil = require('./../helpers/cogni-util')
const sessions = require('./../helpers/sessions')
const userBase = require('./user-base')

const logger = cogniUtil.logger
const errors = cogniUtil.errorHandler
const responseBuilder = cogniUtil.responseBuilder

passport.use('login', new LocalStrategy(
  {
    usernameField: 'username',
    passwordField: 'password',
    passReqToCallback: true
  }, (req, username, password, callback) => {
    logger.info('authenticating user with username: ', username, 'password: ', password)
    userBase.authentication({ username: username, password: password }, (error) => {
      if (error) {
        logger.error('Error: authenticating the user', error)
        callback(error, null)
        return
      }
      userBase.searchUser(username, (ldapError, ldapResult) => {
        if (error) {
          logger.error('Error: authenticating. Unable to find the user with username: ', username, ldapError)
          callback(error, null)
          return
        }
        if (!ldapResult) {
          logger.error('Error: user does not exist')
          callback(errors.resourceNotFound(false), null)
          return
        }
        const user = userBase.getUserEntities(ldapResult)
        req.logIn(sessions.buildSession({ username: user.username }), (error) => {
          if (error) {
            logger.error('Error: Unable to create login session')
            callback(errors.internalServer(false), null)
          }
          callback(null, { session: { id: req.user.session_id } })
        })
      })
    })
  })
)

passport.serializeUser((user, callback) => {
  callback(null, user.session_id)
})

passport.deserializeUser((session_id, callback) => {
  sessions.getUserInfoFromSession(session_id, callback)
})

const checkAuthentication = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next()
  } else {
    logger.info('The user is not logged in')
    return responseBuilder(req, res, errors.sessionExpired(true), null)
  }
}

module.exports = Object.assign(module.exports, {
  passport: passport,
  checkAuthentication: checkAuthentication
})
