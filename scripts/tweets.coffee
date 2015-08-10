# Description:
#   Create and search for tweets on Twitter. Modified from gkoo.
#
# Dependencies:
#   "twit": "1.1.x"
#
# Configuration:
#   HUBOT_TWITTER_CONSUMER_KEY
#   HUBOT_TWITTER_CONSUMER_SECRET
#   HUBOT_TWITTER_ACCESS_TOKEN
#   HUBOT_TWITTER_ACCESS_TOKEN_SECRET
#
# Commands:
#   hubot twitter <command> <query> - Search Twitter for a query
#   hubot twitter search <query> - Search all public tweets
#   hubot twitter user <query> - Get a user's recent tweets
#
# Author:
#   kengz, gkoo

Twit = require "twit"
_ = require 'lomath'
isAdmin = require(__dirname+'/helper.coffee').isAdmin

config =
  consumer_key: process.env.HUBOT_TWITTER_CONSUMER_KEY
  consumer_secret: process.env.HUBOT_TWITTER_CONSUMER_SECRET
  access_token: process.env.HUBOT_TWITTER_ACCESS_TOKEN
  access_token_secret: process.env.HUBOT_TWITTER_ACCESS_TOKEN_SECRET

twit = undefined

getTwit = ->
  unless twit
    twit = new Twit config
  return twit

doHelp = (msg) ->
  commands = [
    "hubot twitter help\t\t\tShow this help menu",
    "hubot twitter search <query>\t\tSearch all public tweets",
    "hubot twitter user <query>\t\tGet a user's recent tweets"
    # "hubot [twitter] tweet <query>\t\tPost a tweet"
  ]
  msg.send commands.join('\n')

doSearch = (msg) ->
  query = msg.match[2]
  return if !query

  twit = getTwit()
  count = 5
  searchConfig =
    q: "#{query}",
    count: count,
    lang: 'en',
    result_type: 'recent'

  twit.get 'search/tweets', searchConfig, (err, reply) ->
    return msg.send "Error retrieving tweets!" if err
    return msg.send "No results returned!" unless reply?.statuses?.length

    statuses = reply.statuses
    response = ''
    i = 0
    for status, i in statuses
      response += "*@#{status.user.screen_name}* _ #{status.text} _"
      response += "\n" if i != count-1

    return msg.send response

doUser = (msg) ->
  username = msg.match[2]
  return if !username

  twit = getTwit()
  count = 5
  searchConfig =
    screen_name: username,
    count: count

  twit.get 'statuses/user_timeline', searchConfig, (err, statuses) ->
    return msg.send "Error retrieving tweets!" if err
    return msg.send "No results returned!" unless statuses?.length

    response = ''
    i = 0
    msg.send "Recent tweets from #{statuses[0].user.screen_name}"
    for status, i in statuses
      response += "#{status.text}"
      response += "\n" if i != count-1

    return msg.send response

doTweet = (msg, tweet) ->
  # set access restriction here
  return if !tweet and isAdmin msg
  tweetObj = status: tweet
  twit = getTwit()
  twit.post 'statuses/update', tweetObj, (err, reply) ->
    if err
      msg.send "Error sending tweet!"
    else
      username = reply?.user?.screen_name
      id = reply.id_str
      if (username && id)
        msg.send "https://www.twitter.com/#{username}/status/#{id}"

module.exports = (robot) ->
  robot.respond /twitter (\S+)\s*(.+)?/i, (msg) ->
    unless config.consumer_key
      msg.send "Please set the HUBOT_TWITTER_CONSUMER_KEY environment variable."
      return
    unless config.consumer_secret
      msg.send "Please set the HUBOT_TWITTER_CONSUMER_SECRET environment variable."
      return
    unless config.access_token
      msg.send "Please set the HUBOT_TWITTER_ACCESS_TOKEN environment variable."
      return
    unless config.access_token_secret
      msg.send "Please set the HUBOT_TWITTER_ACCESS_TOKEN_SECRET environment variable."
      return

    command = msg.match[1]

    if (command == 'help')
      doHelp(msg)

    else if (command == 'search')
      doSearch(msg)

    else if (command == 'tweet')
      doTweet(msg, msg.match[2])

    else if (command == 'user')
      doUser(msg, msg.match[2])

  robot.respond /tweet\s*(.+)?/i, (msg) ->
    doTweet(msg, msg.match[1])
