// First mocha test to run: sets up before all tests
const { spawnSync } = require('child_process')
const fs = require('fs')
const _ = require('lomath')
const path = require('path')
delete process.env['ADAPTERS']
process.env.IOPORT = 7676
const rootPath = path.join(__dirname, '..')
require(path.join(rootPath, 'lib', 'io_start'))() // start socketIO
var helper = new Helper(path.join(rootPath, 'scripts')) // emulate full hubot init

before(() => {
  return co(function*() {
    global.log.info(`Running in ${process.env.NODE_ENV} mode`)
    global.log.info(`Creating rooms, initializing brain for tests`)

    // emulate full hubot initialization, set to global.room for use
    global.room = helper.createRoom({ name: global.DEFAULT_ROOM });

    // set the brain to test/asset.js's
    _.set(this.room.robot, 'brain.data.users', users)
    yield global.ioPromise
  })
})

after(() => {
  global.log.info(`Destroying rooms, resetting test db`)
  global.room.destroy()
    // cleanup test db
})
