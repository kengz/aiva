// Module of wrapped google API methods
// The methods are Promisified for chaining with promises. Use <method>Async for the add promisified methods, 
// e.g. 'watson.alchemy_language.sentiment' has a promise-based sister 'watson.alchemy_language.sentimentAsync'
// 
// Documentation:
// 1. https://github.com/watson-developer-cloud/node-sdk
// 2. Inside the Bluemix console https://console.ng.bluemix.net/home/
// 
// Watson Setup:
// https://github.com/watson-developer-cloud/node-sdk#getting-the-service-credentials

// dependencies
var _ = require('lomath');
var Promise = require('bluebird');
var Watson = require('watson-developer-cloud');

// // !set tokens for local test
// require(__dirname + '/../../../index')('.keys-aiva')


/**
 * Helper to construct watson API object using process.env.<CRED> and additional options.
 * @param  {string} APIname Name of the Watson API.
 * @param  {JSON} options For the API
 * @return {Function}         The authorized, usable Watson API method.
 */
function genWatson(APIname, options) {
  options = options || {};
  try {
    // set the proper creds and complete options JSON
    if (APIname.match(/alchemy/i)) {
      var api_key = process.env.WATSON_ALCHEMY_API_KEY;
      _.assignIn(options, { api_key: api_key })
    } else {
      var tokenName = 'WATSON_' + APIname.toUpperCase() + '_CRED';
      var cred = process.env[tokenName].split(':'),
        username = cred[0],
        password = cred[1];
      /* istanbul ignore next */
      _.assignIn(options, { username: username, password: password })
    }
    res = Watson[APIname](options)
    // hack around inextensible original functions
    const library = Object.create(res);
    Promise.promisifyAll(library);
    return library
    // return Watson[APIname](options)
  } catch (e) {
    // console.log('Failed to generate Watson API without cred for', APIname);
    return null;
  }
}


/**
 * Generate each Watson APIs in the SDK using .keys-<bot>
 */

var alchemy_data_news = genWatson('alchemy_data_news')

var alchemy_language = genWatson('alchemy_language')

var alchemy_vision = genWatson('alchemy_vision')

var concept_insights = genWatson('concept_insights', {
  version: 'v2'
});

var dialog = genWatson('dialog', {
  version: 'v1'
});

var document_conversion = genWatson('document_conversion', {
  version: 'v1',
  version_date: '2015-12-01'
});

var language_translation = genWatson('language_translation', {
  version: 'v2'
});

var natural_language_classifier = genWatson('natural_language_classifier', {
  version: 'v1',
  url: 'https://gateway.watsonplatform.net/natural-language-classifier/api'
});

var personality_insights = genWatson('personality_insights', {
  version: 'v2'
});

var relationship_extraction = genWatson('relationship_extraction', {
  version: 'v1-beta'
});

var retrieve_and_rank = genWatson('retrieve_and_rank', {
  version: 'v1',
  url: 'https://gateway.watsonplatform.net/retrieve-and-rank/api'
});

var speech_to_text = genWatson('speech_to_text', {
  version: 'v1'
});

var text_to_speech = genWatson('text_to_speech', {
  version: 'v1'
});

var tone_analyzer = genWatson('tone_analyzer', {
  version: 'v3-beta',
  version_date: '2016-02-11'
});

var tradeoff_analytics = genWatson('tradeoff_analytics', {
  version: 'v1'
});

var visual_insights = genWatson('visual_insights', {
  version: 'v1-experimental'
});

var visual_recognition = genWatson('visual_recognition', {
  version: 'v2-beta',
  version_date: '2015-12-02'
});


/**
 * List of already usable watson APIs
 */
var watson = {
  alchemy_data_news: alchemy_data_news,
  alchemy_language: Promise.promisifyAll(alchemy_language),
  alchemy_vision: alchemy_vision,
  concept_insights: concept_insights,
  dialog: dialog,
  document_conversion: document_conversion,
  language_translation: language_translation,
  natural_language_classifier: natural_language_classifier,
  personality_insights: personality_insights,
  relationship_extraction: relationship_extraction,
  retrieve_and_rank: retrieve_and_rank,
  speech_to_text: speech_to_text,
  text_to_speech: text_to_speech,
  tone_analyzer: tone_analyzer,
  tradeoff_analytics: tradeoff_analytics,
  visual_insights: visual_insights,
  visual_recognition: visual_recognition,
}

/**
 * export watson for usage
 */
module.exports = watson;


// var params = {
//   text: 'IBM Watson won the Jeopardy television show hosted by Alex Trebek'
// };

// watson.alchemy_language.sentimentAsync(params).then(console.log);
