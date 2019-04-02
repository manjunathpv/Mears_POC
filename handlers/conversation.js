'use strict';

const Conversation = require('watson-developer-cloud/conversation/v1');
const moment = require('moment');
const createAuditLog=require('../helpers/auditLog');

const cogniUtil = require('./../helpers/cogni-util')
const workflowHandler = require('./workflow');
const ticketsHandler = require('./tickets');
const discovery = require('./discovery')
const db = require('../helpers/db');

const logger = cogniUtil.logger
const workspace = process.env.WORKSPACE_ID || '<workspace-id>';

const watsonConversation = new Conversation({
    'version_date': '2017-12-13'
});



const message = (req,responsedata,callback)=>{
    console.log("Trial Worked" + payload)
      var workspace = process.env.WORKSPACE_ID || '<workspace-id>';
        if (!workspace || workspace === '<workspace-id>') {
            return res.json({
                'output': {
                    'text': 'The app has not been configured with a <b>WORKSPACE_ID</b> environment variable. Please refer to the ' + '<a href="https://github.com/watson-developer-cloud/conversation-simple">README</a> documentation on how to set this variable. <br>' + 'Once a workspace has been defined the intents may be imported from ' + '<a href="https://github.com/watson-developer-cloud/conversation-simple/blob/master/training/car_workspace.json">here</a> in order to get a working application.'
                }
            });
        }
        var payload = {
            workspace_id: workspace,
            context: req.context || {},
            input: req.input || {}
        };
    var response = null;
        // Send the input to the conversation service
    watsonConversation.message(payload,function(err, data) {
            if (err) {
                return responsedata.status(err.code || 500).json(err);
            }
            console.log('Í m in watson Conversation')
        console.log('Í m in watson Conversation'+ data)
         return callback(null,data);
         // callback(null, payload,updateMessage(data));
        });
    // console.log("I am printing here "+callback);
    // console.log("I am printing here "+responsedata);
    console.log("I am printing here End of Conversation ");
    }



function updateMessage(response) {
    let responseText = null;
    if (!response.output) {
        response.output = {};
    } else {
        return response;
    }
    if (response.intents && response.intents[0]) {
        const intent = response.intents[0];
        if (intent.confidence >= 0.75) {
            responseText = 'I understood your intent was ' + intent.intent;
        } else if (intent.confidence >= 0.5) {
            responseText = 'I think your intent was ' + intent.intent;
        } else {
            responseText = 'I did not understand your intent';
        }
    }
    response.output.text = responseText;
    return response;
};




module.exports = {
    message: message
};


