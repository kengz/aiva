// Module that imports all AI components from './ai/'

// // !set tokens for local test
// require(__dirname+'/../../index')('.keys-aiva')

var requireDir = require('require-dir');
var AI = requireDir('./ai');

console.log(AI)
console.log('loading complete')

/**
 * Export object for usage
 */
module.exports = AI;