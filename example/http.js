'use strict';

const server = require('..');

server.create(app => {

    app.get('/', (req, res) => {
      res.send('http - simple-server-setup');
    });

  })
  .then(server => console.log(`Listening at ${server.url}`))
;
