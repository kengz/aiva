todo = require('../../lib/js/todo.js')
helper = new Helper('../scripts/todo.js')

# test ping script
describe 'scripts/todo.js', ->

  beforeEach ->
    # creating room with 'httpd: false' will auto tear-down
    @room = helper.createRoom(httpd: false, name: global.DEFAULT_ROOM)
    @robot = @room.robot
    _.set @robot, 'brain.data.users', users

  before ->
    co => 
      yield KB.query('MATCH (a) WHERE ANY(x IN labels(a) WHERE x =~ "(?i)^test_todo.*") DETACH DELETE a').catch(console.log)

  after ->
    co => 
      yield KB.query('MATCH (a) WHERE ANY(x IN labels(a) WHERE x =~ "(?i)^test_todo.*") DETACH DELETE a').catch(console.log)


  # Test
  context 'ID0000001: todo', ->
    beforeEach ->
      co =>
        yield @room.user.say 'ID0000001', '@hubot todo'
        yield delayer()

    # response
    it 'hubot: `todo {add, get, rm}`', ->
      @room.messages.should.eql [
        ['ID0000001', '@hubot todo']
        ['hubot', '`todo {add, get, rm}`']
      ]

  # Test
  context 'ID0000001: todo add task 1', ->
    beforeEach ->
      co =>
        yield @room.user.say 'ID0000001', '@hubot todo add task 1'
        yield delayer()

    # response
    it 'hubot: todo added: task 1', ->
      @room.messages.should.eql [
        ['ID0000001', '@hubot todo add task 1']
        ['hubot', 'todo added: task 1']
      ]
      # confirm task indeed added
      todo.get(res).then(KB.flattenIndex).then(KB.transBeautify).should.eventually.eql('```\n0. task 1\n```')

  # Test
  context 'ID0000002: todo ID0000001 add task 2', ->
    beforeEach ->
      co =>
        yield @room.user.say 'ID0000002', '@hubot todo ID0000001 add task 2'
        yield delayer()
        yield @room.user.say 'ID0000002', '@hubot todo ID0000001 add task 3'
        yield delayer()

    # response
    it 'hubot: todo added: task 2', ->
      @room.messages.should.eql [
        ['ID0000002', '@hubot todo ID0000001 add task 2']
        ['hubot', 'todo added: task 2']
        ['ID0000002', '@hubot todo ID0000001 add task 3']
        ['hubot', 'todo added: task 3']
      ]
      todo.get(res).then(KB.flattenIndex).then(KB.transBeautify).should.eventually.eql('```\n0. task 1\n1. task 2\n2. task 3\n```')

  # Test
  context 'ID0000001: todo get', ->
    beforeEach ->
      co =>
        yield @room.user.say 'ID0000001', '@hubot todo get'
        yield delayer()

    # response
    it 'hubot: <todolist>', ->
      @room.messages.should.eql [
        ['ID0000001', '@hubot todo get']
        ['hubot', '```\n0. task 1\n1. task 2\n2. task 3\n```']
      ]
      todo.get(res).then(KB.flattenIndex).then(KB.transBeautify).should.eventually.eql('```\n0. task 1\n1. task 2\n2. task 3\n```')

  # Test
  context 'ID0000001: todo rm', ->
    beforeEach ->
      co =>
        yield @room.user.say 'ID0000001', '@hubot todo rm'
        yield delayer()

    # response
    it 'hubot: item removed', ->
      @room.messages.should.eql [
        ['ID0000001', '@hubot todo rm']
        ['hubot', 'item removed.']
      ]
      todo.get(res).then(KB.flattenIndex).then(KB.transBeautify).should.eventually.eql('```\n0. task 1\n1. task 2\n```')

  # Test
  context 'ID0000001: todo rm 0', ->
    beforeEach ->
      co =>
        yield @room.user.say 'ID0000001', '@hubot todo rm 0'
        yield delayer()

    # response
    it 'hubot: item removed', ->
      @room.messages.should.eql [
        ['ID0000001', '@hubot todo rm 0']
        ['hubot', 'item removed.']
      ]
      todo.get(res).then(KB.flattenIndex).then(KB.transBeautify).should.eventually.eql('```\n0. task 2\n```')

