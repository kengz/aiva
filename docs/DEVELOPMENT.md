# Development Guide

AIVA is created as an A.I. general purpose interface for developers; it has an (pending) ~~NLP interface and KB brain out of the box~~. We take care of the crucial backend and system, so *developers can focus on things that matter*.

You can focus on writing your app/module backend. When done, plugging it into AIVA shall be way more trivial than writing a whole app with a MEAN stack or Rails.


## Polyglot Environment

Unite we stand. Each language has its strengths, for example Python for machine learning, Node.js for web. AIVA allows to let them work together using `Socket.io`. You can write in any language and add its `Socket.io` client if it doesn't already exist.

For now we have `/lib/client.{js, py, rb}`. Feel free to add more through pull request!


**To run socket.io** during development, import and run `lib/io_start` in a js script (e.g. your interface). This will start the server polyglot clients, and initialize all the modules in `/lib/<lang>/`. When done, it returns a promise for chaining.

This modularity of socket.io allows for **quick dev**, i.e. run a js script for full polyglot environment while developing a small feature. e.g.
```js
var ioStart = require('../io_start')
ioStart().then(function() {
  // run when io is done initializing and when all clients have joined
  global.gPass({
    input: 'Hello from user.',
    to: 'hello.py',
    intent: 'sayHi'
  })
  .then(function(reply) {
    console.log(reply.output)
  }).catch(console.log)
})
```


## <a name="polyglot-dev"></a>Polyglot Development

The interface is `js`, and it's pretty easy to write. In fact, once we finish the RNN NLP feature for auto-parsing user sentences we wouldn't even need to write an interface; at least that's the goal.

Development comes down to:

- **module**: callable low level functions, lives in `/lib/<lang>/<module>.<lang>`.
- **interface**: high level user interface to call the module functions, lives in `/scripts/<interface>.js`

It is vital to follow the directory structure to expose them to the socket.io; deeper nested modules will not be callable via socket.io.

You write a module in `<lang>`, how do you call it from the interface? There are 3 cases depending on the number of `<lang>` (including `js` for interface) involved.

#### Case: 1 `<lang>`

`<lang> = js`. If your module is in `js`, just `require` it directly in the interface script.

Since the AIVA is based on hubot, here's a interface reference: [hubot scripting guide](https://github.com/github/hubot/blob/master/docs/scripting.md). You can also [load hubot scripts](https://github.com/github/hubot/blob/master/docs/scripting.md#script-loading) written by others.

#### Case: 2 `<lang>`s

e.g. `<lang> = js, py`. 

1. You write a module [`lib/py/hello.py`](./lib/py/hello.py)
2. Call it from the interface [`scripts/hello_py.js`](./scripts/hello_py.js) using the exposed `global.gPass` function, with the JSON `msg`
```js
// scripts/hello_py.js
{
  input: 'Hello from user.', // input for module function
  to: 'hello.py', // the target module
  intent: 'sayHi' // the module function to call with input
  // add more as needed
}
```
3. Ensure the called module function returns a reply JSON to the interface:
```python
# lib/py/hello.py
reply = {
  'output': foo(msg.get('input')), # output to interface
  'to': msg.get('from'), # is 'client.js' for interface
  'from': id, # 'hello.py'
  'hash': msg.get('hash') # callback hash for interface
}
```

The JSON fields above are required for their purposes. `global.gPass` used by the interface will auto-inject and `id` for reply, and a `hash` to resolve the promise for the interface.


#### Case: 3 `<lang>`s

e.g. `<lang> = js, py, rb`

1. You write modules in `py, rb` [`lib/py/hello_rb.py`](./lib/py/hello_rb.py), [`lib/rb/Hello.rb`](./lib/rb/Hello.rb)
2. Call one (`py` in this example) from the interface [`scripts/hello_py_rb.js`](./scripts/hello_py_rb.js) as described earlier.
3. [`lib/py/hello_rb.py`](./lib/py/hello_rb.py) passes it further to the `rb` module, by returning the JSON `msg`
```python
lib/py/hello_rb.py
reply = {
  'input': 'Hello from Python from js.', # input for rb module function
  'to': 'Hello.rb', # the target module
  'intent': 'sayHi', # the module function to call with input
  'from': msg.get('from'), # pass on 'client.js'
  'hash': msg.get('hash'), # pass on callback hash for interface
}
```
4. [`lib/rb/Hello.rb`](./lib/rb/Hello.rb) ensure the final module function returns a reply JSON `msg` to the interface. *Note for auto-id, Ruby filename need to be the same as its module name, case-sensitive.*
```rb
# lib/rb/Hello.rb
reply = {
  'output' => 'Hello from Ruby.', # output to interface
  'to' => msg['from'], # 'client.js'
  'from' => @@id, # 'Hello.rb'
  'hash' => msg['hash'] # callback hash for interface
}
```

>Overall, you need only to ensure your scripts/module functions return the correct JSON `msg`, and we handle the rest for you.

With such pattern, you can chain multiple function calls that bounce among different `<lang>`. Example use case: retrieve data from Ruby on Rails app, pass to Java to run algorithms, then to Python for data analysis, then back to Node.js interface.


#### "Ma look! No hand(ler)s!"

"Do I really have to add a handler to reply a JSON `msg` for **every** function I call?". That's really cumbersome. 

To streamline polyglot development further we've made the `client.<lang>`'s automatically try to compile a proper reply JSON `msg`, using the original `msg` it receives for invoking a function.

What this means is you can call a **module** by its name, and its **function** by specifying the dotpath (if it's nested), then providing a valid `input` format (single argument for now). 

On receiving a `msg`, the `client.<lang>` tries to call the function by passing `msg`. If that throws an exception, it retries by passing `msg.input`. After the function executes and returns the result, `client.<lang>`'s handler will check if the reply is a valid JSON, and if not, will make it into one via `correctJSON(reply, msg)` by extracting the information needed from the received `msg`.


## Unit Tests

This repo includes only unit tests for `js` **modules** and **interface** scripts using `mocha`, and runs with `npm test`. Note that tests should be for systems, thus the tests for AI models are excluded.

For the module of other `<lang>`, you may add any unit testing framework of your choice.


## What to use for what

Some of the best/recommended libraries for things:

- **NLP**: StanfordNLP (java), TextBlob(py), Natural(js), Watson, Indico.io, Wordnet
- **Machine learning**: scikit-learn(py), pandas(py), skflow(py), Google APIs
- **Deep learning**: Tensorflow(py), Skflow(py), Torch(lua), Theano(py), leaf(rust) , deeplearning4j(java)
- **Knowledge/concept base**: ConceptNet, Wordnet, Google graph
- Whatever you do best in your favorite languages


## Project structure

What goes where:

| Folder/File | Purpose |
|:---|---|
| `bin/` | bot keys, binaries, bash setup scripts. |
| `lib/<lang>/` | Module scripts, grouped by language, callable via socket.io. See [Polyglot Development](#polyglot-dev). |
| `lib/import_clients.<ext>` | Import all scripts from `lib/<lang>/` and expose them to socket.io for cross-language communication. |
| `lib/io_start.js` | socket.io server and client logic for cross-language communication. |
| `logs` | Logs from bot for debugging and healthcheck. |
| `scripts` | The `node.js` user interface for the `lib/` modules. |
| `scripts/_init.js` | Kicks off AIVA setups after the base Hubot is constructed, before other scripts are lodaded. |
| `test` | Unit tests; uses Mocha. |
| `.env` | Non-bot-specific environment variables. |
| `external-scripts.json` | You can [load Hubot npm modules](https://github.com/github/hubot/blob/master/docs/scripting.md#script-loading) by specifying them in here and `package.json`. | Specifies project dependencies and command shortcuts with npm. |


## How it works: Socket.io logic and standard

#### Sample JSON and the required keys for different purposes.

>Overall, you need only to ensure your scripts/module functions return the correct JSON `msg`, and we handle the rest for you.

- to call a module's function in `<lang>`: [`scripts/hello_py.js`](./scripts/hello_py.js)
```js
// scripts/hello_py.js
{
  input: 'Hello from user.', // input for module function
  to: 'hello.py', // the target module
  intent: 'sayHi' // the module function to call with input
  // add more as needed
}
```

- to reply the payload to sender: [`lib/py/hello.py`](./lib/py/hello.py)
```python
# lib/py/hello.py
reply = {
  'output': foo(msg.get('input')), # output to interface
  'to': msg.get('from'), # is 'client.js' for interface
  'from': id, # 'hello.py'
  'hash': msg.get('hash') # callback hash for interface
}
```

- to pass on payload to other module's function: [`lib/py/hello_rb.py`](./lib/py/hello_rb.py)
```python
lib/py/hello_rb.py
reply = {
  'input': 'Hello from Python from js.', # input for rb module function
  'to': 'Hello.rb', # the target module
  'intent': 'sayHi', # the module function to call with input
  'from': msg.get('from'), # pass on 'client.js'
  'hash': msg.get('hash'), # pass on callback hash for interface
}
```

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


