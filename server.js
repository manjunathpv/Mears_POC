'use strict'

require('dotenv').config({silent: true})
let cogniUtil = require('./helpers/cogni-util')
const logger = cogniUtil.logger

const server = require('./cogniapp')
const port = process.env.PORT || process.env.VCAP_APP_PORT || 3000

server.listen(port, function() {
    logger.info('Server running on port: %d', port)
})

process.on('unhandledRejection', (error) => {
    logger.error(error)
    process.exit(1)
})
