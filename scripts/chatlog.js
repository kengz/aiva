// dependencies
const _ = require('lomath')
const path = require('path')
const { Chatlog, User } = require(path.join(__dirname, '..', 'db', 'models', 'index'))

/* istanbul ignore next */
module.exports = (robot) => {
  robot.hear(/.*/, (res) => {})

  robot.receiveMiddleware((context, next, done) => {
    let envelope = context.response.envelope
    let adapter = process.env.ADAPTER
    let userid = _.toString(_.get(envelope, 'user.id'))
    let username = _.get(envelope, 'user.username') || _.get(envelope, 'user.name')

    let inlogs = [{
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
    let target = context.response.envelope
    // global.log.info(JSON.stringify(target, null, 2))
    let replies = context.strings
    let outlogs = _.map(replies, (text) => ({
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
