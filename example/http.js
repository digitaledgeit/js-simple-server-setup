var server = require('..');

var svr = server.create(function(app) {

	console.log('Server listening at '+svr.url);

	app.get('/', function(req, res) {
		res.write('HTTP SERVER');
		res.end();
		svr.close();
	});

});
