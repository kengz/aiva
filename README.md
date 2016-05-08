# AIVA [![Build Status](https://travis-ci.org/kengz/aiva.svg?branch=master)](https://travis-ci.org/kengz/aiva) [![Coverage Status](https://coveralls.io/repos/github/kengz/aiva/badge.svg?branch=master)](https://coveralls.io/github/kengz/aiva?branch=master) [![Dependency Status](https://gemnasium.com/kengz/aiva.svg)](https://gemnasium.com/kengz/aiva)

**AIVA** (A.I. Virtual Assistant): General-purpose virtual assistant for developers. [http://kengz.me/aiva/](http://kengz.me/aiva/)

It is a **bot-generalization**: you can implement any features, use with major AI tools, deploy across platforms, and code in multiple languages.


| AIVA is | Details |
|:---|---|
| general-purpose | An app interface, AI assistant, anything! |
| cross-platform | Deploy simultaneously on **Slack, Telegram, Facebook**, or any [hubot adapters](https://github.com/github/hubot/blob/master/docs/adapters.md) |
| multi-language | Code in and coordinate among `Node.js`, `Python`, `Ruby`, etc. |
| built-in with AI tools | Tensorflow, SkFlow, Scikit, Pandas, Indico.ml, spaCy, Watson, Google APIs |
| hackable | It extends [Hubot](https://github.com/github/hubot). Add your own modules! |
| powerful, easy to use | Check out [setup](#setup) and [features](#features) |

>To see what they mean, say you have a todo-list feature for AIVA, written in Node.js and leverages NLP and ML from Python. Set your todo list earlier from Slack on desktop? You can access it from Telegram or Facebook on mobile.

We see people spending a lot of time building bots instead of focusing on what they want to do. It still requires much effort to just get a bot up and running. Moreover, the bot built is often confined to a single language, single platform, and without AI capabilities.

Why restrict when you can have all of it? Why build multiple bots when you can have one that plugs into all platforms and runs all languages?

AIVA exists to help with that - we do the heavy-lifting and build a ready-to-use bot; it is general purpose, multi-language, cross-platform, with robust design and tests, to suite your needs. 

AIVA gives you powerful bot tools, saves you the time to build from scratch, and allows you to focus on what you want to do. Morever, you can **build once, run everywhere** with AIVA's multi-adapter [(Slack, Telegram, Fb)](#adapters).

## Documentation

All the docs are on [kengz.me/aiva](http://kengz.me/aiva/). This README serves as a quick reference for setup.



## Installation

1\. Fork this repo (you can use the fork button above too) so you can pull the new releases later:

&nbsp; &nbsp; <iframe src="https://ghbtns.com/github-btn.html?user=kengz&repo=aiva&type=fork&count=true" frameborder="0" scrolling="0" width="170px" height="20px"></iframe>

2\. Clone **your forked repository**:

```shell
git clone https://github.com/YOURUSERNAME/aiva.git
```

Use **Ubuntu >14.04** or **MacOSX**; For the fastest VM setup, I recommend [Digital Ocean](https://www.digitalocean.com), with this automatic [setup script](https://github.com/kengz/mac_setup). Optionally for manual setup, see [Dependencies](#dependencies).



## <a name="setup"></a>Setup, Run

### <a name="one-time-setup"></a>One-time Setup
- **install dependencies**: (first installation may take ~20 mins, mainly due to the AI modules)

```shell
npm run gi
```

- **setup keys**: update `.env`, `bin/.key-aiva` (production), `bin/.key-aivadev` (development).

<aside class="notice">
If you prefer a different bot name, replace "aiva" from the <code>bin/.keys-</code> and in <code>package.json</code>.
</aside>


### <a name="run"></a>Run
- **run**: 

```shell
npm start # runs aiva
npm run debug # runs aivadev
```

This will start AIVA with the default hubot adapters: Slack, Telegram, Facebook.


## Deprecation

AIVA was known as Jarvis in version 2. It is now deprecated, but if you need to reference stuff from Jarvis, do `git checkout tags/v2.0` or checkout [the releases](https://github.com/kengz/aiva/releases).


## Contributing

We'd love for you to contribute and make AIVA even better for all developers. We're mainly interested in something generic and foundational, e.g. adding client for a new language, improving the NLP, adding a useful generic module, adding more adapters like Skype or Twilio.
