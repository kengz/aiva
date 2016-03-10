// The server. Called by scripts/0_init.js

// dependencies
var _ = require('lomath')

/**
 * Start a Socket IO server connecting to a robot.server (an Expressjs server), or a brand new Express server for use in dev. Sets global.io too.
 * @param  {*} robot The hubot object
 * @return {server} server
 */
/* istanbul ignore next */
function io_server(robot) {
  console.log('Starting io_server.js: socket.io on Express server of robot.')
  var server;
  if (robot) {
    server = robot.server;
  } else {
    var app = require('express')()
    process.on('uncaughtException', console.log)
    server = app.listen(process.env.PORT)
  }

  global.io = require('socket.io').listen(server);
  // set the hubot say handlers for unit tests: send reply to room
  global.io.say = say

  // serialize for direct communication by using join room
  global.io.sockets.on('connection', function(socket) {
    socket.on('join', function(id) {
      socket.join(id)
      console.log(id, socket.id, 'joined')
    })
    socket.on('disconnect', function() {
      console.log(socket.id, 'left')
    })
  })

  global.io.on('connection', function(socket) {
    // generic pass to other script
    socket.on('pass', function(msg, fn) {
      // console.log(msg)
      try {
        // e.g. split 'hello.py' into ['hello', 'py']
        // lang = 'py', module = 'hello'
        var tokens = msg.to.split('.'),
          lang = tokens.pop(),
          module = _.join(tokens, '.');
        // reset of <to> for easy calling. May be empty if just passing to client.<lang>
        msg.to = module;
        global.io.sockets.in(lang).emit('take', msg)
      } catch (e) {
        console.log('Wrong msg.to string, not passed on by io_server')
        console.log(e)
      }
    })
  })

  return server;
}

/**
 * Similar method as above for mocha tests, to use @room.user.say
 * @param  {*} room The hubot test helper room.
 * @param  {string} name Of the test user.
 * @param  {string} [key='output'] The key to extract the io JSON payload.
 * @return {Function}     Handler for io client to use for sending.
 *
 * @example
 * (see test/lib/test_nlp.coffee)
 */
/* istanbul ignore next */
function say(room, name, key) {
  key = key || 'output'
  return _.flow(_.partial(_.get, _, key), _.bind(room.user.say, room, name))
}


// export for use by hubot
module.exports = io_server

// if this file is run directly by `node server.js`
/* istanbul ignore next */
if (require.main === module) {
  process.env.PORT = process.env.PORT || 8080
  io_server()
}
