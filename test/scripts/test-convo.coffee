helper = new Helper('../scripts/convo.js')

describe 'scripts/convo.js', ->
  beforeEach ->
    # creating room with 'httpd: false' will auto tear-down
    @room = helper.createRoom(httpd: false, name: global.DEFAULT_ROOM)

  # Test
  context 'alice: who are you', ->
    if process.env.CI
      # skip on CI due to spaCy model too big for CI
      @skip()
    
    beforeEach ->
      co =>
        yield @room.user.say 'alice', '@hubot who are you'
        yield delayer()

    # response
    it 'hubot: <reply>', ->
      @room.messages.should.eql [
        ['alice', '@hubot who are you']
        ['hubot', 'I am AIVA the bot.']
      ]
