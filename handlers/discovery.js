'use strict'

const request = require('request')

const cogniUtil = require('./../helpers/cogni-util')
const config = require('./../config');

const logger = cogniUtil.logger
const discoveryEnvId = config.discoveryEnvId
const discoveryCollectionId = config.discoveryCollectionId
const nodeRedbaseUrl = config.nodeRedBaseUrl


const discoveryQuery = (param, callback) => {
    const options = {
        baseUrl: nodeRedbaseUrl,
        url: '/discovery',
        method: 'POST',
        body: {
            query: param.query,
            discovery_env_id: discoveryEnvId,
            discovery_collection_id: discoveryCollectionId
        },
        json: true
    };

    request.post(options, (error, response, body) => {
        console.log('response from discovery: error: ', error, ' response: ', response, ' body: ', body)
        if (error) {
            logger.error('Error: Unable to query discovery service', error);
            return callback(error, null);
        }
        return callback(null, { data: body });
    });
}


module.exports = Object.assign(module.exports, {
    discoveryQuery: discoveryQuery
})
