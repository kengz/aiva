// common setups for tests, run before tests
const Promise = require('bluebird')
const chai = require('chai') // chai assertation library
const chaiAsPromised = require('chai-as-promised')
const co = require('co')
const Helper = require('hubot-test-helper')
const _ = require('lomath')
const sinon = require('sinon') // sinon spy/stub library

const A = require('./asset') // global asset
const { migrateDb } = require('../src/db')
const { setEnv } = require('../src/env')
const log = require('../src/log')
const startIO = require('../src/start-io')

chai.use(chaiAsPromised)
global.chai = chai
global.co = co
global.Promise = Promise
global.should = chai.should()
global.sinon = sinon
global.Helper = Helper
global.A = A
global.DEFAULT_ROOM = 'bot-test' // set for test
global.Promise.config({ warnings: false })

// set the hubot say handlers for unit tests: send reply to room
global.say = (room, name, key = 'output') => {
  const msg = _.flow(_.partial(_.get, _, key), _.bind(room.user.say, room, name))
  return msg
}

// Promise.delay, with adjusted time factors. for use with yield
global.delayer = (factor = 1) => {
  let timeout = 100 * factor
  timeout = _.min([timeout, 16000]) // timeout is capped at 16s
  return Promise.delay(timeout)
}

function startProcess() {
  return new Promise((resolve, reject) => {
    try {
      // set the port to test
      process.env.NODE_ENV = 'test'
      process.env.ADAPTER = 'Shell'
      log.info('Starting aiva test process')
      setEnv()
      process.env.PORT = 9090
      process.env.IOPORT = 7676
      log.info(`Test is using PORT: ${process.env.PORT}; IOPORT: ${process.env.IOPORT}`)
    } catch (e) {
      log.error(JSON.stringify(e, null, 2))
      log.error('No config and not in CI, please provide your config file.')
      reject()
      process.exit(1)
    }

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
  start,
}
