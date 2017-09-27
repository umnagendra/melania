'use strict';
const botly       = require('botly');
const logger      = require('../util/logger');
const utils       = require('../util/utils');
const _           = require('lodash');

const fbmBot = new botly({
    accessToken: _.trim(process.env.FB_PAGE_ACCESS_TOKEN),
    verifyToken: _.trim(process.env.FB_VERIFICATION_TOKEN)
});

// helpers to "promisify" async functions
const _getUserProfile = (userId) => {
    return new Promise((resolve, reject) => {
        fbmBot.getUserProfile(userId, (err, data) => {
            if (!err) {
                logger.info("Got user details: ", data);
                resolve(data);
            }
            else reject(err);
        });
    });
};

// register to "message" event from facebook messenger
fbmBot.on("message", (senderId, message, data) => {
    logger.debug("Received a message from [ID: %s]: ", senderId, message);
    _getUserProfile(senderId)
        .then((sender) => {
            fbmBot.sendText({id: senderId, text: 'Hey, ' + sender.first_name});
        })
        .catch((err) => utils.logErrorWithStackTrace(err));
});

module.exports = fbmBot.router();