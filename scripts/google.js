// dependencies
var _ = require('lomath')
var ai = require('../lib/js/ai')
var slackAtt = require('../lib/js/slack_att')

// export for bot
/* istanbul ignore next */
module.exports = function(robot) {

  // menu
  robot.respond(/google$/i, function(res) {
    res.send('`google <query>`')
  })

  // menu
  robot.respond(/googlekb$/i, function(res) {
    res.send('`google kb <query>`')
  })

  // find out details about users matching the search keyword
  robot.respond(/google\s+(.+)/i, function(res) {
    var query = res.match[1]
    // call google kg search
    ai.google.gsearchAsync(query)
    .then(function(results) {
      // format and send slack attachments
      att = slackAtt.gen(res, results, slackAtt.gsearchParser)
      robot.adapter.customMessage(att)
    }).catch(console.log)
  })

  // find out details about users matching the search keyword
  robot.respond(/googlekb\s+(.+)/i, function(res) {
    var keyword = res.match[1]
    var params = { query: keyword, limit: 5 };
    // call google kg search
    ai.google.kgsearch.entities.searchAsync(params)
    .then(function(results) {
      // format and send slack attachments
      att = slackAtt.gen(res, results, slackAtt.gkgParser)
      robot.adapter.customMessage(att)
    }).catch(console.log)
  })
}
