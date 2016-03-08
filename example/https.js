'use strict'

const server = require('..');

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
