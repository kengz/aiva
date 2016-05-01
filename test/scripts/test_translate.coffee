helper = new Helper('../scripts/translate.js')

describe 'scripts/translate.js', ->
  beforeEach ->
    # creating room with 'httpd: false' will auto tear-down
    @room = helper.createRoom(httpd: false, name: global.DEFAULT_ROOM)

  # Test
  context 'alice: translate', ->
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
  context 'alice: translate 我是机器人', ->
    beforeEach ->
      co =>
        yield @room.user.say 'alice', '@hubot translate 我是机器人'
        yield delayer(10)

    # response
    it 'hubot: I Robot', ->
      @room.messages.should.eql [
        ['alice', '@hubot translate 我是机器人']
        ['hubot', 'I Robot']
      ]
