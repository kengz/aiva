// Module to generate Slack attachments for robot.adapter.customMessage

// dependencies
var _ = require('lomath')


// The predefined color palette
var palette = {
  good: 'good',
  warning: 'warning',
  danger: 'danger',
  red: 'danger',
  pink: '#ff4081',
  violet: '#ab47bc',
  purple: '#7e57c2',
  indigo: '#3f51b5',
  blue: '#42a5f5',
  cyan: '#18ffff',
  teal: '#64ffda',
  green: 'good',
  yellow: 'warning',
  orange: '#ffa726',
  brown: '#795548',
  grey: '#546e7a'
}

// quick function to get color from palette
/* istanbul ignore next */
function getColor(str) {
  return _.get(palette, str.toLowerCase())
}

// sample simple attachment
// keys can be missing
var Att = {
  // color can be "good", "warning", "danger", hex #439FE0
  color: "good",
  pretext: "This is a pretext",
  title: "This is a title",
  title_link: "https://api.slack.com/docs/attachments",
  text: "This is the main text in a message attachment, and can contain standard message markup (see details below). The content will automatically collapse if it contains 700+ characters or 5+ linebreaks, and will display a 'Show more...' link to expand the content.",
  fieldMat: [
    // the "short" key defaults to true
    ["Priority", "high"],
    ["Status", "pending"]
  ],
  image_url: "https://slack.global.ssl.fastly.net/ae57/img/slack_api_logo.png",
  thumb_url: "https://slack.global.ssl.fastly.net/ae57/img/slack_api_logo.png"
}

// console.log(gen({ message: { room: 'kengz' } }, Att))


/**
 * Generates the JSON message object for Slack's robot.adapter.customMessage, on taking robot's res and multiple simple objs.
 * @param  {*} res robot's response object.
 * @param  {JSON|Array|*} Att Simplified attachment object(s) or an array of them, or any result to be parsed
 * @param  {Function} Parser (batch) that will be applied to atts, if specified.
 * @return {JSON}     The message object for Slack's robot.adapter.customMessage
 * @example
 * gen(res, gkgseachRes, slackAtt.gkgParser)
 * // => gkgsearchRes as array of Slack attachments
 */
/* istanbul ignore next */
function gen(res, atts, parser) {
  if (parser) {
    // apply parser directly if specified
    atts = parser(atts)
  } else {
    // no parser, ensure atts is an array of attachment JSONs
    if (!_.isArray(atts)) { atts = [atts] };
  }
  return {
    channel: res.message.room,
    attachments: _.map(atts, genAttach)
  }
}

/**
 * Generates the JSON attachment payload for Slack's robot.adapter.customMessage from a simplified JSON attachment object. Refer to https://api.slack.com/docs/attachments for details.
 * @param  {JSON} Att A simplified attachment object
 * @return {JSON}            The attachment object.
 */
/* istanbul ignore next */
function genAttach(Att) {
  // cleanup the fieldmat
  Att["fieldMat"] = cleanFieldMat(Att["fieldMat"])
  // filter out undefined values
  Att = _.pickBy(Att);
  // the 3 keys for each field
  var fieldKeys = ["title", "value", "short"]
  var fields = _.map(Att.fieldMat, function(fieldArr) {
    // for default: short = true
    fieldArr.push(true)
    return _.zipObject(fieldKeys, fieldArr)
  });
  // make null if is empty
  fields = _.isEmpty(fields) ? null : fields;
  // filter out null values
  return _.pickBy({
    "fallback": _.join(_.compact([Att.pretext, Att.title, Att.title_link]), ' - '),
    "color": getColor(Att.color),
    "pretext": Att.pretext,
    "title": Att.title,
    "title_link": Att.title_link,
    "text": Att.text,
    "fields": fields,
    "image_url": Att.image_url,
    "thumb_url": Att.thumb_url
  })
}

/**
 * Helper method to clean the deeper fieldMat: remove rows where row[1] is falsy.
 * @param  {Array} fieldMat The fieldMat of slack attachment
 * @return {Array}          The cleaned matrix.
 */
function cleanFieldMat(fieldMat) {
  cleanMap = _.map(fieldMat, function(row) {
    return row[1] ? row : null
  })
  return _.compact(cleanMap)
}


//////////////////////////////////////////////
// The parsers into Slack attachment format //
//////////////////////////////////////////////


/**
 * Parser for google knowledge graph into slack attachments
 * @param  {JSON} gkgRes Result from google.kgsearch()
 * @return {Array}        Of Slack attachments
 * @example
 * gen(res, gkgseachRes, slackAtt.gkgParser)
 * // => gkgsearchRes as array of Slack attachments
 * 
 */
/* istanbul ignore next */
function gkgParser(gkgRes) {
  var items = (gkgRes.itemListElement || [])
  return _.map(items, _gkgParser)
}
/**
 * Unit parser for google knowledge graph result to slack attachment
 */
/* istanbul ignore next */
function _gkgParser(item) {
  var att = {
    color: "purple",
    pretext: _.get(item, "result.description"),
    title: _.get(item, "result.name"),
    title_link: _.get(item, "result.detailedDescription.url"),
    text: _.get(item, "result.detailedDescription.articleBody"),
    fieldMat: [
      // the "short" key defaults to true
      ["Type", _.join(_.get(item, "result.@type"), ", "), false]
    ],
    thumb_url: _.get(item, "result.image.contentUrl")
  }
  return att
}

/**
 * Parser for google knowledge graph into slack attachments
 * @param  {JSON} gsearchRes Result from google.gsearch()
 * @return {Array}        Of Slack attachments
 * @example
 * gen(res, gseachRes, slackAtt.gsearchParser)
 * // => gsearchRes as array of Slack attachments
 * 
 */
/* istanbul ignore next */
function gsearchParser(gsearchRes) {
  var items = (gsearchRes.links || [])
  return _.map(items, _gsearchParser)
}
/**
 * Unit parser for google knowledge graph result to slack attachment
 */
/* istanbul ignore next */
function _gsearchParser(item) {
  var att = {
    color: "indigo",
    title: _.get(item, "title"),
    title_link: _.get(item, "href"),
    text: _.get(item, "description"),
    fieldMat: [
      // the "short" key defaults to true
      ["url", _.get(item, "link"), false]
    ],
  }
  return att
}

var slackAtt = {
  gen: gen,
  gkgParser: gkgParser,
  gsearchParser: gsearchParser
}

module.exports = slackAtt
