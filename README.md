# AIVA [![Build Status](https://travis-ci.org/kengz/aiva.svg?branch=aiva-v3)](https://travis-ci.org/kengz/aiva) [![Dependency Status](https://gemnasium.com/kengz/jarvis.svg)](https://gemnasium.com/kengz/jarvis)

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
- release the simplest version of AIVA with simpler AI modules (google graph API and conceptnet, imagenet: slack might be able to take picture for bot). Full NLP and KB will take longer to complete.
- warning if forever restarts
- store cron in KB for restoration
- user preference: weather, last food order etc, extensible
- KB contextual search: guess context from search input, e.g. name or email or task, then apply search to labels or properties or conns
- multi-platform tests: test switching out the adapter to Telegram/IRC, centralize brain recognize the same user across different platforms, and you can seamlessly pick up your bot from any platform - this will be the "one bot to rule it all" as you can find it anywhere and it will know this is the same person.
- add back branches:only:master to .travis.yml
- update package.json name, private, url, license





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
