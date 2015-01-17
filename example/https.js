var server = require('..');

var options = {
	secure: true,
	key:    __dirname+'/server.key',
	cert:   __dirname+'/server.cert'
};

var svr = server.create(options, function(app) {

	console.log('Server listening at '+svr.url);

	app.get('/', function(req, res) {
		res.write('HTTPS SERVER');
		res.end();
		svr.close();
	});

});