'use strict';
const botly             = require('botly');
const _                 = require('lodash');
const logger            = require('../util/logger');
const utils             = require('../util/utils');
const sessionManager    = require('../session/session_manager');
const MESSAGES          = require('../resources/messages');

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
    // TODO
};

const _welcomeUser = (senderId) => {
    fbmBot.sendText({
        id: senderId,
        text: util.format(MESSAGES.GREETING,
                          sessionManager.getSession(senderId).user.name,
                          process.env.VIRTUAL_ASSISTANT_NAME)
    });
};