// Reviver at app.js cuz most deployment services has entry point at app.js
// Alternatively can be run from bash if u have admin control over the server:
// At this root directory
// npm -g forever
// forever start run.js
// forever start -m 5 run.js
// forever list
// forever stopall

var forever = require('forever-monitor');

// // set the env based on who you're deploying
// var env = require('node-env-file');
// // set env to see which bot is being deployed
// env(__dirname + '/bin/.env');
// // then set env by the deployed bot
// env(__dirname + '/bin/'+process.env.DEPLOY);

// quasi-immortality: restart run.js upon death, for max of 100 times
var child = new (forever.Monitor)('run.js', {
    max: 100,
    silent: false,
    args: []
});

child.on('restart', function() {
    console.error('Forever restarting script for ' + child.times + ' time');
});

child.on('exit', function () {
    console.log('run.js has exited after max restarts');
});

child.start();
