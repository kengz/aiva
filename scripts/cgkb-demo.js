// dependencies
const co = require('co')
const _ = require('lomath')
const path = require('path')
const cgkb = require('CGKB')

/* istanbul ignore next */
module.exports = (robot) => {
  robot.respond(/clear\s*kb$/i, (res) => {
    cgkb.kb.clear()
    res.send('CGKB is cleared')
  })

  robot.respond(/nlp\s*demo\s*1$/i, (res) => {
    cgkb.add('Bob brought the pizza to Alice.')
    res.send('Your wish is my command')
  })

  robot.respond(/nlp\s*demo\s*2$/i, (res) => {
    cgkb.add('Book me a flight from New York to London for Sunday')
  })

  robot.respond(/.*/, (res) => {
    var text = res.match[0]
    text = _.trim(_.replace(text, robot.name, ''))
    if (_.includes(text, 'nlp') || _.includes(text, 'clear kb')) {
      return
    } else {
      cgkb.add(text)
        .then(() => {
          res.send('Saved to brain')
        })
    }
    if (_.includes(text, 'flight')) {
      res.send('Your wish is my command')
    }
  })
}
