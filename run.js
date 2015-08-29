// dependencies
var env = require('node-env-file');
var spawn = require('child_process').spawn;

// set env to see which bot is being deployed
env(__dirname + '/bin/.env');
// then set env by the deployed bot
env(__dirname + '/bin/' + process.env.DEPLOY);

// child processes by spawn
var children = [];

// so that hubot is killed when forever exits.
// Note that you must set --killSignal=SIGTERM
// forever command: 
// forever start --killSignal=SIGTERM -a -l jarvis.log --uid "jarvis" run.js
process.on('SIGTERM', function() {
    children.forEach(function(child) {
        child.kill();
    });
});

// run hubot
var hb = spawn('./bin/hubot', ['-a', process.env.ADAPTER])
children.push(hb);
// for debugging, allows console.log to print to terminal
hb.stdout.on('data', function (data) {
  console.log(data.toString('utf8'));
});

// setTimeout(function() { process.exit(0) }, 3000);


// Legacy code: Deploying bot
// terminal exec task with promise: use as exec.bind(<command>)
// function exec(arg) {
//     var defer = q.defer();
//     cp.exec(arg, function(err, stdout, stderr) {
//         if (err) throw err
//         console.log(stdout);
//         defer.resolve(err)
//     })
//     return defer.promise;
// }

// run bot from here app.js
// exec('./bin/hubot -a '+process.env.ADAPTER);

