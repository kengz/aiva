// dependencies
// Interface for Google Deepdream
const Response = require('hubot').Response
var _ = require('lomath')
var fs = require('fs')
var runDeepdream = require('../lib/deepdream')
var request = require('request')

// quick test scripts
module.exports = function(robot) {
  robot.on("fb_richMsg", function(envelope) {
    robot.logger.info("got fb richMsg", envelope.attachments[0])
    runDeepdream(envelope)
    .then(function(outFilepath) {
      robot.logger.info('DeepDream outFile', outFilepath)
      var formData = {
        recipient: `{"id":"${envelope.user.id}"}`,
        message: '{"attachment":{"type":"image", "payload":{}}}',
        filedata: fs.createReadStream(outFilepath)
      }
      request.post({url:'https://graph.facebook.com/v2.6/me/messages?access_token='+process.env.FB_PAGE_TOKEN, formData: formData});
    })
  })

  robot.catchAll(/.+/, function(res) {
    // only telegram for now
    if (robot.adapterName != 'telegram') { return };
    if (_.has(res.message, 'photo')) {
      robot.logger.info("got telegram photo")
      res.reply('running DeepDream. This may take up to 5 minutes :)')
      runDeepdream(res.message)
      .then(function(outFilepath) {
        robot.logger.info('DeepDream outFile', outFilepath)
        robot.emit('telegram:invoke', 'sendPhoto', { chat_id: res.message.from.id, photo: fs.createReadStream(outFilepath) }, function (error, response) {
          if (err) { console.log(err) };
        });
      })
      .catch(console.log)
    };
  })
}
