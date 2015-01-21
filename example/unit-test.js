var assert  = require('assert');
var client  = require('go-fetch');
var server  = require('..');

//it('should set the Content-Type', function(done){

	var svr = server.create(function(app) {
		app.get('/', function(req, res) {
			assert.equal(req.headers['content-type'], 'text/x-foo');
			res.end();
			svr.close();
		})
	});

	svr.on('configured', function() {

		client().get(svr.url, {'Content-Type': 'text/x-foo'}, function(err, res) {
			if (err) throw err;
			res.on('end', function() {console.log('test done()')}).end();
		});

	});

//});