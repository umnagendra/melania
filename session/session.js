'use strict';
var request         = require('request-promise-native');
const STATES        = require('../resources/states');

module.exports = (user) => {
    return {
        user: {
            id      : user.id,
            name    : user.first_name + ' ' + user.last_name
        },

        customerMessagesBuffer: [],

        state: STATES.STARTED,

        socialminer: {
            scRefURL: null,
            latestEventID: 0,
            eventPoller: null,
            cookieJar: request.jar(),
        }
    }
};