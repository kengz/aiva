// Module of wrapped ConceptNet API methods
// The methods are Promisified for chaining with promises. Use <method>Async for the add promisified methods, 
// e.g. 'cn.lookup' has a promise-based sister 'cn.lookupAsync'
// 
// Documentation: https://github.com/commonsense/conceptnet5/wiki

// dependencies
var Promise = require('bluebird');
var ConceptNet = require('concept-net')
var cn = ConceptNet(null, null, '5.4')

// export functions
cn.lookup = cn.lookup
cn.getURI = cn.getURI
cn.search = cn.search
cn.association = cn.association
Promise.promisifyAll(cn)

/**
 * export conceptnet for usage
 */
module.exports = cn

// refer: https://github.com/commonsense/conceptnet5/wiki
// https://github.com/commonsense/conceptnet5/wiki/API
// algo to convert input to parameter:
// 0. higher level NLP interface for this KB
// 1. determine language
// 2. need uri standardization
// 3. determine parameters, and what graph user looks for: either just concept, or assertations, rel. See URI hierarchy https://github.com/commonsense/conceptnet5/wiki/URI-hierarchy
// 4. output result parser? e.g. compose into NL sentence
// 
// examples

// cn.lookupAsync("/c/ja/自動車", {
//   limit: 2,
//   offset: 0,
//   filter: "core"
// }).then(console.log)

// cn.lookupAsync('/c/en/donut',{
//   filter: 'core'}).then(console.log)

// cn.getURIAsync('ground beef').then(console.log)

// cn.getURIAsync('車', 'ja').then(console.log)

// cn.searchAsync({
//   start: "/c/en/donut"
// }).then(console.log)

// cn.associationAsync("/c/en/cat", {
//   limit: 4,
//   filter: "/c/en/dog"
// }).then(console.log)
