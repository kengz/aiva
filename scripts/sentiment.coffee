# Description:
#   Sentiment analysis: search from twitter, call Indico
#
# Commands:
#   hubot sa [n=10] <term> - Get the sentiment from a twitter search, scaled 0-1 from bad to good.
#   
# Author:
#   kengz

_ = require 'lomath'

qsentiment = require(__dirname+'/../lib/sentiment.js')

module.exports = (robot) ->
  robot.respond /sa\s*(\d*)\s*(.*)/i, (msg) ->
    count = if msg.match[1] is '' then 10 else msg.match[1]
    term = msg.match[2]
    qsentiment(count, term).then (body) ->
    	msg.send body

