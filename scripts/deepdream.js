// dependencies
// Interface for Google Deepdream
var _ = require('lodash')
var fs = require('fs')
var runDeepdream = require('../lib/deepdream')

// quick test scripts
module.exports = function(robot) {
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
