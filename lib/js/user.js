// Module that handles user details

// dependencies
var _ = require('lomath')

/**
 * Simple-search a user in this creator-centric KB by the keyword, matching over to name, real_name, id, email_address
 * @param  {string|JSON} keyword Keyword or hubot res object(extract id then) for regex-match.
 * @return {Promise}         The neoRes in a promise.
 */
function whois(keyword) {
  if (_.isObject(keyword)) {
    // if is hubot res object, extract its ID
    keyword = getId(keyword)
  };
  var ws = 'WHERE' + KB.leftJoin(['name', 'real_name', 'id', 'email_address'], `=~ "(?i).*${keyword}.*"`)
  return KB.get(['user'], ws, 'RETURN a').then(_.partial(KB.transform, _, KB.cleanUser))
}

/**
 * Get the user's ID from the hubot res object, first user.whois() user result, or return the argument if it's a string
 * @param  {JSON|Array|string} res hubot res object, first user.whois() user result or a string
 * @return {string}     user's ID
 */
function getId(res) {
  if (_.isString(res)) {
    return searchUserID(res)
  } else if (_.isArray(res)) {
    return _.get(res, '0.0.id')
  } else {
    return _.get(_.omit(res, 'robot'), 'envelope.user.id')
  }
}

/**
 * Return the passed user name/ID string or res as a wrapped hubot res object for KB.cons.legalize.
 * @param  {JSON|Array|string} res hubot res object, first user.whois() user result or a string
 * @return {JSON}     shallow hubot res object for KB.cons.legalize
 */
function wrapRes(res) {
  if (_.isString(res) || _.isArray(res)) {
    return _.set({}, 'envelope.user.id', getId(res))
  } else {
    return res
  }
}

/**
 * Locally search the global.users object
 * Local-search a user in the global.users object using a keyword, matching over to id, name, real_name, id, email_address
 * @private
 * @param  {string} keyword To search for.
 * @return {string}         ID of the first matched user found
 */
function searchUserID(keyword) {
  var foundUser = _.find(global.users, function(user) {
    return _.some(['id', 'name', 'real_name', 'email_address'], function(key) {
      return _.toLower(user[key]).match(_.toLower(keyword))
    })
  })
  return foundUser ? foundUser.id : foundUser
}

/**
 * Produce a new user-local hash string for the user by prepending a hash string with userID from res.
 * @param  {string} hashStr The original string which may have conflict globally.
 * @param  {JSON|string} res  hubot res object or a ID/name string.
 * @return {string}      the new user-local hash string
 *
 * @example
 * user.hash('bot', 'test_hash')
 * // => 'bot#test_hash'
 */
function hash(res, hashStr) {
  return getId(res) + '#' + hashStr
}



module.exports = {
  whois: whois,
  getId: getId,
  wrapRes: wrapRes,
  hash: hash
}
