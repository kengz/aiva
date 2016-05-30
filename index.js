// dependencies
var env = require('node-env-file');
var spawn = require('child_process').spawn;
var execSync = require('child_process').execSync;
var Promise = require('bluebird');
var _ = require('lomath');
var portfinder = require('portfinder');
Promise.promisifyAll(portfinder)
var ngrok = require('requireg')('ngrok');
Promise.promisifyAll(ngrok);
var Log = require('log'),
log = new Log('info');

// child processes for spawn
var children = [];

// list of all ports used, including for adapters
var portList = {
  production: {
    ngrok: '4040-4041',
    neo4j: 7474,
    socketIO: 6464,
    slack: 8343,
    telegram: 8443,
    fb: 8543
  },
  development: {
    ngrok: '4040-4041',
    neo4j: 7476,
    socketIO: 6466,
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
    hardsetEnv()
    env(__dirname + '/bin/' + process.env.DEPLOY) // bot-level
    hardsetBotEnv()
    log.info("Using:", process.env.DEPLOY, "in NODE_ENV:", process.env.NODE_ENV)
  } catch (e) {
    log.error('%s \nindex.js quitting.', e)
    process.exit(1)
  }
}

// hard-set env on process-level, i.e. not reading from file
function hardsetEnv() {
  // fallback if runnning `node index.js` directly
  process.env.NODE_ENV = process.env.NODE_ENV || 'development'
  process.env.DEPLOY = process.env.DEPLOY || '.keys-aivadev'
  process.env.BOTNAME = process.env.BOTNAME || 'aivadev'
  process.env.IOPORT = _.get(portList, [process.env.NODE_ENV, 'socketIO'])
}

// hard-set env on bot-level
function hardsetBotEnv() {
  // override default FB adapter env
  process.env.FB_AUTOHEAR = 'true'
  process.env.FB_WEBHOOK_BASE = process.env.FB_WEBHOOK_BASE || process.env.FB_WEBHOOK
  process.env.FB_ROUTE_URL = '/fb'
}

// get the specific port for the adapter
function getSpecificPort(adapter) {
  return _.get(portList, [process.env.NODE_ENV, adapter])
}

// Return Promise with cEnv, a copy of process.env, for chaining
function copyEnv(adapter) {
  var cEnv = _.clone(process.env)
  cEnv['ADAPTER'] = adapter
  cEnv['BOTNAME'] = cEnv[_.toUpper(adapter)+'_BOTNAME'] || cEnv['BOTNAME'] // override default if specified
  return Promise.resolve(cEnv)
}

// set the PORT of cEnv if it's specified in portList, or use the next open port
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
      log.info(cEnv['ADAPTER'], "webhook url: ", url, "at PORT:", cEnv['PORT'])
      return cEnv
    })
    .catch(function(err) {
      log.error("%s \nYou may have specified a wrong pair of ngrok subdomain and NGROK_AUTH, or trying to use more than 1 custom subdomain at once.", e)
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
  log.info("Deploy bot:", cEnv['BOTNAME'], "with adapter:", cEnv['ADAPTER'])
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
  // setEnv, then log live ports
  setEnv();
  _.each(portList[process.env.NODE_ENV], function(k,v) {
    log.info('http://localhost:%s used for %s',k,v)
  })
  
  // so that hubot is killed when forever exits.
  process.on('exit', function() {
    children.forEach(function(child) {
      child.kill();
    });
    log.info("Shutting down")
  });
  
  // start and kill neo4j brain server
  execSync('./bin/neo4j_auth.sh', { stdio: [process.stdin, process.stdout, 'pipe'] });

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
