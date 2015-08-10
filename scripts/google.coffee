# Description:
#   Search from Google Web API.
#
# Commands:
#   hubot g|google <query> - Search Google.
#
# Author:
#   kengz, mnpk

_ = require 'lomath'

module.exports = (robot) ->
  robot.respond /(g|google) (.*)/i, (msg) ->
    googleMe msg, msg.match[2], (url) ->
      console.log msg.envelope.user
      msg.send url

googleMe = (msg, query, cb) ->
  msg.http('http://ajax.googleapis.com/ajax/services/search/web')
    .query(v: '1.0', q: query)
    .get() (err, res, body) ->
      count = 5
      pages = JSON.parse(body)
      pages = pages.responseData?.results
      if pages?.length > 0
        response = ''
        i = 0
        for page, i in pages
          response += "*#{page.titleNoFormatting}*\n_ #{page.unescapedUrl} _"
          response += "\n" if i != count-1

      cb response