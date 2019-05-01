const winston = require('winston');
const express = require('express');
const app = express();

require('./startup/logging')();
require('./startup/validation')();
require('./startup/routes')(app);
require('./startup/mongodb')();
require('./startup/config')();

port = process.env.PORT || 5000;
const server = app.listen(port, () =>  { winston.info(`Listening on port ${port}...`) });

module.exports = server;