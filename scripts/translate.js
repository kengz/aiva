// Module for translation
// dependencies
var _ = require('lomath')

// // Development process, testing after starting server with "npm run server"
// var client = require('../lib/client.js')
// global.gPass = client.gPass

// global.gPass({
//   input: "hola amigos",
//   to: 'ai.py',
//   intent: 'nlp.translate'
// }).then(console.log)
// // hello friends


// deploy feature: export for bot
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
