const winston = require('winston');
const mongoose = require('mongoose');
const config = require('config');
module.exports = function() {
    const uri = config.get('dbUri');
    mongoose.connect(uri)
        .then(() => winston.info(`conected to ${uri}`));
}