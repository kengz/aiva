const winston = require('winston')

/* istanbul ignore next */
const logLevel = process.env.npm_config_debug ? 'debug' : 'info'
const log = global.log || new (winston.Logger)({
  level: logLevel,
  transports: [new (winston.transports.Console)({
    /* istanbul ignore next */
    formatter: (options) => {
      const levelStr = winston.config.colorize(options.level, options.level.toUpperCase())
      const msgStr = options.message || ''
      const formatStr = `[${new Date()}] ${levelStr} ${msgStr}`
      return formatStr
    },
  })],
})
global.log = log

module.exports = log
