genNLP = require('../../lib/js/gen_nlp.js')

describe 'lib/gen_nlp.js', ->
  str = "Mr. Best flew to New York on Saturday morning at 9am."
  
  context 'parseTime', ->
    it 'returns a parsed time object', ->
      genNLP.parseTime(str).should.eventually.be.a('date')

  context 'parseGen', ->
    it 'returns the JSON of parsed general NLP properties from python spaCy', ->
      genNLP.parseGen(str).should.eventually.include.keys('text', 'len', 'tokens', 'lemmas', 'NER', 'noun_phrases', 'pos_coarse', 'pos_fine')
      
  context 'parse', ->
    it 'returns the JSON of all compiled NLP parser results above', ->
      genNLP.parse(str).should.eventually.include.keys('text', 'len', 'tokens', 'lemmas', 'NER', 'noun_phrases', 'pos_coarse', 'pos_fine', 'time')
