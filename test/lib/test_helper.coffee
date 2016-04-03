user = require('../../lib/js/helper.js')

describe 'lib/helper.js', ->

  describe 'parseArr', ->
    # test
    context "('[male, 22, 1, 7.25]')", ->
      # response
      it 'return parsed array', ->
        helper.parseArr('[male, 22, 1, 7.25]').should.eql(['male', 22, 1, 7.25])
