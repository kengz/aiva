const Promise = require('bluebird')
const { exec } = require('child_process')
const _ = require('lomath')
const path = require('path')
const Sequelize = require('sequelize')
const log = require(path.join(__dirname, 'log'))
const dbConfig = require(path.join(__dirname, '..', 'config', 'db.json'))

process.env.NODE_ENV = process.env.NODE_ENV || 'development'
const sqlConfig = _.get(dbConfig, `${process.env.NODE_ENV}`)

const sequelize = new Sequelize(
  sqlConfig.database,
  sqlConfig.username,
  sqlConfig.password,
  sqlConfig)

function createDb() {
  const sysSeq = new Sequelize(
    'sys',
    sqlConfig.username,
    sqlConfig.password,
    sqlConfig)
  var nodeEnvs = ['test', 'development', 'production']
  var createDbQueries = _.map(nodeEnvs, (nodeEnv) => {
    return "CREATE DATABASE " + _.get(dbConfig, `${nodeEnv}.database`) + ";"
  })

  return Promise.any(
      _.map(createDbQueries, (createDbQuery) => {
        return sysSeq.query(createDbQuery)
      })).then(() => {
      sysSeq.close()
      log.info(`Created the aiva sql databases`)
    })
    .catch(e => { log.error(JSON.stringify(e, null, 2)) })
}

function authDb() {
  return sequelize
    .authenticate()
    .then((e) => {
      log.info('Authenticated SQL database successfully');
      sequelize.close().finally()
    })
    .catch((e) => {
      if (_.get(e, 'original.code') == 'ER_BAD_DB_ERROR') {
        createDb().then(() => { sequelize.close().finally() })
      }
    })
}

function migrateDb() {
  return new Promise((resolve, reject) => {
    exec(`./node_modules/.bin/sequelize db:migrate --env ${process.env.NODE_ENV}`, (err, stdout, stderr) => {
      if (err) {
        log.error(stderr.toString())
        reject(err)
      }
      log.debug(stdout.toString())
      resolve()
    })
  })
}

authDb()

module.exports = {
  authDb: authDb,
  migrateDb: migrateDb
}
