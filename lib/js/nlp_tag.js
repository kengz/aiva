ioid = __filename.split("\/").pop()

// Modules to parse and tag a sentence into basic entities needed for HTMI.
// Entities now include: time, POS etc.,

var _ = require('lomath')
var Promise = require('bluebird')
var date = require('date.js')
var nlp = require('./ai').nlp

var fs = require('fs')

// nlp.POS.lookup('kiss').then(console.log)
// nlp.POS.lookup('kiss', console.log)

// want: 
// tokens
// NER
// POS
// tagPOS -> wordpos wordnet lookup from POS above only if it is contextual: lexname, lemmas
// time
// emotion (later)
// if available, use the best: spaCy, Stanford NLP
// else try to fallback to nodejs version
// of course label source too
// No, really, just choose the best one for each function, cuz you are no longer restricted by language difference

// spaCy has got:
// tokenize, sentence
// export to numpy
// word vectors
// POS tags
// semantic dependencies
// NER
// 

// var s = 'remind me to kiss laundry at 5pm at Stony Brook University'


// need more useful without killing the stopwords. use TB too
function tagPOS(s) {
  return nlp.POS.getPOS(s)
}
// tagPOS(s).then(console.log)
// ok this shit is just with simple tokenization
// might need stanford/textblob NLP for sentence-aware POS

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
// add promise timeout, dont break on failure but set key to null

// tagNER(s).then(console.log)

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
  res['POS'] = tagPOS(s)
  res['NER'] = tagNER(s)
  res['time'] = tagTime(s)
  Promise.props(res).then(function(o) {
    console.log("all done", o)
  }).catch(function(e) {
    console.log("some failed", e)
  })

}

// var ioStart = require('../io_start')

// console.log("from nlp", global.io)

// ioStart()
//   .then(function(server) {
//     global.gPass({
//         // input: s,
//         // to: 'ai.py',
//         // intent: 'tb.NERTag'
//         input: 'Hello from user.',
//         to: 'hello.py',
//         intent: 'sayHi'
//       }).then(console.log)
//       // tag(s)
//       // tagPOS(s).then(console.log)
//       // tagNER(s).then(console.log)
//       // tagTime('remind me to do laundry at 5pm').then(console.log)
//   })
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
