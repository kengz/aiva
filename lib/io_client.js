// Module to init all clients for all supported languages. Called by scripts/0_init.js

// dependencies
var _ = require('lomath')
var spawn = require('child_process').spawn;

/**
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

  ////////////////////////////////////////////////
  // Master import of socketio polyglot clients //
  ////////////////////////////////////////////////

  // import js locally
  require(__dirname + '/client.js')

  // import other languages via child_process
  var commands = [
    ['ruby', [__dirname + '/client.rb']],
    ['python3', [__dirname + '/client.py']]
  ]

  _.each(commands, function(c) {
    // spawn then add listeners
    var cp = spawn(c[0], c[1], { stdio: [process.stdin, process.stdout, 'pipe'] });
    // add to the list of child processes
    children.push(cp);

    /* istanbul ignore next */
    cp.stderr.on('data', function(data) {
      console.log('err:', data.toString('utf8'));
      // kill if err to prevent runover process
      cp.kill('SIGTERM')
    });

  })

}


/* istanbul ignore next */
var cleanExit = function() { process.exit() };
process.on('SIGINT', cleanExit); // catch ctrl-c
process.on('SIGTERM', cleanExit); // catch kill

module.exports = io_client

// if this file is run directly by `node server.js`
/* istanbul ignore next */
if (require.main === module) {
  io_client()
}
