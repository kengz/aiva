# helper = new Helper('../scripts/hello_py.js')

# # test ping script
# describe 'scripts/hello_py.js', ->
#   beforeEach ->
#     # creating room with 'httpd: false' will auto tear-down
#     @room = helper.createRoom(httpd: false, name: global.DEFAULT_ROOM)

#   # Test
#   context 'user: hello_py', ->
#     beforeEach ->
#       co =>
#         yield @room.user.say 'alice', '@hubot hello_py'
#         yield delayer()

#     # response
#     it 'hubot: `hello_py [py]`', ->
#       @room.messages.should.eql [
#         ['alice', '@hubot hello_py']
#         ['hubot', '`hello_py [py]`']
#       ]

#   # Test
#   context 'user: hello_py py', ->
#     beforeEach ->
#       co =>
#         yield @room.user.say 'alice', '@hubot hello_py py'
#         yield delayer()

#     # response
#     it 'hubot: Hello from Python.', ->
#       @room.messages.should.eql [
#         ['alice', '@hubot hello_py py']
#         ['hubot', 'Hello from Python.']
#       ]

