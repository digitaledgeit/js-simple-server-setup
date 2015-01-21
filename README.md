# simple-server-setup

A library for creating a simple server with little effort.

Bootstraps an ExpressJS app and route handler in just a few lines. Useful for testing scripts that use a HTTP client e.g.  [go-fetch](https://www.npmjs.com/package/go-fetch) or [browserbot](https://www.npmjs.com/package/browserbot). 

## Installation

## Usage

A simple HTTP server:

    var server = require('simple-server-setup');
    
    var svr = server.create(function(app) {
    
	    console.log('Server listening at '+svr.url);

    	app.get('/', function(req, res) {
    		res.write('HTTP SERVER');
    		res.end();
    		svr.close();
    	});
    	
    });

A simple HTTPS server:

    var server = require('simple-server-setup');
    
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

A unit test to check the HTTP client has sent the Content-Type header:

    var assert  = require('assert');
    var fetch   = require('go-fetch');
    var server  = require('simple-server-setup');
    
    it('should set the Content-Type', function(done){
    
        var svr = server.create(function(app) {
            app.get('/', function(req, res) {
                assert.equal(req.headers['content-type'], 'text/x-foo');
                res.end();
                svr.close();
            })
        });
    
        fetch.get(svr.url, {'Content-Type': 'text/x-foo'} function(err, res) {
            done();
        });
        
    });
    
## API

### .create([options], callback)
    
Create a new server with the specified options.

Options:

	 @param   {Object}    [options]             The server options
	 @param   {Boolean}   [options.host]        The server host - localhost
	 @param   {Boolean}   [options.port]        The server port - 3000
	 @param   {Boolean}   [options.keepAlive]   Whether the server should keep connections alive (turning this on will take longer for the server to shutdown between tests - false
	 @param   {Boolean}   [options.secure]      Whether the server should serve requests on HTTPS - false
	 @param   {Boolean}   [options.key]         The path to the server key - server.key
	 @param   {Boolean}   [options.cert]        The path to the server certificate - server.cert
	 @param   {Function}  callback              A function to configure the application
    
## Misc
### Generating a self-signed key and certificate for a HTTPS server

    openssl req -nodes -new -x509 -keyout server.key -out server.cert
     
## License

The MIT License (MIT)

Copyright (c) 2014 James Newell

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.