# Description:
#   Shia Labeouf JUST DO IT motivational gifs
#
# Commands:
#   hubot just do it - Sends a Shia Labeouf gif.
#   
# Author:
#   kengz
  
_ = require 'lomath'

DOIT = [
	'http://media.giphy.com/media/87xihBthJ1DkA/giphy.gif'
	'http://media.giphy.com/media/GcSqyYa2aF8dy/giphy.gif'
	'http://media.giphy.com/media/14uY44q6iY8k80/giphy.gif'
	'http://media.giphy.com/media/T1iSSDNDnk0Cs/giphy.gif'
]

module.exports = (robot) ->
  robot.respond /just do it/i, (msg) ->
    msg.send DOIT[_.random(DOIT.length-1)]