// Module that imports all AI components from './ai/'

var requireDir = require('require-dir');
var AI = requireDir('./ai');

/**
 * Export object for usage
 */
module.exports = AI;