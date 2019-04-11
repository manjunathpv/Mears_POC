'use strict'

import _ from 'lodash'
import express from 'express'

import cogniUtil from './../helpers/cogni-util'
// import auth from './../handlers/auth
const liteDB = require('../handlers/litedb')

const logger = cogniUtil.logger
const errors = cogniUtil.errorHandler
const responseBuilder = cogniUtil.responseBuilder
const validator = cogniUtil.validator
const app = express()
app.use(express.json())

app.post('/register', (req, res, next) => {
  if (!_.has(req.body, 'firstname') || !_.has(req.body, 'username') || !_.has(req.body, 'password')) {
    logger.error('Error: Missing or invalid parameters.')
    return responseBuilder(req, res, errors.missingParameter(true), null)
  }
  if (!validator.validatePassword(req.body.password)) {
    logger.error('Error: Your password should contain atleast 1 Uppercase, 1 Lowercase, 1 Special characters.')
    return responseBuilder(req, res, errors.FormatError(true), null)
  }
  // auth.passport.authenticate('login', (error, sessionDetail) => {
  //   console.log(sessionDetail)
  //   if (error) {
  //     logger.error('Error: Unable to authenticate user with error: ', error)
  //     return responseBuilder(req, res, errors.formatErrorForWire(error), null)
  //   }
  //   responseBuilder(req, res, null, sessionDetail)
  // })(req, res, next)
  liteDB.register(req, res)
})

app.post('/login', (req, res) => {
  liteDB.login(req, res)
})

module.exports = app
