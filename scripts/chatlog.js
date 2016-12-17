// dependencies
const _ = require('lomath')
const path = require('path')
const { Chatlog, User } = require(path.join(__dirname, '..', 'db', 'models', 'index'))

/* istanbul ignore next */
module.exports = (robot) => {
  robot.hear(/.*/, (res) => {})

  robot.receiveMiddleware((context, next, done) => {
    var envelope = context.response.envelope
    var adapter = process.env.ADAPTER
    var userid = _.toString(_.get(envelope, 'user.id'))
    var username = _.get(envelope, 'user.username') || _.get(envelope, 'user.name')

    inlogs = [{
      'adapter': adapter,
      'userid': userid,
      'username': username,
      'room': _.get(envelope, 'room'),
      'incoming': true,
      'method': 'receive',
      'message': _.get(envelope, 'message.text') || _.join(_.keys(_.get(envelope, 'message.message')), ', ')
    }]

    User.findOrCreate({
      where: {adapter: adapter, userid: userid},
      defaults: {username: username, envelope: JSON.stringify(envelope)}})
    .spread((user, created) => {})

    _.each(inlogs, (inlog) => {
      Chatlog.create(inlog)
      global.log.debug(`[In log]: ${inlog.message}`)
    })

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
    _.each(outlogs, (outlog) => {
      Chatlog.create(outlog)
      global.log.debug(`[Out log]: ${outlog.message}`)
    })
    return next()
  })
}
