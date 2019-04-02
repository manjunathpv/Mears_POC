'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const cognichatbothandler = require('./../handlers/cognichatbot');


const app = express();
app.use(bodyParser.json());

app.post('/message', (req, res) => {
    cognichatbothandler.message(req.body, res,(error, data) => {
        if (error) {
            console.log('error: ', error);
            return res.status(error.code || 500).json(error);
        }
        return res.json(data);
    });
});

module.exports = app