// This wraps the useful nlp methods from:
// - [NaturalNode](https://github.com/NaturalNode/natural)
// - [wordpos](https://github.com/moos/wordpos)


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

  lookup: wordpos.lookup.bind(wordpos),
  lookupNoun: wordpos.lookupNoun.bind(wordpos),
  lookupVerb: wordpos.lookupVerb.bind(wordpos),
  lookupAdjective: wordpos.lookupAdjective.bind(wordpos),
  lookupAdverb: wordpos.lookupAdverb.bind(wordpos),

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
