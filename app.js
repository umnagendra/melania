'use strict';
const express       = require('express');
const health        = require('express-ping');
const bodyParser    = require('body-parser');
const httpLogger    = require('morgan');
const _             = require('lodash');
const logger        = require('./util/logger');
const indexRoute    = require('./routes/index');

logger.info("**** STARTUP ****");
logger.debug("Environment = ", process.env);

if (!_.isNumber(parseInt(process.env.PORT))) {
    throw new ReferenceError('Environment variable PORT is missing, or invalid');
}

// Setup the web service
var app = express();
app.use(bodyParser.json());
app.use(httpLogger('short'));
app.use(health.ping());

// setup routes
app.use('/', indexRoute);

// Start the web service
app.listen(process.env.PORT, () => {
    logger.info("Service listening on port %d ...", process.env.PORT);
});