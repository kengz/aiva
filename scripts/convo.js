// dependencies
// Interface script for convo engine

/* istanbul ignore next */
module.exports = (robot) => {
  /* istanbul ignore next */
  robot.respond(/.*/, (res) => {
    if (process.env.CI) {
      return
    }
    let str = res.match[0].replace(`${robot.name} `, '')
    global.client.pass({
        input: str,
        to: 'convo_classifier.py',
        intent: 'classify'
      })
      .then((reply) => {
        let convo = reply.output
        global.log.info(`Convo Score ${convo.score}, Topic: ${convo.topic}`)
        if (convo.topic === 'exception') {
          // TODO can add some counter by user to activate
          return
        }
        res.send(convo.response)
      }).catch(console.log)
  })
}
