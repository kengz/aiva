const _ = require('lomath')
const path = require('path')
const randomBytes = require('randombytes')
const { TextMessage } = require('hubot')
const { User } = require(path.join(__dirname, '..', 'db', 'models', 'index'))

// emulate a user sending a message to bot
// call as:
// const msgEmulator = require('msg-emulator')
// msgEmulator.receive(userid, 'ping')
function receive(userid, text) {
  let adapter = process.env.ADAPTER
  let emulMsgID = `${userid}-${new Date().toISOString()}`
  User.find({
      where: { adapter: adapter, userid: userid }
    })
    .then((user) => {
      let envelope = JSON.parse(user.envelope)
      let message = new TextMessage(envelope, `${global.robot.name} ${text}`, emulMsgID)
      global.robot.receive(message)
      // global.robot.send(envelope, 'Direct message')
    })
}

module.exports = {
  receive: receive
}
