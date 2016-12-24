// dependencies
// Module that runs after bot is constructed,
// before all other scripts are loaded;
// emit 'ready' to kickstart things such as auto-serialization
const Promise = require('bluebird')
const co = require('co')
const fs = require('fs')
const _ = require('lomath')
const path = require('path')
const polyIO = require('poly-socketio')
const log = require('../src/log')

global.ROOTPATH = path.join(__dirname, '..')
const brainDumpPath = path.join(__dirname, '..', 'brain.json')
polyIO.client({ port: process.env.IOPORT })

// export for bot
module.exports = (robot) => {
  // set global for usage by children
  global.robot = robot

  // wake up, init
  co(function* wake() {
    /* istanbul ignore next */
    if (robot.adapter.constructor.name === 'Shell') {
      // set for Shell local dev
      _.assign(robot.brain.data, { users: global.users })
    }
    yield Promise.delay(10) // wait to connect, get users
    // emit 'ready' event to kick off initialization
    robot.emit('ready')
  }).catch(log.error)

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
    const envelope = res.envelope
    const info = _.join([
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
      res.send('Brain written to output.')
    } catch (e) {
      /* istanbul ignore next */
      res.send('No permission to write brain to output.')
    }
  })
}
