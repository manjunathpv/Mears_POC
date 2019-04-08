'use strict'

import express from 'express'
import cogniUtil from './../helpers/cogni-util'

const logger = cogniUtil.logger
const responseBuilder = cogniUtil.responseBuilder

const app = express()

app.get('/', (req, res) => {
  logger.info('Welcome to Mears!!')
  const welcomeMsg = 'Welcome to Mears!!'
  res.json({ 'message': welcomeMsg })
})

module.exports = app
