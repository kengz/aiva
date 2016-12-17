// dependencies
// Interface script for convo engine
const _ = require('lomath')
const path = require('path')
const msgEmulator = require(path.join(__dirname, '..', 'src', 'msg-emulator'))

/* istanbul ignore next */
module.exports = (robot) => {
  /* istanbul ignore next */
  robot.respond(/emulate.*/, (res) => {
    var userid = _.toString(_.get(res.envelope, 'user.id'))
    msgEmulator.receive(userid, 'ping')
  })
}
