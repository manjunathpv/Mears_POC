'use strict'

const express = require('express')
const bodyParser = require('body-parser')
const discovery = require('./../handlers/discovery')

const app = express()
app.use(bodyParser.json())


app.post('/query', (req, res, next) => {
    discovery.discoveryQuery({ query: req.body.query }, (error, data) => {
        console.log('got discovery res: error: ', error, ' res: ', data)
        if (error) {
            console.log('Error: Unable to query the discovery with error: ', error)
            return res.status(error.code || error.statusCode || 500).json(error)
        }
        return res.json(data)
    })
})


module.exports = app
