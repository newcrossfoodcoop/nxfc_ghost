'use strict';

/**
 * Module dependencies
 */
var _ = require('lodash'),
	gulp = require('gulp'),
	assets = require('./config/env/default').assets,
	gulpLoadPlugins = require('gulp-load-plugins'),
	runSequence = require('run-sequence'),
	plugins = gulpLoadPlugins(),
	args = require('get-gulp-args')();
	
var jsfiles = _(assets)
    .values()
    .map(function(a){
        if(typeof a === 'object'){
            return _.values(a);
        }
        return a;
    })
    .union()
    .flatten()
    .filter(function(i){ 
        if (!i) { return false; }
        return i.match('\.(?:js|json)$');
    })
    .valueOf();

// Set NODE_ENV to 'test'
gulp.task('env:test', function () {
	process.env.NODE_ENV = 'test';
});

// Set NODE_ENV to 'development'
gulp.task('env:dev', function () {
	process.env.NODE_ENV = 'development';
});

// Set NODE_ENV to 'production'
gulp.task('env:prod', function () {
	process.env.NODE_ENV = 'production';
});

// Set NODE_ENV to 'stage'
gulp.task('env:stage', function () {
	process.env.NODE_ENV = 'stage';
});

// Nodemon task
gulp.task('nodemon:api', function () {
	return plugins.nodemon({
		script: 'api.js',
		nodeArgs: ['--debug'],
		ext: 'js',
		watch: jsfiles
	});
});

function spawnNode(entry){
    var nodeArgs = [entry];
    var spawn = require('child_process').spawn;
    console.log(args);
    
    _(['stack-size', 'debug', 'max_old_space_size'])
        .forEach(function(k) {
            var sk = 'spawn_' + k;
            if (!_.has(args,sk)) { return; }
            if (typeof(args[sk]) !== 'undefined') {nodeArgs.push( '--' + k + '=' + args[sk] );}
            else {nodeArgs.push('--' + k);}
        });
    console.log('spawning: node',nodeArgs);
    spawn('node', nodeArgs, {stdio: 'inherit'}); 
}

gulp.task('node:api',     function () { spawnNode('api.js') });

// JS linting task
gulp.task('jshint', function () {
	return gulp.src(jsfiles)
		.pipe(plugins.jshint())
		.pipe(plugins.jshint.reporter('default'))
		.pipe(plugins.jshint.reporter('fail'));
});

// RAML linting task
gulp.task('ramllint', function() {
  gulp.src(assets.raml)
    .pipe(plugins.raml())
    .pipe(plugins.raml.reporter('default'))
    .pipe(plugins.raml.reporter('fail'));
});

// Mocha tests task
gulp.task('mocha', function (done) {
    var already;

	// Run the tests
	gulp.src(_.union([
	    assets.tests.api
	]))
		.pipe(plugins.mocha({
			reporter: 'spec',
			timeout: 4000
		}))
		.on('error', function(err) {
		    already = true;
			done(err);
		})
		.on('end', function(err) {
		    if (!already) {
			    done(err);
			}
		});

});

// API documentation from raml
gulp.task('ramldoc', function() {
  return gulp.src('api/raml/api.raml')
    .pipe(plugins.raml2html())
    .pipe(gulp.dest('api/build'));
});

// Build documentation
gulp.task('build:docs', function(done) {
	runSequence('ramldoc', done);
});

// Build documentation
gulp.task('build', function(done) {
	runSequence('build:docs', done);
});

// Build documentation
gulp.task('lint', function(done) {
	runSequence('jshint', 'ramllint', done);
});

// Run the project tests
gulp.task('test', function(done) {
	runSequence('env:test', 'lint', 'mocha', done);
});

// Run the project in development mode
gulp.task('default', function(done) {
	runSequence('env:dev', 'lint', 'default:message', done);
});

gulp.task('default:message', function(done) {
    console.log('\nTo run the parts:\n\tgulp api\n\tgulp worker\n');
});

gulp.task('api', function(done) {
	runSequence('env:dev', 'lint', 'nodemon:api', done);
});

// Run the project in production mode
gulp.task('test:api', function(done) {
	runSequence('env:test', 'node:api', done);
});

// Run the project in production mode
gulp.task('prod:api', function(done) {
	runSequence('env:prod', 'node:api', done);
});

// Run the project in stage mode
gulp.task('stage:api', function(done) {
	runSequence('env:stage', 'node:api', done);
});


