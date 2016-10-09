'use strict';

/**
 * Module dependencies.
 */
var config = require('./config/config'),
	express = require('./config/lib/express');

config.app.app = 'api';

// Initialize express
var app = express.init();

// Start the app by listening on <port>
var port = config.api.port;
app.listen(port);

// Logging initialization
console.log('Started on port ' + port);
