const Session = require("./session");
const STATES = require("../resources/states");
const logger = require("../util/logger");

/**
 * `Map <sender ID, session>`
 *
 * holds all sessions that are ongoing
 */
const sessionMap = new Map();

/**
 * Exposes an interface for the rest of the
 * application to create, update and destroy sessions
 */
const SessionManager = {
    isSessionOngoing: id => sessionMap.has(id) &&
            sessionMap.get(id).state !== STATES.STARTED &&
            sessionMap.get(id).state !== STATES.ENDED,

    createSession: (user) => {
        logger.info("Creating new session for user", user);
        sessionMap.set(user.id, Session(user));
        logger.info("session now is ", sessionMap);
        logger.info("getting from session: ", sessionMap.get(user.id));
    },

    getSession: (id) => {
        logger.info("inside getSession, session now is ", sessionMap);
        sessionMap.get(id);
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
        // clear interval if it exists
        if (sessionMap.get(id) && sessionMap.get(id).socialminer.eventPoller) {
            clearInterval(sessionMap.get(id).socialminer.eventPoller);
        }
        // then, remove the session from sessionMap
        sessionMap.delete(id);
    },
};

module.exports = SessionManager;
