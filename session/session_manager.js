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
        return sessionMap.get(id);
    },

    setState: (id, state) => {
        sessionMap.get(id).state = state;
    },

    setSCRefURL: (id, url) => {
        sessionMap.get(id).socialminer.scRefURL = url;
    },

    setLatestEventId: (id, eventId) => {
        sessionMap.get(id).socialminer.latestEventID = eventId;
    },

    setEventPoller: (id, poller) => {
        sessionMap.get(id).socialminer.eventPoller = poller;
    },

    addToCustomerMessageBuffer: (id, text) => {
        sessionMap.get(id).customerMessagesBuffer.push(text);
    },

    destroySession: (id) => {
        sessionMap.delete(id);
    }
};

module.exports = SessionManager;