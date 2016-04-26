// dependencies
var env = require('node-env-file');
var spawn = require('child_process').spawn;
var exec = require('child_process').exec;
var Promise = require('bluebird');
var _ = require('lomath');
var portfinder = require('portfinder');
Promise.promisifyAll(portfinder)
var ngrok = require('requireg')('ngrok');
Promise.promisifyAll(ngrok);

process.env.NODE_ENV = process.env.NODE_ENV || 'development'

// child processes for spawn
var children = [];

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

// process.env.<key> to set webhook for adapter
var adapterWebhookKey = {
  'telegram': 'TELEGRAM_WEBHOOK'
}

// export the setEnv for convenient usage in dev
module.exports = setEnv;

// set env if not already set externally
// .env must exist if setting env vars externally
function setEnv(defaultKey) {
  // optionally set defaultKey
  process.env.DEPLOY = process.env.DEPLOY || defaultKey || '.keys-aivadev';
  try {
    env(__dirname + '/.env', { overwrite: false });
    // then set env keys for the deployed bot
    console.log("Deploying using", process.env.DEPLOY)
    env(__dirname + '/bin/' + process.env.DEPLOY);
    process.env.BOTNAME = process.env.DEPLOY.split("-").pop()
  } catch (e) {
    console.log(e)
    console.log('index.js quitting.')
    process.exit(1)
  }
}

// get the specific port for the adapter
function getSpecificPort(adapter) {
  return _.get(adapterPorts, [process.env.NODE_ENV, adapter])
}

// Return Promise with cEnv, a copy of process.env, for chaining
function copyEnv(adapter) {
  var cEnv = _.clone(process.env)
  cEnv['ADAPTER'] = adapter
  return Promise.resolve(cEnv)
}

// set the PORT of cEnv if it's specified in adapterPorts, or use the next open port
function setPort(cEnv) {
  // copy env for child (separate PORT)
  var specifiedPort = getSpecificPort(cEnv['ADAPTER']);
  if (specifiedPort) {
    cEnv['PORT'] = specifiedPort
    return cEnv
  } else {
    return portfinder.getPortAsync()
    .then(function(newPort) {
      cEnv['PORT'] = newPort
      portfinder.basePort += 1
      return cEnv
    })
  }
}

// set the webhook of cEnv if it's specified in adapterWebhookKey
// Spawn a ngrok automatically to handle the webhook
function setWebhook(cEnv) {
  var webhookKey = _.get(adapterWebhookKey, cEnv['ADAPTER'])
  if (webhookKey) {
    return ngrok.connectAsync({
      proto: 'http', // http|tcp|tls 
      addr: cEnv['PORT'], // port or network address 
    })
    .then(function(url) {
      cEnv[webhookKey] = url
      return cEnv
    })
  } else {
    return cEnv
  }
}

// at last, when all cEnv is setup, spawn a hubot in child.process using cEnv
function spawnProcess(cEnv) {
  // spawn hubot with the copied env for childprocess
  var hb = spawn('./bin/hubot', ['-a', cEnv['ADAPTER'], '--name', process.env.BOTNAME], { stdio: 'inherit', env: cEnv })
  children.push(hb);
  console.log("Deploy", process.env.BOTNAME, "with", cEnv['ADAPTER'], "at port", cEnv['PORT'])
  return cEnv
}

// Spawn hubot for an adapter by chaining the setups above
function spawnHubot(adapter) {
  return copyEnv(adapter)
  .then(setPort)
  .then(setWebhook)
  .then(spawnProcess)
}


// if this file is run directly by `node index.js`
/* istanbul ignore next */
if (require.main === module) {
  // call setEnv with a default key
  setEnv();
  
  // so that hubot is killed when forever exits.
  process.on('exit', function() {
    children.forEach(function(child) {
      child.kill();
    });
    console.log("Shutting down")
  });
  
  // start and kill neo4j brain server
  exec('neo4j start');

  // detect all adapters, spawn a hubot for each
  var adapters = process.env.ADAPTERS.split(/\s*,\s*/g)
  _.each(adapters, function(adapter){
    spawnHubot(adapter)
  })

  var cleanExit = function() { process.exit() };
  process.on('SIGINT', cleanExit); // catch ctrl-c
  process.on('SIGTERM', cleanExit); // catch kill
};
