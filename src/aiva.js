const Promise = require('bluebird')
const { spawn } = require('child_process')
const _ = require('lomath')
const ngrok = require('ngrok')
const path = require('path')

const log = require(path.join(__dirname, 'log'))
const { setEnv, spawnEnv, activeAdapters } = require(path.join(__dirname, 'env'))
var children = [] // child processes for spawn

// finally, spawn a hubot in child.process using env
/* istanbul ignore next */
function spawnProcess(env) {
  var hb = spawn('./bin/hubot', ['-a', env['ADAPTER'], '--name', env['BOTNAME']], { stdio: 'inherit', env: env })
  children.push(hb)
  log.info(`Deploying bot ${env['BOTNAME']} with adapter ${env['ADAPTER']}`)
  return env
}

// Spawn hubot for an adapter by chaining the setups above
/* istanbul ignore next */
function spawnHubot(adapter) {
  return spawnEnv(adapter)
    .then(spawnProcess)
}

// if this file is run directly by `node index.js`
/* istanbul ignore next */
function start() {
  setEnv()

  // so that hubot is killed when forever exits.
  process.on('exit', () => {
    children.forEach((child) => { child.kill() })
    log.info("Shutting down")
  })

  // spawn a hubot for each active adapter
  require(path.join(__dirname, 'io_start'))() // start socketIO
  _.each(_.keys(activeAdapters), spawnHubot) // start hubot with adapters

  var cleanExit = () => {
    ngrok.kill()
    process.exit()
  }
  process.on('SIGINT', cleanExit) // catch ctrl-c
  process.on('SIGTERM', cleanExit) // catch kill
}

// export the setEnv for convenient usage in dev
module.exports = {
  start: start
}
