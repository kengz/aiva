helper = new Helper('../scripts/hello_io.js')

# test ping script
describe 'scripts/hello_io.js', ->
  beforeEach ->
    # creating room with 'httpd: false' will auto tear-down
    @room = helper.createRoom(httpd: false, name: global.DEFAULT_ROOM)

  # Test
  context 'user: hello_io', ->
    beforeEach ->
      co =>
        yield @room.user.say 'alice', '@hubot hello_io'
        yield delayer()

    # response
    it 'hubot: `hello_io [js, py, rb]`', ->
      @room.messages.should.eql [
        ['alice', '@hubot hello_io']
        ['hubot', '`hello_io [js, py, rb]`']
      ]

  # Test
  context 'user: hello_io py', ->
    beforeEach ->
      co =>
        yield @room.user.say 'alice', '@hubot hello_io py'
        yield delayer()

    # response
    it 'hubot: Hello from Python.', ->
      @room.messages.should.eql [
        ['alice', '@hubot hello_io py']
        ['hubot', 'Hello from Python.']
      ]

  # Test
  context 'user: hello_io js', ->
    beforeEach ->
      co =>
        yield @room.user.say 'alice', '@hubot hello_io js'
        yield delayer()

    # response
    it 'hubot: Hello from Nodejs.', ->
      @room.messages.should.eql [
        ['alice', '@hubot hello_io js']
        ['hubot', 'Hello from Nodejs.']
      ]

