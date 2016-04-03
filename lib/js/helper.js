// collection of helper methods, esp for the interface

// dependencies
var _ = require('lomath');

// parse a string array into array of string and numbers
// e.g. '[male, 22, 1, 7.25]'
function parseArr(arrStr) {
  str = arrStr.trim().replace(/^\[/, '').replace(/\]$/, '')
  split = str.split(',')
  arr = _.map(split, function(e) {
    return e.match(/[a-zA-Z]/) ? e : parseFloat(e)
  })
  return arr
}

/**
 * List of usable helpers
 */
helper = {
  parseArr: parseArr
}

/**
 * export for usage
 */
module.exports = helper