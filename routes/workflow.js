'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const workflow = require('./../handlers/workflow');

const app = express();
app.use(bodyParser.json());

app.post('/authentication', (req, res) => {
    workflow.authentication(req.body, (error, data) => {
        if (error) {
            console.log('error: ', error);
            return res.status(error.code || 500).json(error);
        }
        return res.json(data);
    });
});

app.post('/unlock-account', (req, res) => {
    workflow.unlockAccount(req.body, (error, data) => {
        if (error) {
            console.log('error: ', error);
            return res.status(error.code || 500).json(error);
        }
        return res.json(data);
    });
});

module.exports = app;
