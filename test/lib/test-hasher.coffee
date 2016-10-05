# hasher = require('../../lib/js/hasher.js')
helper = new Helper('../scripts/info.js')
id = __filename.split("/").pop();

describe 'src/hasher.js', ->
  # declare variables
  str = 'hasher test'
  hashStr = null
  msg = null
  
  before ->
    # creating room with 'httpd: false' will auto tear-down
    @room = helper.createRoom(httpd: false, name: global.DEFAULT_ROOM)

  describe 'gen', ->
    # test
    context '(id, cb)', ->
      # response
      it 'return hashStr, add cb to hashMap', ->
        hashStr = hasher.gen(id, global.say(@room, 'hubot'))
        hashStr.should.match(/^test-hasher/)
        msg = 
          hash: hashStr
          output: str
        hasher.hashMap[hashStr].should.be.ok

  describe 'handle', ->
    # test
    context '(msg)', ->
      # response
      it 'executes the handler in hashMap.', ->
        hasher.handle(msg)
        @room.messages.should.eql [
          ['hubot', str]
        ]
