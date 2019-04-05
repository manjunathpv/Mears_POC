'use strict'

import workflow from './workflow'

const userStatus = (userDetail, callback) => {
  workflow.userStatus(userDetail, callback)
}

module.exports = Object.assign(module.exports, {
  userStatus: userStatus
})
