// dependencies
var env = require('node-env-file');
var spawn = require('child_process').spawn;
var exec = require('child_process').exec;

// export the setEnv for convenient usage in dev
module.exports = setEnv;

// set env if not already set externally
// .env must exist if setting env vars externally
function setEnv(defaultKey) {
  // optionally set defaultKey
  process.env.DEPLOY = process.env.DEPLOY || defaultKey;

  try {
    env(__dirname + '/.env', { overwrite: false });
    // reset port for dev
    if (process.env.NODE_ENV == 'development') { process.env.PORT = process.env.TEST_PORT };
    // then set env keys for the deployed bot
    console.log("Deploying using", process.env.DEPLOY)
    env(__dirname + '/bin/' + process.env.DEPLOY);
  } catch (e) {
    console.log(e)
    process.exit(1)
  }
}

// if this file is run directly by `node index.js`
/* istanbul ignore next */
if (require.main === module) {
  // call setEnv with a default key
  setEnv();
  
  // child processes by spawn
  var children = [];
  
  // so that hubot is killed when forever exits.
  process.on('exit', function() {
    children.forEach(function(child) {
      child.kill();
    });
    // kill the neo4j brain server too
    exec('neo4j stop')
    console.log("Shutting down")
  });
  
  // start and kill neo4j brain server
  exec('neo4j start');
  // run hubot
  var hb = spawn('./bin/hubot', ['-a', process.env.ADAPTER], {  stdio: 'inherit' })
  children.push(hb);
  
  
  
  var cleanExit = function() { process.exit() };
  process.on('SIGINT', cleanExit); // catch ctrl-c
  process.on('SIGTERM', cleanExit); // catch kill
};
