// The socket.io server and polyglot clients. Called by scripts/_init.js
const Promise = require('bluebird')
const { spawn, execSync } = require('child_process')
const fs = require('fs')
const _ = require('lomath')
const path = require('path')
const log = require(path.join(__dirname, 'log'))
const { setEnv, activeAdapters } = require(path.join(__dirname, 'env'))

const LIBPATH = path.join(__dirname, '..', 'lib')

/* istanbul ignore next */
if (process.env.IOPORT == undefined) { setEnv() }

// import other languages via child_process
var ioClientCmds = _.pickBy({
    ruby: {
      install_dependency: "gem install socket.io-client-simple",
      client: path.join(LIBPATH, 'client.rb')
    },
    python3: {
      install_dependency: "python3 -m pip install socketIO-client",
      client: path.join(LIBPATH, 'client.py')
    }
  },
  (args, cmd) => {
    return global.config.get("ACTIVATE_IO_CLIENTS").get(cmd)
  })

const CLIENT_COUNT = 1 + _.size(ioClientCmds) + _.size(activeAdapters)

/**
 * Start a Socket IO server connecting to a robot.server (an Expressjs server), or a brand new Express server for use in dev. Sets global.io too.
 * Has a failsafe for not starting multiple times even when called repeatedly by accident in the same thread.
 * @param  {*} robot The hubot object
 * @return {server} server
 */
/* istanbul ignore next */
function io_server(robot) {
  if (global.io) {
    // if already started elsewhere, skip below including io_client, return promise with the existing server
    return Promise.resolve(global.io.server)
  }

  global.log.info(`Starting socket.io server on IOPORT: ${process.env.IOPORT}`)
  var server
  const app = require('express')()
  process.on('uncaughtException', global.log.error)
  server = app.listen(process.env.IOPORT)

  global.io = require('socket.io').listen(server)
  var count = CLIENT_COUNT
  global.ioPromise = new Promise((resolve, reject) => {
    global.io.sockets.on('connection', (socket) => {
      // serialize for direct communication by using join room
      socket.on('join', (id) => {
        socket.join(id)
        global.log.debug(id, socket.id, 'joined')
        if (--count == 0) {
          global.log.info(`All ${CLIENT_COUNT} clients have joined`)
          resolve(server) // resolve with the server
        }
      })
      socket.on('disconnect', () => { global.log.info(socket.id, 'left') })
    })
  }).catch((err) => {
    global.log.error(JSON.stringify(err, null, 2))
    global.log.error("Clients initialization error.")
    process.exit(0)
  })

  global.io.on('connection', (socket) => {
    // generic pass to other script
    socket.on('pass', (msg, fn) => {
      global.log.debug(`IO on pass, msg: ${JSON.stringify(msg, null, 2)} fn: ${fn}`)
      try {
        // e.g. split 'hello.py' into ['hello', 'py']
        // lang = 'py', module = 'hello'
        var tokens = msg.to.split('.'),
          lang = tokens.pop(),
          module = _.join(tokens, '.')
          // reset of <to> for easy calling. May be empty if just passing to client.<lang>
        msg.to = module
        global.io.sockets.in(lang).emit('take', msg)
      } catch (e) { global.log.error(JSON.stringify(e, null, 2)) }
    })
  })

  // call clients after setup, or skipped together above
  io_client(robot)
  return global.ioPromise
}

/**
 * Helper: called from within io_server after its setup.
 * Start all polyglot io_client processes using spawn. Kill them on error to prevent runaway processes, i.e. run all the io_import.<language> processes. The io_import.<language> im turn runs all the io clients of that language.
 * @param  {*} robot The hubot object
 */
/* istanbul ignore next */
function io_client(robot) {
  // the child processes,kill all on death
  var children = []

  /* istanbul ignore next */
  process.on('exit', () => {
    children.forEach((child) => {
      child.kill()
    })
    global.log.info('Exit: killed io_client.js children')
  })

  // import js locally
  require(path.join(LIBPATH, 'client'))

  _.each(ioClientCmds, (cmds, lang) => {
    // spawn then add listeners, add to the list of child processes
    global.log.info(`Starting socketIO client for ${lang}`)
    global.log.debug(execSync(cmds['install_dependency']).toString())
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
function io_start(robot) {
  io_server(robot)
  return global.ioPromise
}

/* istanbul ignore next */
const cleanExit = () => { process.exit() }
process.on('SIGINT', cleanExit) // catch ctrl-c
process.on('SIGTERM', cleanExit) // catch kill

// export for use by hubot
module.exports = io_start

// if this file is run directly by `node server.js`
/* istanbul ignore next */
if (require.main === module) {
  io_start()
}
