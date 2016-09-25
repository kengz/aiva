// First mocha test to run: sets up before all tests
const fs = require('fs')
const _ = require('lomath')
const path = require('path')
const { spawnSync } = require('child_process')
delete process.env['ADAPTERS']
process.env.IOPORT = 7676
const rootPath = path.join(__dirname, '..')
require(path.join(rootPath, 'lib', 'io_start'))() // start socketIO
var helper = new Helper(path.join(rootPath, 'scripts')) // emulate full hubot init


before(() => {
  // console.log('Starting Neo4j:')
  return co(function*() {
    // var ss = yield spawnSync('neo4j', ['start'])
    // console.log((ss.stdout || 0).toString())
    console.log('This is in ' + process.env.NODE_ENV + ' mode.')

    // emulate full hubot initialization, set to global.room for use
    global.room = helper.createRoom({ name: global.DEFAULT_ROOM });

    // set the brain to test/asset.js's
    _.set(this.room.robot, 'brain.data.users', users)
    yield global.ioPromise
  })
})


after(() => {
  global.room.destroy()
  // console.log('Stopping Neo4j:')
  // return co(function*() {
    // yield KB.query('MATCH (a) WHERE ANY(x IN labels(a) WHERE x =~ "(?i)^test_.*") DETACH DELETE a').catch(console.log)
    // console.log('Deleted all test data (with label =~ "^test_.*")');
    // var ss = yield spawnSync('neo4j', ['stop'])
    // console.log((ss.stdout||0).toString())
  // })
})
