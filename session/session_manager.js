'use strict';
const Session           = require('./session');
const STATES            = require('../resources/states');
const logger            = require('../util/logger');

// Map <sender ID, session>
const sessionMap = new Map();

const SessionManager = {
    isSessionOngoing: (id) => {
        return sessionMap.has(id) &&
            sessionMap.get(id).state !== STATES.STARTED &&
            sessionMap.get(id).state !== STATES.ENDED;
    },

    createSession: (user) => {
        logger.info('Creating new session for user', user);
        sessionMap.set(user.id, Session(user));
    },

    getSession: (id) => {
        // returns a deep-copy of the session
        // because we don't want anyone to inadvertently
        // modify the session on their own
        return Object.assign({}, sessionMap.get(id));
    },

    addToCustomerMessageBuffer: (id, text) => {
        sessionMap.get(id).customerMessagesBuffer.push(text);
    }
};

module.exports = SessionManager;