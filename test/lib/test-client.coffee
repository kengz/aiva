helper = new Helper('../scripts/hello-io.js')

describe 'src/global-client.js', ->
  msgDirect =
    input: 'Hello from user.',
    to: 'hello.py',
    intent: 'say_hi'

  beforeEach ->
    # creating room with 'httpd: false' will auto tear-down
    @room = helper.createRoom(httpd: false, name: global.DEFAULT_ROOM)
    # delay to wait for all clients to join
    co ->
      yield delayer()

  describe 'global.client.clientPass', ->
    # test
    context "(cb, msgDirect)", ->
      beforeEach ->
        co =>
          global.client.clientPass(global.say(@room, 'hubot'), msgDirect)
          yield delayer()
      # response
      it 'successfully pass, callback executed on reply.', ->
        @room.messages.should.eql [
          ['hubot', 'Hello from Python.']
        ]


  describe 'global.client.pass', ->
    # test
    context "(msgDirect): js -> py", ->
      # response
      it 'successfully pass, return promise with JSON.', ->
        global.client.pass(msgDirect).should.eventually.have.all.keys('output', 'to', 'from', 'hash')
