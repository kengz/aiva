# Description:
#   Todolist, for each user!
#
# Commands:
#   hubot todo [<user>] add <item> - Add todo item to user(default to yourself)'s' todo
#   hubot todo [<user>] list|show - Show all the user's todo, indexed.
#   hubot todo [<user>] rm|remove <index=0> - Remove a todo item at index, default to first.
#   hubot todo [<user>] clear - Remove all the user's todo.
#
# Author:
#   kengz

_ = require 'lomath'

userId = require(__dirname+'/helper.coffee').userId

# set an alias for user
setTodoForUser = (robot, user, item) ->
  robot.brain.data.todo[user] ?= []
  robot.brain.data.todo[user].push item

removeTodoForUser = (robot, user, indexStr) ->
	indices = _.filter indexStr.split(/\D+/), _.isInteger
	args = _.union [robot.brain.data.todo[user]], indices
	_.pullAt.apply(null, args)

# clear alias
clearTodoForUser = (robot, user) ->
  robot.brain.data.todo[user] = []

# beautify an arr message
beautify = (arr, user) ->
  head = '`Todos for '+user+'`\n'
  body = ''
  _.each arr, (item, index) ->
  	body += '\n' + index + '. ' + item
  body = if body is '' then '_There is nothing to do!_' else '```'+body+'```'
  return head + body


module.exports = (robot) ->
  robot.brain.data.todo ?= {}

  robot.respond /todo\s*((?:(?!add).)*) add (.*)/i, (msg) ->
    user = userId(robot, msg.match[1], msg)
    item = msg.match[2]
    if user?
  	  setTodoForUser robot, user, item
  	  msg.send "OK, added for "+user+". \`todo [<user>] list\` to see"

  robot.respond /todo\s*(.*)(show|list)/i, (msg) ->
    user = userId(robot, msg.match[1], msg)
    if user?
     msg.send beautify robot.brain.data.todo[user], user

  robot.respond /todo\s*((?:(?!rm|remove).)*) (rm|remove)(.*)/i, (msg) ->
    user = userId(robot, msg.match[1], msg)
    indexStr = msg.match[3] || '0'
    if user?
     removeTodoForUser robot, user, indexStr
     msg.send beautify robot.brain.data.todo[user], user

  robot.respond /todo\s+(.*)clear/i, (msg) ->
    user = userId(robot, msg.match[1], msg)
    if user?
     clearTodoForUser robot, user
     msg.send beautify robot.brain.data.todo[user], user
