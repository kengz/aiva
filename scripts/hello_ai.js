// dependencies
var genNLP = require('../lib/js/gen_nlp')
var ai = require('../lib/js/ai')

// // Development process, testing after starting server with "node lib/io_start.js"
// var client = require('../lib/client.js')
// global.gPass = client.gPass

// var input = 'find me flights from New York to London at 9pm tomorrow.'
// genNLP.parse(input)
// .then(function(reply) {
//   console.log(JSON.stringify(reply))
// })
// // parsed NLP results

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
