'use strict'

import * as ldap from 'ldapjs'
import _         from 'lodash'

import * as cogniUtil from './../helpers/cogni-util'
import sessions       from './../helpers/sessions'
import * as config    from './../config'


const logger = cogniUtil.logger
const errors = cogniUtil.errorHandler
const ldapAdminUsername = config.ldapAdminUsername
const ldapAdminPassword = config.ldapAdminPassword
const ldapServerDomain = config.ldapServerDomain
const ldapServerPort = config.ldapServerPort

const _authentication = (username, password, callback) => {
    const url = 'ldap://' + ldapServerDomain + ':' + ldapServerPort
    const ldapParams = {
        url: url,
        timeout: 5000000,
        connectTimeout: 5000000,
        reconnect: true
    }
    const ldapClient = ldap.createClient(ldapParams)
    ldapClient.bind(username, password, (error, status) => {
        _unbind(ldapClient, error, error ? null : status, callback)
    })
}

const authenticate = (credentials, callback) => {
    _authentication(credentials.username, credentials.password, (error, status) => {
        if (!error) {
            return callback(errors.noError(), status)
        }
        searchUser(credentials.username, (error, user) => {
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

const searchUser = (username, callback) => {
    const url = 'ldap://' + ldapServerDomain + ':' + ldapServerPort
    const ldapParams = {
        url: url,
        timeout: 5000000,
        connectTimeout: 5000000,
        reconnect: true
    }
    const ldapClient = ldap.createClient(ldapParams)
    ldapClient.bind(ldapAdminUsername, ldapAdminPassword, (error) => {
        if (error) {
            logger.error('Error: while authenticating as LDAP Admin', error)
            return callback(errors.internalServer(false), null)
        }
        let searchEntry
        const userDetail = username.split('@')
        ldapClient.search('dc=' + userDetail[1].replace(/\./g, ',dc='), {
            scope: 'sub',
            filter: '(userPrincipalName=' + username + ')'
        }, (error, ldapResult) => {
            if (error) {
                logger.error('Error: LDAP search for user error', error)
                _unbind(ldapClient, errors.internalServer(false), null, callback)
            }
            ldapResult.on('searchEntry', (entry) => {
                searchEntry = entry
            })
            ldapResult.on('error', function (err) {
                logger.error('Error: while searching for user with username: ', username, err.message);
                _unbind(ldapClient, errors.internalServer(false), null, callback)
            });
            ldapResult.on('end', function () {
                if (searchEntry) {
                    _unbind(ldapClient, errors.noError(), searchEntry, callback)
                } else {
                    logger.debug('User with username: ', username, ' is not found!')
                    _unbind(ldapClient, errors.resourceNotFound(false), null, callback)
                }
            })
        })
    })
}

const unlockAccount = (userDetails, callback) => {
    const url = 'ldap://' + ldapServerDomain + ':' + ldapServerPort
    const ldapParams = {
        url: url,
        timeout: 5000000,
        connectTimeout: 5000000,
        reconnect: true
    }
    const ldapClient = ldap.createClient(ldapParams)
    ldapClient.bind(ldapAdminUsername, ldapAdminPassword, (error) => {
        if (error) {
            logger.error('Error: while authenticating as LDAP Admin', error)
            return callback(errors.internalServer(false), null)
        } else {
            const userDetail = userDetails.username.split('@')
            let searchEntry
            ldapClient.search('dc=' + userDetail[1].replace(/\./g, ',dc='), {
                scope: 'sub',
                filter: '(userPrincipalName=' + userDetails.username + ')'
            }, (ldapError, ldapResult) => {
                ldapResult.on('searchEntry', (entry) => {
                    searchEntry = entry
                })
                ldapResult.on('error', function (err) {
                    logger.error('Error: while searching for user with username: ', userDetails.username, err.message)
                    _unbind(ldapClient, errors.internalServer(false), null, callback)
                });
                ldapResult.on('end', function () {
                    if (!searchEntry) {
                        logger.debug('User with username: ', userDetails.username, ' is not found!')
                        _unbind(ldapClient, errors.resourceNotFound(false), null, callback)
                    }
                    const options = [
                        new ldap.Change({
                            operation: 'replace',
                            modification: {
                                LockOutTime: '0'
                            }
                        })
                    ]
                    ldapClient.modify(searchEntry.objectName, options, (ldapUpdateError) => {
                        if (ldapUpdateError) {
                            logger.error('LDAP authentication error: ', ldapUpdateError)
                            _unbind(ldapClient, errors.internalServer(false), null, callback)
                        }
                        logger.info('The account has been unlocked for the user: ', userDetails.username)
                        _unbind(ldapClient, null, null, callback)
                    })
                })
            })
        }
    })
}

const userStatus = (userDetail, callback) => {
    searchUser(userDetail.username, (error, user) => {
        if (error) {
            logger.error('Error: Unable to search the user with username: ', userDetail.username)
            return callback(error, null)
        }
        if (userDetail.phone_number !== getPropertyFromUserEntity(user, 'telephoneNumber', false)) {
            logger.error('Error: The phone number is not matching with the registered phone number.')
            return callback(errors.unauthorizedAccess(false), null)
        }
        const userStatus = getPropertyFromUserEntity(user, 'lockoutTime', false)
        callback(errors.noError(), {user_status: {account_locked: userStatus !== '0'}})
    })
}

const _unbind = (ldapClient, error, data, callback) => {
    ldapClient.unbind(() => {
        callback(error, data)
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
    const userDetails = _.find(user.attributes, {type: property})
    if (isAll) {
        return userDetails.vals
    }
    return userDetails.vals[0]
}


module.exports = Object.assign(module.exports, {
    authenticate: authenticate,
    searchUser: searchUser,
    unlockAccount: unlockAccount,
    userStatus: userStatus,
    getUser: getUser,
    getUserEntities: getUserEntities,
    getPropertyFromUserEntity: getPropertyFromUserEntity
})
