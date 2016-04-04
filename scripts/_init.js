// dependencies
// Module that runs after bot is constructed, before all other scripts are loaded; emit 'ready' to kickstart things such as auto-serialization
global._ = require('lomath')
global.co = require('co')
global.Promise = require('bluebird')

// declare global assets
// the knowledge base
global.KB = require('neo4jkb')({
  NEO4J_AUTH: process.env.NEO4J_AUTH,
  NEO4J_HOST: process.env.NEO4J_HOST,
  NEO4J_PORT: process.env.NEO4J_PORT
});
// the default room name
/* istanbul ignore next */
global.DEFAULT_ROOM = (process.env.NODE_ENV == 'production') ? process.env.DEFAULT_ROOM || 'bot-dev' : 'bot-test'

// export for bot
module.exports = function(robot) {
  // set global for reference
  global.robot = robot
  
  ///////////////////
  // wake up, init //
  ///////////////////
  co(function*() {
    // plugin socket.io for polyglot communication
    require('../lib/io_server')(robot)
    require('../lib/io_client')(robot)

    /* istanbul ignore next */
    if (robot.adapter.constructor.name == 'Shell') {
      // set for Shell local dev
      global.DEFAULT_ROOM = 'Shell'
      require('../test/asset')
      robot.brain.data.users = global.users
    };
    // send a message to connect the adapter and update robot.brain.data.users
    yield robot.messageRoom(global.DEFAULT_ROOM, "I'm online.")
    yield Promise.delay(500);
    // emit 'ready' event to kick off initialization
    robot.emit('ready')
  }).catch(console.log)

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
