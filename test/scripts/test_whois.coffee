helper = new Helper('../scripts/whois.js')

# test ping script
describe 'scripts/whois.js', ->
  beforeEach ->
    # creating room with 'httpd: false' will auto tear-down
    @room = helper.createRoom(httpd: false, name: global.defaultRoom)
    @robot = @room.robot
    _.set @robot, 'brain.data.users', users


  # Test
  context 'user: who is', ->
    beforeEach ->
      co =>
        yield @room.user.say 'alice', '@hubot whois'
        yield delayer()

    # response
    it 'hubot: <details>', ->
      # allow time for message to get through and handled
      # emit the 'serialize' event
      @room.messages.should.eql [
        ['alice', '@hubot whois']
        ['hubot', '`whois <name/alias/ID>`']
      ]
 
  # Test
  context 'user: who is alice', ->
    beforeEach ->
      co =>
        yield @room.user.say 'alice', '@hubot whois alice'
        yield delayer()

    # response
    it 'hubot: <details>', ->
      # allow time for message to get through and handled
      # emit the 'serialize' event
      @room.messages.should.eql [
        ['alice', '@hubot whois alice']
        ['hubot', '```\nname: alice\nid: ID0000001\nemail_address: alice@email.com\n```']
      ]
 
  # Test
  context 'user: who is 001', ->
    beforeEach ->
      co =>
        yield @room.user.say 'alice', '@hubot whois 001'
        yield delayer()

    # response
    it 'hubot: <details>', ->
      # allow time for message to get through and handled
      # emit the 'serialize' event
      @room.messages.should.eql [
        ['alice', '@hubot whois 001']
        ['hubot', '```\nname: alice\nid: ID0000001\nemail_address: alice@email.com\n```']
      ]
 