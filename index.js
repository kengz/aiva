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

// child processes for spawn
var children = [];

var modulePorts = {
  production: {
    IOPORT: 6363
  },
  development: {
    IOPORT: 6365
  }
}
// make 2 levels of set env
// also print all ports

// some adapters need specific ports to work with
var adapterPorts = {
  production: {
    slack: 8343,
    telegram: 8443,
    fb: 8543
  },
  development: {
    slack: 8345,
    telegram: 8443,
    fb: 8545
  }
}

// process.env.<key> to set webhook for adapter
var adapterWebhookKey = {
  telegram: 'TELEGRAM_WEBHOOK',
  fb: 'FB_WEBHOOK_BASE'
}

// export the setEnv for convenient usage in dev
module.exports = setEnv;

// when running cmd `node index.js`, supply NODE_ENV and DEPLOY
function setEnv() {
  try {
    env(__dirname + '/.env', { overwrite: false }) // process-level
    env(__dirname + '/bin/' + process.env.DEPLOY) // bot-level
    overrideDefaultEnv()
    console.log("Deploying using", process.env.DEPLOY, "in NODE_ENV:", process.env.NODE_ENV)
  } catch (e) {
    console.log(e, '\nindex.js quitting.')
    process.exit(1)
  }
}

// override default FB adapter env
function overrideDefaultEnv() {
  // fallback if runnning `node index.js` directly
  process.env.NODE_ENV = process.env.NODE_ENV || 'development'
  process.env.DEPLOY = process.env.DEPLOY || '.keys-aivadev'
  process.env.BOTNAME = process.env.BOTNAME || 'aivadev'
  // override default FB adapter env
  process.env.FB_AUTOHEAR = 'true'
  process.env.FB_WEBHOOK_BASE = process.env.FB_WEBHOOK_BASE || process.env.FB_WEBHOOK
  process.env.FB_ROUTE_URL = '/fb'
}

// get the specific port for the adapter
function getSpecificPort(adapter) {
  return _.get(adapterPorts, [process.env.NODE_ENV, adapter])
}

// Return Promise with cEnv, a copy of process.env, for chaining
function copyEnv(adapter) {
  var cEnv = _.clone(process.env)
  cEnv['ADAPTER'] = adapter
  cEnv['BOTNAME'] = cEnv[_.toUpper(adapter)+'_BOTNAME'] || cEnv['BOTNAME'] // override default if specified
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
    // set ngrok subdomain if <ADAPTER>_WEBHOOK given as ngrok domain
    var subdomain = undefined
    if (cEnv[webhookKey] && cEnv[webhookKey].match(/\/\/(\w+)\.ngrok/)) {
      subdomain = cEnv[webhookKey].match(/\/\/(\w+)\.ngrok/)[1]
    }
    var ngrokOpts = _.pickBy({
      proto: 'http', // http|tcp|tls 
      addr: cEnv['PORT'], // port or network address 
      subdomain: subdomain,
      authtoken: cEnv['NGROK_AUTH']
    })

    return ngrok.connectAsync(ngrokOpts)
    .then(function(url) {
      cEnv[webhookKey] = url
      console.log("[", cEnv['ADAPTER'], "webhook url: ", url, "at PORT:", cEnv['PORT'], "]")
      return cEnv
    })
    .catch(function(err) {
      console.log(err)
      console.log("You may have specified a wrong pair of ngrok subdomain and NGROK_AUTH, or trying to use more than 1 custom subdomain at once.")
    })
  } else {
    return cEnv
  }
}

// at last, when all cEnv is setup, spawn a hubot in child.process using cEnv
function spawnProcess(cEnv) {
  // spawn hubot with the copied env for childprocess
  var hb = spawn('./bin/hubot', ['-a', cEnv['ADAPTER'], '--name', cEnv['BOTNAME']], { stdio: 'inherit', env: cEnv })
  children.push(hb);
  console.log("Deploy", cEnv['BOTNAME'], "with", cEnv['ADAPTER'])
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
  console.log("Access neo4j at http://localhost:7474")
  console.log("Access ngrok at http://localhost:4040~4041")

  // start socket.io for polyglot communication
  require('./lib/io_start')()

  // detect all adapters, spawn a hubot for each
  var adapters = process.env.ADAPTERS.split(/\s*,\s*/g)
  _.each(adapters, function(adapter){
    spawnHubot(adapter)
  })

  var cleanExit = function() { process.exit() };
  process.on('SIGINT', cleanExit); // catch ctrl-c
  process.on('SIGTERM', cleanExit); // catch kill
};
