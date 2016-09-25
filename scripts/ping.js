// dependencies
// Module to ping the robot and get basic info
const fs = require('fs')
const _ = require('lomath')
const path = require('path')

const brainDumpPath = path.join(__dirname, '..' , 'brain.json')

// quick test scripts
module.exports = (robot) => {
  // ensure bot name
  robot.respond(/who\s*are\s*you/i, (res) => {
    res.send(robot.name)
  })

  // check res object for dev and debug
  robot.respond(/my\s*id/i, (res) => {
    res.send(JSON.stringify(_.omit(res, 'robot'), null, 2))
  })

  // check the current NODE_ENV mode: development or production
  robot.respond(/node\s*env/i, (res) => {
    res.send(`${process.env['BOTNAME']} with adapter ${process.env['ADAPTER']} is deployed in ${process.env.NODE_ENV} mode.`)
  })

  // write the runtime brain to output
  robot.respond(/write brain/i, (res) => {
    try {
      fs.writeFile(brainDumpPath, JSON.stringify(robot.brain.data))
      res.send(`Brain dumped to output ${brainDumpPath}`)
    } catch (e) {
      res.send(`No permission to write brain to output.`)
    }
  })

}
