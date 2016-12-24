// dependencies
const _ = require('lomath')
const { CronJob } = require('cron')
const date = require('date.js')
const path = require('path')
const { Cronjob, User } = require(path.join(__dirname, '..', 'db', 'models', 'index'))
const msgEmulator = require(path.join(__dirname, '..', 'src', 'msg-emulator'))

// Create the real job from model job
function createJob(job) {
  let time = new Date(job.pattern)
  // when next phase complete, can just use date(job.pattern)
  let pattern = _.isNaN(time.getTime()) ? job.pattern : time
  new CronJob({
    cronTime: pattern,
    onTick: _.partial(msgEmulator.receive, job.userid, job.command),
    start: true,
  })
}

Cronjob.all().then((jobs) => {
  _.each(jobs, createJob)
  // need to delete overdue
  // need to also create on add below
  // also need to consider the best way to parse command. do 'remind' vs 'emulate'
})

/* istanbul ignore next */
module.exports = (robot) => {
  robot.respond(/cron.*/i, (res) => {
    let adapter = process.env.ADAPTER
    let userid = _.toString(_.get(res.envelope, 'user.id'))
    let text = res.match[0]
    let parsedDate = date(text).toString()
    let job = {
      'adapter': adapter,
      'userid': userid,
      'pattern': parsedDate,
      'command': 'ping'
    }
    Cronjob.create(job)
    createJob(job) // create on add
  })
}
