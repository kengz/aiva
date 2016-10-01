// Module for socket communication: use hash string and hashMap of callback functions for correct identification and execution. Is set as global.
const _ = require('lomath')
const randomBytes = require('randombytes')

// The hashMap for this global hash
var hashMap = {};
// !for future multiple replies: don't delete on 'handle', but do a periodic scan and prune keys with older hash timestamp

/**
 * Generates a hash string as current _.uniqueId(_.now()), format: <scriptname>_<timestamp>_<uniqId>
 * Used when client passes msg to target script. This generates and registers in the hashMap the hash string, and also the optional callback function to handle replies.
 * @param {string} id Script name from basename(__file__)
 * @param {Function} cb Callback function to store in this map, invoked by this hash string.
 * @return {string}        the hash string
 */
function gen(id, cb) {
  /* istanbul ignore next */
  id = id || 'unidentified';
  /* istanbul ignore next */
  var hashStr = id + '_' + randomBytes(16).toString('hex');
  /* istanbul ignore next */
  if (cb) {
    global.log.debug(`Added a callback to hasher for global-client`)
    // if exists, add the callback function to map
    hashMap[hashStr] = cb
  };
  return hashStr;
}

/**
 * Handler for socket client; use the msg's hash to find a callback function from hashMap, and execute cb(msg) if found.
 * Note the payload msg received must contain the same hash, thus it's your job to include the same when replying.
 * @param  {JSON} msg The socket client JSON payload.
 */
/* istanbul ignore next */
function handle(msg) {
  // skip if it's an outgoing request (sending input to people to wait for output reply to handle)
  if (msg.input && !msg.output) { return }
  msg = msg || {};
  var hashStr = _.isString(msg) ? msg : msg.hash;
  if (hashStr) {
    global.log.debug('hash string exists for global-client')
    var cb = hashMap[hashStr];
    if (cb) {
      global.log.debug('hasher.handle invoking cb for global-client')
      _.omit(hashMap, hashStr);
      cb(msg)
    };
  };
}

module.exports = {
  hashMap: hashMap,
  gen: gen,
  handle: handle
}
