const winston = require('winston')

/* istanbul ignore next */
logLevel = process.env['npm_config_debug'] ? 'debug' : 'info'
const log = global.log || new(winston.Logger)({
  level: logLevel,
  transports: [new(winston.transports.Console)({
    formatter: (options) => {
      /* istanbul ignore next */
      return `[${new Date}] ${winston.config.colorize(options.level, options.level.toUpperCase())} ${options.message || ''}`
    }
  })]
})
global.log = log

module.exports = log
