'use strict'

import 'babel-core/register'
import 'babel-polyfill'
const morgan = require('morgan')
const fs = require('fs')
const path = require('path')
const express = require('express')
const cookieParser = require('cookie-parser')
const session = require('express-session')
const passport = require('passport')

import config from './config'
const db = require('./helpers/db');
const authRoutes = require('./routes/auth')
const userRoutes = require('./routes/user')
const ticketRoutes = require('./routes/tickets')

const accesslogDir = process.env.ACCESS_LOG_FILE_DIR
const accesslogFileName = process.env.ACCESS_LOG_FILE_NAME

if (!fs.existsSync(accesslogDir)) {
    fs.mkdirSync(accesslogDir)
}

const app = express()
app.use(express.static('./public'))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser(config.sessionSecret))
/* app.use(session({
    secret: config.sessionSecret,
    resave: false,
    saveUninitialized: true,
    cookie: {maxAge: config.cookieExpiration}
})) */
app.use(passport.initialize())
app.use(passport.session())

const accessLogStream = fs.createWriteStream(path.join(accesslogDir, accesslogFileName), { flags: 'a' })
app.use(express.json())
app.use(morgan('combined', { stream: accessLogStream }))

app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*")
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, sessionId, session_id, Accept")
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT')
    res.setHeader('Access-Control-Allow-Credentials', true)
    next()
})

app.use('/auth', authRoutes)
app.use('/user', userRoutes)
app.use('/tickets', ticketRoutes)

module.exports = app
