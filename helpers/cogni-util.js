'use strict'

import logger from './logger'
import errorHandler from './error-handler'
import responseCodes from './response-codes'
import responseBuilder from './response-builder'
import commonUtil from './common-util'
const validator = require('./validator')

module.exports = Object.assign(module.exports, {
  logger: logger,
  errorHandler: errorHandler,
  responseCodes: responseCodes,
  responseBuilder: responseBuilder,
  commonUtil: commonUtil,
  validator: validator
})
