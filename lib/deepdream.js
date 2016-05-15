// Module for Google Deepdream: currently only for Telegram
// Note: https://github.com/VISIONAI/clouddream must be started, and .env must specify its path

// dependencies
const _ = require('lomath')
const Promise = require('bluebird')
const co = require('co')
const Download = require('download')
const path = require('path')
const pathExists = require('path-exists')
const untildify = require('untildify')
const TelegramBot = require('telegrambot')

// dev client. comment out during deploy
// var client = require('./client.js')

const deepdreamPath = untildify(path.normalize(process.env.CLOUDDREAM_PATH + '/deepdream'))
const deepdreamInPath = deepdreamPath + '/inputs'
const deepdreamOutPath = deepdreamPath + '/outputs'

var telegramAPI = new TelegramBot(process.env.TELEGRAM_TOKEN);
var telegramAPIURL = 'https://api.telegram.org/file/bot' + process.env.TELEGRAM_TOKEN
var telegramGetFile = Promise.promisify(telegramAPI.getFile).bind(telegramAPI)

// detect if message has image, then return the adapter
// uses the JSON structure to detect
function detect_adapter(message) {
  if (_.has(message, 'photo')) {
    return 'telegram'
  } else if (_.get(message, 'attachments[0]type') == 'image') {
    return 'fb'
  };
}

// get image url from telegram res.message for download
function image_url(message) {
  console.log("extracting image url for download")
  var adapter = detect_adapter(message)
  if (adapter == 'telegram') {
    return telegramGetFile(_.last(message.photo))
    .then(function(obj) {
      return telegramAPIURL + '/' + obj['file_path']
    })
  } else if (adapter == 'fb') {
    return Promise.resolve(_.get(message, 'attachments[0]payload.url'))
  } else {
    Promise.reject('no photo')
  }
}

// download a File from url to destination, prepend filename with hash
function downloadFile(url, dest, hash) {
  console.log('downloadFile', url)
  return new Promise(function(resolve, reject) {
    new Download({ mode: '755' })
    .get(url, dest)
    .rename(hash + '_' + url.split('/').pop().replace(/\?.+/,''))
    .run(function(err, files) {
      if (err) { reject(err) };
      var name_path = _.get(files, '[0]history')
      resolve(name_path)
    });
  })
}

// get output filepath from name_path array
function deepdreamOutFilepath(name_path) {
  var inFilepath = name_path.pop()
  return inFilepath.replace('deepdream/inputs/', 'deepdream/outputs/')
}

// wait 10s, then per 2s, for 10 times max, poll the output filename, resolve promise with the filepath
function getOutFilepath(outFilepath) {
  console.log("outFilepath", outFilepath)
  var maxTimes = 5*10
  return co(function*() {
    yield Promise.delay(10 * 1000)
    for (var i = 0; i < maxTimes; i++) {
      console.log('checking file, trial', i)
      yield Promise.delay(6000)
      if (pathExists.sync(outFilepath)) {
        return yield Promise.resolve(outFilepath)
      } else if (i == maxTimes - 1) {
        return yield Promise.reject(new Error('Timeout: deepdream no output in ' + deepdreamOutPath))
      }
    }
  })
}

// Run Deepdream from a res.message (non-Text).
// steps:
// 0. ask user to wait for about 20s
// 1. get url from res.message
// 2. download from url to deepdream/inputs
// 2.1 get filepath name -> subs `/inputs/` to `/outputs/` for output file name.
// 3. wait 10s, then per 1s, for 20 times max, poll the output filename, resolve promise with the filepath
// 4. on resolution, send photo
function runDeepdream(message) {
  if (!pathExists.sync(deepdreamPath)) {
    throw new Error('CLOUDDREAM_PATH is not a valid dir')
  };
  return image_url(message)
  .then(function(image_url) {
    return downloadFile(image_url, deepdreamInPath, message.message_id||message.event.message.mid.split(':').pop())
  })
  .then(deepdreamOutFilepath)
  .then(getOutFilepath)
}


module.exports = runDeepdream
