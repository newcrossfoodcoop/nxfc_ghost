var hooks = require('hooks'),
    assert = require('assert');

var store = {};

hooks.before('GET /api/ghost/posts/slug/{slug} -> 200', function (test, done) {
    test.request.params.slug = 'welcome-to-ghost';
    done();
});

hooks.before('GET /api/ghost/posts/slug/{slug} -> 404', function (test, done) {
    test.request.params.slug = 'undefined';
    done();
});
