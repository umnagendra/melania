'use strict';
const _           = require('lodash');
const logger      = require('../util/logger');

const MANDATORY_ENV_VARS = [
    'PORT',
    'FB_PAGE_ACCESS_TOKEN',
    'FB_VERIFICATION_TOKEN',
    'VIRTUAL_ASSISTANT_NAME',
    'SOCIALMINER_HOST',
    'SOCIALMINER_CHAT_FEED_ID',
    'CCX_QUEUE_ID'
];

module.exports = {
    /**
     * Validates the deployed environment to ensure
     * all required variables are defined. If not, it
     * aborts the entire application.
     */
    validateEnvironment: () => {
        _.each(MANDATORY_ENV_VARS, (variable) => {
            if (_.isUndefined(process.env[variable]) ||
                _.isEmpty(_.trim(process.env[variable]))) {
                throw new ReferenceError('SEVERE ERROR: MISSING/INVALID environment variable value: ' + variable);
            }
        });
    },

    /**
     * Logs an error with its stack trace
     * 
     * @param {*} err
     * @param {String} msg
     */
    logErrorWithStackTrace: (err, msg) => {
        logger.error("Something went wrong.", err, new Error(msg).stack);
    },

    /**
     * Properly decode a URLEncoded string
     *
     * @param {String} str
     */
    decodeString: (str) => {
        str = decodeURIComponent(str.replace(/\+/g,  " "));
        str = str.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/\"/g,'&quot;').replace(/\'/g,'&#x27;').replace(/\//g,'&#x2f;');

        return str;
    }
};