'use strict';
var request             = require('request-promise-native');
var util                = require('util');
const logger            = require('./logger');
const sessionManager    = require('../session/session_manager');

// constants
const CHAT_TITLE                = 'Chat from Facebook Messenger';
const CCX_QUEUETAG_PREFIX       = 'Chat_Csq';
const CHAT_FEED_REFURL          = 'http://%s/ccp-webapp/ccp/feed/%s';
const CHAT_URL                  = 'http://%s/ccp/chat';
const CHAT_EVENTS_QUERY_PARAMS  = '?all=false&eventid=';
const LOCATION_HEADER           = 'Location';
const MIME_XML                  = 'application/xml';

const SocialMinerRESTClient = {
    postChatRequest: (sessionId) => {
        logger.info('Posting a chat request to SocialMiner [HOST=%s], [FEEDID=%s]',
                    process.env.SOCIALMINER_HOST, process.env.SOCIALMINER_CHAT_FEED_ID);

        let options = {
            url: util.format(CHAT_URL, process.env.SOCIALMINER_HOST),
            method: 'POST',
            headers: {
                'Content-Type': MIME_XML
            },
            body: _constructChatRequestPayload(sessionId),
            resolveWithFullResponse: true,
            jar: sessionManager.getSession(sessionId).socialminer.cookieJar
        };

        logger.debug('POST: new chat request', options);
        return request(options);
    },

    getLatestChatEvents: (sessionId) => {
        let thisSession = sessionManager.getSession(sessionId);
        let latestEventId = thisSession.socialminer.latestEventID;
        
        let options = {
            url: util.format(CHAT_URL, process.env.SOCIALMINER_HOST) + CHAT_EVENTS_QUERY_PARAMS + latestEventId,
            method: 'GET',
            headers: {
                'Accept': MIME_XML
            },
            jar: thisSession.socialminer.cookieJar
        };

        logger.debug('GET: chat events', options);
        return request(options);
    }
};

module.exports = SocialMinerRESTClient;

// private functions

const _constructChatRequestPayload = (sessionId) => {
    let feedRefURL = util.format(CHAT_FEED_REFURL,
                     process.env.SOCIALMINER_HOST, process.env.SOCIALMINER_CHAT_FEED_ID);
    let thisSession = sessionManager.getSession(sessionId);

    return '<SocialContact>' +
                '<feedRefURL>' + feedRefURL + '</feedRefURL>' +
                '<author>' + thisSession.user.name  + '</author>' +
                '<title>' + CHAT_TITLE  + '</title>' +
                '<extensionFields>' +
                    '<extensionField>' +
                        '<name>ccxqueuetag</name>' +
                        '<value>' + CCX_QUEUETAG_PREFIX + process.env.CCX_QUEUE_ID  + '</value>' +
                    '</extensionField>' +
                    '<extensionField>' +
                        '<name>h_Name</name>' +
                        '<value>' + thisSession.user.name + '</value>' +
                    '</extensionField>' +
                '</extensionFields>' +
            '</SocialContact>';
};

const _constructMessagePayload = (text) => {
    return '<Message>' +
                '<body>' + text  + '</body>' +
           '</Message>';
};