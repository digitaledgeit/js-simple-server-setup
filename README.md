# simple-server-setup

A library for creating a simple server with little effort.

Bootstrap an `express` app in just a few lines. Useful for testing scripts that use a HTTP client e.g.  [go-fetch](https://www.npmjs.com/package/go-fetch) or [browserbot](https://www.npmjs.com/package/browserbot).

## Installation

    npm install --save-dev simple-server-setup

## Usage

A simple HTTP server:

```javascript

const server = require('simple-server-setup');

server.create(app => {

    app.get('/', (req, res) => {
      res.send('http - simple-server-setup');
    });

  })
  .then(server => console.log(`Listening at ${server.url}`))
;


```

A simple HTTPS server:

```javascript

const server = require('simple-server-setup');

const options = {
  secure: true,
  key: __dirname + '/server.key',
  cert: __dirname + '/server.cert'
};

server.create(options, app => {

    app.get('/', (req, res) => {
      res.send('https - simple-server-setup');
    });

  })
  .then(server => console.log(`Listening at ${server.url}`))
;

```

A unit test to check the HTTP client has sent the Content-Type header:

```javascript

const assert  = require('assert');
const client  = require('go-fetch');
const server  = require('simple-server-setup');

it('should set the Content-Type', function (done) {

  server.create(app => {
    app.get('/', (req, res) => {
      try {
        assert.equal(req.headers['content-type'], 'text/x-foo');
      } catch (err) {
        done(err);
      }
      res.send('test - simple-server-setup');
    });
  })
    .then(server => {
      client().get(server.url, {'Content-Type': 'text/x-foo'}, (err, res) => {
        if (err) throw err;
        res.getBody().on('data', () => {/* do nothing */
        });
        res.getBody().on('end', () => server.close(done));
      });

    })
    .catch(err => console.log(err))
  ;

});

```

## API

### Methods

#### .create([options], callback) : Promise<http.Server>
    
Create a new server with the specified options.

Options:

	 @param   {Object}    [options]             The server options
	 @param   {Boolean}   [options.host]        The server host - localhost
	 @param   {Boolean}   [options.port]        The server port - 3000
	 @param   {Boolean}   [options.keepAlive]   Whether the server should keep connections alive (turning this on will take longer for the server to shutdown between tests - false
	 @param   {Boolean}   [options.secure]      Whether the server should serve requests on HTTPS - false
	 @param   {Boolean}   [options.key]         The path to the server key - server.key
	 @param   {Boolean}   [options.cert]        The path to the server certificate - server.cert
	 @param   {Function}  callback              A function to configure the express instance
    
### Events

## Miscellaneous

### Generating a self-signed key and certificate for a HTTPS server

    openssl req -nodes -new -x509 -keyout server.key -out server.cert
     
## Change log

### 0.2.0

- break: return a promise instead of an event emitter

## License

The MIT License (MIT)

Copyright (c) 2016 James Newell
