'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const chatbot = require('./../handlers/chatbot');
const db = require('./../helpers/db');
const _ = require('lodash');

const app = express();
app.use(bodyParser.json());

app.post('/conversation', (req, res) => {
    chatbot.conversation(req.body, (err, data) => {
        if (err) {
            console.log('error: ', err);
            return res.status(err.code || 500).json(err);
        }
        return res.json(data);
    });
});

app.post('/get-all-chat', (req, res) => {
    db.getAll((err, chats) => {
        if (err) {
            console.log('error: ', err);
            return res.status(err.code || err.statusCode || 500).json(err);
        }
        console.log('chats: ', chats)
        return res.json(chats);
    })
})

app.post('/get-chat', (req, res) => {
    db.get(db.databases.skitter, { email: req.body.email }, (err, chats) => {
        if (err) {
            console.log('Error while getting chats with ', req.body.email, ': ', err);
            return res.status(err.code || err.statusCode || 500).json(err);
        }
        console.log('chats: ', chats)
        return res.json(chats);
    })
})
    

module.exports = app;
