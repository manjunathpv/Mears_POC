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


const conversation = (parameters, callback) => {
    logger.info('parameters to the conversation: ', parameters)
    if (!workspace || workspace === '<workspace-id>') {
        logger.info('Workspace id is not valid');
        return callback(null, {
            'output': { 'text': 'Configure the app with a Workspace Id environment variable.' }
        });
    }

    const payload = {
        workspace_id: workspace,
        context: parameters.context || {},
        input: parameters.input || {}
    };

    if (payload.input.text === 'printer') {
        discovery.discoveryQuery({ query: payload.input.text }, (error, data) => {
            logger.info('got discovery res: error: ', error, ' res: ', data)
            if (error) {
                logger.info('Error: Unable to query the discovery with error: ', error)
                return callback(error, null)
            }
            callback(null, _buildDiscoveryPassege(data.data))
        })
    } else {
        watsonConversation.message(payload, (error, data) => {
            if (error) {
                logger.info('Error: Unable to make conversation with watson');
                return callback(error, null);
            }
            const chatConversation = {
                email: payload.email ? payload.email : 'dinesh.ganesh@test.com',
                chat: {
                    chatbot: data.output.text ? data.output.text.length ? data.output.text[0] : '' : '',
                    user: payload.input.text ? payload.input.text : ''
                },
                timestamp: moment().unix()
            }

            saveChat(chatConversation, (dbError, dbStatus) => {
                if (dbError) {
                    logger.info('Error: Unable to save the chat message ', dbError);
                    return callback(dbError, null);
                }
                if (validateMessageCallback(data)) {
                        ticketsHandler.createTicket(payload, (ticketErr, ticketStatus) => {
                            if (ticketErr) {
                                logger.info('Error: creating service ticket. ', ticketErr);
							
                                return callback(ticketErr, null);
                            }
                            logger.info('ticket has been created')
                            workflowHandler.unlockAccount(payload, (error, unlockStatus) => {
                                if (error) {
                                    logger.info('Error: unlocking user account. ', error);
                                    return callback(error, null);
                                }
                                logger.info('Unlocked account. ', unlockStatus)
                                return callback(null, updateMessage(data));
                            });
                        });
                    
                } else {
                    logger.info("I am in first else block")
                    callback(null, updateMessage(data));
                }
            })
        });
    }
};

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

const saveChat = (params, callback) => {
    db.save(db.databases.skitter, params, callback);
}


const validateMessageCallback = function (data) {
	var auditLog ={
	 httpStatus:200,
 response:"Login Success",
 responseTime:".5",
 request_url:"/login",
 session_id:"testSession_id",
 client_id:"testClient_id",
 user_id:"testUser_id",
 transaction_id:"testTransaction_id"
 }
	
		createAuditLog(auditLog);
    if (data.context.RegisterNumberVar) {
        if (data.context.RegisterNumberVar === "215-789-8348") {
            logger.info("Inside If Pass");
            logger.info("Registered Phone Number..." + data.context.RegisterNumberVar);
            logger.info("Generating OTP Mehtod must be called here");
            return true;
        } else {
            return false;
        }
    } else {
        return false;
    }
}

const _buildDiscoveryPassege = (response) => {
    let text = 'Helpful tips:<br/><br/>'
    const passegesLength = response.passages.length
    for (let i = 0; i < passegesLength; i++) {
        text = text + ((i === 0 ? '' : '<br/><br/>') + (i + 1) + '. ' + response.passages[i].passage_text)
        if (i === 2) {
            break
        }
    }
    const message = {
        output: { text: text }
    }

    return message
}


module.exports = Object.assign(module.exports, {
    conversation: conversation,
    saveChat: saveChat
});
