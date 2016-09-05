var winston = require('winston');

var logger = new winston.Logger({
    transports: [
        new (winston.transports.Console)({
            handleExceptions: true,
            colorize: true
        }),
        new (winston.transports.File)({
            filename: 'server.log',
            handleExceptions: true
        })
    ]
});

logger.stream = {
    write: function (message, encoding) {
        logger.info(message);
    }
};

module.exports = logger;
