# AIVA [![Build Status](https://travis-ci.org/kengz/aiva.svg?branch=aiva-v3)](https://travis-ci.org/kengz/aiva) [![Dependency Status](https://gemnasium.com/kengz/jarvis.svg)](https://gemnasium.com/kengz/jarvis)

**AIVA** (A.I. Virtual Assistant): General-purpose virtual assistant for developers. 

| AIVA is | |
|:---|---|
| general-purpose | An app interface, AI assistant, anything! |
| cross-platform | Slack, Telegram, IRC, Twilio, or any [hubot adapters](https://github.com/github/hubot/blob/master/docs/adapters.md) |
| multi-language | Runs scripts among Node.js, Python3, Ruby, etc. |
| hackable | It extends [Hubot](https://github.com/github/hubot). Add your own modules! |
| powerful, easy to use | Check out [setup](#setup) and [features](#features) |

AIVA is based on a theoretical interface [HTMI](./docs/HTMI.md) and a brain [CGKB](./docs/CGKB.md) that is *human-bounded Turing complete*. The theorem establishes that HTMI can be used by a human to solve any problems or perform any functions she enumerates that are solvable by a Turing Machine. Complete implementation is still underway.



## Installation

Clone this repo:

```shell
git clone <the_git_url>
```

Use **Ubuntu >14.04** or **MacOSX**; For the fastest VM setup, I recommend [Digital Ocean](https://www.digitalocean.com), with this automatic [setup script](https://github.com/kengz/mac_setup). Optionally for manual setup, see [Dependencies](#dependencies).



## Setup, Run

#### <a name="setup"></a>One-time Setup
- **install dependencies**: `npm run gi`
- **setup keys**: update `.env`, `bin/.key-<bot-name>`, replace `aiva` in `package.json` if you prefer different name

Check [**Setup tips**](#setup-tips) for tips.

#### <a name="run"></a>Run
- **run**: `npm start`; append `--bot=<bot-name>` to run the non-default bots.
```shell
# alternative commands
npm stop # stop all running bots
npm run debug # outputs log to terminal
npm run debug --bot=<bot-name> # to dev
npm run shell # use shell-adapter to dev
npm test # run unit tests
forever list # see the list of bots running
```



## <a name="features"></a>Features

pending.



## Development Guide

AIVA ships completely usable right out of the box - you can use it as a simple virtual assistant. It's also designed as an interface for developers, so refer to [DEVELOPMENT.md](./docs/DEVELOPMENT.md) for development guide.



## Design

Design of AIVA can be found at [DESIGN.md](./docs/DESIGN.md).



## Changelog

For Todos (pending features) and Changelogs see [CHANGELOG.md](./docs/CHANGELOG.md)



## <a name="setup-tips"></a>Setup tips

#### Neo4j
If it's your first installation of `Neo4j`, change the password:
```shell
neo4j start
# change your password
# note the default username:pswd is neo4j:neo4j
curl -X POST -d "password=YOUR_NEW_PASSWORD" -u neo4j:<OLD_PSWD> http://localhost:7474/user/neo4j/password
# access Neo4j browser GUI
open http://localhost:7474
```

#### SSH Browser-forwarding

If you're hosting Neo4j on a remote machine and want to access its browser GUI on your local machine, connect to it via 

```
ssh -L 8080:localhost:7474 <remote_host>
```

Then you can go to `http://localhost:8080/` on your local browser.


#### <a name="dependencies"></a>Dependencies

All the system dependencies are installed automatically by running `npm run gi`, which executes [`bin/install`](./bin/install). If you'd like to setup your VM manually, see/edit the setup script; below is the list:

- `node.js >v5.x`
- `java jdk >7, export $JAVA_HOME path`
- `neo4j >v2.3.0`
- `neo4j shell tool`
- `python3, pip3`
- `setuptools virtualenvwrapper` (`pip3`)
- `libatlas-dev libblas-dev gfortran` (`Linux apt-get`)
- `numpy scipy tensorflow scikit-learn skflow pandas matplotlib` (`pip3`)
- `ruby, bundler`
- `forever, istanbul` (`npm -g`)




## Contributing

We'd love for you to contribute and make AIVA even better for all developers. We're mainly interested in something generic and foundational, e.g. adding client for a new language, improving the NLP, adding a useful module, adding more adapters like Telegram or Whatsapp.
