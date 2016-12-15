// dependencies
const _ = require('lomath')
const path = require('path')
const { Chatlog, User } = require(path.join(__dirname, '..', 'db', 'models', 'index'))

/* istanbul ignore next */
module.exports = (robot) => {
  robot.hear(/.*/, (res) => {})

  robot.receiveMiddleware((context, next, done) => {
    var source = context.response.envelope
    var adapter = process.env.ADAPTER
    var userid = _.toString(_.get(source, 'user.id'))
    var username = _.get(source, 'user.username') || _.get(source, 'user.name')
    var profile = _.get(source, 'user')

    inlogs = [{
      'adapter': adapter,
      'userid': userid,
      'username': username,
      'room': _.get(source, 'room'),
      'incoming': true,
      'method': 'receive',
      'message': _.get(source, 'message.text') || _.join(_.keys(_.get(source, 'message.message')), ', ')
    }]

    User.findOrCreate({
      where: {adapter: adapter, userid: userid},
      defaults: {username: username, profile: JSON.stringify(profile)}})
    .spread((user, created) => {})

    _.each(inlogs, (inlog) => { Chatlog.create(inlog) })

    return next()
  })

  robot.responseMiddleware((context, next, done) => {
    var target = context.response.envelope
    // global.log.info(JSON.stringify(target, null, 2))
    replies = context.strings
    outlogs = _.map(replies, (text) => ({
      'adapter': process.env.ADAPTER,
      'userid': _.get(target, 'user.id'),
      'username': _.get(target, 'user.username') || _.get(target, 'user.name'),
      'room': _.get(target, 'room'),
      'incoming': false,
      'method': context.method,
      'message': text
    }))
    _.each(outlogs, (outlog) => { Chatlog.create(outlog) })
    return next()
  })
}
