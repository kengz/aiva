// common setups for tests, run before tests
global.Promise = require('bluebird')
global.co = require('co')
const path = require('path')
const SRCPATH = path.join(__dirname, '..', 'src')
const startIO = require(path.join(SRCPATH, 'start-io'))
const log = require(path.join(SRCPATH, 'log'))
const { setEnv } = require(path.join(SRCPATH, 'env'))
const { migrateDb } = require(path.join(SRCPATH, 'db'))
global.chai = require('chai') // chai assertation library
chai.use(require("chai-as-promised"))
global.should = chai.should()
global.sinon = require('sinon') // sinon spy/stub library
global.Helper = require('hubot-test-helper')
global.Promise.config({ warnings: false })
global.DEFAULT_ROOM = "bot-test" // set for test
global.A = require(path.join(__dirname, 'asset')) // global asset

// set the hubot say handlers for unit tests: send reply to room
global.say = (room, name, key) => {
  key = key || 'output'
  return _.flow(_.partial(_.get, _, key), _.bind(room.user.say, room, name))
}

// Promise.delay, with adjusted time factors. for use with yield
global.delayer = (factor) => {
  factor = factor || 1
  var timeout = 100 * factor
  timeout = _.min([timeout, 16000]) // timeout is capped at 16s
  return Promise.delay(timeout)
}

function startProcess() {
  return new Promise((resolve, reject) => {
    try {
      // set the port to test
      process.env.NODE_ENV = 'test'
      log.info(`Starting aiva test process`)
      setEnv()
      process.env.PORT = 9090
      process.env.IOPORT = 7676
      log.info(`Test is using PORT: ${process.env.PORT}; IOPORT: ${process.env.IOPORT}`)
    } catch (e) {
      log.error(JSON.stringify(e, null, 2))
      log.error("No config and not in CI, please provide your config file.")
      reject()
      process.exit(1)
    }

    const ROOTPATH = path.join(__dirname, '..')
    startIO() // start socketIO
    resolve()
  })
}

// primary start method
function start() {
  return migrateDb()
    .then(startProcess)
}

module.exports = {
  start: start
}
