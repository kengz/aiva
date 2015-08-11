# Description:
#   time-me and darksky combined, with memory of users' locations.
#   Modified from parkr (time-me), and kyleslattery, awaxa (darksky)
#
# Dependencies:
#   node-geocoder
#
# Configuration:
#   HUBOT_TIMEZONEDB_API_KEY
#   HUBOT_DARK_SKY_API_KEY
#   HUBOT_DARK_SKY_DEFAULT_LOCATION
#   HUBOT_DARK_SKY_SEPARATOR (optional - defaults to "\n")
#   
# Notes:
#   If HUBOT_DARK_SKY_DEFAULT_LOCATION is blank, weather commands without a location will be ignored
#
# Commands:
#   hubot <user> is | <I'm> in <location> - Set where user is
#   hubot where am I | is <user> - Tells where user is
#   hubot time me | [at] [user] - Time at where user is
#   hubot weather - Get the weather for HUBOT_DARK_SKY_DEFAULT_LOCATION
#   hubot weather me | [at] <location|user> - Weather at where user is
#
# Author:
#   kengz

userId = require(__dirname+'/helper.coffee').userId

geocoder = require('node-geocoder').getGeocoder('google', 'http', {})
timezonedbKey = process.env["HUBOT_TIMEZONEDB_API_KEY"]

unless timezonedbKey?
  console.log "Whoops, can't use /time me, as HUBOT_TIMEZONEDB_API_KEY isn't set."

monthNames = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December"
]

dayNames = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday"
]

now = ->
  Math.round(new Date().getTime() / 1000)

locationForUser = (robot, userName, msg) ->
  robot.brain.data.locations[userId(robot, userName, msg)]

setLatitudeAndLongitudeOnUser = (robot, user, msg, lat, lon) ->
  id = userId(robot, user, msg)
  robot.brain.data.locations[id]       ?= {}
  robot.brain.data.locations[id]["lat"] = lat
  robot.brain.data.locations[id]["lon"] = lon

setLocationForUser = (robot, user, msg, location, cb) ->
  name = userId(robot, user, msg)
  robot.brain.data.locations[name] ?= {}
  robot.brain.data.locations[name]["stringLocation"] = location
  geocodeNewLocation robot, user, msg, location, cb

geocodeNewLocation = (robot, user, msg, location, cb) ->
  geocoder.geocode location, (err, res) ->
    if err
      console.log err
      cb("There was an error: #{err}")
    else
      setLatitudeAndLongitudeOnUser(robot, user, msg, res[0].latitude, res[0].longitude)
      cb("Ok, updated #{userId(robot, user, msg)}'s location to '#{location}'")

relativeToNoon = (hours) ->
  if hours - 12 > 0
    "PM"
  else
    "AM"

formattedUnixTime = (timestamp) ->
  date = new Date(parseInt(timestamp) * 1000)
  console.log date
  "#{dayNames[date.getUTCDay()]}, #{monthNames[date.getUTCMonth()]} #{date.getUTCDate()} at #{date.getUTCHours()}:#{date.getUTCMinutes()} #{relativeToNoon(date.getUTCHours())}."

timeAtLatitudeAndLongitude = (robot, location, cb) ->
  robot.http("http://api.timezonedb.com/").query
    key: timezonedbKey,
    lat: location.lat,
    lng: location.lon,
    time: now(),
    format: "json"
  .get() (err, res, body) ->
    if err or JSON.parse(body).status != "OK"
      cb "Sorry, I can't fetch time from unrecognized geolocation :("
    else
      info = JSON.parse body
      cb "```It's currently #{formattedUnixTime info.timestamp} in #{location.stringLocation}.```"

module.exports = (robot) ->
  robot.brain.data.locations ?= {}

  robot.respond /time( at)? ?(.+)?/i, (msg) ->
    user = userId(robot, msg.match[2], msg)
    location = if user? and robot.brain.data.locations[user]? then robot.brain.data.locations[user].stringLocation else msg.match[2]

    if location?
      geocoder.geocode location, (err, res) ->
        if err
          msg.send "Sorry, I don't know where #{location} is"
        else
          codedlocation = {}
          codedlocation['stringLocation'] = location
          codedlocation['lat'] = res[0].latitude
          codedlocation['lon'] = res[0].longitude
          timeAtLatitudeAndLongitude robot, codedlocation, (message) ->
            msg.send message
    else
      msg.send "Sorry, I don't know where #{user} is so I can't tell what time zone he or she is in. :("

  robot.respond /((?:(?!is).)*) is (in|at) (.*)/i, (msg) ->
    user = userId(robot, msg.match[1], msg)
    if user?
      location = msg.match[3]
      setLocationForUser robot, user, msg, location, (message) ->
        msg.send message

  robot.respond /I\'*\’*m (in|at) (.*)/i, (msg) ->
    user = msg.message.user.name
    location = msg.match[2]
    setLocationForUser robot, user, msg, location, (message) ->
      msg.send message

  robot.respond /I am (in|at) (.*)/i, (msg) ->
    user = msg.message.user.name
    location = msg.match[2]
    setLocationForUser robot, user, msg, location, (message) ->
      msg.send message

  robot.respond /where is (.+)/i, (msg) ->
    user     = userId(robot, msg.match[1], msg)
    if user?
      location = locationForUser(robot, user, msg)
      if location?
        msg.send "#{user} is in #{location.stringLocation}."
      else
        msg.send "Sorry, no idea where #{user} is."

  robot.respond /where am I/i, (msg) ->
    user     = msg.message.user.name
    location = locationForUser(robot, user, msg)
    if location?
      msg.send "#{user} is in #{location.stringLocation}."
    else
      msg.send "Sorry, no idea where #{user} is."


  # This part henceforth is Darksky: uses either location or username
  robot.respond /weather( at)? ?(.+)?/i, (msg) ->
    user = userId(robot, msg.match[2], msg)
    location = if user? and robot.brain.data.locations[user]? then robot.brain.data.locations[user].stringLocation else msg.match[2]

    options =
      separator: process.env.HUBOT_DARK_SKY_SEPARATOR
    unless options.separator
      options.separator = "\n"

    googleurl = "http://maps.googleapis.com/maps/api/geocode/json"
    q = sensor: false, address: location
    msg.http(googleurl)
      .query(q)
      .get() (err, res, body) ->
        result = JSON.parse(body)

        if result.results.length > 0
          lat = result.results[0].geometry.location.lat
          lng = result.results[0].geometry.location.lng
          darkSkyMe msg, lat,lng , options.separator, (darkSkyText) ->
            response = "```Weather for #{result.results[0].formatted_address}#{options.separator}#{darkSkyText}```"
              .replace /-?(\d+\.?\d*)°C/g, (match) ->
                centigrade = match.replace /°C/, ''
                match = Math.round(centigrade*10)/10 + '°C/' + Math.round(centigrade * (9/5) + parseInt(32, 10)) + '°F'
            msg.send response
        else
          msg.send "Couldn't find #{location}"

darkSkyMe = (msg, lat, lng, separator, cb) ->
  url = "https://api.forecast.io/forecast/#{process.env.HUBOT_DARK_SKY_API_KEY}/#{lat},#{lng}/?units=si"
  msg.http(url)
    .get() (err, res, body) ->
      result = JSON.parse(body)

      if result.error
        cb "#{result.error}"
        return

      response = "Currently: #{result.currently.summary} #{result.currently.temperature}°C"
      response += "#{separator}Today: #{result.hourly.summary}"
      response += "#{separator}Coming week: #{result.daily.summary}"
      cb response

