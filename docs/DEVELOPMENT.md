# Development Guide

AIVA is created as an A.I. general purpose interface for developers; it has an NLP interface and KB brain out of the box. We take care of the crucial backend and system, so *developers can focus on things that matter*.

You can focus on writing your app/module backend. When done, plugging it into AIVA shall be way more trivial than writing a frontend website. For example, I can write a credit card benefit finder, then plug it in to AIVA by writing a simple interface script.



## AI

#### Docs links
#### Setup
#### Usage
#### Tips: what's good for what, pricing, etc.


## Development

The interface is `js`, and it's pretty easy to write. In fact, once we finish the RNN NLP feature for auto-parsing user sentences we wouldn't even need to write an interface; at least that's the goal.

Development comes down to:

- **module**: low level functions, lives in `/lib/<lang>/<module>.<lang>`
- **interface**: high level user interface to call the module functions, lives in `/scripts/<interface>.js`

It is vital to use the directory structure just stated for SocketIO to automatically handle the polyglot coordination.

You write a module in `<lang>`, how do you call it from the interface? There are 3 cases depending on the number of `<lang>` (including `js` for interface) involved.

#### Case: 1 `<lang>`

`<lang> = js`. If your module is in `js`, just `require` it directly in the interface script.

#### Case: 2 `<lang>`s

e.g. `<lang> = js, py`. 

1. You write a module [`lib/py/hello.py`](./lib/py/hello.py)
2. Call it from the interface [`scripts/hello_py.js`](./scripts/hello_py.js) using the exposed `global.gPass` function, with the `msg`
```js
// /scripts/hello_py.js
{
  input: 'Hello from user.', // input for module function
  to: 'hello.py', // the target module
  intent: 'sayHi' // the module function to call with input
}
```
3. Ensure the called module function returns a reply JSON:
```python
reply = {
  'output': foo(msg.get('input')), # output to interface
  'to': msg.get('from'), # is 'client.js' for interface
  'from': id, # 'hello.py'
  'hash': msg.get('hash') # callback hash for interface
}
```

The JSON fields above are required for their purposes. `global.gPass` used by the interface will auto-inject and `id` for reply, and a `hash` to resolve the promise for the interface.



### Unit Tests

*For the module, you may add any unit testing framework for the language its coded in. This repo does not include unit tests for other languages.*




## Polyglot environment

That being said, this is the guide to plugging in your modules, written in any language, to AIVA. The central piece is `Socket.io`, which exposes a server for generic applications.

We recognize that it's necessary to have a polyglot support for the best design, for example NLP is best done in Python. That's why we make AIVA polyglottic.

Once you've written the module, you only need to do 2 things: import it to AIVA under `lib/<lang>/`, and register an **interface** for calling it.

If you're writing in any language other than `node.js`, you need only take care of 1 extra thing: ensure a client of the language exists. For now we have socket.io client for `python` and `ruby`. Feel free to add more through pull request!

Some of the things best done in other languages:

- **NLP**: `TextBlob` (`python`), `StanfordNLP` (`java`)
- **Deep learning**: `Tensorflow` (`python`), `Torch` (`lua`), `Theano` (`python`), `leaf` (`rust`), `deeplearning4j` (`java`)
- literally any of the projects written in the language you love


## Project structure

AIVA ships fully functional, but it's also for developers to customize.

| Folder/File | Purpose |
|:---|---|
| `bin/` | bot keys, binaries, bash setup scripts. |
| `lib/` | Non-interface modules and scripts, grouped by languages. Contains the core examples for extending the bot. |
| `lib/import_clients.<ext>` | Import all scripts from their folders and integrate with socketIO for cross-language communications. |
| `lib/io_client.js, io_server.js` | SocketIO logic for cross-language communications. |
| `logs` | Logs from bot for debugging and healthcheck |
| `scripts` | The interface modules of the `lib` modules, for bot to interact with users; in `node.js`. |
| `scripts/0_init.js` | Kicks off AIVA setups after the base Hubot is constructed, before other scripts are lodaded. |
| `test` | Unit tests; uses Mocha |
| `.env` | Non-bot-specific environment variables |
| `external-scripts.json` | You can [load Hubot npm modules](https://github.com/github/hubot/blob/master/docs/scripting.md#script-loading) by specifying them here. |
| `package.json` | The "scripts" portion contains commands that you can customize |



## Examples

A good [hubot scripting guide](https://github.com/github/hubot/blob/master/docs/scripting.md). Note you still need simple script to interface between the user and your program in `lib/`, written in any language.

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

