const _ = require('lodash')
const Promise = require('bluebird')
const Download = require('download')
const path = require('path')
const pathExists = require('path-exists')
const untildify = require('untildify')
const co = require('co')

var client = require('../lib/client.js')

const deepdreamPath = untildify(path.normalize(process.env.CLOUDDREAM_PATH + '/deepdream'))
if (!pathExists.sync(deepdreamPath)) throw new Error('CLOUDDREAM_PATH is not a valid dir')
  const deepdreamInPath = deepdreamPath + '/inputs'
const deepdreamOutPath = deepdreamPath + '/outputs'


var message = {
  message_id: 216,
  photo: 
  [ { file_id: 'AgADAQADlKoxG4bPLgUEjh8GSkYg_EWe0i8ABL3IL5XU4MGjLF4BAAEC',
  file_size: 1080,
  file_path: 'photo/file_0.jpg',
  width: 90,
  height: 54 },
  { file_id: 'AgADAQADlKoxG4bPLgUEjh8GSkYg_EWe0i8ABFyV54EytlKaLV4BAAEC',
  file_size: 18819,
  width: 320,
  height: 192 },
  { file_id: 'AgADAQADlKoxG4bPLgUEjh8GSkYg_EWe0i8ABBF5HveFrLVjK14BAAEC',
  file_size: 52347,
  width: 800,
  height: 480 } ]
}

// get image url from telegram res.message for download
function image_url_telegram(message) {
  if (_.has(message, 'photo')) {
    var file_path = _.get(message, 'photo[0]file_path')
    return file_path ? 'https://api.telegram.org/file/bot'+process.env.TELEGRAM_TOKEN+'/'+file_path : undefined
  };
}
// console.log(image_url_telegram(message))

// download a File from url to destination, prepend filename with hash
function downloadFile(url, dest, hash) {
  console.log('downloadFile')
  return new Promise(function(resolve, reject) {
    new Download({mode: '755'})
    .get(url, dest)
    .rename(hash+'_'+url.split('/').pop())
    .run(function(err, files) {
      if (err) { reject(err) };
      var name_path = _.get(files, '[0]history')
      resolve(name_path)
    });
  })
}

function deepdreamOutFilepath(name_path) {
  var inFilepath = name_path.pop()
  return inFilepath.replace('deepdream/inputs/', 'deepdream/outputs/')
}

// wait 10s, then per 2s, for 10 times max, poll the output filename, resolve promise with the filepath
function checkFile(outFilepath) {
  // console.log('checkFile')
  return co(function*() {
    yield Promise.delay(10*1000)
    for (var i = 0; i < 10; i++) {
      console.log('checking file, trial', i)
      yield Promise.delay(2000)
      if (pathExists.sync(outFilepath)) {
        return yield Promise.resolve(outFilepath)
      } else if (i == 10-1) {
        yield Promise.reject(new Error('Timeout: deepdream no output in '+deepdreamOutPath))
      }
    }
  })
}

// checkFile('a path it is')
// .then(console.log)
// .catch(console.log)

// waitUntil checkCondition, ->
//   # This callback will run when `checkCondition` returns a true-ish value

// steps:
// 0. ask user to wait for about 20s
// 1. get url from res.message
// 2. download from url to deepdream/inputs
// 2.1 get filepath name -> subs `/inputs/` to `/outputs/` for output file name.
// 3. wait 10s, then per 1s, for 20 times max, poll the output filename, resolve promise with the filepath
// 4. on resolution, send photo

var dogeLink = image_url_telegram(message)
// downloadFile(dogeLink, '../lib/assets', message.message_id)
// .then(deepdreamOutFilepath) // array
// .then(console.log) // array
// .then(function(res) {
//   // console.log(process.env.TELEGRAM_TOKEN)
// })

function compose(message) {
  var image_url = image_url_telegram(message)
  return downloadFile(image_url, deepdreamInPath, message.message_id)
  .then(deepdreamOutFilepath)
  .then(checkFile)
}

compose(message)
.catch(console.log)

// e.g. code for Telegram
// robot.emit('telegram:invoke', 'sendPhoto', { chat_id: res.message.room, photo: fs.createReadStream(__dirname + '/image.png') }, function (error, response) {
//   console.log(error);
//   console.log(response);
// });


// deep dream need stronger acid
// ok so once started, deepdream is automatic
// thus need to just poll the output directory for matching filename: timeout for 10s then once per sec
// prepend filename of image with message.message_id
// 



// // ok do telegram first
// // global.gPass = client.gPass

// // global.gPass({
// //   input: "hola amigos",
// //   to: 'ai.py',
// //   intent: 'nlp.translate'
// // }).then(console.log)

// // hello friends


// var imgur = require('imgur')

// imgur.setClientId(process.env.IMGUR_ID);

// console.log(imgur.getClientId())

// A single image 
// imgur.uploadFile('../lib/assets/doge.jpg')
// .then(function (json) {
//   console.log(json.data.link);
// })
// .catch(function (err) {
//   console.error(err.message);
// });

// var dogePic = 'wiSk6R8';
// imgur.getInfo(dogePic)
// .then(function(json) {
//   console.log(json);
// })
// .catch(function (err) {
//   console.error(err.message);
// });

// var dogeLink = 'http://i.imgur.com/wiSk6R8.jpg'
