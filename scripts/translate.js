// Module for translation
const _ = require('lomath')

// // Development process, testing after starting server with "npm run server"
// var client = require('../lib/client.js')
// global.gPass = client.gPass

// global.gPass({
//   input: "hola amigos",
//   to: 'nlp.py',
//   intent: 'translate'
// }).then(console.log)
// // hello friends


// deploy feature: export for bot
/* istanbul ignore next */
module.exports = (robot) => {
  // menu
  robot.respond(/translate\s*$/i, (res) => {
    res.send('`translate <text>`')
  })

  // translate
  /* istanbul ignore next */
  robot.respond(/translate\s*(.+)/i, (res) => {
    var str = res.match[1]
    global.gPass({
        input: str,
        to: 'nlp.py',
        intent: 'translate'
      })
      .then((reply) => {
        res.send(reply.output)
      })
  })
}
