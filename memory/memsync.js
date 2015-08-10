////////////////////////////////
// class to sync bot's memory //
////////////////////////////////
// Memory upload/download shall be called from within a method class,
// .e.g for Track, it shall has its own upload/download by require(memsync.js)
// This is so that the class can directly control the processes.

// dependencies
var _ = require('lomath');
var q = require('q');
var fs = require('fs');
var scraper = require('reqscraper');
var req = scraper.req;


// variables
var rootdir = __dirname + '/../';
var GHTOKEN = process.env.HUBOT_GHTOKEN;
var REPOPATH = process.env.HUBOT_REPOPATH;


// Github API methods

/**
 * Github API HTTP req option for getting a file at path.
 * @category memsync
 * @param  {string} path Path of the file from the root in repo, e.g. 'memory/track.json'.
 * @return {string} response From Github API.
 */
function optGet(path) {
    return {
        method: 'GET',
        baseUrl: 'https://api.github.com',
        url: 'repos/' + REPOPATH + 'contents/' + path,
        headers: {
            'User-Agent': 'Jarvis',
            'Authorization': 'token ' + GHTOKEN
        }
    }
}

// update file
/**
 * Github API HTTP req option for updating a file at path.
 * @category memsync
 * @param  {string} path Path of the file from the root in repo, e.g. 'memory/track.json'.
 * @param  {JSON} memory The bot memory to upload.
 * @param  {string} sha The SHA tag of the file to update.
 * @return {string} response From Github API
 */
function optUpdate(path, memory, SHA) {
    return {
        method: 'PUT',
        baseUrl: 'https://api.github.com',
        url: 'repos/' + REPOPATH + 'contents/' + path,
        headers: {
            'User-Agent': 'Jarvis',
            'Authorization': 'token ' + GHTOKEN
        },
        body: {
            message: 'Bot uploading memory',
            content: new Buffer(JSON.stringify(memory)).toString('base64'),
            sha: SHA
        },
        json: true
    }
}

/**
 * Get the SHA tag from Github API response.
 * @param  {string} res HTTP response.
 * @return {string} sha The SHA tag.
 */
function getSHA(res) {
    if (typeof res == 'string') res = JSON.parse(res);
    return res['sha'];
}

/**
 * Upload file at path to Github repo.
 * @public
 * @category memsync
 * @param  {string} path Path of the file from the root locally and in repo, e.g. 'memory/track.json'.
 * @param  {JSON} [memObj] If specified, the memory object to use instead of the local file, e.g. 'this.memory in Track'.
 * @return {Promise} promise After calling the Github API.
 */
function upload(path, memObj) {
    var memory = memObj == undefined ?
        require(rootdir + path) :
        memObj;
    fs.writeFile(rootdir + path, JSON.stringify(memory));
    return req(optGet(path))
        .then(getSHA)
        .then(optUpdate.bind(null, path, memory))
        .then(req)
}

/**
 * Download file at path from Github repo and write to local.
 * @public
 * @category memsync
 * @param  {string} path Path of the file from the root locally and in repo, e.g. 'memory/track.json'.
 * @return {Promise} promise After writing to file.
 */
function download(path) {
    return req(optGet(path))
        .then(function(res) {
            var defer = q.defer();
            var b = new Buffer(JSON.parse(res).content, 'base64');
            var j = b.toString();
            fs.writeFile(rootdir + path, j, function() {
                defer.resolve(JSON.parse(j))
            });
            return defer.promise;
        })
}

// upload('memory/track.json').then(console.log)
// download('memory/track.json').then(console.log)

// exporting
module.exports = {
    upload: upload,
    download: download
}
