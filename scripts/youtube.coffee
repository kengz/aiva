# Description
#   A hubot script for searching YouTube with the YouTube Data API v3.
#   Based off the original hubot-youtube script.
#
# Configuration:
#   HUBOT_GOOGLE_API - Your Google API key with access enabled for YouTube Data
#                      API v3
#
# Commands:
#   hubot youtube <query> - Searches Google YouTube and returns link
#
# Notes:
#   Make sure you don't go over your daily quota for API usage.
#
# Author:
#   sprngr

module.exports = (robot) ->

  unless process.env.HUBOT_GOOGLE_API_KEY?
    robot.logger.warning "The HUBOT_GOOGLE_API environment variable not set"
    return

  ytApiKey = process.env.HUBOT_GOOGLE_API_KEY

  robot.respond /(?:youtube|yt)(?: me)?\s(.*)/i, (msg) ->
    query = msg.match[1]
    ytSearchUrl = "https://www.googleapis.com/youtube/v3/search"
    searchParams = {
      order: "relevance"
      part: "snippet",
      maxResults: 1,
      type: "video",
      key: ytApiKey,
      q: query
    }

    robot.http(ytSearchUrl)
      .query(searchParams)
      .get() (err, res, body) ->
        videos = JSON.parse(body).items

        if videos == undefined || videos.length == 0
          msg. send "No video results for \"#{query}\""
          return

        videoId = videos[0].id.videoId
        msg.send "http://www.youtube.com/watch?v=#{videoId}"