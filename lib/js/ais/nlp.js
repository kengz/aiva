// This wraps the useful nlp methods from:
// - [NaturalNode](https://github.com/NaturalNode/natural)
// - [wordpos](https://github.com/moos/wordpos)

// dependencies
var _ = require('lomath')
var Promise = require('bluebird')

/////////////////
// NaturalNode //
/////////////////
var natural = require('natural');

// Tokenizer
var tokenizer = new natural.TreebankWordTokenizer(),
  tokenize = tokenizer.tokenize.bind(tokenizer);
// console.log(tokenize("my dog hasn't any fleas."));

// Stemmer
var stem = natural.PorterStemmer.stem;
// console.log(stem('words'))

// Inflectors: singularize/pluralize
var nounInflector = new natural.NounInflector(),
  singularNoun = nounInflector.singularize.bind(nounInflector),
  pluralNoun = nounInflector.pluralize.bind(nounInflector);
// console.log(singularNoun('beers'));
// console.log(pluralNoun('radius'));

var verbInflector = new natural.PresentVerbInflector(),
  singularVerb = verbInflector.singularize.bind(verbInflector),
  pluralVerb = verbInflector.pluralize.bind(verbInflector);
// console.log(singularVerb('become'));
// console.log(pluralVerb('becomes'));

var NGrams = natural.NGrams,
  bigrams = NGrams.bigrams,
  trigrams = NGrams.trigrams,
  ngrams = NGrams.ngrams;
// console.log(bigrams('some words here'))
// console.log(bigrams(['some', 'words', 'here']))
// console.log(trigrams('some other words here'))
// console.log(ngrams('some other words here for you', 4))
//   // padding on start and end (omit if null)
// console.log(ngrams('some other words here for you', 4, null, '[end]'))

// tf-idf: use Indico


/////////////
// wordpos //
/////////////
var WordPOS = require('wordpos'),
  wordpos = new WordPOS({ stopwords: true });

// Modifiers: restore the lexName from the lexFilenum of WordNet cuz wordpos doesn't do it
// map source: https://wordnet.princeton.edu/wordnet/man/lexnames.5WN.html
var WordNetLexnames = require(__dirname + '/data/WordNetLexnames.json');
// get the lexName from lexFilenum
function lexnumToName(lexFilenum) {
  return _.first(_.get(WordNetLexnames, lexFilenum))
}
// inject per object
function injectLexname(obj) {
  var lexFilenum = _.get(obj, 'lexFilenum')
  var lexName = lexnumToName(lexFilenum)
  obj['lexName'] = lexName
}
// inject on all the results from wordpos.lookup
function injectLexnames(lookupArr) {
  _.map(lookupArr, injectLexname)
  return lookupArr
}

// Modify lookup methods to inject lexnames
// use like _.partial(withLexname, fn)
function withLexname(fn, word, cb) {
  if (cb) {
    return fn(word, function(lookupArr) {
      injectLexnames(lookupArr)
      cb(lookupArr)
    }).then(function(lookupArr) {
      return injectLexnames(lookupArr)
    })
  } else {
    return fn(word).then(function(lookupArr) {
      return injectLexnames(lookupArr)
    })
  }
}


// Note: this lib both takes callback and returns promise
// Tip: it's faster if you know the specific POS you're after
var POS = {
  getPOS: wordpos.getPOS.bind(wordpos),
  getNouns: wordpos.getNouns.bind(wordpos),
  getVerbs: wordpos.getVerbs.bind(wordpos),
  getAdjectives: wordpos.getAdjectives.bind(wordpos),
  getAdverbs: wordpos.getAdverbs.bind(wordpos),

  isNoun: wordpos.isNoun.bind(wordpos),
  isVerb: wordpos.isVerb.bind(wordpos),
  isAdjective: wordpos.isAdjective.bind(wordpos),
  isAdverb: wordpos.isAdverb.bind(wordpos),

  lookup: _.partial(withLexname, wordpos.lookup.bind(wordpos)),
  lookupNoun: _.partial(withLexname, wordpos.lookupNoun.bind(wordpos)),
  lookupVerb: _.partial(withLexname, wordpos.lookupVerb.bind(wordpos)),
  lookupAdjective: _.partial(withLexname, wordpos.lookupAdjective.bind(wordpos)),
  lookupAdverb: _.partial(withLexname, wordpos.lookupAdverb.bind(wordpos)),

  WNdb: WordPOS.WNdb,
  stopwords: WordPOS.stopwords
}


// POS.getPOS('The angry bear chased the frightened little squirrel.', function(result) {
//   console.log(result);
// }).then(console.log)

// POS.isNoun('kiss').then(console.log)


// POS.lookup('kiss').then(console.log)
// POS.lookupVerb('kiss').then(console.log)
// POS.lookupVerb('dial').then(console.log)
// POS.lookupVerb('call').then(console.log)
// lookupVerb('phone').then(console.log)



// Package for export
var nlp = {
  natural: natural,
  tokenize: tokenize,
  stem: stem,
  singularNoun: singularNoun,
  pluralNoun: pluralNoun,
  singularVerb: singularVerb,
  pluralVerb: pluralVerb,
  bigrams: bigrams,
  trigrams: trigrams,
  ngrams: ngrams,

  wordpos: wordpos,
  POS: POS
}

// export the nlp module
module.exports = nlp;
