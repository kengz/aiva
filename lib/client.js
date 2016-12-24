// The client for js; imports all js modules49
const _ = require('lomath')
const path = require('path')
const requireDir = require('require-dir')
const socketIOClient = require('socket.io-client')
const log = require('../src/log')

let libJs
let client
const ioid = 'js' // the id of this script for io client registration

// log.info(libJs.ai.nlp.POS.getPOS({input: "remind me to do laundry"}))

// correct the reply JSON
/* istanbul ignore next */
function correctReply(reply, msg) {
  let cReply = reply
  if (!_.isPlainObject(cReply)) {
    cReply = { output: cReply }
  }
  // autofill if not already exist
  cReply.to = cReply.to || msg.from
  cReply.from = cReply.from || ioid
  cReply.hash = cReply.hash || msg.hash
  return cReply
}

// 1. Register the socket.io client

// 2. Write module methods and register as handlers
// done in your module scripts

// 3. listener to handle incoming payload.
/**
 * The handle for client.on('take') on getting replies
 * @param  {JSON} msg Replied msg
 */
/* istanbul ignore next */
function handle(msg) {
  const to = msg.to
  const intent = msg.intent
  if (to && intent) {
    let reply

    // try JSON or JSON.input as input
    try {
      reply = _.get(libJs[to], intent)(msg)
    } catch (err) {
      try {
        reply = _.get(libJs[to], intent)(msg.input)
      } catch (deepErr) {
        log.debug('js handle fails.', deepErr)
      }
    } finally {
      // try JSON or made-JSON output
      reply = correctReply(reply, msg)
      if (reply.to) {
        client.emit('pass', reply)
      }
    }
  }
}

/* istanbul ignore next */
function join() {
  // import all in lib/js/, called only when the modules are needed
  libJs = requireDir(path.join(__dirname, 'js'))
  log.debug('import js lib from client.js')
  const IOPORT = process.env.IOPORT || 6466
  log.info(`Starting socketIO client for js at ${IOPORT}`)
  client = socketIOClient(`http://localhost:${IOPORT}`)
  client.emit('join', ioid)
  client.on('disconnect', client.disconnect)
  client.on('take', handle)
}

module.exports = {
  join,
}

/* istanbul ignore next */
if (require.main === module) {
  join()
}
