// The socket.io server and polyglot clients. Called by scripts/_init.js

// dependencies
var _ = require('lomath')
var spawn = require('child_process').spawn
var Promise = require('bluebird')
var fs = require('fs')
var clientCount = _.countBy(fs.readdirSync(__dirname), function(filename) {
  return filename.match(/^client\./)
})['client.']

/**
 * Start a Socket IO server connecting to a robot.server (an Expressjs server), or a brand new Express server for use in dev. Sets global.io too.
 * Has a failsafe for not starting multiple times even when called repeatedly by accident in the same thread.
 * @param  {*} robot The hubot object
 * @return {server} server
 */
/* istanbul ignore next */
function io_server(robot) {
  if (global.io) {
    // if already started elsewhere, skip below including io_client, return promise with the existing server
    return Promise.resolve(global.io.server)
  };

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
  var count = clientCount;
  global.ioPromise = new Promise(function(resolve, reject) {
    global.io.sockets.on('connection', function(socket) {
      // serialize for direct communication by using join room
      socket.on('join', function(id) {
        socket.join(id)
        console.log(id, socket.id, 'joined')
        if (--count == 0) {
          console.log('All', clientCount, 'clients have joined.')
          console.log('================================================================================')
          resolve(server) // resolve with the server
        };
      })
      socket.on('disconnect', function() {
        console.log(socket.id, 'left')
      })
    })
  }).catch(function(err) {
    console.log("Clients initialization error.")
    process.exit(0)
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
        console.log(e)
      }
    })
  })

  // call clients after setup, or skipped together above
  setTimeout(function() {
    // add timelag try to resolve rb client issue on travis
    io_client(robot)
  }, 1000);
  return global.ioPromise;
}


/**
 * Helper: called from within io_server after its setup.
 * Start all polyglot io_client processes using spawn. Kill them on error to prevent runaway processes, i.e. run all the io_import.<language> processes. The io_import.<language> im turn runs all the io clients of that language.
 * @param  {*} robot The hubot object
 */
/* istanbul ignore next */
function io_client(robot) {
  console.log("Starting polyglot io_clients");
  // the child processes,kill all on death
  var children = [];
  /* istanbul ignore next */
  process.on('exit', function() {
    children.forEach(function(child) {
      child.kill();
    });
    console.log('Exit: killed io_client.js children')
  });

  // import js locally
  require(__dirname + '/client.js')

  // import other languages via child_process
  var commands = [
    ['ruby', [__dirname + '/client.rb']],
    ['python3', [__dirname + '/client.py']]
  ]
  _.each(commands, function(c) {
    // spawn then add listeners, add to the list of child processes
    var cp = spawn(c[0], c[1], { stdio: [process.stdin, process.stdout, 'pipe'] });
    children.push(cp);

    /* istanbul ignore next */
    cp.stderr.on('data', function(data) {
      console.log('err:', data.toString('utf8'));
      // kill if err to prevent runover process
      cp.kill('SIGTERM')
    });
  })
}

/**
 * The main method to start the io server then clients.
 * Calls server and client methods above.
 */
/* istanbul ignore next */
function io_start(robot) {
  process.env.PORT = process.env.PORT || 8080
  io_server(robot)
  return global.ioPromise
}


/* istanbul ignore next */
var cleanExit = function() { process.exit() };
process.on('SIGINT', cleanExit); // catch ctrl-c
process.on('SIGTERM', cleanExit); // catch kill

// export for use by hubot
module.exports = io_start

// if this file is run directly by `node server.js`
/* istanbul ignore next */
if (require.main === module) {
  io_start()
}
