'use strict';
const botly             = require('botly');
const _                 = require('lodash');
const util              = require('util');
const xml2js            = require('xml2js');
const logger            = require('../util/logger');
const utils             = require('../util/utils');
const sessionManager    = require('../session/session_manager');
const socialminer       = require('../util/socialminer_rest_util');
const MESSAGES          = require('../resources/messages');
const STATES            = require('../resources/states');

// poll for chat events from SocialMiner every 3 seconds
const EVENT_POLLING_INTERVAL_MS = 3000;

const fbmBot = new botly({
    accessToken: _.trim(process.env.FB_PAGE_ACCESS_TOKEN),
    verifyToken: _.trim(process.env.FB_VERIFICATION_TOKEN)
});

// register to "message" event from facebook messenger
fbmBot.on("message", (senderId, message, data) => {
    logger.debug("Received a message from [ID: %s]: ", senderId, message);

    // are we already in an ongoing session with this sender?
    if (sessionManager.isSessionOngoing(senderId)) {
        _handleMessageInConversation(senderId, message.text);
    } else {
        // STEP 0: Get user details from Facebook
        _getUserProfile(senderId).then((sender) => {
            // STEP 1: Create a new session
            sessionManager.createSession(sender);
            // STEP 2: Welcome/greet the user
            _welcomeUser(senderId);
            // STEP 3: Also add this message into the incoming buffer
            sessionManager.addToCustomerMessageBuffer(senderId, message.text);
        }).catch((err) => utils.logErrorWithStackTrace(err));
    }
});

module.exports = fbmBot.router();

// private functions

/**
 * "Promisified" wrapper function to get user profile
 * by ID from facebook
 */
const _getUserProfile = (userId) => {
    return new Promise((resolve, reject) => {
        fbmBot.getUserProfile(userId, (err, data) => {
            if (!err) resolve(data);
            else reject(err);
        });
    });
};

const _handleMessageInConversation = (senderId, text) => {
    let thisSession = sessionManager.getSession(senderId);
    switch (thisSession.state) {
        case STATES.INFO:
            // add this msg into incoming buffer
            sessionManager.addToCustomerMessageBuffer(senderId, text);
            // inject chat request into socialminer
            // and start polling for events
            _startChat(senderId);
            break;

        case STATES.TALKING:
            // TODO just take the msg and send to socialminer

        default:
            // just add this msg into incoming buffer
            sessionManager.addToCustomerMessageBuffer(senderId, text);
    }
};

const _welcomeUser = (senderId) => {
    fbmBot.sendText({
        id: senderId,
        text: util.format(MESSAGES.GREETING,
                          sessionManager.getSession(senderId).user.name,
                          process.env.VIRTUAL_ASSISTANT_NAME)
    });
    // change state to INFO, because we are asking for info from sender
    sessionManager.setState(senderId, STATES.INFO);
};

const _startChat = (senderId) => {
    // send waiting text to customer
    fbmBot.sendText({id: senderId, text: MESSAGES.PLEASE_WAIT_FOR_AGENT});
    // change state to WAITING, because we are waiting for agent to join
    sessionManager.setState(senderId, STATES.WAITING);
    // create chat in SocialMiner
    socialminer.postChatRequest(senderId)
        .then((response) => {
            logger.info('Chat created successfully. Response = ', response);
            // start polling for chat events
            let poller = setInterval(_getLatestChatEvents.bind(senderId), EVENT_POLLING_INTERVAL_MS);
            // update poller ref in session so it can be stopped later
            sessionManager.setEventPoller(senderId, poller);
        })
        .catch((err) => {
            utils.logErrorWithStackTrace(err);
            // inform the customer that something went wrong
            fbmBot.sendText({id: senderId, text: MESSAGES.CHAT_FAILURE_TRY_LATER});
            // cleanup the session, it is no longer needed
            sessionManager.destroySession(senderId);
        });
};

const _getLatestChatEvents = (senderId) => {
    socialminer.getLatestChatEvents(senderId)
        .then((response) => {
            // parse the XML response
            xml2js.parseString(response, (err, result) => {
                logger.log('Received chat events', result);
                if (!err && result && result.MessageEvent) {
                    let thisSession = sessionManager.getSession(senderId);
                    // we have a message, which means agent has joined
                    if (thisSession.state === STATES.WAITING) {
                        // move state to TALKING
                        sessionManager.setState(STATES.TALKING);
                    }
                    _processMessagesFromSocialMiner(senderId, result.MessageEvent);
                } else if (err) {
                    utils.logErrorWithStackTrace(err);
                }
            });
        })
        .catch((err) => utils.logErrorWithStackTrace(err));
};

const _processMessagesFromSocialMiner = (senderId, messages) => {
    if (_.isArray(messages)) {
        _.each(messages, (message) => {
            // send each message to customer
            fbmBot.sendText({id: senderId, text: message.body});
            // update the latest event ID
            sessionManager.setLatestEventId(parseInt(message.id));
        });
    } else {
        // send the message to customer
        fbmBot.sendText({id: senderId, text: messages.body});
        // update the latest event ID
        sessionManager.setLatestEventId(parseInt(messages.id));
    }
};