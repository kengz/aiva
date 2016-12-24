helper = new Helper('../scripts/hello-io.js')

# test ping script
describe 'scripts/hello-io.js', ->
  beforeEach ->
    # creating room with 'httpd: false' will auto tear-down
    @room = helper.createRoom(httpd: false, name: global.DEFAULT_ROOM)

  # Test
  context 'user: hello-io', ->
    beforeEach ->
      co =>
        yield @room.user.say 'alice', '@hubot hello-io'
        yield delayer()

    # response
    it 'hubot: `hello-io [js, py, rb]`', ->
      @room.messages.should.eql [
        ['alice', '@hubot hello-io']
        ['hubot', '`hello-io [js, py, rb]`']
      ]

  # Test
  context 'user: hello-io py', ->
    beforeEach ->
      co =>
        yield @room.user.say 'alice', '@hubot hello-io py'
        yield delayer()

    # response
    it 'hubot: Hello from Python.', ->
      @room.messages.should.eql [
        ['alice', '@hubot hello-io py']
        ['hubot', 'Hello from Python.']
      ]

  # Test
  context 'user: hello-io js', ->
    beforeEach ->
      co =>
        yield @room.user.say 'alice', '@hubot hello-io js'
        yield delayer()

    # response
    it 'hubot: Hello from Nodejs.', ->
      @room.messages.should.eql [
        ['alice', '@hubot hello-io js']
        ['hubot', 'Hello from Nodejs, Hello from user.']
      ]

