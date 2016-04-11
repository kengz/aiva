// Modules to parse and tag a sentence into basic entities needed for HTMI.
// Entities now include: time, POS etc.,

var _ = require('lomath')
var Promise = require('bluebird')
var date = require('date.js')

// quick dev setup, import lightweight client
var client = require('../client')
global.gPass = client.gPass

var s = "Mr. Best flew to New York on Saturday morning at 9pm to Brooklyn University."
parse(s).then(console.log)


// global.gPass({
//   input: "hola amigos",
//   to: 'ai.py',
//   intent: 'nlp.translate'
// })


function parse(s) {
  try {
    return global.gPass({
      input: s,
      to: 'ai.py',
      intent: 'nlp.parse'
    })
  } catch (e) {
    return Promise.resolve(e)
  }
}
parse(s).then(console.log)

function tagTime(s) {
  return Promise.resolve(date(s))
}
// tagTime('remind me to do laundry at 5pm').then(console.log)

// use local py neural net and sample training set
// model can be delivered via npm module
function tagClass(s) {
}

function tag(s) {
  var res = {}
  res['spacy'] = parse(s)
  res['time'] = tagTime(s)
  Promise.props(res).then(function(o) {
    console.log("all done", o)
  }).catch(function(e) {
    console.log("some failed", e)
  })

}

