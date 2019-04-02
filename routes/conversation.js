'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const conversation = require('./../handlers/conversation');


const app = express();
app.use(bodyParser.json());

app.post('/message', (req, res) => {
    conversation.message(req.body, (error, data) => {
        if (error) {
            console.log('error: ', error);
            return res.status(error.code || 500).json(error);
        }
        return res.json(data);
    });
});

module.exports = app