# helper = new Helper('../scripts/.init.js')

# test ping script
describe 'scripts/.init.js', ->
  beforeEach ->
    # there's a global.room from test/0_init_test.js
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
 