// dependencies
// Module for translation
var _ = require('lomath')

// export for bot
module.exports = function(robot) {

  // menu
  robot.respond(/translate\s*$/i, function(res) {
    res.send('`translate <text>`')
  })

  // translate
  robot.respond(/translate\s*(.+)/i, function(res) {
    var str = res.match[1];
    global.gPass({
        input: str,
        to: 'nlp.py',
        intent: 'translate'
      })
      .then(function(reply) {
        res.send(reply.output)
      })
  })

}
