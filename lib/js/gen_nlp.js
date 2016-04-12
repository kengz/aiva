// General NLP to parse all user input, or all-purpose parsing
// Powered by lib.py.ai.nlp.parse via spaCy

var _ = require('lomath')
var Promise = require('bluebird')
var date = require('date.js')

// // quick dev setup, import lightweight client
// var client = require('../client')
// global.gPass = client.gPass
// var s = "Mr. Best flew to New York on Saturday morning at 9am."
// parseTime(s).then(console.log)

// global.gPass({
//   input: "hola amigos",
//   to: 'nlp.py',
//   intent: 'translate'
// }).then(console.log)

// parse: run all the parse<sub> functions, compile and return the results in promise
function parse(s) {
  var res = {}
  res['gen'] = parseGen(s)
  res['time'] = parseTime(s)
  return Promise.props(res)
    .then(function(o) {
      return compile(o)
    })
}
// parse(s).then(console.log)


// Parse the general NLP properties
function parseGen(s) {
  try {
    return global.gPass({
      input: s,
      to: 'nlp.py',
      intent: 'parse'
    })
  } catch (e) {
    /* istanbul ignore next */
    return Promise.reject(e)
  }
}
// parseGen(s).then(console.log)

// parse time
function parseTime(s) {
  return Promise.resolve(date(s))
}
// parseTime(s).then(console.log)

// helper: clean and merge the parsed results
function compile(res) {
  /* istanbul ignore next */
  var output = res['gen'] || {}
  output = _.omit(output, ['to', 'from', 'hash'])
  output['time'] = res['time']
  return output
}


module.exports = {
  parse: parse,
  parseGen: parseGen,
  parseTime: parseTime
}
