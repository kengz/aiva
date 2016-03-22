var google = require('googleapis')

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
    console.log('Response:', JSON.stringify(res, null, 2));
  }
}

// console.log(google)

////////////////////
// URL shorterner //
////////////////////

// var urlshortener = google.urlshortener({
//   version: 'v1',
//   auth: auth
// });

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



///////////////////////////////////
// Google Knowledge Graph Search //
///////////////////////////////////
// https://developers.google.com/knowledge-graph/#knowledge_graph_entities

// var kgsearch = google.kgsearch({
//   version: 'v1',
//   auth: auth
// });

// // query can only be target entities, and not NLP query.
// // thus as in all other KBs, still need NLP parsing to extract entities of interest
// var params = { query: 'taylor swift', limit: 3 };
// kgsearch.entities.search(params, logCb);



/////////////////////////////////
// Google search via scraper:  //
/////////////////////////////////

// // https://www.npmjs.com/package/google
// var google = require('google')
// google.resultsPerPage = 25


// // wrap by passing to customMessage command

// var nextCounter = 0

// google('node.js best practices', function(err, res) {
//   if (err) console.error(err)

//   console.log(res.links)
// })



/////////////////////
// Google Geocoder //
/////////////////////

// var geocoder = require('geocoder');

// // Geocoding
// geocoder.geocode("11222 brooklyn", logCb);

// // Reverse Geocoding
// geocoder.reverseGeocode( 33.7489, -84.3789, logCb);

// // Setting sensor to true
// geocoder.reverseGeocode( 33.7489, -84.3789, logCb, { sensor: true });


////////////////////
// Prediction API //
////////////////////
// https://cloud.google.com/prediction/docs/reference/v1.6/hostedmodels/predict#try-it
// pricey af: https://cloud.google.com/prediction/pricing
// can train n sell ur own models
// or can use available models
// backlog for now. Not powerful/cheap/easy enuf to use
// look at alternatives: alchemy, indico, metamind


// AlchemyAPI (really good) 
// get key here: http://www.alchemyapi.com/api/register.html free 1k transactions per day
// demo: http://www.alchemyapi.com/developers/getting-started-guide

// indico (nyeh)
// get key here: https://indico.io/register
// free get 50k calls per month
// docs: https://indico.io/docs

