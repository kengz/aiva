var google = require('googleapis')
var auth = process.env.GOOGLE_TOKEN
// List of APIs supported by google api node client: https://developers.google.com/apis-explorer/#p/
// Get key: 
// Create a Google Developer account https://console.developers.google.com/
// Create a project, then generate an API key (browser key) https://console.developers.google.com/apis/credentials
// Enable the APIs you wish to use https://console.developers.google.com/apis/enabled
// (provide the list of APIs needed to be eneabled):
// - URL shortener
// - Google Search
// - Knowledge Graph Search API 
// - YouTube Data API v3

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