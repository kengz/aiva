# Description:
#   Username aliasing, set basis for userId method.
#
# Commands:
#   hubot I am | I'm <alias> - Set your own alias
#   hubot <username> is <alias> - Set alias for username
#   hubot who is <alias> - See who's using the alias
#   hubot clear alias for <username> - Remove all aliases for the user
#   
# Author:
#   kengz
  
_ = require 'lomath'

userId = require(__dirname+'/helper.coffee').userId

# set an alias for user
setAliasForUser = (robot, user, msg, alias) ->
  name = userId(robot, user, msg)
  robot.brain.data.aliases[name] ?= [name]
  robot.brain.data.aliases[name] = _.union(robot.brain.data.aliases[name], [alias.toLowerCase()])

# clear alias  
clearAliasForUser = (robot, user, msg) ->
  name = userId(robot, user, msg)
  robot.brain.data.aliases[name] = [name]

# list all aliases for the user
listAliasForUser = (robot, user, msg) ->
  robot.brain.data.aliases[userId(robot, user, msg)].join(', ')

module.exports = (robot) ->
  robot.brain.data.aliases ?= {}

  robot.respond /I am(?! in| at) (.*)/i, (msg) ->
    user = msg.message.user.name
    alias = msg.match[1]
    setAliasForUser robot, user, msg, alias
    msg.send "Okay, I'll remember that "+user+" is "+alias

  robot.respond /I\'*\’*m(?! in| at) (.*)/i, (msg) ->
    user = msg.message.user.name
    alias = msg.match[1]
    setAliasForUser robot, user, msg, alias
    msg.send "Okay, I'll remember that "+user+" is "+alias

  robot.respond /My name is(?! in| at) (.*)/i, (msg) ->
    user = msg.message.user.name
    alias = msg.match[1]
    setAliasForUser robot, user, msg, alias
    msg.send "Okay, I'll remember that "+user+" is "+alias

  # someone is alias
  robot.respond /((?:(?!is)\w)*) is(?! in| at) (.*)/i, (msg) ->
    user = userId(robot, msg.match[1])
    if user?
      alias = msg.match[2]
      setAliasForUser robot, user, msg, alias
      msg.send "Okay, I'll remember that "+user+" is "+alias
    else
      ''
  
  # see the alias set
  robot.respond /who is (.*)/i, (msg) ->
    name = msg.match[1].replace('?', '')
    user = userId(robot, name, msg)
    msg.send name+" is also "+listAliasForUser(robot, user, msg)

  robot.respond /who am I/i, (msg) ->
  	name = msg.message.user.name
  	user = userId(robot, name, msg)
  	msg.send name+" is also "+listAliasForUser(robot, user, msg)

  # clear all aliases for user
  robot.respond /clear alias for (.*)/i, (msg) ->
    user = userId(robot, msg.match[1], msg)
    clearAliasForUser robot, user, msg
    msg.send "Okay, aliases cleared for "+user




