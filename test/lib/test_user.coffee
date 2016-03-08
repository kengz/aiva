user = require('../../lib/js/user.js')

describe 'lib/user.js', ->

  describe 'whois', ->
    # test
    context '(alice)', ->
      # response
      it 'return user alice', ->
        user.whois('alice').should.eventually.eql(A.whois_alice)

    # test
    context '(ID0000001)', ->
      # response
      it 'return user alice', ->
        user.whois('ID0000001').should.eventually.eql(A.whois_alice)

    # test
    context '(res)', ->
      # response
      it 'return current user alice', ->
        user.whois(res).should.eventually.eql(A.whois_alice)
    return


  describe 'getId', ->
    # test
    context '(alice)', ->
      # response
      it 'return userId', ->
        user.getId('alice').should.equal('ID0000001')
    # test
    context '(inexistent)', ->
      # response
      it 'return undefined', ->
        should.not.exist(user.getId('inexistent'))
    # test
    context '(ID0000001)', ->
      # response
      it 'return userId', ->
        user.getId('ID0000001').should.equal('ID0000001')
    # test
    context '(res)', ->
      # response
      it 'return userId', ->
        user.getId(res).should.equal('ID0000001')
    # test
    context 'user.whois', ->
      # response
      it 'return userId', ->
        user.whois('alice').then(user.getId).should.eventually.equal('ID0000001')
    return


  describe 'wrapRes', ->
    # test
    context '(alice)', ->
      # response
      it 'return wrapped res', ->
        user.wrapRes('alice').should.eql(A.wrapRes_alice)
    # test
    context '(ID0000001)', ->
      # response
      it 'return wrapped res', ->
        user.wrapRes('ID0000001').should.eql(A.wrapRes_alice)
    # test
    context '(res)', ->
      # response
      it 'return the same res', ->
        user.wrapRes(res).should.eql(res)
    # test
    context 'user.whois', ->
      # response
      it 'return wrapped res', ->
        user.whois('alice').then(user.wrapRes).should.eventually.eql(A.wrapRes_alice)
    return


  describe 'hash', ->
    # test
    context '(alice, hashStr)', ->
      # response
      it 'return user-localized hash', ->
        user.hash('alice', 'hashStr').should.equal('ID0000001#hashStr')
    # test
    context '(ID0000001, hashStr)', ->
      # response
      it 'return user-localized hash', ->
        user.hash('ID0000001', 'hashStr').should.equal('ID0000001#hashStr')
    # test
    context '(res, hashStr)', ->
      # response
      it 'return user-localized hash', ->
        user.hash(res, 'hashStr').should.equal('ID0000001#hashStr')
    return


  return


