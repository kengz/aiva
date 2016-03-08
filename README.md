# Peppurr

[![Build Status](https://travis-ci.com/kengz/peppurr.svg?token=c5tCQyTMzysDQ4ah1SXs&branch=master)](https://travis-ci.com/kengz/peppurr) [![Dependency Status](https://gemnasium.com/c54d292372b8917a643ee66ac5723bb3.svg)](https://gemnasium.com/kengz/peppurr)

General-purpose virtual assistant for developers.

| Peppurr is | |
|:---|---|
| general-purpose | An app interface, AI assistant, anything! It's way beyond a chatbot. |
| cross-platform | Slack, Telegram, IRC, Twilio, or any [hubot adapters](https://github.com/github/hubot/blob/master/docs/adapters.md) |
| cross-language | Runs scripts among Node.js, Python3, Ruby, etc. |
| hackable | It extends [Hubot](https://github.com/github/hubot). Add your own modules! |
| powerful, easy to use | Check out [setup](#setup) and [features](#features) |


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
- **setup keys**: update `.env`, `bin/.key-<bot-name>`, replace `peppurr` in `package.json` if you prefer different name

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



## Dev Guide: Project structure

Peppurr ships fully functional, but it's also for developers to customize.

| Folder/File | Purpose |
|:---|---|
| `bin/` | bot keys, binaries, bash setup scripts. |
| `lib/` | Non-interface modules and scripts, grouped by languages. Contains the core examples for extending the bot. |
| `lib/import_clients.<ext>` | Import all scripts from their folders and integrate with socketIO for cross-language communications. |
| `lib/io_client.js, io_server.js` | SocketIO logic for cross-language communications. |
| `logs` | Logs from bot for debugging and healthcheck |
| `scripts` | The interface modules of the `lib` modules, for bot to interact with users; in `node.js`. |
| `scripts/0_init.js` | Kicks off peppurr setups after the base Hubot is constructed, before other scripts are lodaded. |
| `test` | Unit tests; uses Mocha |
| `.env` | Non-bot-specific environment variables |
| `external-scripts.json` | You can [load Hubot npm modules](https://github.com/github/hubot/blob/master/docs/scripting.md#script-loading) by specifying them here. |
| `package.json` | The "scripts" portion contains commands that you can customize |



## Dev Guide: Examples

#### Case 1: standalone js script

1. Write the module under `lib/js`: [`lib/js/user.js`](./lib/js/user.js)
2. Write the `js` interface script under `scripts`, import the module to use: [`scripts/whois.js`](./scripts/whois.js)
3. Write the unit tests for both the module and the interface scripts: [`test/lib/test_user.coffee`](./test/lib/test_user.coffee), [`test/scripts/test_whois.coffee`](./test/scripts/test_whois.coffee)

Refer to [hubot scripting guide](https://github.com/github/hubot/blob/master/docs/scripting.md) for writing `js` interface scripts.


#### Case 2: standalone <lang> script

You can code in any language, and Socket IO will handle the logic.

1. Write the module under `lib/<lang>`: [`lib/py/hello.py`](./lib/py/hello.py)
2. Write the `js` interface script: [`scripts/hello_py.js`](./scripts/hello_py.js)
3. Write the unit tests for both the module and the interface scripts: [`test/scripts/test_hello_py.coffee`](./test/scripts/test_hello_py.coffee)

*For the module, you may add any unit testing framework for the language its coded in. This repo does not include unit tests for other languages.*


#### Case 3: multi-language scripts

You can code and pass msgs among any languages, and Socket IO will handle the logic. This uses the global client's `global.gPass` to directly send a payload to the server from the interface script.

1. Write the modules under `lib/<lang>`: [`lib/py/hello_rb.py`](./lib/py/hello_rb.py), [`lib/rb/Hello.rb`](./lib/rb/Hello.rb)
2. Write the `js` interface script: [`scripts/hello_py_rb.js`](./scripts/hello_py_rb.js)
3. Write the unit tests for both the module and the interface scripts: [`test/scripts/test_hello_py_rb.coffee`](./test/scripts/test_hello_py_rb.coffee)


#### Case 4: wrapped multi-language scripts

You can code and pass msgs among any languages, and Socket IO will handle the logic. This uses the global client's `global.gPass` from within the `lib` module script to yield a simpler interface script.

1. Write the modules under `lib/<lang>`: [`lib/py/hello_rb.py`](./lib/py/hello_rb.py), [`lib/rb/Hello.rb`](./lib/rb/Hello.rb)
2. Write the `js` interface script: [`scripts/hello_py_rb.js`](./scripts/hello_py_rb.js)
3. Write the unit tests for both the module and the interface scripts: [`test/scripts/test_hello_py_rb.coffee`](./test/scripts/test_hello_py_rb.coffee)


#### Sample `msg` and the required JSON keys for different purposes

>Overall, you need only to ensure your scripts/module functions return the correct JSON `msg`, and we handle the rest for you.

- to call a module's function in `<lang>`: [`scripts/hello_py.js`](./scripts/hello_py.js)
```js
{
  input: 'Hello from user.',
  to: 'hello.py',
  intent: 'sayHi'
}
```

- to reply the payload to sender: [`lib/py/hello.py`](./lib/py/hello.py)
```py
{
  'output': 'Hello from Python.',
  'to': msg.get('from'), # the original sender 'client.js'
  'from': id, # 'hello.py'
  'hash': msg.get('hash'), # the js Promise hash
}
```

- to pass on payload to other module's function: [`lib/py/hello_rb.py`](./lib/py/hello_rb.py)
```py
{
  'input': 'Hello from Python.',
  'to': 'Hello.rb',
  'intent': 'sayHi',
  'from': msg.get('from'), # the original sender 'client.js'
  'hash': msg.get('hash'), # the js Promise hash
}
```



## Dev Guide: Socket.io logic (handled by us)

#### Server
There is a socket.io server that extends Hubot's Express.js server: [`lib/io_server.js`](./lib/io_server.js). All `msg`s go through it. For example, let `msg.to = 'hello.py', msg.intent = 'sayHi'`. The server splits this into `module = 'hello', lang = 'py'`, modifies `msg.to = module`, then sends the `msg` to the client of `lang`.


#### Clients
For each language, there is a socket.io client that imports all modules of its language within `lib`. When server sends a `msg` to it, the client's `handle` will find the module and its function using `msg.to, msg.intent` respectively, then call the function with `msg` as the argument. If it gets a valid reply `msg`, it will pass it on to the server.

>Note due to how a module is called using `msg.to, msg.intent`, you must ensure that the functions are named properly, and `Ruby`'s requirement that module be capitalized implies that you have to name the file with the same capitalization, e.g. `lib/rb/Hello.rb` for the `Hello` module.

>To add support for other language, say `Java`, you can add a `lib/client.java` by following patterns in `lib/client.{py, rb}`, and adding the `commands` in `lib/io_client.js`*


#### Entry point
The entry point is always a `js` interface script, but luckily we have made it trivial for non-js developers to write it. A full reference is [hubot scripting guide](https://github.com/github/hubot/blob/master/docs/scripting.md).

`robot.respond` takes a regex and a callback function, which executes when the regex matches the string the robot receives. `res.send` is the primary method we use to send a string to the user.

Overall, there are 2 ways to connect with `lib` modules:

**global.gPass**: [`scripts/hello_py.js`](./scripts/hello_py.js) This is a global method to pass a `msg`. It generates a `hash` using `lib/hasher.js` with a `Promise`, which is resolved whenever the `js` client receives a valid reply `msg` with same `hash`. This method returns the resolved `Promise` with that `msg` for chaining.

**wrapped global.gPass**: [`scripts/translate.js`](./scripts/translate.js), [`lib/js/nlp.js`](./lib/js/nlp.js) This is similar to above, but the `msg` is properly generated by a `js` lib module, resulting in a much cleaner and safer interface script. The lib module needs to be imported at the top to be used.


#### Data flow

The msg goes through socket.io as `js(interface script) -> js(io_server.js) -> <lang>(client.<lang>) -> js(io_server.js) -> ...(can bound among different <lang> modules) -> js(client.js) -> js(interface script)`

For the `hello_py.js` example, the path is `js(scripts/hello_py.js) user input -> js(lib/io_server.js) -> py(client.py), call py function -> js(io_server.js) -> js(client.js) call Promise.resolve -> js(interface script) send back to user`



## Le Petite Search Engine



## Todo
- enumerate new systems and theorems
- import datejs with NLP time parser
- better slack custom message wrapper, able to specify color
- IBM watson faster for NLP intent map: https://github.com/watson-developer-cloud/conversational-agent-application-starter-kit#about-the-conversational-agent-pattern
- prevent port conflict while running npm test when a bot is up
- time: cron, chrono-node, moment(formatter), chronic (rb), Sugar (too heavy), laterjs, matthewmueller's date.js, natty(MIT)
- ok here's the plan
- generic KB creator: bot learns to create label n KB by learning
- step1: NLP parse into entities, e.g. (actor)-[action]->(subject), with extra entities like time, author and KB basic standard shits.
- step2: Canonicalization: ML mapper into, e.g. maps `{links, link, refers, refs} => ref` using word2vec n metric
- setp3: KB creation using shit laid out in sample todo.js
- creation may seem trivial, but proper creation with the right built in data will help unleash the graph power when querying.
- then you'll have a generic ML-built KB, don't have to write a builder for each type of knowledge.
- need natural language parse, sentiment preferably. raise from regex fallback
- Tensorflow: everything! Local ML, NLP as advanced feature; basic feature has regex as fallbacks
- chrono and time format conversion method
- test: what time is it
- remind: cron and chrono/date
- store cron in KB for restoration
- alice id in mocha hubot-test-helper. No workaround except from the lib.
- linking interface. Linkage is the true power of GKB and must make it trivial to use
- user preference: weather, last food order etc, extensible
- design le search engine using the KB standard and helper methods
- KB contextual search: guess context from search input, e.g. name or email or task, then apply search to labels or properties or conns
- checkout algolia and elastic for search engine. oohh add machine learning n ranking n shits
- suspend buffer when err is thrown, offer fixes; 
- credit card benefit shits
- test switching out the adapter to Telegram/IRC
- debugger mode
- multi-platform tests: centralize brain recognize the same user across different platforms, and you can seamlessly pick up your bot from any platform - this will be the "one bot to rule it all" as you can find it anywhere and it will know this is the same person.
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

We'd love for you to contribute and make Peppurr even better for all developers. We're mainly interested in something generic and foundational, e.g. adding client for a new language, improving the NLP, adding a useful module, adding more adapters like Telegram or Whatsapp.
