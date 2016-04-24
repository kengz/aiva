// dependencies
var env = require('node-env-file');
var spawn = require('child_process').spawn;
var exec = require('child_process').exec;
var _ = require('lomath');
var portfinder = require('portfinder');

// some adapters need specific ports to work with
var adapterPorts = {
  'production': {
    'telegram': 8443,
    'fb': 8080
  },
  'development': {
    'telegram': 8443,
    'fb': 80
  }
}

// export the setEnv for convenient usage in dev
module.exports = setEnv;

// get the specific port for the adapter
function getSpecificPort(adapter) {
  return _.get(adapterPorts, [process.env.NODE_ENV, adapter])
}

// set env if not already set externally
// .env must exist if setting env vars externally
function setEnv(defaultKey) {
  // optionally set defaultKey
  process.env.DEPLOY = process.env.DEPLOY || defaultKey;
  try {
    env(__dirname + '/.env', { overwrite: false });
    // then set env keys for the deployed bot
    console.log("Deploying using", process.env.DEPLOY)
    env(__dirname + '/bin/' + process.env.DEPLOY);
  } catch (e) {
    console.log(e)
    console.log('index.js quitting.')
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
    console.log("Shutting down")
  });
  
  // start and kill neo4j brain server
  exec('neo4j start');

  var botname = process.env.DEPLOY.split("-").pop()
  // detect all adapters, spawn a hubot for each
  var adapters = process.env.ADAPTERS.split(/\s*,\s*/g)
  _.each(adapters, function(adapter){
    portfinder.getPort(function(e, port) {
      // copy env for child (separate PORT)
      var envCopy = _.clone(process.env)
      envCopy['PORT'] = getSpecificPort(adapter) || port

      // spawn hubot with the copied env for childprocess
      var hb = spawn('./bin/hubot', ['-a', adapter, '--name', botname], { stdio: 'inherit', env: envCopy })
      children.push(hb);
      console.log("Deploy", botname, "with", adapter, "at port", envCopy['PORT'])
      
      // update basePort for next search
      portfinder.basePort += 1
    })
  })

  var cleanExit = function() { process.exit() };
  process.on('SIGINT', cleanExit); // catch ctrl-c
  process.on('SIGTERM', cleanExit); // catch kill
};
