# Description:
#   Generates help commands for Hubot.
#
# Commands:
#   hubot help <category> - Displays all help commands that match <category>.
#   hubot help all - Displays all of the help commands that Hubot knows about.
#
# URLS:
#   /hubot/help
#
# Notes:
#   These commands are grabbed from comment blocks at the top of each file.
#   
# Author:
#   kengz
  

_ = require 'lomath'
typedCmd = require(__dirname+'/helper.coffee').typedCmd

# all the main cmd category keys
typedCmdKeys = _.sortBy _.keys typedCmd
# all the cmd regexs
allCmds = _.flattenDeep(_.map(_.values(typedCmd), _.values))

# beautify an arr message
beautify = (arr) ->
  return 'See command types by `help ['+_.sortBy(_.keys(arr)).join(', ')+']`'


helpContents = (name, commands) ->

  """
<!DOCTYPE html>
<html>
  <head>
  <meta charset="utf-8">
  <title>#{name} Help</title>
  <style type="text/css">
    body {
      background: #d3d6d9;
      color: #636c75;
      text-shadow: 0 1px 1px rgba(255, 255, 255, .5);
      font-family: Helvetica, Arial, sans-serif;
    }
    h1 {
      margin: 8px 0;
      padding: 0;
    }
    .commands {
      font-size: 13px;
    }
    p {
      border-bottom: 1px solid #eee;
      margin: 6px 0 0 0;
      padding-bottom: 5px;
    }
    p:last-child {
      border: 0;
    }
  </style>
  </head>
  <body>
    <h1>#{name} Help</h1>
    <div class="commands">
      #{commands}
    </div>
  </body>
</html>
  """


module.exports = (robot) ->

  robot.respond /help\s*(.*)?$/i, (msg) ->
    cmds = robot.helpCommands()
    filter = msg.match[1]

    # if arg empty
    if !filter?
      msg.send beautify typedCmd
      return

    else
    	# if arg is a key of typedCmdKeys
    	if _.includes typedCmdKeys, filter
    		msg.send beautify typedCmd[filter]
    		return
    	else
    		# if not requesting all, then filter
    		if filter != 'all'
      		cmds = cmds.filter (cmd) ->
       			cmd.match new RegExp(filter, 'i')

				if cmds.length == 0
       		msg.send "No available commands match #{filter}"
       		return

       	# do the filter shits using cmds from filter
      	prefix = robot.alias or robot.name
    		cmds = cmds.map (cmd) ->
      		cmd = cmd.replace /hubot/ig, robot.name
      		cmd.replace new RegExp("^#{robot.name}"), prefix
    		# emit is all the commands matched from cmds
    		emit = '`' + cmds.join("`\n`") + '`'
    		msg.send emit

  		robot.router.get "/#{robot.name}/help", (req, res) ->
  		  cmds = robot.helpCommands().map (cmd) ->
  		    cmd.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;')
		
  		  emit = "<p>#{cmds.join '</p><p>'}</p>"
		
  		  emit = emit.replace /hubot/ig, "<b>#{robot.name}</b>"
		
  		  res.setHeader 'content-type', 'text/html'
  		  res.end helpContents robot.name, emit
