// The client for js; imports all js modules
const _ = require('lomath')
const path = require('path')
const requireDir = require('require-dir')
const socketIOClient = require('socket.io-client')
const SRCPATH = path.join(__dirname, '..', 'src')
const log = require(path.join(SRCPATH, 'log'))

var lib_js, client
const ioid = 'js' // the id of this script for io client registration

// log.info(lib_js.ai.nlp.POS.getPOS({input: "remind me to do laundry"}))

// correct the reply JSON
/* istanbul ignore next */
function correctReply(reply, msg) {
  if (!_.isPlainObject(reply)) {
    reply = { "output": reply }
  }
  // autofill if not already exist
  reply["to"] = reply["to"] || msg["from"]
  reply["from"] = reply["from"] || ioid
  reply["hash"] = reply["hash"] || msg["hash"]
  return reply
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
  var to = msg.to,
    intent = msg.intent;
  if (to && intent) {
    var reply;
    // try JSON or JSON.input as input
    try {
      reply = _.get(lib_js[to], intent)(msg)
    } catch (e) {
      try {
        reply = _.get(lib_js[to], intent)(msg.input)
      } catch (e) {
        log.debug('js handle fails.', e)
      }
    } finally {
      // try JSON or made-JSON output
      reply = correctReply(reply, msg)
      if (reply.to) {
        client.emit('pass', reply)
      };
    }
  }
}

/* istanbul ignore next */
function join() {
  // import all in lib/js/, called only when the modules are needed
  lib_js = requireDir(path.join(__dirname, 'js'))
  log.debug(`import js lib from client.js`)
  const IOPORT = process.env.IOPORT || 6466
  log.info(`Starting socketIO client for js at ${IOPORT}`)
  client = socketIOClient(`http://localhost:${IOPORT}`)
  client.emit('join', ioid)
  client.on('disconnect', client.disconnect)
  client.on('take', handle)
}

module.exports = {
  join: join
}

/* istanbul ignore next */
if (require.main === module) {
  join()
}
