// dependencies
var _ = require('lomath')
var q = require('q')
var Twitter = require('twitter')
var indico = require('indico.io')

// init
// Be sure to set your API key 
indico.apiKey = process.env.INDICO_API_KEY;

var client = new Twitter({
    consumer_key: process.env.HUBOT_TWITTER_CONSUMER_KEY,
    consumer_secret: process.env.HUBOT_TWITTER_CONSUMER_SECRET,
    access_token_key: process.env.HUBOT_TWITTER_ACCESS_TOKEN,
    access_token_secret: process.env.HUBOT_TWITTER_ACCESS_TOKEN_SECRET
});

// custom poll from a single status
function poll(status) {
    return status.text
}
// parse the tweets object returned from API
function parse(tweets) {
    statuses = tweets.statuses
    res = _.uniq(_.map(statuses, poll))
    return res
}

// the query method for tweet, default to 10 counts
// returns array of text results
// qtweet(term)
// qtweet(count, term)
function qtwitter(count, term) {
    if (term == undefined) {
        term = count
        count = 10
    }
    var defer = q.defer()
    client.get('search/tweets', {
        q: term,
        count: count
    }, function(error, tweets, response) {
        defer.resolve(parse(tweets))
    })
    return defer.promise
}

// qtwitter('TI5').then(console.log)


// get the batchSentiment from Indico,
// input = array of strings
// return array of numbers, 0 = bad, 1 = good
function qindico(input) {
    if (!_.isArray(input))
        input = [input]

    var defer = q.defer()
    indico
        .batchSentiment(input)
        .then(function(res) {
            defer.resolve({
                'input': input,
                'output': res
            })
        })

    return defer.promise
}


// format the object pair {input, output}
// where input = array of input strings, output = array from indico sentiments
// all numbers rounded to 3dp
function format(pair) {
    var body = '\*Indico Sentiment Analysis\*'
    // output individual resultso only if count < 10
    if (pair.input.length < 10) {
        _.each(pair.input, function(row, i) {
            body += '\n\n' + row + '\n\`' + pair.output[i] + '\`'
        })
    } else {
        for (var i = 0; i < 3; i++) {
            body += '\n\n' + pair.input[i] + '\n\`' + pair.output[i] + '\`'
        }
        body += '\n\n_...auto-hide large individual output_'
    }
    // append the mean
    var mean = _.mean(pair.output)
    body += '\n\n\*Sentiment mean\*: \`' + mean + '\`'
    return body
}

// sentiment analysis wrapper: chain qtwitter, qindico, format
// return promise of body string
function qsentiment(count, term) {
    return qtwitter(count, term)
        .then(qindico)
        .then(format)
}

// qsentiment(undefined, 'node.js')
// .then(console.log)

module.exports = qsentiment
