// dependencies
// Interface script for convo engine
const _ = require('lomath')
const path = require('path')
const { User } = require(path.join(__dirname, '..', 'db', 'models', 'index'))
const { TextMessage } = require('hubot')

/* istanbul ignore next */
module.exports = (robot) => {
  /* istanbul ignore next */
  robot.respond(/emulate.*/, (res) => {

    var adapter = process.env.ADAPTER
    var userid = _.toString(_.get(res.envelope, 'user.id'))
    User.find({
        where: { adapter: adapter, userid: userid }
      })
      .then((user) => {
        var envelope = JSON.parse(user.envelope)
        robot.send(envelope, 'Emulate message')

        message = new TextMessage(envelope.user, `${robot.name} ping`, '0')
        robot.receive(message)
      })
  })
}
