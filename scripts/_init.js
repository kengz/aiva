// dependencies
// Module that runs after bot is constructed, before all other scripts are loaded; emit 'ready' to kickstart things such as auto-serialization
global.Promise = require('bluebird')
global.co = require('co')
global._ = require('lomath')
const fs = require('fs')
const path = require('path')
const polyIO = require('poly-socketio')

global.ROOTPATH = path.join(__dirname, '..')
const log = require(path.join(__dirname, '..', 'src', 'log'))
const brainDumpPath = path.join(__dirname, '..', 'brain.json')
polyIO.client({ port: process.env.IOPORT })

// export for bot
module.exports = (robot) => {
  // set global for usage by children
  global.robot = robot

  // wake up, init
  co(function*() {
    /* istanbul ignore next */
    if (robot.adapter.constructor.name === 'Shell') {
      // set for Shell local dev
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

  // ensure bot name
  robot.respond(/bot info/i, (res) => {
    var envelope = res.envelope
    var info = _.join([
      `robot.name: ${robot.name}`,
      `process.env.NODE_ENV: ${process.env.NODE_ENV}`,
      `adapter: ${process.env.ADAPTER}`,
      `user.id: ${envelope.user.id}`,
      `user.name: ${_.get(envelope, 'user.username') || _.get(envelope, 'user.name')}`,
      `room: ${envelope.room}`,
      `server time: ${new Date()}`,
      ], '\n')
    res.send(info)
  })

  // write the runtime brain to output
  robot.respond(/write brain/i, (res) => {
    try {
      fs.writeFile(brainDumpPath, JSON.stringify(robot.brain.data))
      res.send(`Brain written to output.`)
    } catch (e) {
      /* istanbul ignore next */
      res.send(`No permission to write brain to output.`)
    }
  })
}
