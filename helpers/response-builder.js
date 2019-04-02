'use strict'

import moment from 'moment'

import * as responseCodes from './response-codes'
import commonUtil from './common-util'
import auditLog from './auditLog'
let config = require('./../config')

const responseBuilder = (req, res, error, payload) => {
    let statusCode
    if (!!error) {
        statusCode = error.code || responseCodes.badRequest
    } else {
        statusCode = responseCodes.ok
    }
    /*const auditLogParams = {
        method: req.method,
        request_url: req.originalUrl,
        body: req.body,
        http_status: statusCode,
        session_id: req.header('session_id') ? req.header('session_id') : null,
        //user_id: req.body.username,
        client_id: config.preferences.tempClientId,
       // transaction_id: req.body.transaction_id ? req.body.transaction_id : commonUtil.generateRandomChars(32),
        response: error ? payload : null,
        //response_time: moment().unix() - Math.floor(req._startTime.getTime() / 1000)
    }
   /* auditLog(auditLogParams, () => {
        res.status(statusCode).send(JSON.stringify({
            error: error,
            payload: payload,
            status_code: statusCode
        }))
    }) */

    res.status(statusCode).send(JSON.stringify({
        error: error,
        payload: payload,
        status_code: statusCode
    }))

    return res;
}

module.exports = responseBuilder
