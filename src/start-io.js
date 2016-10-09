// The socket.io server and polyglot clients. Called by scripts/_init.js
const { spawn } = require('child_process')
const _ = require('lomath')
const path = require('path')
const polyIO = require('poly-socketio')
const log = require(path.join(__dirname, 'log'))
const { setEnv, activeAdapters } = require(path.join(__dirname, 'env'))

/* istanbul ignore next */
if (process.env.IOPORT === undefined) { setEnv() }
const LIBPATH = path.join(__dirname, '..', 'lib')
const jsIOClient = require(path.join(LIBPATH, 'client'))

// import other languages via child_process
var ioClientCmds = _.pickBy({
    ruby: {
      // install_dependency: "gem install socket.io-client-simple activesupport",
      client: path.join(LIBPATH, 'client.rb')
    },
    python3: {
      // install_dependency: "python3 -m pip install socketIO-client",
      client: path.join(LIBPATH, 'client.py')
    }
  },
  (args, cmd) => {
    return global.config.get("ACTIVATE_IO_CLIENTS").get(cmd)
  })

/* istanbul ignore next */
const adapterCount = (process.env.NODE_ENV === 'test') ? 1 : _.size(activeAdapters)
const CLIENT_COUNT = 1 + _.size(ioClientCmds) + adapterCount

/**
 * Helper: called from within ioServer after its setup.
 * Start all polyglot ioClient processes using spawn. Kill them on error to prevent runaway processes, i.e. run all the io_import.<language> processes. The io_import.<language> im turn runs all the io clients of that language.
 */
/* istanbul ignore next */
function ioClient() {
  // the child processes,kill all on death
  var children = []

  /* istanbul ignore next */
  process.on('exit', () => {
    children.forEach((child) => {
      child.kill()
    })
    global.log.info('Exit: killed ioClient.js children')
  })

  // import js locally
  jsIOClient.join()

  _.each(ioClientCmds, (cmds, lang) => {
    // spawn ioclients for other lang
    global.log.info(`Starting socketIO client for ${lang} at ${process.env.IOPORT}`)
    var cp = spawn(lang, [cmds['client']], { stdio: [process.stdin, process.stdout, 'pipe'] })
    children.push(cp)

    /* istanbul ignore next */
    cp.stderr.on('data', (data) => {
      global.log.error(`${data.toString('utf8')}`)
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
      debug: process.env['npm_config_debug']
    })
    .then(ioClient)
  return global.ioPromise
}

/* istanbul ignore next */
const cleanExit = () => { process.exit() }
process.on('SIGINT', cleanExit) // catch ctrl-c
process.on('SIGTERM', cleanExit) // catch kill
process.on('uncaughtException', global.log.error)

// export for use by hubot
module.exports = ioStart

// if this file is run directly by `node server.js`
/* istanbul ignore next */
if (require.main === module) {
  ioStart()
}
