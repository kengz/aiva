// The client for js; imports all js modules
const _ = require('lomath')
const path = require('path')
const socketIOClient = require('socket.io-client')
const SRCPATH = path.join(__dirname, '..', 'src')
const log = require(path.join(SRCPATH, 'log'))

// import all in lib/js/, called only when the modules are needed
requireDir = require('require-dir')
lib_js = requireDir(path.join(__dirname, 'js'))
log.debug(`import js lib from client.js`)

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
/* istanbul ignore next */
var IOPORT = process.env.IOPORT || 6466
const client = socketIOClient(`http://localhost:${IOPORT}`);
// the id of this script for io client registration
const ioid = 'js';
// first join for serialization
client.emit('join', ioid)
client.on('disconnect', client.disconnect)


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

// add listener
client.on('take', handle)
