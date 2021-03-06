'use strict'

import _ from 'lodash'
import express from 'express'

import cogniUtil from './../helpers/cogni-util'
import auth from './../handlers/auth'

const logger = cogniUtil.logger
const errors = cogniUtil.errorHandler
const responseBuilder = cogniUtil.responseBuilder
const app = express()
app.use(express.json())

app.post('/login', (req, res, next) => {
  if (!_.has(req.body, 'username') || !_.has(req.body, 'password')) {
    logger.error('Error: Missing or invalid parameters.')
    return responseBuilder(req, res, errors.missingParameter(true), null)
  }
  auth.passport.authenticate('login', (error, sessionDetail) => {
    console.log(sessionDetail)
    if (error) {
      logger.error('Error: Unable to authenticate user with error: ', error)
      return responseBuilder(req, res, errors.formatErrorForWire(error), null)
    }
    responseBuilder(req, res, null, sessionDetail)
  })(req, res, next)
})

app.post('/logout', (req, res) => {
  if (!req.header('session_id')) {
    logger.error('Error: Missing or invalid parameters.')
    return responseBuilder(req, res, errors.missingParameter(true), null)
  }
  req.logout()
  responseBuilder(req, res, null, null)
})

module.exports = app
