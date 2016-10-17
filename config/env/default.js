'use strict';

var path = require('path'),
    pkgjson = require(path.resolve('./package.json'));

module.exports = {
	app: {
	    app: 'unknown',
		title: pkgjson.name,
		description: pkgjson.description,
		keywords: 'ghost, mysql, node.js',
		version: pkgjson.version || 'VERSION'
	},
    assets: {
        actions: {
            api: 'api/actions/**/*.js'
        },
        routes: {
            api: 'api/routes/**/*.js'
        },
        controllers: {
            api: 'api/controllers/**/*.js'
        },
        config: 'config/**/*.js',
        tests: {
            api: 'api/tests/**/*.js',
            model: 'models/tests/**/*.js'
        },
        models: null,
        raml: 'api/raml/*.raml'
    },
    api: {
        host: 'localhost',
        port: 3020
    },
    mysql: {
        host: process.env.MYSQL_HOST || (process.env.MYSQL_HOST_VAR ? process.env[process.env.MYSQL_HOST_VAR] : 'localhost')
    },
    ghost: {
        subdir: '/cms',
        salt: 'meanjsghost'
    },
    ownerEmail: process.env.OWNER_EMAIL || 'OWNER_EMAIL' + '@a.b',
    externalAddress: process.env.EXTERNAL_ADDRESS
};
