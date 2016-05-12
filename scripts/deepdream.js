// var imgur = require('imgur')

var client = require('../lib/client.js')

// imgur.setClientId(process.env.IMGUR_ID);

// console.log(imgur.getClientId())

// var path = require('path')
// // A single image 
// // imgur.uploadFile('../lib/assets/doge.jpg')
// // .then(function (json) {
// //   console.log(json.data.link);
// // })
// // .catch(function (err) {
// //   console.error(err.message);
// // });

// // var dogePic = 'wiSk6R8';
// // imgur.getInfo(dogePic)
// // .then(function(json) {
// //   console.log(json);
// // })
// // .catch(function (err) {
// //   console.error(err.message);
// // });

// var dogeLink = 'http://i.imgur.com/wiSk6R8.jpg'

var _ = require('lodash')
var Promise = require('bluebird')
var Download = require('download');

var message = {
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

function image_url_telegram(message) {
  if (_.has(message, 'photo')) {
    var file_path = _.get(message, 'photo[0]file_path')
    return file_path ? 'https://api.telegram.org/file/bot'+process.env.TELEGRAM_TOKEN+'/'+file_path : undefined
  };
}
console.log(image_url_telegram(message))

function downloadFile(url, dest) {
  return new Promise(function(resolve, reject) {
    new Download({mode: '755'})
    .get(url, dest)
    .run(function(err, files) {
      if (err) { reject(err) };
      var name_path = _.get(files, '[0]history')
      resolve(name_path)
    });
  })
}

// just make dest = deepdream/inputs
// make sure it exists of course
// then poll outputs/ for filename, if exists resolve promise with its path, upload image to user
// var dogeLink = image_url_telegram(message)
// downloadFile(dogeLink, '../lib/assets')
// .then(console.log)
// .then(function(res) {
//   // console.log(process.env.TELEGRAM_TOKEN)
// })

const pathExists = require('path-exists');
const untildify = require('untildify');

pathExists(untildify('~/Desktop/doge.jpg')).then(exists => {
  console.log(exists);
  //=> true 
});

// ok so once started, deepdream is automatic
// thus need to just poll the output directory for matching filename
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
