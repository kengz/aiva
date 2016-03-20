var natural = require('natural');
var wordnet = new natural.WordNet();

// Design:
// Use the more superior https://github.com/moos/wordpos
// parse POS into intent, args? not so simple but it's a step forward

wordnet.lookup('node', function(results) {
    results.forEach(function(result) {
        console.log('------------------------------------');
        console.log(result.synsetOffset);
        console.log(result.pos);
        console.log(result.lemma);
        console.log(result.synonyms);
        console.log(result.pos);
        console.log(result.gloss);
    });
});


// Better wordpos
var WordPOS = require('wordpos'),
    wordpos = new WordPOS();

wordpos.getAdjectives('The angry bear chased the frightened little squirrel.', function(result){
    console.log(result);
});
// [ 'little', 'angry', 'frightened' ]

wordpos.isAdjective('awesome', function(result){
    console.log(result);
});
// true 'awesome'

wordpos.getNouns('The angry bear chased the frightened little squirrel.', console.log)
// [ 'bear', 'squirrel', 'little', 'chased' ]

wordpos.getPOS('The angry bear chased the frightened little squirrel.', console.log)
// output:
  // {
  //   nouns: [ 'bear', 'squirrel', 'little', 'chased' ],
  //   verbs: [ 'bear' ],
  //   adjectives: [ 'little', 'angry', 'frightened' ],
  //   adverbs: [ 'little' ],
  //   rest: [ 'the' ]
  // }