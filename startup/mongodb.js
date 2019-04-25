const winston = require('winston');
const mongoose = require('mongoose');
const config = require('config');
module.exports = function() {
    const uri = `mongodb+srv://${config.get("DBUSER")}:${config.get("DBPASSWORD")}@${config.get("ATLASCLOUSTER")}/${config.get("DBNAME")}?retryWrites=true`
    //mongoose.connect('mongodb://localhost/vidly')
    mongoose.connect(uri)
        .then(() => winston.info('conected to db'))
}