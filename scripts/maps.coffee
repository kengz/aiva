# Description:
#   Interacts with the Google Maps API.
#
# Commands:
#   hubot [driving|transit|biking|walking] directions from <origin|user> to <target|user> - Returns Google maps with directions
#   hubot map <me|user|location> - Returns a map of where you|user|location is at
#   
# Author:
#   kengz
  
tinyurl = require 'tinyurl'
_ = require 'lomath'
q = require 'q'
userId = require(__dirname+'/helper.coffee').userId

shortenUrl = (link) ->
  defer = q.defer()
  esc = link.replace(/\\/g, '\\\\').replace(/\{/g, '\{').replace(/\}/g, '\\\}').replace(/\[/g, '\\\]').replace(/\]/g, '\\\]')
  # esc = _.escapeRegExp(link).replace(/\\\//g, '//').replace(/\\\./g, '.')
  tinyurl.shorten esc, defer.resolve
  return defer.promise

sendlink = (url, msg) ->
  return shortenUrl(url)
  .then (link) ->
    msg.send link
    return link

module.exports = (robot) ->

  robot.respond /((driving|walking|bike|biking|bicycling|transit) )?directions from (.+) to (.+)/i, (msg) ->
    mode        = msg.match[2] || 'driving'
    origin      = msg.match[3]
    if robot.brain.data.locations[userId(robot, origin, msg)]?
      origin = robot.brain.data.locations[userId(robot, origin, msg)].stringLocation
    destination = msg.match[4]
    if robot.brain.data.locations[userId(robot, destination, msg)]?
      destination = robot.brain.data.locations[userId(robot, destination, msg)].stringLocation
    key         = process.env.HUBOT_GOOGLE_API_KEY

    if origin == destination
      return msg.send "Now you're just being silly."

    if !key
      msg.send "Please enter your Google API key in the environment variable HUBOT_GOOGLE_API_KEY."
    if mode == 'bike' or mode == 'biking'
      mode = 'bicycling'

    url         = "https://maps.googleapis.com/maps/api/directions/json"
    query       =
      mode:        mode
      key:         key
      origin:      origin
      destination: destination
      sensor:      false

    robot.http(url).query(query).get()((err, res, body) ->
      jsonBody = JSON.parse(body)
      route = jsonBody.routes[0]
      if !route
        msg.send "Error: No route found."
        return
      legs = route.legs[0]
      start = legs.start_address
      end = legs.end_address
      distance = legs.distance.text
      duration = legs.duration.text
      response = "Directions from #{start} to #{end}\n"
      response += "#{distance} - #{duration}\n\n"
      i = 1
      for step in legs.steps
        instructions = step.html_instructions.replace(/<div[^>]+>/g, ' - ')
        instructions = instructions.replace(/<[^>]+>/g, '')
        response += "#{i}. #{instructions} (#{step.distance.text})\n"
        i++

      # sendlink("http://maps.googleapis.com/maps/api/staticmap?size=400x400&" +
               # "path=weight:3%7Ccolor:red%7Cenc:#{route.overview_polyline.points}&sensor=false", msg)
      msg.send "http://maps.googleapis.com/maps/api/staticmap?size=400x400&" +
               "path=weight:3%7Ccolor:red%7Cenc:#{route.overview_polyline.points}&sensor=false"
      msg.send response
    )

  robot.respond /(?:(satellite|terrain|hybrid)[- ])?map (.+)/i, (msg) ->
    mapType  = msg.match[1] or "roadmap"
    # try to see if input is a recognized user
    user = msg.match[2]

    if robot.brain.data.locations[userId(robot, user, msg)]?
      user = robot.brain.data.locations[userId(robot, user, msg)].stringLocation
    
    location = encodeURIComponent(user)
    mapUrl   = "http://maps.google.com/maps/api/staticmap?markers=" +
                location +
                "&size=400x400&maptype=" +
                mapType +
                "&sensor=false" +
                "&format=png" # So campfire knows it's an image
    url      = "http://maps.google.com/maps?q=" +
               location +
              "&hl=en&sll=37.0625,-95.677068&sspn=73.579623,100.371094&vpsrc=0&hnear=" +
              location +
              "&t=m&z=11"

    sendlink(mapUrl, msg)
    sendlink(url, msg)

