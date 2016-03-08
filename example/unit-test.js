'use strict';

const assert = require('assert');
const client = require('go-fetch');
const server = require('..');

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
