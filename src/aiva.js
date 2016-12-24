const Promise = require('bluebird')
const { spawn } = require('child_process')
const _ = require('lomath')
const ngrok = require('ngrok')
const { authDb, migrateDb } = require('./db')
const { setEnv, spawnEnv, activeAdapters } = require('./env')
const log = require('./log')
const startIO = require('./start-io')

const children = [] // child processes for spawn

// finally, spawn a hubot in child.process using env
/* istanbul ignore next */
function spawnProcess(env) {
  const hb = spawn(
    './bin/hubot',
    ['-a', _.toLower(env.ADAPTER), '--name', env.BOTNAME],
    { stdio: 'inherit', env })
  children.push(hb)
  log.info(`Deploying bot ${env.BOTNAME} with adapter ${env.ADAPTER}`)
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
  return new Promise((resolve) => {
    log.info('Starting aiva process')
    setEnv()

    // so that hubot is killed when forever exits.
    process.on('exit', () => {
      children.forEach((child) => { child.kill() })
      log.info('Shutting down')
    })

    startIO() // start socketIO
    _.each(_.keys(activeAdapters), spawnHubot) // start hubot with adapters
    resolve()
  })
}

// primary start method
function start() {
  return authDb()
    .then(migrateDb)
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
  start,
}
