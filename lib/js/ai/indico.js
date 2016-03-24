// dependencies
var indico = require('indico.io');
// Indico https://indico.io/register and retrieve key from https://indico.io/dashboard/

// // !set tokens for local test
// require('../../index')('.keys-aiva')

indico.apiKey =  process.env.INDICO_API_KEY;

/**
 * Export indico for usage
 */
module.exports = indico;


// var response = function(res) { console.log(res); }
// var logError = function(err) { console.log(err); }

// // single example
// indico.sentiment("I love writing code!")
//   .then(response)
//   .catch(logError);

// // batch example
// var batchInput = [
//     "I love writing code!",
//     "Alexander and the Terrible, Horrible, No Good, Very Bad Day"
// ];
// indico.sentiment(batchInput)
//   .then(response)
//   .catch(logError);