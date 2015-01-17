var assert  = require('assert');
var client  = require('go-fetch');
var server  = require('..');

it('should set the Content-Type header', function(done){

	//check the client has set the Content-Type header
	var svr = server.create(function(app) {
		app.get('/', function(req, res) {
			assert.equal(req.headers['content-type'], 'text/x-foo');
			res.end();
			svr.close(done);
		})
	});

	//send a request to the server with the Content-Type header and ignore the response
	client().get(svr.url, {'Content-Type': 'text/x-foo'}).send().resume();

});