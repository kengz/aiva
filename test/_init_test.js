// First mocha test to run: sets up before all tests
var _ = require('lomath')
var fs = require('fs')
var spawnSync = require('child_process').spawnSync;
// start socket.io for polyglot communication
process.env.IOPORT = 7676
require('../lib/io_start')()
// emulate full hubot init
var helper = new Helper('../scripts/')


before(function() {
  console.log('Starting Neo4j:')
  return co(function*() {
    var ss = yield spawnSync('neo4j', ['start'])
    console.log((ss.stdout || 0).toString())
    console.log('This is in ' + process.env.NODE_ENV + ' mode.')

    // emulate full hubot initialization, set to global.room for use
    global.room = helper.createRoom({ name: global.DEFAULT_ROOM });

    // set the brain to test/asset.js's
    _.set(this.room.robot, 'brain.data.users', users)
    yield global.ioPromise
  })
})


after(function() {
  global.room.destroy()
  console.log('Stopping Neo4j:')
  return co(function*() {
    yield KB.query('MATCH (a) WHERE ANY(x IN labels(a) WHERE x =~ "(?i)^test_.*") DETACH DELETE a').catch(console.log)
    console.log('Deleted all test data (with label =~ "^test_.*")');
    // var ss = yield spawnSync('neo4j', ['stop'])
    // console.log((ss.stdout||0).toString())
  })
})
