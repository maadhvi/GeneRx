const winston = require('winston');

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.File({ filename: 'reports/failures/error.log', level: 'error' }),
    new winston.transports.File({ filename: 'reports/logs/execution.log' }),
    new winston.transports.Console({ format: winston.format.simple() })
  ],
});

module.exports = logger;
