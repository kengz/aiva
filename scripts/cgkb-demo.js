// dependencies
const _ = require('lomath')
const path = require('path')
const { kb, nlp } = require(path.join(__dirname, '..', '..', 'CGKB'))

var nodeROOT = {
  word: "ROOT",
  POS_fine: "ROOT"
}

function graphifyParseTree(parseTree, nodeFrom = nodeROOT, graph = []) {
  nodeFrom['name'] = nodeFrom['word']
  nodeFrom['label'] = nodeFrom['POS_coarse'] == 'PUNCT' ? 'PUNCT' : nodeFrom['POS_fine']
  _.each(parseTree, (nodeTo) => {
    // take out modifiers
    var modifiers = _.get(nodeTo, 'modifiers')
    _.unset(nodeTo, 'modifiers')
    nodeTo['name'] = nodeTo['word']
    nodeTo['label'] = nodeTo['POS_coarse'] == 'PUNCT' ? 'PUNCT' : nodeTo['POS_fine']
    edge = { label: nodeTo['arc'] }
    graph.push([nodeFrom, nodeTo, edge])
    graphifyParseTree(modifiers, nodeTo, graph)
  })
  return graph
}

function buildSyntaxGraph(text) {
  return kb.clearDb()
  .then(() => {
    nlp.parse(text)
    .then((output) => {
      parseTree = output[0].parse_tree
      graph = graphifyParseTree(parseTree, nodeROOT)
      var qp = kb.addGraph(graph)
      return kb.db.cypherAsync(qp)
      .then(console.log)
    })
  })
}

module.exports = (robot) => {
  robot.respond(/nlp\s*demo\s*1$/i, (res) => {
    buildSyntaxGraph('Bob brought the pizza to Alice.')
    res.send('Your wish is my command')
  })

  robot.respond(/nlp\s*demo\s*2$/i, (res) => {
    buildSyntaxGraph('Book me a flight from New York to London for Sunday')
  })

  robot.respond(/.*/, (res) => {
    var text = res.match[0]
    if (_.includes(text, 'nlp')) {
      return
    } else {
      buildSyntaxGraph(text)
      .then(() => {
        res.send('Saved to brain')
      })
    }
    if (_.includes(text, 'flight')) {
      res.send('Your wish is my command')
    }
  })
}
