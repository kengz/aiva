// The client for js; imports all js modules

// dependencies
const Promise = require('bluebird')
const Log = require('log')
const _ = require('lomath')
const path = require('path')

global.hasher = require(path.join(__dirname, 'js', 'hasher')) // the js handler hasher

/* istanbul ignore next */
if (process.env.IOPORT == undefined) {
  const { setEnv, log } = require(path.join(__dirname, '..', 'index'))
  setEnv()
}

// import all in lib/js/, called only when the modules are needed, e.g. in io_start
// not called when client.js required from hubot
function importAll() {
  // requireDir = require('require-dir');
  // lib_js = requireDir('./js');
  // log.info('import js scripts from client.js')
}

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


//////////////////////////////////////
// 1. Register the socket.io client //
//////////////////////////////////////
/* istanbul ignore next */
var IOPORT = process.env.IOPORT || 6466
const client = require('socket.io-client')('http://localhost:' + IOPORT);
// the id of this script for io client registration
const ioid = 'js';
// first join for serialization
client.emit('join', ioid)
client.on('disconnect', client.disconnect)


//////////////////////////////////////////////////////
// 2. Write module methods and register as handlers //
//////////////////////////////////////////////////////
// done in your module scripts


/////////////////////////////////////////////
// 3. listener to handle incoming payload. //
/////////////////////////////////////////////

/**
 * The handle for client.on('take') on getting replies
 * @param  {JSON} msg Replied msg
 */
/* istanbul ignore next */
function handle(msg) {
  // 1. call hasher to handle first
  hasher.handle(msg);

  // 2. if has 'to' && 'intent, pass on to other clients
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


////////////////////////////////////////
// node.js entry-point client methods //
////////////////////////////////////////

/**
 * Pass that returns a promise for getting client replies conveniently.
 * Has promise timeout of 60s; is properly binded.
 * @param  {string|JSON} to   Name of the to script, or a JSON msg containing at least to, input
 * @param  {*} input    Input for the client to pass
 * @return {Promise}        The promise object that will be resolved when target script replies.
 */
function pass(to, input) {
  var defer = cdefer();
  clientPass(defer.resolve, to, input)
  return defer.promise;
}

/**
 * Wrapper for passing an msg using the client; must specify the callback handler function (properly binded), and an extension of msg including the target, input keys.
 * @param  {Function} cbBinded A properly binded callback handler.
 * @param  {string|JSON} to   Name of the to script, or a JSON msgect containing at least to, input
 * @param  {*} input    Input for the client to pass
 *
 * @example
 * // shorthand
 * clientPass(log.info, 'hello.rb', 'Hello ruby.')
 *
 * // full msgect
 * clientPass(log.info, {
 *   input: '我是机器人',
 *   to: 'nlp.py',
 *   intent: 'translate',
 * })
 */
/* istanbul ignore next */
function clientPass(cbBinded, to, input) {
  var baseObj = {
    hash: hasher.gen(ioid, cbBinded),
    from: ioid
  };
  // build up the msgect to pass to target
  if (_.isPlainObject(to)) {
    // if an msgect is supplied directly
    _.assign(baseObj, to);
    /* istanbul ignore next */
  } else if (_.isString(to)) {
    // or supplied string to and input
    _.assign(baseObj, { to: to, input: input });
  } else {
    throw new Error('You must supply at least target and input to pass to io client.')
  }

  // pass to target client
  client.emit('pass', baseObj)
}

/**
 * Promise constructor using defer pattern to expose its promise, resolve, reject. Has a timeout of 60s.
 * @return {defer} The Promise.defer legacy msg.
 */
/* istanbul ignore next */
function cdefer() {
  var maxWait = 20000;
  var resolve, reject;
  var promise = new Promise(function() {
      resolve = arguments[0];
      reject = arguments[1];
    })
    .timeout(maxWait)
  return {
    resolve: resolve,
    reject: reject,
    promise: promise
  };
}

// clientPass(log.info, {
//   input: '我是机器人',
//   to: 'nlp.py',
//   intent: 'translate',
// })

// pass({
//   input: 'Hello from user',
//   to: 'hello.py',
//   intent: 'sayHi',
// }).then(log.info).catch(log.info)

// expose the client and two methods globally
global.gPass = pass;
global.gClientPass = clientPass;
global.gClient = client;

module.exports = {
  importAll: importAll,
  gPass: pass,
  gClientPass: clientPass,
  gClient: client
}
