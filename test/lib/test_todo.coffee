todo = require('../../lib/js/todo.js')
user = require('../../lib/js/user.js')

describe 'lib/todo.js', ->

  describe 'genProp', ->
    # test
    context '("task1", "alice")', ->
      # response
      it 'return todo prop', ->
        todo.genProp('task1', 'alice').should.eql(A.todoGenProp)
    # test
    context '("task1", "ID0000001")', ->
      # response
      it 'return todo prop', ->
        todo.genProp('task1', 'ID0000001').should.eql(A.todoGenProp)
    # test
    context '("task1", res)', ->
      # response
      it 'return todo prop', ->
        todo.genProp('task1', res).should.eql(A.todoGenProp)
    # test
    context 'whois.then ("task1", res)', ->
      # response
      it 'return todo prop', ->
        user.whois('alice').then((arr) ->
            todo.genProp('task1', arr)
          ).should.eventually.eql(A.todoGenProp)
    return


  describe 'legalizeProp', ->
    # test
    context '("alice", "task1", "bob"): not-self', ->
      # response
      it 'return legal todo prop. The rest is the same as below as self.', ->
        _.omit(todo.legalizeProp('alice', 'task1', 'bob'), 'updated_when').should.eql(A.todoLegalizeProp_nonself)
    # test
    context '("alice", "task1"): self', ->
      # response
      it 'return legal todo prop', ->
        _.omit(todo.legalizeProp('alice', 'task1'), 'updated_when').should.eql(A.todoLegalizeProp_self)
    # test
    context '("ID0000001", "task1"): self', ->
      # response
      it 'return legal todo prop', ->
        _.omit(todo.legalizeProp('ID0000001', 'task1'), 'updated_when').should.eql(A.todoLegalizeProp_self)
    # test
    context '(res, "task1"): self', ->
      # response
      it 'return legal todo prop', ->
        _.omit(todo.legalizeProp(res, 'task1'), 'updated_when').should.eql(A.todoLegalizeProp_self)
    # test
    context 'whois.then (res, "task1"): self', ->
      # response
      it 'return legal todo prop', ->
        user.whois('alice').then((arr) ->
            _.omit(todo.legalizeProp(arr, 'task1'), 'updated_when')
          ).should.eventually.eql(A.todoLegalizeProp_self)
    return


  describe 'todo: add, get, markDone', ->
    before ->
      co => 
        yield KB.query('MATCH (a) WHERE ANY(x IN labels(a) WHERE x =~ "(?i)^test_todo.*") DETACH DELETE a').catch(console.log)

    after ->
      co => 
        yield KB.query('MATCH (a) WHERE ANY(x IN labels(a) WHERE x =~ "(?i)^test_todo.*") DETACH DELETE a').catch(console.log)
        
    # test
    context '(res, "task1")', ->
      # response
      it 'add "task1" by/to self: (res, task1)', ->
        co =>
          yield todo.add(res, 'task1')
          yield todo.get(res).then(KB.flattenIndex).then(KB.transBeautify).should.eventually.eql('```\n0. task1\n```')

      # response
      it '(res, task2, alice): add "task2" by/to self', ->
        co =>
          yield todo.add(res, 'task2', 'alice')
          yield todo.get(res).then(KB.flattenIndex).then(KB.transBeautify).should.eventually.eql('```\n0. task1\n1. task2\n```')

      # response
      it '(bob, task3, alice): add "task3" by/to others users', ->
        co =>
          yield todo.add('bob', 'task3', 'alice')
          yield todo.get(res).then(KB.flattenIndex).then(KB.transBeautify).should.eventually.eql('```\n0. task1\n1. task2\n2. task3\n```')

      # response
      it 'markDone(res): default to last', ->
        co =>
          yield todo.markDone(res)
          yield todo.get(res).then(KB.flattenIndex).then(KB.transBeautify).should.eventually.eql('```\n0. task1\n1. task2\n```')

      # response
      it 'markDone(res, "0"): use index', ->
        co =>
          yield todo.markDone(res, '0')
          yield todo.get(res).then(KB.flattenIndex).then(KB.transBeautify).should.eventually.eql('```\n0. task2\n```')
          
      # response
      it '(res): exhaust list', ->
        co =>
          yield todo.markDone(res)
          yield todo.get(res).then(KB.flattenIndex).then(KB.transBeautify).should.eventually.eql('```\n\n```')


