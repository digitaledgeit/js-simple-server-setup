var fs = require('fs');
var http = require('http');
var https = require('https');
var express = require('express');

module.exports = {

	/**
	 * Create a new server
	 * @param   {Object}    [options]             The server options
	 * @param   {Boolean}   [options.host]        The server host - localhost
	 * @param   {Boolean}   [options.port]        The server port - 3000
	 * @param   {Boolean}   [options.keepAlive]   Whether the server should keep connections alive (turning this on will take longer for the server to shutdown between tests - false
	 * @param   {Boolean}   [options.secure]      Whether the server should serve requests on HTTPS - false
	 * @param   {Boolean}   [options.key]         The path to the server key - server.key
	 * @param   {Boolean}   [options.cert]        The path to the server certificate - server.cert
	 * @param   {Function}  configure             A function called to configure the application
	 * @returns {Promise}
	 */
	create: function(options, configure) {
		var app = express();
    var server = null;

		//resolve optional arguments
		if (arguments.length === 1) {
			configure  = options;
			options   = {};
		}

		//override the default options
		options.secure    = options.secure || false;
		options.host      = options.host || 'localhost';
		options.port      = options.port || 3000;
		options.keepAlive = options.keepAlive || false;

    //disable the `keep-alive` header which prevents the server from closing immediately and causes slow test execution
    if (!options.keepAlive) {
      app.use(function(req, res, next) {
        res.setHeader('Connection', 'close');
        next();
      });
    }

    configure(app);

    return new Promise((resolve, reject) => {

      //create the server
      if (options.secure) {

        var key = options.key || './'+options.host+'.key';
        var cert = options.cert || './'+options.host+'.cert';

        var config = {
          key: fs.readFileSync(key),
          cert: fs.readFileSync(cert)
        };
        server = https.createServer(config, app).listen(options.port, options.host, () => resolve(server));
      } else {
        server = http.createServer(app).listen(options.port, options.host, () => resolve(server));
      }

      server.secure   = options.secure;
      server.host     = options.host;
      server.port     = options.port;
      server.url      = 'http'+(options.secure ? 's' : '')+'://'+options.host+':'+options.port;

    });
	}

};