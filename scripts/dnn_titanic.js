// dependencies
var helper = require('../lib/js/helper')

/* istanbul ignore next */
module.exports = function(robot) {
  // menu
  robot.respond(/titanic$/i, function(res) {
    res.send('`titanic accuracy`')
    res.send('`titanic [<Sex>,<Age>,<SibSp>,<Fare>]`')
    res.send('`titanic [<Sex>,<Age>,<SibSp>,<Fare>] <Survived>`')
  })

  // titanic dnn predict
  robot.respond(/titanic\s*accuracy\s*/i, function(res) {
    global.gPass({
      input: '',
      to: 'ai.py',
      intent: 'titanic_accuracy'
    })
    .then(function(reply) {
      res.send(reply.output)
    }).catch(console.log)
  })

  // titanic dnn predict
  robot.respond(/titanic\s*(\[.+\])\s*/i, function(res) {
    // parse matched str into arr of str and float
    // e.g. X = '[male, 22, 1, 7.25]'
    var X = helper.parseArr(res.match[1])
    global.gPass({
      input: X,
      to: 'ai.py',
      intent: 'titanic_predict'
    })
    .then(function(reply) {
      res.send(reply.output)
    }).catch(console.log)
  })

  // titanic dnn continue training with new data
  robot.respond(/titanic\s*train\s*(\[.+\])\s*(\d+)/i, function(res) {
    // e.g. X, y = '[male, 22, 1, 7.25] 1'
    var X = helper.parseArr(res.match[1])
    var y = parseFloat(res.match[2])
    console.log('arg check', X, y)
    global.gPass({
      input: X,
      y: y,
      to: 'ai.py',
      intent: 'titanic_train'
    })
    .then(function(reply) {
      res.send(reply.output)
    }).catch(console.log)
  })

}
