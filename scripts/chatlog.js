// dependencies
const _ = require('lomath')
const path = require('path')
const models = require(path.join(__dirname, '..', 'db', 'models', 'index'))

module.exports = (robot) => {
  robot.listenerMiddleware((context, next, done) => {
    next()
    source = context.response.envelope
    inlogs = [{
      'adapter': process.env.ADAPTER,
      'userid': _.get(source, 'user.id'),
      'username': _.get(source, 'user.username'),
      'room': _.get(source, 'room'),
      'incoming': true,
      'method': 'receive',
      'message': _.get(source, 'message.text')
    }]
    _.each(inlogs, (inlog) => { models.Chatlog.create(inlog) })
  })

  robot.responseMiddleware((context, next, done) => {
    next()
    target = context.response.envelope
    replies = context.strings
    outlogs = _.map(replies, (text) => ({
      'adapter': process.env.ADAPTER,
      'userid': _.get(target, 'user.id'),
      'username': _.get(target, 'user.username'),
      'room': _.get(target, 'room'),
      'incoming': false,
      'method': context.method,
      'message': text
    }))
    _.each(outlogs, (outlog) => { models.Chatlog.create(outlog) })
  })
}
