'use strict'

import * as responseCodes from './response-codes'

function CustomError (message, code, name = 'CustomError') {
  this.name = name
  this.message = message || 'Default Message'
  this.code = code
  this.stack = (new Error()).stack
}

CustomError.prototype = Object.create(Error.prototype)
CustomError.prototype.constructor = CustomError

module.exports = {
  formatErrorForWire: function (CustomError) {
    delete CustomError.stack
    return CustomError
  },
  missingParameter: function (formatForWire) {
    const error = new CustomError(
      'There are one or more parameters missing in the supplied request',
      responseCodes.badRequest,
      'MissingParameter'
    )
    return formatForWire ? this.formatErrorForWire(error) : error
  },
  internalServer: function (formatForWire) {
    const error = new CustomError(
      'Internal server error',
      responseCodes.internalServerError,
      'InternalServerError'
    )
    return formatForWire ? this.formatErrorForWire(error) : error
  },
  resourceNotFound: function (formatForWire) {
    const error = new CustomError('Resource Not Found', responseCodes.notFound, 'ResourceNotFound')
    return formatForWire ? this.formatErrorForWire(error) : error
  },
  unauthorizedAccess: function (formatForWire) {
    const error = new CustomError(
      'Unauthorized access to resource',
      responseCodes.unauthorized,
      'UnauthorizedAccess'
    )
    return formatForWire ? this.formatErrorForWire(error) : error
  },
  sessionExpired: function (formatForWire) {
    const error = new CustomError(
      'Session has been expired',
      responseCodes.requestExpired,
      'sessionExpired'
    )
    return formatForWire ? this.formatErrorForWire(error) : error
  },
  invalidParameter: function (formatForWire) {
    const error = new CustomError(
      'Invalid parameter in request body',
      responseCodes.badRequest,
      'InvalidParameter'
    )
    return formatForWire ? this.formatErrorForWire(error) : error
  },
  notAllowed: function (formatForWire) {
    const error = new CustomError(
      'Not allowed to do the particular operation',
      responseCodes.forbidden,
      'Forbidden'
    )
    return formatForWire ? this.formatErrorForWire(error) : error
  },
  customError: function (message, code, name, formatForWire) {
    const error = new CustomError(message, code, name)
    return formatForWire ? this.formatErrorForWire(error) : error
  },
  noError: function () {
    return null
  }
}
