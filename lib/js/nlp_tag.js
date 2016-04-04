// Modules to parse and tag a sentence into basic entities needed for HTMI.
// Entities now include: time, POS etc.,

var _ = require('lomath')
var date = require('date.js')
var nlp = require('./ai').nlp

console.log(date('lorem at 5pm'))
// console.log(nlp)


function tag(s) {
  // tag_time
  // tag_others
}

function time_tag(s) {
  return date(s)
}

// do a POS tag, do canonicalization
function pos_tag(s) {

}