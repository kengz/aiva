// Module that runs after bot is constructed, before all other scripts are loaded; emit 'ready' to kickstart things such as auto-serialization
global.Promise = require('bluebird')
global.co = require('co')
global._ = require('lomath')
const path = require('path')

global.ROOTPATH = path.join(__dirname, '..')
const log = require(path.join(__dirname, '..', 'src', 'log'))
require(path.join(ROOTPATH, 'src', 'global-client')) // js io global-client

// export for bot
module.exports = (robot) => {
  // set global for usage by children
  global.robot = robot

  // wake up, init
  co(function*() {
    /* istanbul ignore next */
    if (robot.adapter.constructor.name == 'Shell') {
      // set for Shell local dev
      require(path.join(ROOTPATH, 'test', 'asset'))
      robot.brain.data.users = global.users
    }
    yield Promise.delay(10); // wait to connect, get users
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
