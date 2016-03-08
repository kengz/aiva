// dependencies
// Module for user's todos
var _ = require('lomath')
var user = require('../lib/js/user')
var todo = require('../lib/js/todo')

// export for bot
module.exports = function(robot) {

  // menu
  robot.respond(/todo\s*$/i, function(res) {
    res.send('`todo {add, get, rm}`')
  })

  // adding
  robot.respond(/todo\s*(\w*)\s*add\s+(.+)/i, function(res) {
    var target = res.match[1];
    // set to self if is 'my', '', undefined
    if (target == 'my' || !target) {
      target = res
    };

    var taskName = res.match[2]
    todo.add(_.omit(res, 'robot'), taskName, target).then(function(result) {
      res.send(`todo added: ${taskName}`)
    }).catch(console.log)
  })

  // get
  robot.respond(/todo\s*(get|list)/i, function(res) {
    todo.get(res).then(KB.flattenIndex).then(KB.transBeautify).then(function(result) {
      res.send(result)
    }).catch(console.log)
  })

  // markDone
  robot.respond(/todo\s*rm\s*(\S*)/i,
    function(res) {
      var index = res.match[1];
      todo.markDone(res, index).then(function(result) {
        res.send('item removed.')
      }).catch(console.log)
    })

}
