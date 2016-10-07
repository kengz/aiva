# AIVA [![GitHub version](https://badge.fury.io/gh/kengz%2Faiva.svg)](http://badge.fury.io/gh/kengz%2Faiva) [![Build Status](https://travis-ci.org/kengz/aiva.svg?branch=master)](https://travis-ci.org/kengz/aiva) [![Code Climate](https://codeclimate.com/github/kengz/aiva/badges/gpa.svg)](https://codeclimate.com/github/kengz/aiva) [![Test Coverage](https://codeclimate.com/github/kengz/aiva/badges/coverage.svg)](https://codeclimate.com/github/kengz/aiva/coverage) [![Dependency Status](https://gemnasium.com/kengz/aiva.svg)](https://gemnasium.com/kengz/aiva) [![MIT licensed](https://img.shields.io/badge/license-MIT-blue.svg)](https://raw.githubusercontent.com/hyperium/hyper/master/LICENSE) [![GitHub forks](https://img.shields.io/github/forks/kengz/aiva.svg?style=social&label=Fork)](https://github.com/kengz/aiva) [![GitHub stars](https://img.shields.io/github/stars/kengz/aiva.svg?style=social&label=Star)](https://github.com/kengz/aiva)

**AIVA** (A.I. Virtual Assistant): General-purpose virtual assistant for developers. [http://kengz.me/aiva/](http://kengz.me/aiva/)

*This project is under extension - to build a [Contextual Graph Knowledge Base](http://kengz.me/aiva/#contextual-graph-knowledge-base) for knowledge encoding. Check [Roadmap](#roadmap) for more.*

It is a **bot-generalization**: you can implement any features, use with major AI tools, deploy across platforms, and code in multiple languages.


| AIVA is | Details |
|:---|---|
| general-purpose | An app interface, AI assistant, anything! |
| cross-platform | Deploy simultaneously on **Slack, Telegram, Facebook**, or any [hubot adapters](https://github.com/github/hubot/blob/master/docs/adapters.md) |
| multi-language | Cross-interaction among `Node.js`, `Python`, `Ruby`, etc. using `SocketIO`. |
| built-in with AI tools (not preinstalled since v4) | Tensorflow, SkFlow, Scikit, Pandas, Indico.ml, spaCy, Watson, Google APIs |
| hackable | It extends [Hubot](https://github.com/github/hubot). Add your own modules! |
| powerful, easy to use | Check out [setup](http://kengz.me/aiva/#setup) and [features](http://kengz.me/aiva/#features) |

>To see what they mean, say you have a todo-list feature for AIVA, written in Node.js and leverages NLP and ML from Python. Set your todo list earlier from Slack on desktop? You can access it from Telegram or Facebook on mobile.

>Deepdream in AIVA (checkout v3.2.1), only took a few hours on the Deepdream module, and deployed it in AIVA in just minutes. Runs on Fb and Telegram simulteneously: <img alt="Deepdream in AIVA" src="http://kengz.me/aiva/images/deepdream.gif" />

We see people spending a lot of time building bots instead of focusing on what they want to do. It still requires much effort to just get a bot up and running. Moreover, the bot built is often confined to a single language, single platform, and without AI capabilities.

Why restrict when you can have all of it? Why build multiple bots when you can have one that plugs into all platforms and runs all languages?

AIVA exists to help with that - we do the heavy-lifting and build a ready-to-use bot; it is general purpose, multi-language, cross-platform, with robust design and tests, to suite your needs. 

AIVA gives you powerful bot tools, saves you the time to build from scratch, and allows you to focus on what you want to do. Morever, you can **build once, run everywhere** with AIVA's multi-adapter [(Slack, Telegram, Fb)](http://kengz.me/aiva/#adapters).



## Installation


1\. Fork this repo so you can pull the new releases later:

&nbsp; &nbsp; [![GitHub forks](https://img.shields.io/github/forks/kengz/aiva.svg?style=social&label=Fork)](https://github.com/kengz/aiva) [![GitHub stars](https://img.shields.io/github/stars/kengz/aiva.svg?style=social&label=Star)](https://github.com/kengz/aiva)

2\. Clone **your forked repository**:

```shell
git clone https://github.com/YOURUSERNAME/aiva.git
```

## <a name="setup"></a>Setup

The line below runs `bin/setup && bin/copy-config && npm install`:

```shell
npm run setup
```

Then edit `config/` files: `default.json`(development), `production.json`(production, optional), `db.json`(mysql)

The command installs the dependencies via `bin/install && npm install`, and prepare the database for aiva to run on. The dependencies are minimal: `nodejs>=6`, `python3`, and `mysql`.

See `bin/install` for the full list, and customize your own. This also runs the same sequence as the CircleCI build in `circle.yml`.

**Docker**. We also offer a Docker image [kengz/aiva](https://hub.docker.com/r/kengz/aiva/). It runs the same except with an extra layer of Docker. See [Docker installation](http://kengz.me/aiva/#docker-installation) for more.


## <a name="run"></a>Run

```shell
npm start # runs 'aivadev' in development mode
```

```shell
# Add flags for more modes
npm start --debug # activate debug logger
npm start production # runs 'aiva' in production mode
```

See [Commands](http://kengz.me/aiva/#commands) for more. This will start AIVA with the default hubot adapters: Slack, Telegram, Facebook (only if activated). See [**Adapters**](http://kengz.me/aiva/#adapters) for connecting to different chat platforms.

>AIVA saying hi, translating, running deep neural net; on Slack, Telegram, Facebook:
<img alt="AIVA on Slack, Telegram" src="http://kengz.me/aiva/images/npm_start.png" />


Check [**Setup tips**](http://kengz.me/aiva/#setup-tips) for help.


## Legacy Releases

AIVA was known as Jarvis in version 2. It is now deprecated, but if you need to reference stuff from Jarvis, do `git checkout tags/v2.0` or checkout [the releases](https://github.com/kengz/aiva/releases).

AIVA v3 was last released at [v3.2.1](https://github.com/kengz/aiva/releases/tag/v3.2.1), which was full featured, but quite heavy. We retire it in favor of a lighter, more developer-friendly and extendible version.

## Roadmap

- a built in graph brain for ad-hoc knowledge encoding, using [CGKB](http://kengz.me/aiva/#cgkb) and [HTMI](http://kengz.me/aiva/#htmi)
- a built in NLP intent-parsing engine

## Contributing

We'd love for you to contribute and make AIVA even better for all developers. We're mainly interested in something generic and foundational, e.g. adding client for a new language, improving the NLP, adding a useful generic module, adding more adapters like Skype or Twilio.
