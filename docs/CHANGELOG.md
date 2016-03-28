# Changelog and Todo


## AI Roadmap Todo

When u put these tools so close together u start to see unpreceedented ways to combine them

- unit test need to wait till socket accepts 3 clients before carrying on
- node v4 cant find cheerio on travis
- socket py interface for dnn
- skflow gridsearch hyperparam with spark https://databricks.com/blog/2016/02/08/auto-scaling-scikit-learn-with-spark.html
- demo of ai working together
- Google brain (KB 1) with knowledge graph n search, wrap
- Attach KB source to answers
- (delay to last) Google user auth
- need basic NLP for basic brain access: entities/concept, or object-verb-subject
- KB fallback: 3,2,1, if local fail, fallback to conceptnet, if still fail, fallback to google the most generic
- ConceptNet parse into nodes and edges for query
- ConceptNet getURI prechain to 3 methods
- ConceptNet KB answer simple or existing sample text or graph language
- Ultimate RNN train QnA by seq2seq: https://github.com/farizrahman4u/seq2seq, https://github.com/nicolas-ivanov/tf_seq2seq_chatbot, https://github.com/adamchanson/seq2seq, skdlow has https://github.com/tensorflow/skflow/blob/master/skflow/models.py#L133
- intent args identifier canonicalization by node NLP wordnet
- RNN train intent args parsing
- KB 3 canonicalization for node and edge keys
- KB 3 local memory with auto structure and streamlined interface
- KB 3 self inquiry and learning mechanism
- functional hash reinsert function with partial args for inquire if incomplete
- developers of any lang just do: tell the needed args JSON keys, since it's also needed for hash storage.
- Pretrained RNN model loadning for NPM (any other pretrained model too)
- Advance: online general learning
- ohh hello there https://cloud.google.com/products/machine-learning/, https://cloud.google.com/ml/
- old things: help menu; geocoding, time, weather; reminder, todo, google search, chatbot?

## General Todo

- fix the `/undefined` file keeps getting generated
- release the simplest version of AIVA with simpler AI modules (google graph API and conceptnet, imagenet: slack might be able to take picture for bot). Full NLP and KB will take longer to complete.
- warning if forever restarts
- store cron in KB for restoration
- user preference: weather, last food order etc, extensible
- multi-platform tests: test switching out the adapter to Telegram/IRC, centralize brain recognize the same user across different platforms, and you can seamlessly pick up your bot from any platform - this will be the "one bot to rule it all" as you can find it anywhere and it will know this is the same person.
- docs on full feature list, so devs know what they can use
- FUCK Google translate wrapper https://github.com/sloria/TextBlob/blob/73679395d528dbed85cd230a9a5683ce4fb758f7/textblob/translate.py
- add back branches:only:master to .travis.yml
- update package.json name, private, url, license


## Changelog

`Jan~March 2016`

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
- Different port to simultaneous use of production and dev/testing. Port 8080 for production, port 9090 for development. Set TEST_PORT in `.env`
- Remove `Textblob`, due to heavy files, bad py encoding
- add `lib/js/nlp.js` to export basic NLP tasks based on Princeton WordNet, NodeNatural, wordpos. With basic examples
- make it easy to import .env vars with the index.js exported method
- add IBM Watson ready to use, includes alchemyAPI. (tokens in .keys-<bot>)
- add indico.io ready to use. (tokens in .keys-<bot>)
- add tensorflow and skflow in `bin/install`
- add DNN example: pretrained, saved, loaded example in `py/ai` with `skflow`