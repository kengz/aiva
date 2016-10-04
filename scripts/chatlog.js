// dependencies
const _ = require('lomath')
const path = require('path')
const models = require(path.join(__dirname, '..', 'db', 'models', 'index'))

module.exports = (robot) => {
  robot.hear(/.*/, (res) => {})

  robot.receiveMiddleware((context, next, done) => {
    source = context.response.envelope
    inlogs = [{
      'adapter': process.env.ADAPTER,
      'userid': _.get(source, 'user.id'),
      'username': _.get(source, 'user.username') || _.get(source, 'user.name'),
      'room': _.get(source, 'room'),
      'incoming': true,
      'method': 'receive',
      'message': _.get(source, 'message.text') || _.join(_.keys(_.get(source, 'message.message')), ', ')
    }]
    _.each(inlogs, (inlog) => { models.Chatlog.create(inlog) })
    return next()
  })

  robot.responseMiddleware((context, next, done) => {
    target = context.response.envelope
    global.log.info(JSON.stringify(target, null, 2))
    replies = context.strings
    outlogs = _.map(replies, (text) => ({
      'adapter': process.env.ADAPTER,
      'userid': _.get(target, 'user.id'),
      'username': _.get(target, 'user.username') || _.get(source, 'user.name'),
      'room': _.get(target, 'room'),
      'incoming': false,
      'method': context.method,
      'message': text
    }))
    _.each(outlogs, (outlog) => { models.Chatlog.create(outlog) })
    return next()
  })
}
