# Description:
#   Get hackersnews and links
#
# Commands:
#   hubot hn [n=5] - Get the first n items on hackers news homepage
#
# Author:
#   kengz

_ = require 'lomath'
q = require 'q'
hn = require 'hn.js'

getAll = () ->
  defer = q.defer()
  hn.home (err, items) ->
    if !err
      defer.resolve items
  return defer.promise

parse = (n, msg) ->
  return getAll()
  .then (items) ->
    arr = _.map(items, (item) ->
      return ['*',item.title,'*\n_ ',item.url, ' _'].join('')
      )
    response = _.take(arr, n).join('\n')
    msg.send response
    return response

module.exports = (robot) ->
  robot.respond /hn (\d*)/i, (msg) ->
    parse(msg.match[1] || 5, msg)
