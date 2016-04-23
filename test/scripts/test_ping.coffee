helper = new Helper('../scripts/ping.js')

# test ping script
describe 'scripts/ping.js', ->
  beforeEach ->
    # creating room with 'httpd: false' will auto tear-down
    @room = helper.createRoom(httpd: false, name: global.DEFAULT_ROOM)


  # Test
  context 'user: whoareyou', ->
    beforeEach ->
      co =>
        yield @room.user.say 'alice', '@hubot whoareyou'

    # response
    it 'hubot: PONG', ->
      @room.messages.should.eql [
        ['alice', '@hubot whoareyou']
        ['hubot', 'hubot']
      ]


  # Test
  context 'user: myid', ->
    beforeEach ->
      co =>
        yield @room.user.say 'alice', '@hubot myid'

    # response
    it 'hubot: <stringified JSON of res>', ->
      @room.messages.should.eql [ 
        # returns the stringified JSON
        [ 'alice', '@hubot myid' ]
        [ 'hubot', '{\n  "message": {\n    "user": {\n      "id": "alice",\n      "room": "bot-test",\n      "name": "alice"\n    },\n    "text": "@hubot myid",\n    "done": false,\n    "room": "bot-test"\n  },\n  "match": [\n    "@hubot myid"\n  ],\n  "envelope": {\n    "room": "bot-test",\n    "user": {\n      "id": "alice",\n      "room": "bot-test",\n      "name": "alice"\n    },\n    "message": {\n      "user": {\n        "id": "alice",\n        "room": "bot-test",\n        "name": "alice"\n      },\n      "text": "@hubot myid",\n      "done": false,\n      "room": "bot-test"\n    }\n  }\n}' ] 
      ]


  # Test
  context 'user: nodeenv', ->
    beforeEach ->
      co =>
        yield @room.user.say 'alice', '@hubot nodeenv'

    # response
    it 'hubot: development (in Mocha test)', ->
      @room.messages.should.eql [
        ['alice', '@hubot nodeenv']
        ['hubot', 'This is in development mode.']
      ]


  # Test
  context 'user: write brain', ->
    beforeEach ->
      co =>
        yield @room.user.say 'alice', '@hubot write brain'

    # response
    it 'hubot: Brain written to output.', ->
      @room.messages.should.eql [
        ['alice', '@hubot write brain']
        ['hubot', 'Brain written to output.']
      ]
