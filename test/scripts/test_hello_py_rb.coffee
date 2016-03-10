helper = new Helper('../scripts/hello_py_rb.js')

# test ping script
describe 'scripts/hello_py_rb.js', ->
  beforeEach ->
    # creating room with 'httpd: false' will auto tear-down
    @room = helper.createRoom(httpd: false, name: global.DEFAULT_ROOM)

  # Test
  context 'user: hello_py_rb', ->
    beforeEach ->
      co =>
        yield @room.user.say 'alice', '@hubot hello_py_rb'
        yield delayer()

    # response
    it 'hubot: `hello_py_rb {rb}`', ->
      @room.messages.should.eql [
        ['alice', '@hubot hello_py_rb']
        ['hubot', '`hello_py_rb {rb}`']
      ]

  # Test
  context 'user: hello_py_rb rb', ->
    beforeEach ->
      co =>
        yield @room.user.say 'alice', '@hubot hello_py_rb rb'
        yield delayer()

    # response
    it 'hubot: Hello from Ruby.', ->
      @room.messages.should.eql [
        ['alice', '@hubot hello_py_rb rb']
        ['hubot', 'Hello from Ruby.']
      ]
