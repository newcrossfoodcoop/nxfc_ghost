'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
    middleware = require(path.resolve('./node_modules/ghost/core/server/middleware')).middleware,
    ghostController = require('../controllers/ghost.api.controller');
    
var ghost = require(path.resolve('./config/lib/ghost'));

module.exports = function(app) {

    ghost.init(app);
    
    // authentication and setup
	app.route('/api/ghost/login').post(
	    ghostController.findUser,
	    ghostController.andSyncUser,
	    ghostController.orCreateUser,
	    ghostController.prepAuthentication,
        middleware.addClientSecret,
        middleware.authenticateClient,
        middleware.generateAccessToken
	);
	
	// public routes
	app.route('/api/ghost/posts/slug/:slug').get(
	    ghostController.read
	);
    app.param('slug', ghostController.postById);
    
    app.route('/api/ghost/posts/tag/:tag').get(
	    ghostController.query
	);
    app.param('tag', ghostController.postsByTag);

};
