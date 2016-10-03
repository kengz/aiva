const Promise = require('bluebird')
const config = require('config')
const _ = require('lomath')
const ngrok = require('ngrok')
Promise.promisifyAll(ngrok)
const path = require('path')
const portscanner = require('portscanner')
Promise.promisifyAll(portscanner)
const log = require(path.join(__dirname, 'log'))

global.config = config
var globalKeys = _.difference(_.keys(config), ['ADAPTERS', 'ACTIVATE_IO_CLIENTS'])
var globalConfig = _.pick(config, globalKeys)
var activeAdapters = _.pickBy(config.get('ADAPTERS'), 'ACTIVATE')

// helper to set process.env (or copy) from config
function configToEnv(config, env = process.env) {
  _.forOwn(config, (v, k) => {
    if (_.isPlainObject(v)) {
      configToEnv(v, env)
    } else {
      env[k] = v
    }
  })
}

// when running cmd `node index.js`, supply NODE_ENV and DEPLOY
/* istanbul ignore next */
function setEnv() {
  try {
    process.env.NODE_ENV = process.env.NODE_ENV || 'development'
    process.env.IOPORT = config.get('PORTS.SOCKETIO')
    log.debug(`globalConfig ${JSON.stringify(globalConfig, null, 2)}`)
    configToEnv(globalConfig)
  } catch (e) {
    log.error(`${JSON.stringify(e, null, 2)}index.js quitting.`)
    process.exit(1)
  }
}

// clone a new env copy for an adapter, return in Promise for chaining
/* istanbul ignore next */
function cloneEnv(adapter) {
  var env = _.clone(process.env)
  env['ADAPTER'] = adapter
  adapterConfig = config.get(`ADAPTERS.${adapter}`)
  log.debug(`adapterConfig ${JSON.stringify(adapterConfig, null, 2)}`)
  configToEnv(adapterConfig, env)
  return Promise.resolve(env)
}

// set the PORT of env if specified in adapterConfig
/* istanbul ignore next */
function setPort(env) {
  var basePort = config.get(`PORTS.${env['ADAPTER']}`)
  return portscanner.findAPortNotInUseAsync(basePort, basePort + 50, '127.0.0.1')
    .then((port) => {
      env['PORT'] = port
      log.debug(`Set ${env['ADAPTER']} PORT: ${port}`)
      return env
    })
}

// set the webhook of env if it's specified in adapterConfig
// Spawn a ngrok automatically to handle the webhook
/* istanbul ignore next */
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

// spawn env and set all the adapter-specific env vars for adapter
/* istanbul ignore next */
function spawnEnv(adapter) {
  return cloneEnv(adapter)
    .then(setPort)
    .then(setWebhook)
}

module.exports = {
  setEnv: setEnv,
  spawnEnv: spawnEnv,
  activeAdapters: activeAdapters
}
