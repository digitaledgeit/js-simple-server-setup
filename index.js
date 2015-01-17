var fs = require('fs');
var http = require('http');
var https = require('https');
var express = require('express');

module.exports = {

	/**
	 * Create a new server
	 * @param   {Object}    [options]         The server options
	 * @param   {Boolean}   [options.host]    The server host
	 * @param   {Boolean}   [options.port]    The server port
	 * @param   {Boolean}   [options.secure]  Whether the server should serve requests on HTTPS
	 * @param   {Boolean}   [options.key]     The path to the server key
	 * @param   {Boolean}   [options.cert]    The path to the server certificate
	 * @param   {Function}  callback          A function to configure the application
	 * @returns {http.Server}
	 */
	create: function(options, callback) {
		var self = this, app = express(), server;

		//resolve optional arguments
		if (arguments.length === 1) {
			callback  = options;
			options   = {};
		}

		//override the default options
		options.secure    = options.secure ||false;
		options.host      = options.host || 'localhost';
		options.port      = options.port || 3000;
		options.keepAlive = options.keepAlive || false;

		//create the server
		if (options.secure) {

			var key = options.key || './'+options.host+'.key';
			var cert = options.cert || './'+options.host+'.cert';

			var config = {
				key: fs.readFileSync(key),
				cert: fs.readFileSync(cert)
			};
			server = https.createServer(config, app).listen(options.port, options.host);
		} else {
			server = http.createServer(app).listen(options.port, options.host);
		}

		server.secure   = options.secure;
		server.host     = options.host;
		server.port     = options.port;
		server.url      = 'http'+(options.secure ? 's' : '')+'://'+options.host+':'+options.port;

		//disable the `keep-alive` header which prevents the server from closing immediately and slow test execution
		if (!options.keepAlive) {
			app.use(function(req, res, next) {
				res.setHeader('Connection', 'close');
				next();
			});
		}

		//let the user setup the app (after we've returned the server object)
		setTimeout(function() {
			callback(app);
		}, 0);

		return server;
	}

};