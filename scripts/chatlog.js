// dependencies
const _ = require('lomath')

module.exports = (robot) => {
  robot.listenerMiddleware((context, next, done) => {
    next()
    source = context.response.envelope
    inlogs = [{
      'timestamp': `${new Date()}`,
      'adapter': process.env.ADAPTER,
      'userid': _.get(source, 'user.id'),
      'username': _.get(source, 'user.username'),
      'room': _.get(source, 'room'),
      'incoming': true,
      'method': 'receive',
      'message': _.get(source, 'message.text')
    }]
    console.log(inlogs)
  })

  robot.responseMiddleware((context, next, done) => {
    next()
    target = context.response.envelope
    replies = context.strings
    outlogs = _.map(replies, (text) => ({
      'timestamp': `${new Date()}`,
      'adapter': process.env.ADAPTER,
      'userid': _.get(target, 'user.id'),
      'username': _.get(target, 'user.username'),
      'room': _.get(target, 'room'),
      'incoming': false,
      'method': context.method,
      'message': text
    }))
    console.log(outlogs)
  })
}
