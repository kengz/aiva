// First mocha test to run: sets up before all tests
var _ = require('lomath')
var spawnSync = require('child_process').spawnSync;
// emulate full hubot init
var helper = new Helper('../scripts/')
var clientCount = 3

// wait for n number of clients to join global.io
function waitForClients() {
  var count = clientCount;
  console.log('waiting for', count, 'clients')
  return new Promise(function(resolve, reject) {
    global.io.sockets.on('connection', function(socket) {
      socket.on('join', function(id) {
        count--;
        if (count == 0) {
          console.log('all', clientCount, 'clients have joined, start tests')
          console.log('================================================================================')
          resolve()
        }
      })
    })
  })
}

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
    yield waitForClients()
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
