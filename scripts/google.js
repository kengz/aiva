// dependencies
var _ = require('lomath')
var ai = require('../lib/js/ai')
var slackAtt = require('../lib/js/slack_att')

// export for bot
/* istanbul ignore next */
module.exports = function(robot) {

  // menu
  robot.respond(/google\s*kb$/i, function(res) {
    res.send('`google kb <query>`')
  })

  // find out details about users matching the search keyword
  robot.respond(/google\s*kb\s+(.+)/i, function(res) {
    var keyword = res.match[1]
    var params = { query: keyword, limit: 5 };
    // call google kg search
    ai.google.kgsearch.entities.searchAsync(params)
    .then(function(results) {
      // format and send slack attachments
      att = slackAtt.gen(res, results, slackAtt.gkgParser)
      robot.adapter.customMessage(att)
    })
  })
}
