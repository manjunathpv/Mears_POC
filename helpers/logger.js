'use strict'

import morgan from 'morgan'
import logger from 'winston'
import moment from 'moment'
import fs from 'fs'
logger.transports.DailyRotateFile = require('winston-daily-rotate-file')

const logDir = 'log'
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir)
}

const tsFormat = () => moment().format('YYYY-MM-DD HH:mm:ss.SSSS')

logger.add(logger.transports.File,
  { level: 'info',
    dirname: process.env.EVENT_LOG_FILE_DIR,
    filename: process.env.EVENT_LOG_FILE_NAME + '.log',
    timestamp: tsFormat }
)
logger.remove(logger.transports.Console)

logger.add(logger.transports.Console,
  { level: 'debug',
    colorize: true,
    timestamp () {
      return moment().format('YYYY-MM-DD HH:mm:ss.SSSS')
    },
    prettyPrint: function (object) {
      if (Array.isArray(object)) {
        return object.toString()
      } else {
        return JSON.stringify(object)
      }
    } })
logger.add(logger.transports.DailyRotateFile, {
  filename: process.env.EVENT_LOG_FILE_NAME + '-',
  dirname: process.env.EVENT_LOG_FILE_DIR,
  datePattern: 'ddMMyyyy.log',
  maxsize: 1000000 })
logger.log(logger)
logger.log(morgan('combined'))

module.exports = logger
