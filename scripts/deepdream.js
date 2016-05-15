var request = require('request')

// dependencies
// Interface for Google Deepdream
const Response = require('hubot').Response
var _ = require('lomath')
var fs = require('fs')
var runDeepdream = require('../lib/deepdream')
var request = require('request')

// { type: 'image',
// payload: { url: 'https://scontent.xx.fbcdn.net/v/t34.0-12/13164323_10209031024269971_2022242086900122355_n.jpg?oh=8b9f82671027926d38d78861f3d8388d&oe=5739223D' } }

// quick test scripts
module.exports = function(robot) {
  robot.on("fb_richMsg", function(envelope) {
    console.log("got richMsg", envelope.attachments[0])
    runDeepdream(envelope)
    .then(function(outFilepath) {
      console.log('outFilepath', outFilepath)
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
      console.log("receiving photo")
      res.reply('running DeepDream. This may take up to 5 minutes :)')
      runDeepdream(res.message)
      .then(function(outFilepath) {
        console.log('made it out', outFilepath)
        robot.emit('telegram:invoke', 'sendPhoto', { chat_id: res.message.from.id, photo: fs.createReadStream(outFilepath) }, function (error, response) {
          if (err) { console.log(err) };
        });
      })
      .catch(console.log)
    };
  })
}
