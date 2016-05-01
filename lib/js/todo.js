// Module for todo feature

// dependencies
var _ = require('lomath')
var co = require('co')
var user = require('./user')


// extends foundation:
// - aided creation
// - fast reference and edit
// - fast usage of edges: the whole point of GDB
// - gen constrain imposer and defaulter


///////////////////////////////
// KB creation basic pattern //
///////////////////////////////

// the base prop
var baseProp = {
  name: 'test_task',
  hash: user.hash('bot', 'test_task'),
  priority: 'medium',
  status: 'doing',
  tag: null,
  notes: null,
  due: null
}

/**
 * Generate prop from baseProp given the params.
 * @private
 * @param  {string} name  Of the prop
 * @param  {JSON|string} taker of the prop. Can only be hubot res object or ID or username string.
 * @return {JSON}       prop
 */
function genProp(name, taker) {
  var prop = {
    name: name,
    hash: user.hash(taker, name)
  }
  return _.defaults(prop, baseProp)
}

/**
 * legalize a generated prop.
 * @private
 * @param  {JSON|Array|string} res hubot res object, first user.whois() user result or an ID or name string.
 * @param  {string} name  Of the prop.
 * @param  {string} [taker] Of the prop
 * @return {JSON}       the legalized prop
 */
function legalizeProp(res, name, taker) {
  // restore res to a hubot res object usable by KB.cons.legalize
  res = user.wrapRes(res)
  // if taker not specified, then is self
  taker = taker || res
  var prop = genProp(name, taker)
  return KB.cons.legalize(prop, res)
}

/**
 * Add a todo node to target.
 * @param  {JSON|Array|string} res hubot res object, first user.whois() user result or a string
 * @param  {string} name   Of the todo task
 * @param  {string} [target] name of the target
 * @return {Promise}        Promise from KB after adding.
 *
 * @example
 * // Add tasks and check it.
 * Use co generator to ensure promise executes in sequence
 * co(function*() {
 *   yield add(res, 'task1', 'alice')
 *   yield add(res, 'task2', 'alice')
 *   yield get(res)
 *     .then(KB.flattenIndex)
 *     .then(KB.transBeautify)
 *     .then(console.log)
 * 
 * })
 * // ```
 * // 0. task1
 * // 1. task2
 * // ```
 */
function add(res, name, target) {
  // restore res to a hubot res object usable by KB.cons.legalize
  res = user.wrapRes(res)
  target = target || res
  return user.whois(target)
    .then(user.getId)
    .then(function(uID) {
      var lprop = legalizeProp(res, name, uID);
      // assigner node and edge
      var assigner = [{
        hash: user.getId(res)
      }, 'user']
      var assignEdge = [KB.cons.legalize('assigns', res), 'assigns']

      // todo node
      var todo = [_.pick(lprop, 'hash'), 'todo']

      // taker
      var takeEdge = [KB.cons.legalize('to', res), 'to']
      var taker = [{
        hash: uID
      }, 'user']

      // execution
      return co(function*() {
        yield KB.addNode([lprop, 'todo'])
        return yield KB.addEdge(
          [assigner, assignEdge, todo], [todo, takeEdge, taker]
        )
      }).catch(console.log)
    })
}


/**
 * Get the todo for a user, with the task name, sorted by a specified array of keys.
 * @param  {JSON|Array|string} res hubot res object, first user.whois() user result or a string
 * @param  {string} [name='']   Of the todo task
 * @param  {Array} [keyArr=['name']] Array specifying fields to sort the results by.
 * @return {Promise}        From the KB query.
 *
 * @example
 * // Add tasks and check it.
 * Use co generator to ensure promise executes in sequence
 * co(function*() {
 *   yield add(res, 'task1', 'alice')
 *   yield add(res, 'task2', 'alice')
 *   yield get(res)
 *     .then(KB.flattenIndex)
 *     .then(KB.transBeautify)
 *     .then(console.log)
 * 
 * })
 * // ```
 * // 0. task1
 * // 1. task2
 * // ```
 * 
 */
function get(res, name, keyArr) {
  res = user.wrapRes(res)
  name = _.find(arguments, _.isString) || ''
  keyArr = _.find(arguments, _.isArray) || ['name']

  // todo node
  var todo = ['todo'];
  // take edge
  var takeEdge = ['to'];
  // taker
  var taker = [{
    hash: user.getId(res)
  }, 'user']

  // search string
  var ws = `WHERE a.name =~ "(?i).*${name}.*"`

  return KB.get(todo, takeEdge, taker, ws, 'RETURN a')
    // pick and sort by filter keyArr
    .then(_.partial(KB.transform, _, KB.picker(keyArr)))
    .then(KB.sorter(keyArr))
    .catch(console.log)
    // .then(KB.flattenIndex)
    // .then(KB.transBeautify)
}


/**
 * Mark a todo task done by edge transition [:to]->[:done] and [:assigns]->[:assigned] by supplying its sorted (user-preferred) index. Note that only the owner of the todo node (point by [:to]) can mark it done.
 * @param  {JSON} res   The hubot res object of the user.
 * @param  {integer} [index=last] Of the todo list in the user's preference:sorter. Defaults to the last.
 * @return {Promise}       From the transition KB query.
 *
 * @example
 * markDone(res)
 * // => mark the last todo done and transition the edges of that todo node.
 * 
 * markDone(res, 0)
 * // => mark the first todo done and transition the edges of that todo node.
 *
 * // full example using co for promise flow control
 * co(function*() {
 *   yield add(res, 'task1', 'alice')
 *   yield add(res, 'task2', 'alice')
 *   yield get(res)
 *     .then(KB.flattenIndex)
 *     .then(KB.transBeautify)
 *     .then(console.log)
 *   
 *   yield markDone(res)
 *   yield get(res)
 *     .then(KB.flattenIndex)
 *     .then(KB.transBeautify)
 *     .then(console.log)
 *    
 * })
 * // The added tasks
 * // ```
 * // 0. task1
 * // 1. task2
 * // ```
 *
 * // the remaining after the last is marked done
 * // ```
 * // 0. task1
 * // ```
 * 
 */
function markDone(res, index) {
  return get(res, '', ['name', 'hash'])
    .then(function(mat) {
      // find the index of the todo
      var list = _.flatten(mat)
      var maxIndex = _.size(list) - 1
      index = _.isInteger(parseInt(index)) ? parseInt(index) : maxIndex
      index = _.clamp(index, 0, maxIndex)

      // first query, change (todo)->(user):
      // MATCH (t:test_todo {hash:'ID0000002#task1'})-[e:test_to]->(u:test_user {name:'bob'}) CREATE (t)-[e2:test_meh]->(u) SET e2 = e WITH e DELETE e
      // set the prop of todo node
      var todoPL = [_.pick(list[index], 'hash'), 'todo'];
      // old edge
      var toEPL = ['to']
      var doneEPL = ['done_by'];
      // user PL
      var userPL = [{
        hash: user.getId(res)
      }, 'user']
      var qp1 = transition(todoPL, toEPL, userPL, doneEPL)

      // second query, change (assigner)->(todo)
      // MATCH (t:test_todo {hash:'ID0000002#task1'})<-[e:test_assigns]-(u:test_user) CREATE (t)<-[e2:test_assigned]-(u) SET e2 = e WITH e DELETE e
      // the giver of the todo
      var giverPL = ['user'];
      // transition of edge [:assigns]
      var assignEPL = ['assigns']
      var assignedEPL = ['assigned']
      var qp2 = transition(giverPL, assignEPL, todoPL, assignedEPL)

      return KB.query(qp1, qp2)

    }).catch(console.log)
}


/////////////////////////////////
// Helper: move out to neo4jKB //
/////////////////////////////////
/**
 * Generates a query-param pair for edge transition, i.e. changing label from [e] into [f] while preserving the properties, i.e. (a)-[e]->(b) into (a)-[f]->(b).
 * @param  {Array} a The prop-Label pair for source node a.
 * @param  {Array} e The prop/dist-Label pair for old edge e.
 * @param  {Array} b The prop-Label pair for source node b.
 * @param  {Array} f The new label for the old edge e; the old properties of e are preserved.
 * @return {Array}   The resultant query-param pair for query.
 *
 * // Transition a todo->user edge
 * // the todo node
 * var a = [{
 *   hash: 'task1'
 * }, 'todo'];
 * // the old edge label
 * var e = ['to'];
 * // the target user node
 * var b = [{
 *   hash: 'alice'
 * }, 'user'];
 * // the new edge label to transition into
 * var f = ['done_by'];
 *
 * transition(a, e, b, f)
 * // => [ 'MATCH (a:test_todo  {hash: {prop_a}.hash})-[e:test_to ]->(b:test_user  {hash: {prop_b}.hash}) CREATE (a)-[f:test_done ]->(b) SET e = f WITH e DELETE e', { prop_a: { hash: 'task1' }, prop_b: { hash: 'alice' } } ]
 * 
 */
function transition(a, e, b, f) {
  var query1 = `MATCH (${KB.literalize(a, 'a')})-[${KB.literalize(e, 'e')}]->(${KB.literalize(b, 'b')}) ` +
    `CREATE (a)-[${KB.literalize(f, 'f')}]->(b) SET e = f ` +
    `WITH e DELETE e`
  var param1 = _.pickBy({
    prop_a: _.find(a, _.isPlainObject),
    prop_e: _.find(e, _.isPlainObject),
    prop_b: _.find(b, _.isPlainObject),
    prop_f: _.find(f, _.isPlainObject)
  })
  var qp1 = [query1, param1]
  return qp1
}

// co(function*() {
//   yield add(res, 'task1')
//   yield add(res, 'task2')
//   yield get(res)
//     // .then(KB.flattenIndex)
//     // .then(KB.transBeautify)
//     .then(console.log)

//   yield markDone(res)
//   yield get(res)
//     .then(KB.flattenIndex)
//     .then(KB.transBeautify)
//     .then(console.log)

// })


// ok what bout ordering todo list. Just like most apps, nope. But autosort by priority and topic and name
// default to auto sort
// if want verbose, only do per individual (has name)
// on display default sort, mark priority too


// sort that shit
// do a delete function: cant delete, relabel to edge, identify via numerical number of sorted index (default sort) (ok if sorted otherwise dont provide index? bad interface ugh) need to safe the user's todo-sorter array
// then call it v1 done

module.exports = {
  genProp: genProp,
  legalizeProp: legalizeProp,
  add: add,
  get: get,
  markDone: markDone,
  transition: transition
}
