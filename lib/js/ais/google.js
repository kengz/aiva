// !Still under work
// Module of wrapped google API methods
// The methods are Promisified for chaining with promises. Use <method>Async for the add promisified methods, 
// e.g. 'urlshortener.url.get' has a promise-based sister 'urlshortener.url.getAsync'

// dependencies
var Promise = require('bluebird')
var Google = require('googleapis');
var _ = require('lomath')
// List of APIs supported by google api node client: https://developers.google.com/apis-explorer/#p/
// Get key: 
// Create a Google Developer account https://console.developers.google.com/
// Create a project, then generate an API key (server key) https://console.developers.google.com/apis/credentials
// Enable the APIs you wish to use https://console.developers.google.com/apis/enabled
// moreover you may with to set a consent screen and create OAuth credentials for certain APIs that's that reaches into your private information, e.g. gmail API
// (provide the list of APIs needed to be eneabled):
// - Calendar API
// - d!Cloud Vision API
// - CustomSearch API
// - Drive API
// - ~!Knowledge Graph Search API 
// - d!Maps (multiple) APIs
// - ~!Maps Geocoding API
// - d!Prediction API
// - d!QPX Express API
// - Translate API
// - ~!URL shortener
// - YouTube Data API v3
// - Google Voice (separate for android) https://developers.google.com/voice-actions/system/#step_1_define_an_intent_filter

// References
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


// // test code
// // !set tokens for local test
// require(__dirname+'/../../../index')('.keys-aiva')

// helper
function logCb(err, res) {
  if (err) {
    console.log('Encountered error', err);
  } else {
    console.log('Response:', JSON.stringify(res, null, 2));
  }
}

var auth = process.env.GOOGLE_API_KEY;
var oauth = process.env.GOOGLE_OAUTH_CLIENT;


////////////////////
// URL shorterner //
////////////////////

var urlshortener = Google.urlshortener({
  version: 'v1',
  auth: auth
});
Promise.promisifyAll(urlshortener.url)
// // get the long url of a shortened url
// var params = { shortUrl: 'http://goo.gl/xKbRu3' };
// urlshortener.url.getAsync(params).then(console.log);

// Creates a new short URL
// var params = {
//   resource: {
//     longUrl: 'http://google.github.io/google-api-nodejs-client/3.1.0/urlshortener.html'
//   }
// };
// urlshortener.url.insertAsync(params).then(console.log)

// // this below need to use an oauth2 client
// urlshortener.url.listAsync({}).then(console.log)



///////////////////////////////////
// Google Knowledge Graph Search //
///////////////////////////////////
// https://developers.google.com/knowledge-graph/#knowledge_graph_entities

var kgsearch = Google.kgsearch({
  version: 'v1',
  auth: auth
});
Promise.promisifyAll(kgsearch.entities)
// // query can only be target entities, and not NLP query.
// // thus as in all other KBs, still need NLP parsing to extract entities of interest
var params = { query: 'taylor swift', limit: 3 };
// kgsearch.entities.searchAsync(params).then(console.log);


////////////////////
// Prediction API //
////////////////////
// https://cloud.google.com/prediction/docs/reference/v1.6/hostedmodels/predict#try-it
// pricey af: https://cloud.google.com/prediction/pricing
// can train n sell ur own models
// or can use available models
// backlog for now. Not powerful/cheap/easy enuf to use
// look at alternatives: alchemy, indico, metamind

// Also google ML is coming soon (very restricted tho)
// https://cloud.google.com/products/machine-learning/
// https://cloud.google.com/ml/



///////////////////////////
// Google oauth per user //
///////////////////////////

// var OAuth2 = Google.auth.OAuth2;

// var oauth2Client = new OAuth2(process.env.GOOGLE_OAUTH_CLIENT_ID, process.env.GOOGLE_OAUTH_CLIENT_SECRET, 'https://github.com/kengz/aiva')
// var scopes = [
//   'https://www.googleapis.com/auth/kgsearch'
// ]
// // Google.options({ auth: oauth2Client });

// var url = oauth2Client.generateAuthUrl({
//   scope: scopes // If you only need one scope you can pass it as string
// });

// console.log(url)


///////////////////////////////
// Non-Google core API below //
///////////////////////////////

/////////////////////////////////
// Google search via scraper:  //
/////////////////////////////////

// https://www.npmjs.com/package/google
var gsearch = require('google')
gsearch.resultsPerPage = 15
gsearchAsync = Promise.promisify(gsearch)

// // wrap by passing to customMessage command
// gsearchAsync('node.js best practices', function(err, res) {
// }).then(function(res) {
//   console.log(res.links)
// })

/////////////////////
// Google Geocoder //
/////////////////////

var geocoder = Promise.promisifyAll(require('geocoder'));

// Geocoding
// geocoder.geocodeAsync("11222 brooklyn").then(console.log);

// // Reverse Geocoding
// geocoder.reverseGeocodeAsync( 33.7489, -84.3789).then(console.log);

// // Setting sensor to true, note since last arg is not callback function, promisify will break
// geocoder.reverseGeocodeAsync( 33.7489, -84.3789, logCb, { sensor: true });


/**
 * List of already usable google APIs
 */
var google = {
  urlshortener: urlshortener,
  kgsearch: kgsearch,
  gsearch: gsearch,
  geocoder: geocoder
}

/**
 * export google for usage
 */
module.exports = google;
