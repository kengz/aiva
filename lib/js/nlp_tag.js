// Modules to parse and tag a sentence into basic entities needed for HTMI.
// Entities now include: time, POS etc.,

var _ = require('lomath')
var Promise = require('bluebird')
var date = require('date.js')
var nlp = require('./ai').nlp


// want: 
// NER
// POS
// time
// emotion (later)


var s = 'remind me to do laundry at 5pm'

// need more useful without killing the stopwords. use TB too
function tagPOS(s) {
  return nlp.POS.getPOS(s)
}
// tagPOS(s).then(console.log)

function tagNER(s) {
  // need a more seamless, handler reply-free way of calling generic function, and always parse/stringify the payload automatically
  try {
    return global.gPass({
      input: s,
      to: 'ai.py',
      intent: 'tb.NERTag'
    })
  } catch (e) {
    return Promise.resolve(e)
  }
}
// tagNER(s).then(console.log)

function tagTime(s) {
  return Promise.resolve(date(s))
}
// tagTime('remind me to do laundry at 5pm').then(console.log)

// use local py neural net and sample training set
// model can be delivered via npm module
function tagClass(s) {

}

// function tag(sentence) {

// }

// var ioStart = require('../io_start')

// ioStart()
// .then(function(server) {
// global.gPass({
//   // input: 'Hello from user.',
//   // to: 'hello.py',
//   // intent: 'sayHi'
//   input: '',
//   to: 'ai.py',
//   intent: 'titanic_accuracy'
// })
// .then(function(reply) {
//   console.log(reply.output)
// }).catch(console.log)
// // })


// var s = 'show me Taylor Swift'
// // var s = 'The angry bear chased the frightened little squirrel'
// // console.log(date('lorem at 5pm'))
// // console.log(_.keys(nlp))
// // console.log(_.keys(nlp.POS))
// nlp.POS.getPOS(s).then(console.log)

// function tag(s) {
//   // tag_time
//   // tag_others
// }

// function time_tag(s) {
//   return date(s)
// }

// // do a POS tag, do canonicalization
// function pos_tag(s) {

// }

// module.exports =
