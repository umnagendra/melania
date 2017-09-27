'use strict';
const express           = require('express');
const health            = require('express-ping');
const bodyParser        = require('body-parser');
const httpLogger        = require('morgan');
const logger            = require('./util/logger');
const utils             = require('./util/utils');
const indexRoute        = require('./routes/index');
const fbWebhookRoute    = require('./routes/fb_webhook');

logger.info("**** STARTUP ****");
logger.debug("Environment = ", process.env);

// Check if the environment is proper
utils.validateEnvironment();

// Setup the web service
var app = express();
app.use(bodyParser.json());
app.use(httpLogger('short'));
app.use(health.ping());

// setup routes
app.use('/', indexRoute);
app.use('/webhook', fbWebhookRoute);

// Start the web service
app.listen(process.env.PORT, () => {
    logger.info("Service listening on port %d ...", process.env.PORT);
});