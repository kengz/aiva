// dependencies
// Module that runs after bot is constructed, before all other scripts are loaded; emit 'ready' to kickstart things such as auto-serialization
global.Promise = require('bluebird')
global.co = require('co')
const Log = require('log')
global._ = require('lomath')
const path = require('path')


global.rootPath = path.join(__dirname, '..')


// export for bot
module.exports = (robot) => {
  // set global for usage by children
  global.robot = robot
  logLevel = process.env['npm_config_debug'] ? 'debug' : 'info'
  global.log = new Log(logLevel)

  // wake up, init
  co(function*() {
    // connect socket.io client to socket.io server for polyglot communication
    require(path.join(rootPath, 'lib', 'client'))

    /* istanbul ignore next */
    if (robot.adapter.constructor.name == 'Shell') {
      // set for Shell local dev
      require(path.join(rootPath, 'test', 'asset'))
      robot.brain.data.users = global.users
    }
    yield Promise.delay(500); // wait to connect, get users
    // emit 'ready' event to kick off initialization
    robot.emit('ready')
  }).catch(global.log.error)

  // initializations
  robot.on('ready', () => {
    robot.emit('serialize_users')
  })

  // manually emit "ready" to simulate initialization
  robot.respond(/manual ready/i, (res) => {
    res.send('Manually starting initialization, emitting "ready".')
    robot.emit('ready')
  })
}
