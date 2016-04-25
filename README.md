# AIVA [![Build Status](https://travis-ci.org/kengz/aiva.svg?branch=aiva-v3)](https://travis-ci.org/kengz/aiva) [![Coverage Status](https://coveralls.io/repos/github/kengz/aiva/badge.svg?branch=aiva-v3)](https://coveralls.io/github/kengz/aiva?branch=master) [![Dependency Status](https://gemnasium.com/kengz/jarvis.svg)](https://gemnasium.com/kengz/jarvis)


**AIVA** (A.I. Virtual Assistant): General-purpose virtual assistant for developers.

It is a **bot-generalization**: you can implement any features, use it simultaneously on the major platforms, and code in multiple languages.


| AIVA is | Details |
|:---|---|
| general-purpose | An app interface, AI assistant, anything! |
| cross-platform | Deploy simultaneously on **Slack, Telegram, Facebook**, or any [hubot adapters](https://github.com/github/hubot/blob/master/docs/adapters.md) |
| multi-language | Code in and coordinate among `Node.js`, `Python`, `Ruby`, etc. |
| built-in with AI tools | Tensorflow, skflow, Indico.ml, spaCy, Watson, Google APIs |
| hackable | It extends [Hubot](https://github.com/github/hubot). Add your own modules! |
| powerful, easy to use | Check out [setup](#setup) and [features](#features) |

>To see what it means, say you have a todo-list feature for AIVA, written in Node.js and leverages NLP and ML from Python. Set your todo list earlier from Slack on desktop? You can access it from Telegram or Facebook on mobile.


## Documentation

All the docs are on [kengz.me/aiva-doc](http://kengz.me/aiva-doc/#aiva). This README serves as a quick reference for setup.



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
- **install dependencies**: 

```shell
npm run gi
```

- **setup keys**: update `.env`, `bin/.key-aiva` (production), `bin/.key-aivadev` (development).

Check [**Setup tips**](#setup-tips) for more help.

<aside class="notice">
If you prefer a different bot name, replace "aiva" from the <code>bin/.keys-</code> and in <code>package.json</code>.
</aside>


### <a name="run"></a>Run
- **run**: 

```shell
npm start # runs aiva
npm run debug # runs aivadev
```

This will start AIVA with the default hubot adapters: Slack, Telegram, Facebook. See [**Adapters**](#adapters) for connecting to different chat platforms.


## Contributing

We'd love for you to contribute and make AIVA even better for all developers. We're mainly interested in something generic and foundational, e.g. adding client for a new language, improving the NLP, adding a useful generic module, adding more adapters like Whatsapp or Twilio.
