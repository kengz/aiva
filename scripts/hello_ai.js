// dependencies
// Development process, testing after starting server with "npm run server"
var client = require('../lib/client.js')
global.gPass = client.gPass

var genNLP = require('../lib/js/gen_nlp')
var ai = require('../lib/js/ai')

// var input = 'find me flights from New York to London at 9pm tomorrow.'
// genNLP.parse(input)
// .then(function(reply) {
//   console.log(JSON.stringify(reply))
// })
// // parsed NLP results

console.log(ai)

// deploy feature: export for bot
module.exports = function(robot) {
  // menu
  robot.respond(/nlp\s*$/i, function(res) {
    res.send('`nlp <text>`')
  })

  // nlp parse
  robot.respond(/nlp\s*(.+)/i, function(res) {
    var input = res.match[1];
    genNLP.parse(input)
    .then(function(reply) {
      var output = JSON.stringify(reply, null, 2)
      res.send(output)
    })
  })
}
