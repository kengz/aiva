const winston = require('winston')

/* istanbul ignore next */
const logLevel = process.env.npm_config_debug ? 'debug' : 'info'
const log = global.log || new (winston.Logger)({
  level: logLevel,
  transports: [new (winston.transports.Console)({
    /* istanbul ignore next */
    formatter: (options) => {
      const formatStr = `[${new Date()}] ${winston.config.colorize(options.level, options.level.toUpperCase())} ${options.message || ''}`
      return formatStr
    },
  })],
})
global.log = log

module.exports = log
