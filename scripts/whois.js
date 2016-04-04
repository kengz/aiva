// dependencies
// Module to find a user by name/alias/ID
var _ = require('lomath')
var user = require('../lib/js/user')

// export for bot
module.exports = function(robot) {

  // menu
  robot.respond(/who\s*is\s*$/i, function(res) {
    res.send('`whois <name/alias/ID>`')
  })

  // find out details about users matching the search keyword
  robot.respond(/who\s*is\s+(.+)/i, function(res) {
    var keyword = res.match[1]
    user.whois(keyword)
      .then(_.partial(KB.transform, _, KB.parseUser))
      .then(KB.transBeautify).then(function(result) {
        res.send(result)
        return res
      }).catch(console.log)
  })
}
