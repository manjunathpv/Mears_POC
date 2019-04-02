'use strict';

const express = require('express');
const request = require('request');
const IcdBaseUrl = process.env.ICD_BASE_URL;
const app = express();

const createTicket = (ticketParams, callback) => {
    const options = {
        headers: { 'content-type': 'application/json', cookie: process.env.ICD_COOKIE },
        url: IcdBaseUrl + 'createTicket',
        json: true,
        qs: { priority: 4, description: 'Unlock account issue' },
    };

    request.post(options, (error, response, body) => {
        if (error) {
            console.log('Error: Unable to create ticket with ', error);
            return callback(error, null);
        }
        return callback(null, { data: body });
    });
};

module.exports = {
    createTicket: createTicket
};
