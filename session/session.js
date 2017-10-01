'use strict';
var request         = require('request-promise-native');
const STATES        = require('../resources/states');

module.exports = (user) => {
    return {
        // details of facebook user who has initiated chat
        // we can also keep additional fields like profile pic URL,
        // email ID, etc. based on use cases
        user: {
            id      : user.id,
            name    : user.first_name + ' ' + user.last_name
        },

        // a buffer that holds messages sent by the facebook user
        // until an agent can join this chat
        customerMessagesBuffer: [],

        state: STATES.STARTED,

        socialminer: {
            scRefURL: null,
            latestEventID: 0,
            eventPoller: null,
            cookieJar: request.jar() // IMPORTANT! Maintains chat client HTTP session
        }
    }
};