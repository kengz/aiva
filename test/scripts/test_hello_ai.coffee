helper = new Helper('../scripts/hello_ai.js')

describe 'scripts/hello_ai.js', ->
  beforeEach ->
    # creating room with 'httpd: false' will auto tear-down
    @room = helper.createRoom(httpd: false, name: global.DEFAULT_ROOM)

  # Test
  context 'alice: nlp', ->
    beforeEach ->
      co =>
        yield @room.user.say 'alice', '@hubot nlp'
        yield delayer()

    # response
    it 'hubot: `nlp <text>`', ->
      @room.messages.should.eql [
        ['alice', '@hubot nlp']
        ['hubot', '`nlp <text>`']
      ]

  # Test
  context 'alice: nlp find me flights from New York to London at 9pm tomorrow.', ->
    beforeEach ->
      co =>
        yield @room.user.say 'alice', '@hubot nlp find me flights from New York to London at 9pm tomorrow.'
        yield delayer()

    # response
    it 'hubot: <nlp results>', ->
      @room.messages.should.have.length 2
