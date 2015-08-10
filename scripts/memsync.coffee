_ = require 'lomath'
memsync = require '../memory/memsync.js'
mem = require '../memory/braindata.json'
HubotCron = require 'hubot-cronjob'

# Description:
#   Jarvis escapes to a bunker in case of nuclear attacks.
#
# Dependencies:
#   memsync.js (local)
#
# Configuration:
#   HUBOT_GHTOKEN
#   HUBOT_REPOPATH
#
# Commands:
#   hubot upload brain - to Github
#   hubot download brain - from Github
#   hubot show brain - Prints brain.data
#
# Author:
#   kengz
  
isAdmin = require(__dirname+'/helper.coffee').isAdmin

module.exports = (robot) ->
  robot.brain.mergeData mem

  timezone = 'America/New_York'
  patternUpload = '0 0 0 * * *'

  upload = (msg) ->
    memsync.upload('memory/braindata.json', robot.brain.data)
    .then(msg.send 'brain uploaded to Github')
    
  # check if you are an admin
  robot.respond /(vision)$/i, (msg) ->
    if isAdmin msg
      msg.send "You are the vision"
    else
      msg.send "You are not the vision"

  robot.respond /(ultron attacks)$/i, (msg) ->
    if isAdmin msg
      upload msg

  robot.respond /(attack ultron)$/i, (msg) ->
    if isAdmin msg
      memsync.download('memory/braindata.json')
      .then(robot.brain.mergeData)
      .then(msg.send 'brain downloaded from Github')

  robot.respond /(show brain)$/i, (msg) ->
    msg.send 'brain:', JSON.stringify robot.brain.data

  # annoyKeng = () ->
    # robot.messageRoom('kengz', 'heyyyyyyyyy')

  # new HubotCron pattern2, timezone, annoyKeng

  new HubotCron patternUpload, timezone, upload
