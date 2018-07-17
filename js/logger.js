/**
* Configurations of logger.
*/
const winston = require('winston');
const winstonRotator = require('winston-daily-rotate-file');

const consoleConfig = [
  new winston.transports.Console({
      'colorize': true
  })
];

const createLogger = new winston.Logger({
    'transports': consoleConfig
});

const successLogger = createLogger;
successLogger.add(winstonRotator, {
    'name': 'access-file',
    'level': 'info',
    'filename': './logs/%DATE%-access.log',
    'json': false,
    'datePattern': 'YYYY-MM-DD',
    'prepend': true,
    'zippedArchive': true,
    'maxSize': '10m',
    'maxFiles': '30d'
});

const errorLogger = createLogger;
errorLogger.add(winstonRotator, {
    'name': 'error-file',
    'level': 'error',
    'filename': './logs/%DATE%-error.log',
    'json': false,
    'datePattern': 'YYYY-MM-DD',
    'prepend': true,
    'zippedArchive': true,
    'maxSize': '10m',
    'maxFiles': '30d'
});

module.exports = {
    'successlog': successLogger,
    'errorlog': errorLogger
};