// dependencies
// Sample interface script for lib/py/hello_rb.py

// Bot will call this function with the robot argument
module.exports = function(robot) {

  // menu
  robot.respond(/hello_py_rb$/i, function(res) {
    res.send('`hello_py_rb {rb}`')
  })

  // call the hello_rb.py methods
  robot.respond(/hello_py_rb\s*(.+)/i, function(res) {
    var str = res.match[1];
    /* istanbul ignore else */
    if (str == 'rb') {
      // use the global client to pass to the hello.py client
      // this returns a promise
      global.gPass({
          // must specify at least the following keys
          input: 'Hello from user.',
          to: 'hello_rb.py',
          intent: 'passToOtherClient'
        })
        // this goes through hello_rb.py -> Hello.rb -> client.js
        // respond to user when client.js resolves the promise
        .then(function(reply) {
          res.send(reply.output)
        }).catch(console.log)
    };
  })

}
