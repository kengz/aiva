// dependencies
// Module to ping the robot and get basic info
var _ = require('lomath')
var fs = require('fs')

// quick test scripts
module.exports = function(robot) {
  robot.catchAll(/.+/, function(res) {
    console.log('doing catchall')
    // console.log(res)
    console.log(res.message)
  })

  robot.respond(/getfile/i, function(res) {
    robot.emit('telegram:invoke', 'getFile', {file_id: 'AgADAQADlKoxG4bPLgUEjh8GSkYg_EWe0i8ABBF5HveFrLVjK14BAAEC'}, function(err, resp) {
      console.log(err)
      console.log(resp)
    })
    // console.log(res)
  })
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
