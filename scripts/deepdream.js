// dependencies
// Interface for Google Deepdream
const Response = require('hubot').Response
var _ = require('lomath')
var fs = require('fs')
var runDeepdream = require('../lib/deepdream')
var request = require('request')

// for rate limiting
const maxUse = 20
var counter = {
  'id': 0
}
// deduct usages for each user
function deduct(userId) {
  counter[userId] = (counter[userId]||maxUse)-1
  return counter[userId]
}

// quick test scripts
/* istanbul ignore next */
module.exports = function(robot) {
  robot.on("fb_richMsg", function(envelope) {
    res = new Response(robot, envelope, undefined)
    // rate limit
    var remain = deduct(envelope.user.id)
    if (remain < 0) {
      res.send(`Sorry, you ran out of your ${maxUse} uses of Deepdream. Hope you enjoyed!`)
      return
    }

    res.send(`running DeepDream. This may take up to 2 minutes :) Meanwhile you have ${remain} uses left.`)
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
      // rate limit
      var remain = deduct(res.envelope.user.id)
      if (remain < 0) {
        res.send(`Sorry, you ran out of your ${maxUse} uses of Deepdream. Hope you enjoyed!`)
        return
      }
    
      robot.logger.info("got telegram photo")
      res.send(`running DeepDream. This may take up to 2 minutes :) Meanwhile you have ${remain} uses left.`)
      runDeepdream(res.message)
      .then(function(outFilepath) {
        robot.logger.info('DeepDream outFile', outFilepath)
        robot.emit('telegram:invoke', 'sendPhoto', { chat_id: res.message.from.id, photo: fs.createReadStream(outFilepath) }, function (error, response) {
          if (error) { console.log(error) };
        });
      })
      .catch(console.log)
    };
  })
}
