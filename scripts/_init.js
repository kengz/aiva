// dependencies
// Module that runs after bot is constructed, before all other scripts are loaded; emit 'ready' to kickstart things such as auto-serialization
global._ = require('lomath')
global.co = require('co')
global.Promise = require('bluebird')
var Log = require('log');

// declare global assets
// the knowledge base
global.KB = require('neo4jkb')({
  NEO4J_AUTH: process.env.NEO4J_AUTH,
  NEO4J_PORT: process.env.NEO4J_PORT
});

// export for bot
module.exports = function(robot) {
  // set global for usage by children
  global.robot = robot
  global.log = new Log('info')
  
  ///////////////////
  // wake up, init //
  ///////////////////
  co(function*() {
    // connect socket.io client to socket.io server for polyglot communication
    require('../lib/client')

    /* istanbul ignore next */
    if (robot.adapter.constructor.name == 'Shell') {
      // set for Shell local dev
      require('../test/asset')
      robot.brain.data.users = global.users
    };
    yield Promise.delay(500); // wait to connect, get users
    // emit 'ready' event to kick off initialization
    robot.emit('ready')
  }).catch(global.log.error)

  /////////////////////
  // initializations //
  /////////////////////
  robot.on('ready', function() {
    robot.emit('serialize_users')
  })

  // manually emit "ready" to simulate initialization
  robot.respond(/manual ready/i, function(res) {
    res.send('Manually starting initialization, emitting "ready".')
    robot.emit('ready')
  })

}
