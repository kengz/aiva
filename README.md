# AIVA [![Build Status](https://travis-ci.org/kengz/jarvis.svg?branch=aiva-v3)](https://travis-ci.org/kengz/jarvis) [![Dependency Status](https://gemnasium.com/kengz/jarvis.svg)](https://gemnasium.com/kengz/jarvis)

**AIVA** (A.I. Virtual Assistant): General-purpose virtual assistant for developers. 

| AIVA is | |
|:---|---|
| general-purpose | An app interface, AI assistant, anything! It's way beyond a chatbot. |
| cross-platform | Slack, Telegram, IRC, Twilio, or any [hubot adapters](https://github.com/github/hubot/blob/master/docs/adapters.md) |
| cross-language | Runs scripts among Node.js, Python3, Ruby, etc. |
| hackable | It extends [Hubot](https://github.com/github/hubot). Add your own modules! |
| powerful, easy to use | Check out [setup](#setup) and [features](#features) |

AIVA is based on a theoretical interface [HTMI](./docs/HTMI.md) and a brain [CGKB](./docs/CGKB.md) that is *human-bounded Turing complete*. The theorem establishes that HTMI can be used by a human to solve any problems or perform any functions she enumerates that are solvable by a Turing Machine. Complete implementation is still underway.


## <a name="features"></a>Features



## Installation

Clone this repo:

```shell
git clone <the_git_url>
```

Use **Ubuntu >14.04** or **MacOSX**; For the fastest VM setup, I recommend [Digital Ocean](https://www.digitalocean.com), and you can use this [setup script](https://github.com/kengz/mac_setup). Otherwise, check [`bin/install`](./bin/install) for system dependencies.


## Setup, Run

#### <a name="setup"></a>One-time Setup
- **install dependencies**: `npm run gi`
- **setup keys**: update `.env`, `bin/.key-<bot-name>`, replace `aiva` in `package.json` if you prefer different name

Check [**Setup Helps**](#setup-helps) for tips.

#### <a name="run"></a>Run
- **run**: `npm start`; append `--bot=<bot-name>` to run the non-default bots.
```shell
# alternative commands
npm stop # stop all running bots
npm run debug # outputs log to terminal
npm run debug --bot=<bot-name> # to dev
npm run shell # use shell-adapter to dev
npm test # run unit tests
```


## Development Guide

AIVA ships completely usable right out of the box - you can use it as a simple virtual assistant. It's also designed as an interface for developers, so refer to [DEVELOPMENT.md](./DEVELOPMENT.md) for development guide.


## Design

Design of AIVA can be found at [DESIGN.md](./DESIGN.md).


## Todo
- outsource docs, leave README to the bare essential needed to get AIVA up and running
- release the simplest version of AIVA with simpler AI modules (google graph API and conceptnet, imagenet: slack might be able to take picture for bot). Full NLP and KB will take longer to complete.
- warning if forever restarts
- store cron in KB for restoration
- user preference: weather, last food order etc, extensible
- KB contextual search: guess context from search input, e.g. name or email or task, then apply search to labels or properties or conns
- multi-platform tests: test switching out the adapter to Telegram/IRC, centralize brain recognize the same user across different platforms, and you can seamlessly pick up your bot from any platform - this will be the "one bot to rule it all" as you can find it anywhere and it will know this is the same person.
- add back branches:only:master to .travis.yml
- update package.json name, private, url, license


## Changelog
*[This is a Mark III version of Keng's bot.]*

`Jan 2016`

- save logs locally in `logs/`.
- start brain `neo4j` server on spawn, stop on death.
- expandable bash script `bin/install` as auto global dependency setup for both MacOSX and Linux.
- add `mocha` using `chai`, `chai-as-promised`, `sinon` libraries for tests; coverage by `istanbul`.
- using `hubot-test-helper` for unit tests. Tests should be written in `coffeescript` for brevity.
- all devs and tests shall be done locally via the `shell` adapter, using `npm run shell`. This sets the `.env` and `bin/.keys-<default_bot>` local env vars, starts the `neo4j` brain server, then launches `bin/hubot`. i.e. It should work the same as `npm start` except for `forever` and `Slack-adapter`. See [Setup](#setup).
- `npm` script runs all. See [Run](#run).
- modularize graph KB externally to [kengz/neo4jKB](https://github.com/kengz/neo4jKB)
- add Travis CI (private)
- `scripts/0_init.js` is the first loaded script (lexicographically)l used to setup and extend hubot. It emits `'ready'` when the bot is done setting up, and before all other scripts start loading. One can make good use of event emitters for global, cross-script coordination.
- add user serializer for `defaultRoom` (in `env`), 'general' to reserialize on new user joining.
- support `NODE_ENV=development` for dev and tests: `shell` sets from `npm run shell`; Mocha sets from `test/common.js`.
- add `test/0_init_test.js` to do global test setup.
- basic infrastructure tested: initialization, event emission and handling, messaging
- unify all env vars safely to under `.env` and `bin/.keys-<bot-name>`, with auto customization for Shell, Mocha, Travis and production.
- dev must ensure that `scripts/0_init.js` is called first, thus `lib/` scripts cannot be imported at `0_init.js`.
- for KB creation pattern making use of graph relation, refer to `scripts/todo.js`
- add `lib/user.js` for user-searching. `scripts/serialize_users.js` will set `global.users = robot.brain.data.users` for global access of users.
- `bin/install` now installs `neo4j-shell-tools` for db migration. Use `export-graphml -o backup.graphml -t -r` and `import-graphml -i backup.graphml -t` from within `neo4j-shell`. Files will be saved to `${NEO4J_HOME}`.
- add `Socket.io` plugging into `robot.server` for polyglot communication. Connect to it by e.g. `var socket = require('socket.io-client')('http://localhost:8080')`
- add `python3` automated setup and packaging processes.
- multiple language (polyglot) process control: add `socket.io` clients for `nodejs, python3, ruby` in `lib`, with proper import/file examples and structures.
- in `mocha` tests, there's a `global.room` as an entire emulated hubot for use.
- add `bin/vagrant_travis` script to emulate a Travis CI VM for CI debugging.
- standard: `<comment-symbol> !` to note future implementation or fixes
- add `global.io.{reply, send, say}` for hubot replies from io. Use as `io.send(res)`; see `scripts/translate.js` for example.
- unify clients: one for each language.
- Different port to simultaneous use of production and dev/testing. Port 8080 for production, port 9090 for development. Set TEST_PORT in .env

## Dev

A good [hubot scripting guide](https://github.com/github/hubot/blob/master/docs/scripting.md). Note you still need simple script to interface between the user and your program in `lib/`, written in any language.


##### You can send customMessage msg to Slack

```
robot.adapter.customMessage({
  channel: res.message.room,
  text: "Latest changes",
  attachments: [{
    "fallback": "Required plain-text summary of the attachment.",
    "color": "#36a64f",
    "pretext": "Optional text that appears above the attachment block",
    "author_name": "Bobby Tables",
    "author_link": "http://flickr.com/bobby/",
    "author_icon": "http://flickr.com/icons/bobby.jpg",
    "title": "Slack API Documentation",
    "title_link": "https://api.slack.com/",
    "text": "Optional text that appears within the attachment",
    "fields": [{
      "title": "Priority",
      "value": "High",
      "short": false
    }],

    "image_url": "http://my-website.com/path/to/image.jpg",
    "thumb_url": "http://example.com/path/to/thumb.png"
  }]
})
```


##### Reference for `res` object cuz hubot lib is dipshit
```JSON
{
	"message": {
		"user": {
			"id": "alice",
			"room": "Shell",
			"name": "alice"
		},
		"text": "@hubot myid",
		"done": false,
		"room": "Shell"
	},
	"match": [
	"@hubot myid"
	],
	"envelope": {
		"room": "Shell",
		"user": {
			"id": "alice",
			"room": "Shell",
			"name": "alice"
		},
		"message": {
			"user": {
				"id": "alice",
				"room": "Shell",
				"name": "alice"
			},
			"text": "@hubot myid",
			"done": false,
			"room": "Shell"
		}
	}
}
```

try to print envelope
useful shits for robot.
- listen
- hear
- respond
- enter
- leave
- topic
- error
- catchAll(the other)
- send (user, strings...)
- reply
- messageRoom
- on
- emit
- shutdown




## Features


## Dependencies
The complete list of dependencies:


## <a name="setup-helps"></a>Setup Helps

#### Neo4j
If it's your first installation of `Neo4j`, change the password:
```shell
neo4j start
# change your password
curl -H "Content-Type: application/json" -X POST -d '{"password":"YOUR_NEW_PASSWORD"}' -u neo4j:neo4j http://localhost:7474/user/neo4j/password
# access Neo4j browser GUI
open http://localhost:7474
```

#### SSH Browser-forwarding

If you're hosting Neo4j on a remote machine and want to access its browser GUI on your local machine, connect to it via 

```
ssh -L 8080:localhost:7474 <remote_host>
```

Then you can go to `http://localhost:8080/` on your local browser.



## Contributing

We'd love for you to contribute and make AIVA even better for all developers. We're mainly interested in something generic and foundational, e.g. adding client for a new language, improving the NLP, adding a useful module, adding more adapters like Telegram or Whatsapp.
