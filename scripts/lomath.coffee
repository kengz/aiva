# Description:
#   Evaluate lomath
#
# Commands:
#   hubot _.<function>(args) - Evaluates a lomath function
#   hubot _.fn - Lists all functions of lomath
#   hubot _.api - Gives the API url of lomath
#
# Author:
#   kengz

_ = require 'lomath'

module.exports = (robot) ->
  robot.respond /_\.(\w+)(.*)$/i, (msg) ->
    fn = msg.match[1]
    strargs = msg.match[2]
    res = 'Syntax error in your lomath: '+'`_.'+fn+strargs+'`'
    
    if fn is 'fn'
      res = '```'+_.functions(_).join('\n')+'```'
    else if fn is 'api'
      res = '`lomath api:` _ http://kengz.github.io/lomath/ _'
    else
      try
        args = JSON.parse strargs.replace('(', '[').replace(')', ']')
        res = '`'+JSON.stringify(_[fn].apply(_, args))+'`'
      catch e

    msg.send res
