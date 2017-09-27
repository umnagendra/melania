'use strict';
const _           = require('lodash');
const logger      = require('../util/logger');

module.exports = {
    validateEnvironment: () => {
        if (_.isUndefined(process.env.FB_PAGE_ACCESS_TOKEN) ||
        _.isUndefined(process.env.FB_VERIFICATION_TOKEN) ||
        _.isEmpty(_.trim(process.env.FB_PAGE_ACCESS_TOKEN)) ||
        _.isEmpty(_.trim(process.env.FB_VERIFICATION_TOKEN))) {
            throw new ReferenceError('At least one of these environment variables: ' + 
                                     '(FB_PAGE_ACCESS_TOKEN, FB_VERIFICATION_TOKEN) ' +
                                     'is missing, or invalid.');
        }
    },

    logErrorWithStackTrace: (err, msg) => {
        logger.error("Something went wrong.", err, new Error(msg).stack);
    }
};