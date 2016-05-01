// dependencies
// Module to ping the robot and get basic info
var _ = require('lomath')
var fs = require('fs')

// quick test scripts
module.exports = function(robot) {
  // ensure bot name
  robot.respond(/who\s*are\s*you/i, function(res) {
    res.send(robot.name)
  })

  // check res object for dev and debug
  robot.respond(/my\s*id/i, function(res) {
    res.send(JSON.stringify(_.omit(res, 'robot'), null, 2))
  })

  // check the current NODE_ENV mode: development or production
  robot.respond(/node\s*env/i, function(res) {
    res.send('This is in ' + process.env.NODE_ENV + ' mode.')
  })

  // write the runtime brain to output
  robot.respond(/write brain/i, function(res) {
    fs.writeFile(__dirname + '/../brain.json', JSON.stringify(robot.brain.data))
    res.send("Brain written to output.")
  })

}
