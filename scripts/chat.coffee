# Description:
#   Simple chatbot porting via Mitsuku
#   
# Commands:
#   hubot <chat> - Chat with hubot.
#
# Author:
#   kengz

_ = require 'lomath'
mitsukuMaker = require('mitsuku-api')
dict = require(__dirname+'/../memory/dict.json')
typedCmd = require(__dirname+'/helper.coffee').typedCmd

army = {}

# all the main cmd category keys
typedCmdKeys = _.sortBy _.keys typedCmd
# all the cmd regexs
allCmds = _.flattenDeep(_.map(_.values(typedCmd), _.values))


# General catcher by matching inout to a dictionary module. Returns bolean
catchDict = (dictmodule, input) ->
	_.filter(dictmodule, (cmd) ->
		return _.reMatch(new RegExp(cmd), 'i')(input)
		)

# catch jarvis talks
catchJ = (input) ->
	catchDict _.keys(dict), input

# catch hubot script commands
catchCmd = (input) ->
	catchDict allCmds, input


# jarvis talks
jtalk = (arr, msg, robot) ->
    name = msg.envelope.user.name
    if _.includes arr, "I'm"
      name = robot.name
    else

    msg.send msg.random(arr) + ' ' + name

# mitsuku talks
# creates a new mitsuku for every new user
mtalk = (txt, msg, robot) ->
	user = msg.message.user.name
	if not army[user]?
		army[user] = mitsukuMaker()
	else
		''
	mitsuku = army[user]
	mitsuku.send(txt).then (reply) ->
		msg.send reply.replace(/\s+\.$/, '.').replace(/mitsuku/i, robot.name)



module.exports = (robot) ->
	robot.respond /(.*)/i, (msg) ->
		txt = msg.match[1]
		isCmd = catchCmd txt
		isJ = catchJ txt
		if !_.size isCmd 
			if _.size isJ then jtalk dict[isJ], msg, robot else mtalk txt, msg, robot

