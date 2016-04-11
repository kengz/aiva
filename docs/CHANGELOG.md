# Changelog and Todo


## AI Roadmap Todo

- unit test gen_nlp, but spare travis from it? spacy is 500mb https://github.com/spacy-io/spaCy/blob/master/.travis.yml
- advance dependency parsing from spaCy or OpenIE http://nlp.stanford.edu/software/openie.html
- generate a list of callable functions from socket.io, otherwise it's all hidden
- better menu format inspired by lita
- unit test io_start?
- fix external dep: data/ models/ none to load when first installed. use npm to distribute models
- start first neural net to simple-classify sentence into intents
- skflow gridsearch hyperparam with spark https://databricks.com/blog/2016/02/08/auto-scaling-scikit-learn-with-spark.html
- Attach KB source to answers
- (delay to last) Google user auth
- KB fallback: 3,2,1, if local fail, fallback to conceptnet, if still fail, fallback to google the most generic
- ConceptNet parse into nodes and edges for query
- ConceptNet getURI prechain to 3 methods
- ConceptNet KB answer simple or existing sample text or graph language
- skflow has rnn https://github.com/tensorflow/skflow/tree/master/examples, seq2seq https://github.com/tensorflow/skflow/blob/5db4eb1bde4fd015f21b950df60ea0061c595563/examples/language_model.py https://github.com/tensorflow/skflow/blob/5db4eb1bde4fd015f21b950df60ea0061c595563/examples/neural_translation.py https://github.com/tensorflow/skflow/blob/9ed1a458ecf7483c2695a076b9776f85014d5a65/examples/neural_translation_word.py
- Ultimate RNN train QnA by seq2seq: https://github.com/farizrahman4u/seq2seq, https://github.com/nicolas-ivanov/tf_seq2seq_chatbot, https://github.com/adamchanson/seq2seq, skdlow has https://github.com/tensorflow/skflow/blob/master/skflow/models.py#L133
- RNN train intent args parsing
- KB 3 canonicalization for node and edge keys
- KB 3 local memory with auto structure and streamlined interface
- KB 3 self inquiry and learning mechanism
- functional hash reinsert function with partial args for inquire if incomplete
- Pretrained RNN model loadning for NPM (any other pretrained model too)
- Advance: online general learning
- ohh hello there https://cloud.google.com/products/machine-learning/, https://cloud.google.com/ml/
- old things: help menu; geocoding, time, weather; reminder, todo, google search, chatbot?

## General Todo

- release the simplest version of AIVA with simpler AI modules (google graph API and conceptnet, imagenet: slack might be able to take picture for bot). Full NLP and KB will take longer to complete.
- warning if forever restarts
- store cron in KB for restoration
- user preference: weather, last food order etc, extensible
- multi-platform tests: test switching out the adapter to Telegram/IRC, centralize brain recognize the same user across different platforms, and you can seamlessly pick up your bot from any platform - this will be the "one bot to rule it all" as you can find it anywhere and it will know this is the same person.
- docs on full feature list, so devs know what they can use
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
- add `lib/js/nlp.js` to export basic NLP tasks based on Princeton WordNet, NodeNatural, wordpos. With basic examples
- make it easy to import .env vars with the index.js exported method
- add IBM Watson ready to use, includes alchemyAPI. (tokens in .keys-<bot>)
- add indico.io ready to use. (tokens in .keys-<bot>)
- add tensorflow and skflow in `bin/install`
- add DNN example: pretrained, saved, loaded example in `py/ai` with `skflow`
- unit test now waits for all clients to join socketio server before starting tests
- travis and unit tests shall cover only systems, and not AI, models etc.
- promisify all ai modules for chaining
- add google kg search with interface
- restore py `Textblob`
- `io_start` enables modularity on the complete polyglot deve environment with socket.io. Also returns promise for chaining
- add google knowledge graph search
- `client.<lang>` flexibly invokes function with dotpath, try with passing `msg` or retry with `msg.input`, then on returned result checks and compiles reply into a JSON with `correctJSON(reply, msg)`
- replace textblob with spaCy - MIT, very advanced and performant. Nest under `py.ai.nlp`. Add translate too.
- finish `gen_nlp.js` as the general nlp to use for parsing all user inputs, for all purposes.