# Description:
#   Pugme is the most important thing in life
#   Catme is the most important thing in your life, even more than pugs!
#
# Dependencies:
#   None
#
# Configuration:
#   None
#
# Commands:
#   hubot pug me - Receive a pug
#   hubot pug bomb N - get N pugs
#   hubot cat me - Get a cat
#   hubot cat bomb N - Get N cats
#   hubot how many cats are there - Get the number of cats available
#   
# Author:
#   kengz, dodecaphonic, technicalpickles

_ = require 'lomath'

limit = (numStr) ->
  num = Number(numStr) || 5
  num = Math.min(num, 5)

module.exports = (robot) ->

  robot.respond /pug me/i, (msg) ->
    msg.http("http://pugme.herokuapp.com/random")
      .get() (err, res, body) ->
        msg.send JSON.parse(body).pug

  robot.respond /pug bomb( (\d+))?/i, (msg) ->
    count = limit msg.match[2]
    msg.http("http://pugme.herokuapp.com/bomb?count=" + count)
      .get() (err, res, body) ->
        msg.send pug for pug in JSON.parse(body).pugs

  robot.respond /how many pugs are there/i, (msg) ->
    msg.http("http://pugme.herokuapp.com/count")
      .get() (err, res, body) ->
        msg.send "There are #{JSON.parse(body).pug_count} pugs."


  robot.respond /cat me/i, (msg) ->
    msg.http("http://meowme.herokuapp.com/random")
      .get() (err, res, body) ->
        msg.send JSON.parse(body).cat

  robot.respond /cat bomb( (\d+))?/i, (msg) ->
    count = limit msg.match[2]
    msg.http("http://meowme.herokuapp.com/bomb?count=" + count)
      .get() (err, res, body) ->
        msg.send cat for cat in JSON.parse(body).cats

  robot.respond /how many cats are there/i, (msg) ->
    msg.http("http://meowme.herokuapp.com/count")
      .get() (err, res, body) ->
        msg.send "There are #{JSON.parse(body).cat_count} cats."
