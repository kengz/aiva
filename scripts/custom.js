// dependencies
// Module to demo robot.adapter.customMessage
var _ = require('lomath')
var custom_msg = require('../lib/js/custom_msg')

// sample simpleAtt, see custom_msg.js for more
simpleAtt = {
  pretext: "This is a pretext",
  color: "blue",
  title: "This is a title",
  title_link: "https://api.slack.com/docs/attachments",
  text: "This is the main text in a message attachment, and can contain standard message markup (see details below). The content will automatically collapse if it contains 700+ characters or 5+ linebreaks, and will display a 'Show more...' link to expand the content.",
  fieldMat: [
    ["Priority", "high"],
    ["Status", "pending"]
  ],
  image_url: "https://slack.global.ssl.fastly.net/ae57/img/slack_api_logo.png",
  thumb_url: "https://slack.global.ssl.fastly.net/ae57/img/slack_api_logo.png"
}


module.exports = function(robot) {
  /* istanbul ignore next */
  robot.respond(/custom_msg$/i, function(res) {
    robot.adapter.customMessage(custom_msg(res, simpleAtt))
  })

}
