'use strict';
const _           = require('lodash');
const logger      = require('../util/logger');

const MANDATORY_ENV_VARS = [
    'PORT',
    'FB_PAGE_ACCESS_TOKEN',
    'FB_VERIFICATION_TOKEN',
    'VIRTUAL_ASSISTANT_NAME'
];

module.exports = {
    validateEnvironment: () => {
        _.each(MANDATORY_ENV_VARS, (variable) => {
            if (_.isUndefined(process.env[variable]) ||
                _.isEmpty(_.trim(process.env[variable]))) {
                throw new ReferenceError('SEVERE ERROR: MISSING/INVALID environment variable value: ' + variable);
            }
        });
    },

    logErrorWithStackTrace: (err, msg) => {
        logger.error("Something went wrong.", err, new Error(msg).stack);
    }
};