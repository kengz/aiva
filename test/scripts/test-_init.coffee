helper = new Helper('../scripts/_init.js')

# test ping script
describe 'scripts/_init.js', ->
  beforeEach ->
    # there's a global.room from test/_init_test.js
    @room = global.room
    @robot = @room.robot

  # Test
  context 'robot.on(ready)', ->
    # response
    it 'robot.emit(serialize_users)', ->
      spyRun = sinon.spy()
      spySer = sinon.spy()
      @robot.on 'ready', spyRun
      @robot.on 'serialize_users', spySer
      # re-invoke the initialization
      # emit the 'ready' event
      @robot.emit('ready')
      sinon.assert.calledOnce spyRun
      sinon.assert.calledOnce spySer
 
  # Test
  context 'user: manual ready', ->
    beforeEach ->
      co =>
        @spyRun = sinon.spy()
        @robot.on 'ready', @spyRun
        yield @room.user.say 'alice', '@hubot manual ready'

    # response
    it 'robot.emit(ready)', ->
      # re-invoke the initialization
      sinon.assert.calledOnce @spyRun

  # Test
  context 'user: bot info', ->
    beforeEach ->
      co =>
        @room = helper.createRoom(httpd: false, name: global.DEFAULT_ROOM)
        yield @room.user.say 'alice', '@hubot bot info'

    # response
    it 'hubot: <bot info>', ->
      @room.messages.should.not.be.empty

  # Test
  context 'user: write brain', ->
    beforeEach ->
      co =>
        @room = helper.createRoom(httpd: false, name: global.DEFAULT_ROOM)
        yield @room.user.say 'alice', '@hubot write brain'

    # response
    it 'hubot: Brain written to output.', ->
      @room.messages.should.eql [
        ['alice', '@hubot write brain']
        ['hubot', 'Brain written to output.']
      ]
