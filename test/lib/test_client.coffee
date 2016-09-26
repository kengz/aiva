helper = new Helper('../scripts/hello_py.js')

describe 'lib/client.js', ->
  msgDirect =
    input: 'Hello from user.',
    to: 'hello.py',
    intent: 'sayHi'

  beforeEach ->
    # creating room with 'httpd: false' will auto tear-down
    @room = helper.createRoom(httpd: false, name: global.DEFAULT_ROOM)
    # delay to wait for all clients to join
    co =>
      yield delayer()

  describe 'global.gClientPass', ->
    # test
    context "(cb, msgDirect)", ->
      beforeEach ->
        co =>
          global.gClientPass(global.say(@room, 'hubot'), msgDirect)
          yield delayer()
      # response
      it 'successfully pass, callback executed on reply.', ->
        @room.messages.should.eql [
          ['hubot', 'Hello from Python.']
        ]


  describe 'global.gPass', ->
    # test
    context "(msgDirect): js -> py", ->
      # response
      it 'successfully pass, return promise with JSON.', ->
        global.gPass(msgDirect).should.eventually.have.all.keys('output', 'to', 'from', 'hash')
