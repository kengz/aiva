// dependencies
const Promise = require('bluebird')
const { spawn, execSync } = require('child_process')
const config = require('config')
const Log = require('log')
const _ = require('lomath')
const ngrok = require('ngrok')
Promise.promisifyAll(ngrok)
const path = require('path')
const portfinder = require('portfinder')
Promise.promisifyAll(portfinder)


var children = [] // child processes for spawn
logLevel = process.env['npm_config_debug'] ? 'debug' : 'info'
const log = new Log(logLevel)
var globalKeys = _.difference(_.keys(config), ['ADAPTERS'])
var globalConfig = _.pick(config, globalKeys)
var activeAdapters = _.pickBy(config.get('ADAPTERS'), 'ACTIVATE')

// helper to set process.env (or copy) from config
function configToEnv(config, env = process.env) {
  _.forOwn(config, (v, k) => {
    _.isPlainObject(v) ? configToEnv(v, env) : env[k] = v
  })
}

// when running cmd `node index.js`, supply NODE_ENV and DEPLOY
function setEnv() {
  try {
    process.env.NODE_ENV = process.env.NODE_ENV || 'development'
    process.env.IOPORT = config.get('PORTS.SOCKETIO')
    process.env.CLIENT_COUNT = _.size(activeAdapters)
    log.debug(`globalConfig ${JSON.stringify(globalConfig, null, 2)}`)
    configToEnv(globalConfig)
  } catch (e) {
    log.error(`${JSON.strigify(e, null, 2)}index.js quitting.`)
    process.exit(1)
  }
}

// spawn a new env copy for an adapter, return in Promise for chaining
function spawnEnv(adapter) {
  var env = _.clone(process.env)
  env['ADAPTER'] = adapter
  adapterConfig = config.get(`ADAPTERS.${adapter}`)
  log.debug(`adapterConfig ${JSON.stringify(adapterConfig, null, 2)}`)
  configToEnv(adapterConfig, env)
  return Promise.resolve(env)
}

// set the PORT of env if specified in adapterConfig
function setPort(env) {
  portfinder.basePort = config.get(`PORTS.${env['ADAPTER']}`)
  return portfinder.getPortAsync()
    .then((newPort) => {
      env['PORT'] = newPort
      log.debug(`Set ${env['ADAPTER']} PORT: ${newPort}`)
      portfinder.basePort += 1 // prevent conflict
      return env
    })
}

// set the webhook of env if it's specified in adapterConfig
// Spawn a ngrok automatically to handle the webhook
function setWebhook(env) {
  var webhookKey = env['WEBHOOK_KEY']
  if (!webhookKey) {
    log.debug(`No WEBHOOK set for adapter ${env['ADAPTER']}`)
    return env
  } else {
    var webhook = env[webhookKey]
    var subdomain = undefined
    if (webhook && webhook.match(/\/\/(\w+)\.ngrok/)) {
      subdomain = webhook.match(/\/\/(\w+)\.ngrok/)[1]
    }

    var ngrokOpts = _.pickBy({
      proto: 'http', // http|tcp|tls 
      addr: env['PORT'], // port or network address 
      subdomain: subdomain,
      authtoken: env['NGROK_AUTH']
    })
    log.debug(`ngrok options: ${JSON.stringify(ngrokOpts, null, 2)}`)

    return ngrok.connectAsync(ngrokOpts)
      .then((url) => {
        env[webhookKey] = url // update
        log.debug(`Set ${env['ADAPTER']} webhook url: ${url}:${env['PORT']}`)
        return env
      })
      .catch((e) => {
        log.error(`${JSON.stringify(e, null, 2)} \nYou may have specified a wrong pair of ngrok subdomain and NGROK_AUTH, or trying to use more than 1 custom subdomain at once.`)
        return env
      })
  }
}

// finally, spawn a hubot in child.process using env
function spawnProcess(env) {
  var hb = spawn('./bin/hubot', ['-a', env['ADAPTER'], '--name', env['BOTNAME']], { stdio: 'inherit', env: env })
  children.push(hb)
  log.info(`Deploying bot ${env['BOTNAME']} with adapter ${env['ADAPTER']}`)
  return env
}

// Spawn hubot for an adapter by chaining the setups above
function spawnHubot(adapter) {
  return spawnEnv(adapter)
    .then(setPort)
    .then(setWebhook)
    .then(spawnProcess)
}

// if this file is run directly by `node index.js`
/* istanbul ignore next */
if (require.main === module) {
  setEnv()

  // so that hubot is killed when forever exits.
  process.on('exit', () => {
    children.forEach((child) => { child.kill() })
    log.info("Shutting down")
  })

  // detect all active adapters, spawn a hubot for each
  activeAdapters = _.pickBy(config.get('ADAPTERS'), 'ACTIVATE')
  process.env.CLIENT_COUNT = _.size(activeAdapters)
  require(path.join(__dirname, 'lib', 'io_start'))() // start socketIO
  _.each(_.keys(activeAdapters), spawnHubot) // start hubot with adapters

  var cleanExit = () => {
    ngrok.kill()
    process.exit()
  }
  process.on('SIGINT', cleanExit) // catch ctrl-c
  process.on('SIGTERM', cleanExit) // catch kill
}


// export the setEnv for convenient usage in dev
module.exports = setEnv
