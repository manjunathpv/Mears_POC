'use strict'

import express from 'express'
import _       from 'lodash'

import cogniUtil     from './../helpers/cogni-util'
import requestHelper from './../helpers/request-helper'
import userBase      from './../handlers/user-base'
import workflow      from './../handlers/workflow'
import auth          from './../handlers/auth'


const logger = cogniUtil.logger
const errors = cogniUtil.errorHandler
const responseBuilder = cogniUtil.responseBuilder
const app = express()


app.post('/user-status', (req, res) => {
    if (!_.has(req.body, 'username') || !_.has(req.body, 'phone_number')) {
        logger.error('Error: Missing or invalid parameters.')
        return responseBuilder(req, res, errors.missingParameter(true), null)
    }
    userBase.userStatus(req.body, (error, userStatus) => {
        if (error) {
            return responseBuilder(req, res, errors.formatErrorForWire(error), null)
        }
        responseBuilder(req, res, null, userStatus)
    })
})

app.post('/unlock-account', (req, res) => {
    if (!_.has(req.body, 'username') || !_.has(req.body, 'phone_number')) {
        logger.error('Error: Missing or invalid parameters.')
        return responseBuilder(req, res, errors.missingParameter(true), null)
    }
    workflow.unlockAccount({username: req.body.username}, (error) => {
        if (error) {
            logger.error('Error: Unable to authenticate user with error: ', error)
            return responseBuilder(req, res, errors.formatErrorForWire(error), null)
        }
        responseBuilder(req, res, null, null)
    })
})

app.post('/get-user', auth.checkAuthentication, (req, res) => {
    if (!req.header('session_id')) {
        logger.error('Error: Missing or invalid parameters.')
        return responseBuilder(req, res, errors.missingParameter(true), null)
    }
    requestHelper.authenticateUser(req.header('session_id'), (error) => {
        if (error) {
            return responseBuilder(req, res, errors.formatErrorForWire(error), null)
        }
        userBase.getUser({session_id: req.header('session_id')}, (error, user) => {
            if (error) {
                logger.error('Error getting user information. ', error)
                return responseBuilder(req, res, errors.formatErrorForWire(error), null)
            }
            responseBuilder(req, res, null, _.pick(user, 'name', 'username', 'phone_number'))
        })
    })
})


module.exports = app
