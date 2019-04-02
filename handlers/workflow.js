'use strict'

import * as userBase from './user-base'


const authentication = (param, callback) => {
    userBase.authenticate(param, callback)
}

const unlockAccount = (userDetail, callback) => {
    userBase.unlockAccount(userDetail, callback)
}

const searchUser = (email, callback) => {
    userBase.searchUser(email, callback)
}


module.exports = Object.assign(module.exports, {
    authentication: authentication,
    unlockAccount: unlockAccount,
    searchUser: searchUser
})
