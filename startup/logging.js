require('express-async-errors');
const winston = require('winston');

module.exports = function() {
    winston.configure({
        transports: [
            new winston.transports.Console({ colorize : true, prettyPrint : true}),
            new winston.transports.File({ filename: 'logfile.log' })
        ],
        exceptionHandlers: [
            new winston.transports.Console({ colorize : true, prettyPrint : true}),
            new winston.transports.File({ filename: 'ExeptionsLogfile.log' })             
        ],
    });
    
    process.on('unhandledRejection', (ex)=>{
        throw ex;
    });
}