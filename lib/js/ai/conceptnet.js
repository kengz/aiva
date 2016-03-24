var ConceptNet = require('concept-net')
var cn = ConceptNet(null, null, '5.4')

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

// cn.URIstd('en', 'ground beef', function(err, res) {
//   console.log(res)
// })

// cn.URIstd('ja', '車', function(err, res) {
//   console.log(res)
// })

// cn.lookup("/c/ja/自動車", {
//   limit: 2,
//   offset: 0,
//   filter: "core"
// }, function(err, res) {
//   console.log(res)
// })

// cn.lookup('/c/en/donut',{
//   filter: 'core'}, function(err, res) {
//     console.log(res)
//   })

// cn.search({
//   start: "/c/en/donut"
// }, function(err, res) {
//   console.log(res)
// })

// cn.association("/c/en/cat", {
//   limit: 4,
//   filter: "/c/en/dog"
// }, function(err, res) {
//   console.log(res)
// })
