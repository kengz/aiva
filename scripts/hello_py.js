// dependencies
// Sample interface script for lib/py/hello.py

// Bot will call this function with the robot argument
module.exports = function(robot) {

  // menu
  robot.respond(/hello_py$/i, function(res) {
    res.send('`hello_py [py]`')
  })

  // call the hello.py methods
  robot.respond(/hello_py\s*(.+)/i, function(res) {
    var str = res.match[1];
    /* istanbul ignore else */
    if (str == 'py') {
      // use the global client to pass to the hello.py client
      // this returns a promise
      global.gPass({
          // must specify at least the following keys
          input: 'Hello from user.',
          to: 'hello.py',
          intent: 'sayHi'
        })
        // this goes through hello.py -> client.js
        // respond to user when client.js resolves the promise
        .then(function(reply) {
          res.send(reply.output)
        }).catch(console.log)
    };
  })

}
