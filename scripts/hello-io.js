// dependencies
// Sample interface script for lib/<lang>/hello.<lang>

// Bot will call this function with the robot argument
module.exports = (robot) => {
  // menu
  robot.respond(/hello-io$/i, (res) => {
    res.send('`hello-io [js, py, rb]`')
  })

  // call the hello.py methods
  robot.respond(/hello-io\s*(.+)/i, (res) => {
    let lang = res.match[1]

    // use the global client to pass to the hello.py client
    // this returns a promise
    global.client.pass({
        // must specify at least the following keys
        input: 'Hello from user.',
        to: `hello.${lang}`,
        intent: 'sayHi'
      })
      // this goes through hello.py -> client.js
      // respond to user when client.js resolves the promise
      .then((reply) => {
        res.send(reply.output)
      }).catch(console.log)
  })
}
