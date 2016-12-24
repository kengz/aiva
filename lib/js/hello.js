const path = require('path')
const ioid = path.basename(__filename)

function foo(input) {
  return 'Hello from Nodejs.'
}

function sayHi(msg) {
  reply = {
    output: foo(msg.input),
    to: msg.from,
    from: ioid,
    hash: msg.hash,
  }
  return reply
}

module.exports = {
  sayHi,
}
