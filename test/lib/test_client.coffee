helper = new Helper('../scripts/hello_py.js')

describe 'lib/client.js', ->
  msgDirect =
    input: 'Hello from user.',
    to: 'hello.py',
    intent: 'sayHi'

  msgIndirect =
    input: 'Hello from user.'
    to: 'hello_rb.py'
    intent: 'passToOtherClient'

  beforeEach ->
    # creating room with 'httpd: false' will auto tear-down
    @room = helper.createRoom(httpd: false, name: global.DEFAULT_ROOM)
    # delay to wait for all clients to join
    co =>
      yield delayer(10)

  describe 'global.gClientPass', ->
    # test
    context "(cb, msgDirect)", ->
      beforeEach ->
        co =>
          global.gClientPass(global.io.say(@room, 'hubot'), msgDirect)
          yield delayer()
      # response
      it 'successfully pass, callback executed on reply.', ->
        @room.messages.should.eql [
          ['hubot', 'Hello from Python.']
        ]

    # test
    context "(cb, msgIndirect)", ->
      beforeEach ->
        co =>
          global.gClientPass(global.io.say(@room, 'hubot'), msgIndirect)
          yield delayer()
      # response
      it 'successfully pass, callback executed on reply.', ->
        @room.messages.should.eql [
          ['hubot', 'Hello from Ruby.']
        ]

  describe 'global.gPass', ->
    # test
    context "(msgDirect): js -> py", ->
      # response
      it 'successfully pass, return promise with JSON.', ->
        global.gPass(msgDirect).should.eventually.have.all.keys('output', 'to', 'from', 'hash')

    # test
    context "(msgIndirect): js -> py -> rb", ->
      # response
      it 'successfully pass, return promise with JSON.', ->
        global.gPass(msgIndirect).should.eventually.have.all.keys('output', 'to', 'from', 'hash')
