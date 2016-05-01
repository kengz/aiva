// Module that imports all AI components from './ai/'

// // !set tokens for local test
// require(__dirname+'/../../index')('.keys-aiva')

var requireDir = require('require-dir');
var AI = requireDir('./ais');

// console.log(AI)

/**
 * Export object for usage
 */
module.exports = AI;