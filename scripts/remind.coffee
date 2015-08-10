# Description:
#   Remind to someone something
#
# Commands:
#   hubot remind <user> to <do something> [in #s|m|h|d] - remind user to do stuff, defaults to 1h.
#   hubot reminder[s] - Show active reminders
#   hubot rm|remove reminder <id> - Remove a given reminder
#   
# Author:
#   kengz
  
_ = require 'lomath'
cronJob = require('cron').CronJob
chrono = require "chrono-node"
moment = require 'moment'
userId = require(__dirname+'/helper.coffee').userId

JOBS = {}

createNewJob = (robot, pattern, user, message) ->
  id = Math.floor(Math.random() * 1000000) while !id? || JOBS[id]
  job = registerNewJob robot, id, pattern, user, message
  robot.brain.data.reminders[id] = job.serialize()
  id

registerNewJobFromBrain = (robot, id, pattern, user, message) ->
  registerNewJob(robot, id, pattern, user, message)

registerNewJob = (robot, id, pattern, user, message) ->
  job = new Job(id, pattern, user, message)
  job.start(robot)
  JOBS[id] = job

unregisterJob = (robot, id)->
  if JOBS[id]
    JOBS[id].stop()
    delete robot.brain.data.reminders[id]
    delete JOBS[id]
    return yes
  no

handleNewJob = (robot, msg, user, pattern, message) ->
    id = createNewJob robot, pattern, user, message
    humanized = moment(pattern).fromNow()
    msg.send "Got it! I will remind #{user.name} #{humanized}"

module.exports = (robot) ->
  robot.brain.data.reminders or= {}

  # The module is loaded right now
  robot.brain.on 'loaded', ->
    for own id, job of robot.brain.data.reminders
      console.log id
      registerNewJobFromBrain robot, id, job...

  robot.respond /reminder(s?)\s*(.*)/i, (msg) ->
    # console.log msg.message.user
    name = msg.match[2] || msg.message.user.name
    user = userId(robot, name, msg)
    if /^all$/i.test(name.trim())
      user = msg.message.user.room
    else

    text = []
    for id, job of JOBS
      room = if name == 'all' then job.user.room else job.user.name

      if room == user
        text.push "`@#{job.user.name} #{id}` to \"#{job.message} #{moment(job.pattern).fromNow()}\"\n"
    if text.length > 0
      text = _.sortBy(text).join('')
      msg.send text
    else
      msg.send "Nothing to remind, isn't it?"

  robot.respond /(rm|remove) reminder (\d+)/i, (msg) ->
    reqId = msg.match[2]
    for id, job of JOBS
      if (reqId == id)
        if unregisterJob(robot, reqId)
          msg.send "Reminder #{id} sleep with the fishes..."
        else
          msg.send "i can't forget it, maybe i need a headshrinker"

  robot.respond /remind ((?:(?!to).)*) to (.*)/i, (msg) ->
    name = userId(robot, msg.match[1], msg)
    body = msg.match[2]
    something = body
    at = 'in 1 hour'

    i = body.lastIndexOf ' in '
    if i > -1
      something = body.substr 0,i
      at = body.substr(i+1)
        .replace(/\s*m$/i, ' minute')
        .replace(/\s*h$/i, ' hour')
        .replace(/\s*d$/i, ' day')

    # console.log at

    users = robot.brain.usersForFuzzyName(name)

    if users.length is 1
      chronoDate = chrono.parse at
      # console.log chronoDate
      executionDate = chronoDate[0].start.date()

      handleNewJob robot, msg, users[0], executionDate, something
    else if users.length > 1
      msg.send "Be more specific, I know #{users.length} people " +
        "named like that: #{(user.name for user in users).join(", ")}"
    else
      msg.send "#{name}? Never heard of 'em"



class Job
  constructor: (id, pattern, user, message) ->
    @id = id
    @pattern = pattern
    # cloning user because adapter may touch it later
    clonedUser = {}
    clonedUser[k] = v for k,v of user
    @user = clonedUser
    @message = message

  start: (robot) ->
    @cronjob = new cronJob(@pattern, =>
      @sendMessage robot, ->
      unregisterJob robot, @id
    )
    @cronjob.start()

  stop: ->
    @cronjob.stop()

  serialize: ->
    [@pattern, @user, @message]

  sendMessage: (robot) ->
    envelope = user: @user, room: @user.room
    message = @message
    if @user.mention_name
      message = "Hey @#{envelope.user.mention_name} remember: " + @message
    else
      message = "Hey @#{envelope.user.name} remember: " + @message
    robot.send envelope, message
