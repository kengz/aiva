// The client for js; imports all js modules

// dependencies
var _ = require('lomath');
var Promise = require('bluebird');
// the js handler hasher
global.hasher = require('./js/hasher');

var requireDir = require('require-dir');
var lib_js = requireDir('./js');
console.log('import js scripts from client.js')


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
var PORT = process.env.PORT || 8080;
var client = require('socket.io-client')('http://localhost:'+PORT);
// the id of this script for client registration
var ioid = 'js';
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
    console.log('invoke client.js to intent')
    try {
      var reply = lib_js[to][intent](msg)
      if (reply.to) {
        client.emit('pass', reply)
      };
    } catch (e) {
      console.log('js handle fails.')
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
 * clientPass(console.log, 'hello.rb', 'Hello ruby.')
 *
 * // full msgect
 * clientPass(console.log, {
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
  var maxWait = 60000;
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

// Add the listener for all shit to work.
// ask the registered handle in hasher to handle to replies,
// the payload received must contain the same hash, thus it's your job to include the same when replying.
// client.on('take', hasher.handle)

// clientPass(console.log, {
//   input: '我是机器人',
//   to: 'nlp.py',
//   intent: 'translate',
// })

// pass({
//   input: '我是机器人',
//   to: 'nlp.py',
//   intent: 'translate',
// }).then(console.log).catch(console.log)

// expose the client and two methods globally
global.gPass = pass;
global.gClientPass = clientPass;
global.gClient = client;
