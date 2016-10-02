const Promise = require('bluebird')
const _ = require('lomath')
const path = require('path')
const Sequelize = require('sequelize')
const log = require(path.join(__dirname, 'log'))
const dbConfig = require(path.join(__dirname, '..', 'config', 'db.json'))

process.env.NODE_ENV = process.env.NODE_ENV || 'development'
const sqlConfig = _.get(dbConfig, `sql.${process.env.NODE_ENV}`)

// automate:
// 2. database creation
// 3. table creation

const sequelize = new Sequelize(
  sqlConfig['database'],
  sqlConfig['username'],
  sqlConfig['password'], {
    dialect: sqlConfig['adapter'],
    pool: {
      max: sqlConfig['pool']
    },
    logging: false
  })

function createDb() {
  const sysSeq = new Sequelize(
    'sys',
    sqlConfig['username'],
    sqlConfig['password'], {
      dialect: sqlConfig['adapter']
    })
  var nodeEnvs = ['test', 'development', 'production']
  var createDbQueries = _.map(nodeEnvs, (nodeEnv) => {
    return "CREATE DATABASE " + _.get(dbConfig, `sql.${nodeEnv}.database`) + ";"
  })

  Promise.any(
      _.map(createDbQueries, (createDbQuery) => {
        return sysSeq.query(createDbQuery)
      })).then(() => {
      sysSeq.close()
      log.info(`Created the aiva sql databases`)
    })
    .catch(e => { log.error(JSON.stringify(e, null, 2)) })
}

sequelize
  .authenticate()
  .then((e) => {
    log.info('Connected to SQL database successfully');
  })
  .catch((e) => {
    if (_.get(e, 'original.code') == 'ER_BAD_DB_ERROR') {
      createDb()
    }
  })
