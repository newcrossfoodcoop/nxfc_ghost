'use strict';

/**
 * Module dependencies.
 */
 
var path = require('path'),
    config = require(path.resolve('./config/config')),
    ghost = require('ghost'),
    helmet = require('helmet');

var	crypto = require('crypto');

/**
 * Generate default config for the module and merge it into the main config
 *
 * Since starting up ghost means waiting for a promise to be fulfilled we have
 * to stake our claim in the express routing stack and redirect it to our ghost
 * server once it's up
 */

//exports.ensureSetup = function(req, res, next) {

//    if (!req.body) {
//        errorHandler.sendError(new Error('cannot setup ghost, no user'),res);
//    }
//    
//    req.user = req.body;
//    
//    // setup ghost if it hasn't been already
//    return app.locals.ghostServer.then(function(ghostServer) {
//        return ghostServer.api.authentication.isSetup();
//    }).then(function (result) {
//        if (result.setup[0].status) {
//            // nothing to do
//            return;
//        } 
//        return app.locals.ghostServer;
//    }).then(function (ghostServer) {
//        if (!ghostServer) { return; }
//        return ghostServer.api.authentication.setupSilent({ setup: [{
//            name: 'Owner',
//            email: config.ownerEmail,
//            password: hashPassword(config.ownerEmail),
//        }]});
//    }).then(function () {
//        next();
//    }).catch(_.partialRight(errorHandler.sendError, res));
//};

function hashPassword(password) {
    var hash = crypto.pbkdf2Sync(password, new Buffer(config.ghost.salt, 'base64'), 10000, 16).toString('base64');
    return hash;
}
module.exports.hashPassword = hashPassword;

module.exports.ghostServer = null;

module.exports.init = function(app) {

    var ghostServer;
    
    var ghostPromise = ghost({
        config: path.resolve('./api/content/config/ghost.api.content.config.js')
    })
        .then(function(gS) {
            module.exports.ghostServer = ghostServer = gS;
            
            console.log('starting ghost server...');
            return ghostServer.start(app);
        })
        .then(function() { 
            return ghostServer.api.authentication.isSetup();
        })
        .then(function(result) {
            if (result.setup[0].status) {
                console.log('ghost is setup');
                // nothing to do
                return;
            }
            else {
                ghostServer.api.authentication.setupSilent({ setup: [{
                    name: 'Owner',
                    email: config.ownerEmail,
                    password: hashPassword(config.ownerEmail),
                }]});
            }  
        });
    
    app.locals.ghostPromise = ghostPromise;
    
    app.use(
        config.ghost.subdir,
        helmet.xframe('sameorigin'),
        function() { 
            ghostServer.rootApp.apply(this,arguments); 
        }
    );
    
    return ghostPromise;
};
