// dependencies
// Module for translation
const _ = require('lomath')

// // Development process, testing after starting server with "npm run server"

// global.client.pass({
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
    global.client.pass({
        input: str,
        to: 'nlp.py',
        intent: 'translate'
      })
      .then((reply) => {
        res.send(reply.output)
      })
  })
}
