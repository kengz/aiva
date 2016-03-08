// dependencies
// common setups for tests, run before tests
var env = require('node-env-file');

// set env vars for tests
process.env.NODE_ENV = 'development'

// set env if not already set externally
// .env must exist if setting env vars externally
try {
  env(__dirname + '/../.env', {
    overwrite: false
  });
} catch (e) {
  console.log(e)
  if (process.env.TRAVIS) {
    console.log("Using externally set env vars if exist.")
  } else {
    console.log("Please provide your .env file.")
    console.log("Process exiting with code 1.")
    process.exit(1)
  }
}

// unit test global dependencies
global._ = require('lomath')
global.Promise = require('bluebird');
// suppress the annoying bluebird warnings
Promise.config({
  warnings: false
});
// generator-based yield flow control
global.co = require('co')
try {
  global.Helper = require('hubot-test-helper')
} catch (e) {
  console.log("Need coffee to require hubot Helper")
}
// chai assertation library
global.chai = require('chai')
global.chaiAsPromised = require("chai-as-promised")
chai.use(chaiAsPromised)
global.should = chai.should();
// sinon spy/stub library
global.sinon = require('sinon');

// Promise.delay, with adjusted time factors. for use with yield
global.delayer = function(factor) {
  factor = factor || 1
  var timeout = 100 * factor
  if (process.env.TRAVIS) {
    timeout = 10 * timeout
  }
  // timeout is capped at 16s
  timeout = _.min([timeout, 16000])
  return Promise.delay(timeout)
}

// declare global assets
global.A = require('./asset')
global.KB = require('neo4jkb')({
  NEO4J_AUTH: process.env.NEO4J_AUTH,
  NEO4J_HOST: process.env.NEO4J_HOST,
  NEO4J_PORT: process.env.NEO4J_PORT
})
