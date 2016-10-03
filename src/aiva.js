const Promise = require('bluebird')
const { spawn, exec } = require('child_process')
const _ = require('lomath')
const ngrok = require('ngrok')
const path = require('path')

const startIO = require(path.join(__dirname, 'start-io'))
const log = require(path.join(__dirname, 'log'))
const { setEnv, spawnEnv, activeAdapters } = require(path.join(__dirname, 'env'))
const { migrateDb } = require(path.join(__dirname, 'db'))
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

/* istanbul ignore next */
function startProcess() {
  return new Promise((resolve, reject) => {
    log.info(`Starting aiva process`)
    setEnv()

    // so that hubot is killed when forever exits.
    process.on('exit', () => {
      children.forEach((child) => { child.kill() })
      log.info("Shutting down")
    })

    startIO() // start socketIO
    _.each(_.keys(activeAdapters), spawnHubot) // start hubot with adapters
    resolve()
  })
}

// primary start method
function start() {
  return migrateDb()
    .then(startProcess)
}

const cleanExit = () => {
  ngrok.kill()
  process.exit()
}
process.on('SIGINT', cleanExit) // catch ctrl-c
process.on('SIGTERM', cleanExit) // catch kill

// export the setEnv for convenient usage in dev
module.exports = {
  start: start
}
