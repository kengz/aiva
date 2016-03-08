nlp = require('../../lib/js/nlp.js')
helper = new Helper('../scripts/translate.js')

describe 'scripts/translate.js', ->
  beforeEach ->
    # creating room with 'httpd: false' will auto tear-down
    @room = helper.createRoom(httpd: false, name: global.defaultRoom)

  # Test
  context 'alice: todo', ->
    beforeEach ->
      co =>
        yield @room.user.say 'alice', '@hubot translate'
        yield delayer()

    # response
    it 'hubot: `translate <text>`', ->
      @room.messages.should.eql [
        ['alice', '@hubot translate']
        ['hubot', '`translate <text>`']
      ]

  # Test
  context 'user: translate 我是机器人', ->
    beforeEach ->
      co =>
        # emulate @room.user.say 'alice', '@hubot translate'
        yield global.gPass(nlp.translate('我是机器人'))
        .should.eventually.have.all.keys('to', 'from', 'hash', 'output', 'time')
        .then(global.io.say(@room, 'hubot'))

    # response
    it 'hubot: I Robot', ->
      @room.messages.should.eql [
        ['hubot', 'I Robot']
      ]
