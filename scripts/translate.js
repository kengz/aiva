// dependencies
// Module for translation
var _ = require('lomath')
var nlp = require('../lib/js/nlp')

// export for bot
module.exports = function(robot) {

  // menu
  robot.respond(/translate\s*$/i, function(res) {
    res.send('`translate <text>`')
  })

  // translate
  /* istanbul ignore next */
  robot.respond(/translate\s*(.+)/i, function(res) {
    var str = res.match[1];
    global.gPass(nlp.translate(str))
      .then(function(reply) {
        // respond to user when hello.py resolves the promise
        res.send(reply.output)
      })
  })

}
