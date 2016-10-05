// The socket.io server and polyglot clients. Called by scripts/_init.js
const Promise = require('bluebird')
const { spawn, execSync } = require('child_process')
const express = require('express')
const fs = require('fs')
const http = require('http')
const _ = require('lomath')
const path = require('path')
const socketIO = require('socket.io')
const log = require(path.join(__dirname, 'log'))
const { setEnv, activeAdapters } = require(path.join(__dirname, 'env'))

/* istanbul ignore next */
if (process.env.IOPORT === undefined) { setEnv() }
  const LIBPATH = path.join(__dirname, '..', 'lib')
const jsIOClient = require(path.join(LIBPATH, 'client'))
const app = express()
const server = http.Server(app)


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


/**
 * Start a Socket IO server connecting to a robot.server (an Expressjs server), or a brand new Express server for use in dev. Sets global.io too.
 * Has a failsafe for not starting multiple times even when called repeatedly by accident in the same thread.
 * @param  {*} robot The hubot object
 * @return {server} server
 */
 /* istanbul ignore next */
 function ioServer(robot) {
  if (global.io) {
    // if already started
    return Promise.resolve(robot)
  }

  global.log.info(`Starting socket.io server on IOPORT: ${process.env.IOPORT}`)

  global.io = socketIO(server)

  const adapterCount = (process.env.NODE_ENV === 'test') ? 1 : _.size(activeAdapters)
  const CLIENT_COUNT = 1 + _.size(ioClientCmds) + adapterCount
  global.log.debug(`start-io expecting ${CLIENT_COUNT} IO clients`)
  var count = CLIENT_COUNT
  global.ioPromise = new Promise((resolve, reject) => {
    global.io.sockets.on('connection', (socket) => {
      // serialize for direct communication by using join room
      socket.on('join', (id) => {
        socket.join(id)
        count--
        global.log.debug(`${id} ${socket.id} joined, ${count} remains`)
        if (count === 0) {
          global.log.info(`All ${CLIENT_COUNT} IO clients have joined`)
          resolve(server) // resolve with the server
        }
      })
      socket.on('disconnect', () => { global.log.info(socket.id, 'left') })
    })
  })
  .timeout(15000)
  .catch((err) => {
    global.log.error(JSON.stringify(err, null, 2))
    global.log.error("Clients initialization error.")
    process.exit(1)
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

  return new Promise((resolve, reject) => {
    server.listen(process.env.IOPORT, () => {
      resolve(robot)
    })
  })
}

/**
 * Helper: called from within ioServer after its setup.
 * Start all polyglot ioClient processes using spawn. Kill them on error to prevent runaway processes, i.e. run all the io_import.<language> processes. The io_import.<language> im turn runs all the io clients of that language.
 * @param  {*} robot The hubot object
 */
 /* istanbul ignore next */
 function ioClient(robot) {
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
 function ioStart(robot) {
  ioServer(robot)
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
