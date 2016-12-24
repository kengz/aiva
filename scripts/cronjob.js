// dependencies
const { CronJob } = require('cron')
const date = require('date.js')
const _ = require('lomath')
const { Cronjob } = require('../db/models/index')
const msgEmulator = require('../src/msg-emulator')

// Create the real job from model job
function createJob(job) {
  const time = new Date(job.pattern)

  // when next phase complete, can just use date(job.pattern)
  const pattern = _.isNaN(time.getTime()) ? job.pattern : time
  return new CronJob({
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
    const adapter = process.env.ADAPTER
    const userid = _.toString(_.get(res.envelope, 'user.id'))
    const text = res.match[0]
    const parsedDate = date(text).toString()
    const job = {
      adapter,
      userid,
      pattern: parsedDate,
      command: 'ping',
    }
    Cronjob.create(job)
    createJob(job) // create on add
  })
}
