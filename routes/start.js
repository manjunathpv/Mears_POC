'use strict'

import express from 'express'
import cogniUtil from './../helpers/cogni-util'

const logger = cogniUtil.logger

const app = express()

app.get('/', (req, res) => {
  logger.info('Welcome to Mears!!')
})
