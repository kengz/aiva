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