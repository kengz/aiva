// NLP module

// dependencies
var _ = require('lomath')
var id = __filename.split("/").pop(); // nlp.js

/**
 * Pass the textBlob task to the nlp.py to get TextBlob(TB).
 * @param  {string}   str The input string for TB.
 * @param  {Function} cb  The callback function
 * @return {JSON} A reply JSON msg
 */
function textBlob(str) {
  // create a hash for this msg and cbMap
  var reply = {
    input: str,
    to: 'nlp.py',
    intent: 'getTB',
    from: id,
  }
  return reply
}

// !to English only for now
// !next time add auto translate without keyword 'translate', i.e. pass to textblob, detect language, if not english, translate and reply
/**
 * Pass the translate task to the nlp.py to use TB.translate.
 * @param  {string}   str The input string for TB.
 * @param  {Function} cb  The callback function
 * @return {JSON} A reply JSON msg
 */
function translate(str) {
  var reply = {
    input: str,
    to: 'nlp.py',
    intent: 'translate',
    from: id,
  }
  return reply
}


module.exports = {
  textBlob: textBlob,
  translate: translate
}
