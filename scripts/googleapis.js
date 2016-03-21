var google = require('googleapis')

// List of APIs supported by google api node client: https://developers.google.com/apis-explorer/#p/
// Get key: 
// Create a Google Developer account https://console.developers.google.com/
// Create a project, then generate an API key (server key) https://console.developers.google.com/apis/credentials
// Enable the APIs you wish to use https://console.developers.google.com/apis/enabled
// moreover you may with to set a consent screen and create OAuth credentials for certain APIs that's that reaches into your private information, e.g. gmail API
// (provide the list of APIs needed to be eneabled):
// - Calendar API
// - !Cloud Vision API
// - !CustomSearch API
// - Drive API
// - !Knowledge Graph Search API 
// - !Maps (multiple) APIs
// - Prediction API
// - QPX Express API
// - Translate API
// - !URL shortener
// - YouTube Data API v3
// - Google Voice (separate for android) https://developers.google.com/voice-actions/system/#step_1_define_an_intent_filter


// References
// 
// docs: 
// http://google.github.io/google-api-nodejs-client/3.1.0/index.html
// API explorer
// https://developers.google.com/apis-explorer
// API list
// https://developers.google.com/apis-explorer/#p/
// for 'login required', need oauth: 
// https://github.com/google/google-api-nodejs-client/issues/398
// https://developers.google.com/gmail/api/quickstart/nodejs#step_3_set_up_the_sample
// oauth prob:
// https://github.com/google/google-api-nodejs-client/issues/398


// test code
var env = require('node-env-file');
env(__dirname + '/../bin/.keys-aiva', { overwrite: false });
var auth = process.env.GOOGLE_API_KEY;
var oauth = process.env.GOOGLE_OAUTH_CLIENT;
// console.log(auth)

// helper
function logCb(err, res) {
  if (err) {
    console.log('Encountered error', err);
  } else {
    console.log('Response:', res);
  }
}

var urlshortener = google.urlshortener({
  version: 'v1',
  auth: auth
});

// // get the long url of a shortened url
// var params = { shortUrl: 'http://goo.gl/xKbRu3' };
// urlshortener.url.get(params, logCb);

// Creates a new short URL
// var params = {
//   resource: {
//     longUrl: 'http://google.github.io/google-api-nodejs-client/3.1.0/urlshortener.html'
//   }
// };
// urlshortener.url.insert(params, logCb)

// // this below need to use an oauth2 client
// urlshortener.url.list({}, logCb)


// Google search via scraper: 
// https://www.npmjs.com/package/google
var google = require('google')
google.resultsPerPage = 25


var nextCounter = 0
 
google('node.js best practices', function (err, res){
  if (err) console.error(err)
 
  for (var i = 0; i < res.links.length; ++i) {
    var link = res.links[i];
    console.log(link.title + ' - ' + link.href)
    console.log(link.description + "\n")
  }
 
  if (nextCounter < 4) {
    nextCounter += 1
    if (res.next) res.next()
  }
})