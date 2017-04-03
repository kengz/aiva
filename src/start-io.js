// The socket.io server and polyglot clients. Called by scripts/_init.js
const { nlpServer } = require('cgkb')
const { spawn } = require('child_process')
const _ = require('lomath')
const path = require('path')
const polyIO = require('poly-socketio')
const { setEnv, activeAdapters } = require('./env')
const log = require('./log')
const jsIOClient = require('../lib/client')

const nlpServerCount = nlpServer ? 1 : 0
const LIBPATH = path.join(__dirname, '..', 'lib')

/* istanbul ignore next */
const bashSrc = (process.platform === 'darwin') ? '~/.bash_profile' : '~/.bashrc'

/* istanbul ignore next */
const srcCmd = process.env.CI ? '' : `. ${bashSrc}`

/* istanbul ignore next */
if (process.env.IOPORT === undefined) { setEnv() }

// import other languages via child_process
const ioClientCmds = _.pickBy({
  ruby: {
    // install_dependency: "gem install socket.io-client-simple activesupport",
    client: path.join(LIBPATH, 'client.rb'),
  },
  python: {
    // install_dependency: "python -m pip install socketIO-client",
    client: path.join(LIBPATH, 'client.py'),
  },
}, (args, cmd) => global.config.get('ACTIVATE_IO_CLIENTS').get(cmd))

/* istanbul ignore next */
const adapterCount = (process.env.NODE_ENV === 'test') ? 1 : _.size(activeAdapters)
const CLIENT_COUNT = 1 + _.size(ioClientCmds) + adapterCount + nlpServerCount

/**
 * Helper: called from within ioServer after its setup.
 * Start all polyglot ioClient processes using spawn.
 * Kill them on error to prevent runaway processes,
 * i.e. run all the io_import.<language> processes.
 * The io_import.<language> im turn runs all the io clients of that language.
 */
/* istanbul ignore next */

function ioClient() {
  // the child processes,kill all on death
  const children = []

  /* istanbul ignore next */
  process.on('exit', () => {
    children.forEach((child) => {
      child.kill()
    })
    log.info('Exit: killed ioClient.js children')
  })

  // import js locally
  jsIOClient.join()
  nlpServer({ port: process.env.IOPORT }) // start nlp server

  _.each(ioClientCmds, (cmds, lang) => {
    // spawn ioclients for other lang
    log.info(`Starting socketIO client for ${lang} at ${process.env.IOPORT}`)
    const cp = spawn('/bin/bash', ['-c', `
      ${srcCmd}
      ${lang} ${cmds.client}
      `], { stdio: [process.stdin, process.stdout, 'pipe'] })
    children.push(cp)

    /* istanbul ignore next */
    cp.stderr.on('data', (data) => {
      log.error(`${data.toString('utf8')}`)
      cp.kill('SIGTERM') // kill if err to prevent runover process
    })
  })
}

/**
 * The main method to start the io server then clients.
 * Calls server and client methods above.
 */
/* istanbul ignore next */

function ioStart() {
  polyIO.server({
    port: process.env.IOPORT,
    clientCount: CLIENT_COUNT,
    debug: process.env.npm_config_debug,
  })
  .then(ioClient)
  return global.ioPromise
}

/* istanbul ignore next */
const cleanExit = () => { process.exit() }
process.on('SIGINT', cleanExit) // catch ctrl-c
process.on('SIGTERM', cleanExit) // catch kill
process.on('uncaughtException', log.error)

// export for use by hubot
module.exports = ioStart

// if this file is run directly by `node server.js`
/* istanbul ignore next */
if (require.main === module) {
  ioStart()
}
