var google = require('googleapis')
var auth = process.env.GOOGLE_TOKEN
// List of APIs supported by google api node client: https://developers.google.com/apis-explorer/#p/
// Get key: 
// Create a Google Developer account https://console.developers.google.com/
// Create a project, then generate an API key (server key) https://console.developers.google.com/apis/credentials
// Enable the APIs you wish to use https://console.developers.google.com/apis/enabled
// (provide the list of APIs needed to be eneabled):
// - Calendar API
// - !Cloud Vision API
// - !CustomSearch API
// - Drive API
// - !Knowledge Graph Search API 
// - !Maps (multiple) APIs
// - Prediction API
// - Translate API
// - !URL shortener
// - YouTube Data API v3
// - Google Voice (separate for android) https://developers.google.com/voice-actions/system/#step_1_define_an_intent_filter
// Ref docs: http://google.github.io/google-api-nodejs-client/3.1.0/index.html

var urlshortener = google.urlshortener({
  version: 'v1',
  auth: auth
});

var params = { shortUrl: 'http://goo.gl/xKbRu3' };

// get the long url of a shortened url
urlshortener.url.get(params, function (err, response) {
  if (err) {
    console.log('Encountered error', err);
  } else {
    console.log('Long url is', response.longUrl);
  }
});