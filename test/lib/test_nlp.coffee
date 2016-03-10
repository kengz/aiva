nlp = require('../../lib/js/nlp.js')
helper = new Helper('../scripts/translate.js')

describe 'lib/nlp.js', ->
  beforeEach ->
    # creating room with 'httpd: false' will auto tear-down
    @room = helper.createRoom(httpd: false, name: global.DEFAULT_ROOM)

  context 'textBlob', ->
    it 'should say textBlob', ->
      co =>
        yield global.gPass(nlp.textBlob('I am a robot'))
        .should.eventually.have.all.keys('to', 'from', 'hash', 'correct', 'lemmatize', 'noun_phrases', 'parse', 'raw', 'subjectivity', 'tags', 'time')
        .then(global.io.say(@room, 'hubot', 'parse'))
        @room.messages.should.eql [
          ['hubot', 'I/PRP/B-NP/O am/VBP/B-VP/O a/DT/B-NP/O robot/NN/I-NP/O']
        ]

  context 'translate', ->
    it 'should say translate', ->
      co =>
        yield global.gPass(nlp.translate('我是机器人'))
        .should.eventually.have.all.keys('to', 'from', 'hash', 'output', 'time')
        .then(global.io.say(@room, 'hubot'))
        @room.messages.should.eql [
          ['hubot', 'I Robot']
        ]
