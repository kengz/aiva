// Module to generate msg JSON for robot.adapter.customMessage

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
var simpleAtt = {
  pretext: "This is a pretext",
  // color can be "good", "warning", "danger", hex #439FE0
  color: "good",
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

// console.log(gen({ message: { room: 'kengz' } }, simpleAtt))


/**
 * Generates the JSON message object for Slack's robot.adapter.customMessage, on taking robot's res and multiple simple objs.
 * @param  {*} res robot's response object.
 * @param  {JSON...} simpleAtt... (Multiple) simplified attachment object(s)
 * @return {JSON}     The message object for Slack's robot.adapter.customMessage
 */
/* istanbul ignore next */
function gen(res, simpleAtt, moreSimpleAtt) {
  return {
    channel: res.message.room,
    attachments: _.map(_.tail(arguments), genAttach)
  }
}

/**
 * Generates the JSON attachment payload for Slack's robot.adapter.customMessage from a simplified JSON attachment object. Refer to https://api.slack.com/docs/attachments for details.
 * @param  {JSON} simpleAtt A simplified attachment object
 * @return {JSON}            The attachment object.
 */
/* istanbul ignore next */
function genAttach(simpleAtt) {
  // filter out undefined values
  simpleAtt = _.pickBy(simpleAtt);
  // the 3 keys for each field
  var fieldKeys = ["title", "value", "short"]
  var fields = _.map(simpleAtt.fieldMat, function(fieldArr) {
    // for default: short = true
    fieldArr.push(true)
    return _.zipObject(fieldKeys, fieldArr)
  });
  // make null if is empty
  fields = _.isEmpty(fields) ? null : fields;
  // filter out null values
  return _.pickBy({
    "fallback": _.join(_.compact([simpleAtt.pretext, simpleAtt.title, simpleAtt.title_link]), ' - '),
    "pretext": simpleAtt.pretext,
    "color": getColor(simpleAtt.color),
    "title": simpleAtt.title,
    "title_link": simpleAtt.title_link,
    "text": simpleAtt.text,
    "fields": fields,
    "image_url": simpleAtt.image_url,
    "thumb_url": simpleAtt.thumb_url
  })
}


module.exports = gen
