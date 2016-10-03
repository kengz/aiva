// First mocha test to run: sets up before all tests
const _ = require('lomath')
const path = require('path')
const aiva = require(path.join(__dirname, 'common'))

before(() => {
  return co(function*() {
    yield aiva.start()
    
    global.log.info(`Running in ${process.env.NODE_ENV} mode`)
    global.log.info(`Create rooms, init brain for tests`)
    var helper = new Helper(path.join(__dirname, '..', 'scripts')) // emulate full hubot init

    // emulate full hubot initialization, set to global.room for use
    global.room = helper.createRoom({ name: global.DEFAULT_ROOM })

    // set the brain to test/asset.js's
    _.set(this.room.robot, 'brain.data.users', users)
    console.log('global ioPromise', global.ioPromise)
    yield global.ioPromise
  })
})

after(() => {
  global.log.info(`Destroying rooms, resetting test db`)
  global.room.destroy()
    // cleanup test db
})
