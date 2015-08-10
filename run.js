// dependencies
// express
var _ = require('lomath');
var q = require('q');
var cp = require('child_process');

var express = require('express');
var app = express();
// express middlewares
var morgan = require('morgan');
var ejs = require('ejs');
var bodyParser = require('body-parser');
var multer = require('multer');

// engine to render HTML
app.engine('.html', ejs.__express);
app.set('view engine', 'html');
// set the port number
app.set('port', process.env.PORT || 8443);

// Mount middlewares defaulted for root: 
// log all HTTP calls for debugging
// app.use(morgan('combined'));
// use resources for html: HTML, JS and CSS etc.
// parse incoming formData into JSON
app.use(bodyParser.json());
app.use(multer());

app.use(express.static(__dirname + '/views'));

// route: concise way to group all HTTP methods for a path
app.route('/')
    .get(function(req, res) {
        // console.log("you GET")
        res.render('index')
    })
    .post(function(req, res) {
        // respond first
        res.json('okay, received\n')
        // robot handle as middleware for POST
    })
    .put(function(req, res) {
        res.send("you just called PUT\n")
    })


// finally, listen to the specific port for any calls
app.listen(app.get('port'), function() {
    console.log('Node app is running on port', app.get('port'));
});


// Deploying bot
// terminal exec task with promise: use as exec.bind(<command>)
function exec(arg) {
    var defer = q.defer();
    cp.exec(arg, function(err, stdout, stderr) {
        if (err) throw err
        console.log(stdout);
        defer.resolve(err)
    })
    return defer.promise;
}

// run bot from here app.js
exec('./bin/hubot -a '+process.env.ADAPTER);
