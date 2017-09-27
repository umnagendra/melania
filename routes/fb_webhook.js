'use strict';
const botly       = require('botly');
const logger      = require('../util/logger');
const _           = require('lodash');

// validate environment
if (_.isUndefined(process.env.FB_PAGE_ACCESS_TOKEN) ||
    _.isUndefined(process.env.FB_VERIFICATION_TOKEN) ||
    _.isEmpty(_.trim(process.env.FB_PAGE_ACCESS_TOKEN)) ||
    _.isEmpty(_.trim(process.env.FB_VERIFICATION_TOKEN))) {
    throw new ReferenceError('At least one of these environment variables:\n' + 
                             '\tFB_PAGE_ACCESS_TOKEN\n' +
                             '\tFB_VERIFICATION_TOKEN\n' +
                             'is missing, or invalid.');
}

const fbmBot = new botly({
    accessToken: _.trim(process.env.FB_PAGE_ACCESS_TOKEN),
    verifyToken: _.trim(process.env.FB_VERIFICATION_TOKEN)
});

// helpers to "promisify" async functions
const _getUserProfile = (userId) => {
    return new Promise((resolve, reject) => {
        fbmBot.getUserProfile(userId, (err, data) => {
            if (!err)
                resolve(data);
            else
                reject(err);
        });
    });
};

const _sendText = (senderId, textMsg) => {
    return new Promise((resolve, reject) => {
        fbmBot.sendText({id: senderId, text: textMsg}, (err, data) => {
            if (!err) {
                logger.debug("Sent message [%s] to sender [%s]", textMsg, senderId);
                resolve(data);
            } else {
                logger.error("Failed to send message [%s] to sender [%s]. Error = ",
                            textMsg, senderId, err);
                reject(err);
            }
        });
    });
};

// register to "message" event from facebook messenger
fbmBot.on("message", (senderId, message, data) => {
    logger.debug("Received a message from [ID: %s]: ", senderId, message);
    _getUserProfile(senderId)
        .then((sender) => {
            logger.debug("Obtained details for user [ID: %s] - ", senderId, sender);
            fbmBot.sendText({id: senderId, text: 'Hey, ' + sender.first_name});
        })
        .catch((err) => logger.error("Unable to get user details. Error = ", err));
});

module.exports = fbmBot.router();