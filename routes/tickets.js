'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const tickets = require('./../handlers/tickets');

const app = express();
app.use(bodyParser.json());

app.post('/create-ticket', (req, res) => {
    tickets.createTicket(req.body, (error, data) => {
        if (error) {
            console.log('error: ', error);
            return res.status(error.code || 500).json(error);
        }
        return res.json(data);
    });
});

module.exports = app;
