// dependencies
// Interface script for convo engine
const _ = require('lomath')
const path = require('path')
const { User } = require(path.join(__dirname, '..', 'db', 'models', 'index'))

/* istanbul ignore next */
module.exports = (robot) => {
  /* istanbul ignore next */
  robot.respond(/.*/, (res) => {
    var adapter = process.env.ADAPTER
    var userid = _.toString(_.get(res.envelope, 'user.id'))
    User.find({
        where: { adapter: adapter, userid: userid }
      })
      .then((user) => {
        var envelope = JSON.parse(user.envelope)
        robot.send(envelope, 'Emulate message ')
      })
  })
}
