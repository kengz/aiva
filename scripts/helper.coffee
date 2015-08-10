# The helper class with shared functions used by many scripts
# Do not delete!

_ = require 'lomath'

# the command regex
typedCmd = 
  "fun": 
    "chuck norris": [
      /(chuck norris)( me )?(.*)/i
    ]
    "coding love": [
      /(donne moi de la )?joie( bordel)?/i
      /derni[èe]re joie/i
      /((give me|spread) some )?(joy|love)( asshole)?/i
      /last (joy|love)/i
      /reply to (.+)/i
    ]
    "meme": [
      /Y U NO (.+)/i
      /aliens guy (.+)/i
      /iron price (.+)/i
      /brace yourself (.+)/i
      /(.*) (ALL the .*)/i
      /(I DON'?T ALWAYS .*) (BUT WHEN I DO,? .*)/i
      /(.*)(SUCCESS|NAILED IT.*)/i
      /(.*) (\w+\sTOO DAMN .*)/i
      /(NOT SURE IF .*) (OR .*)/i
      /(YO DAWG .*) (SO .*)/i
      /(All your .*) (are belong to .*)/i
      /(.*)\s*BITCH PLEASE\s*(.*)/i
      /(.*)\s*COURAGE\s*(.*)/i
      /ONE DOES NOT SIMPLY (.*)/i
      /(IF YOU .*\s)(.* GONNA HAVE A BAD TIME)/i
      /(.*)TROLLFACE(.*)/i
      /(IF .*), ((ARE|CAN|DO|DOES|HOW|IS|MAY|MIGHT|SHOULD|THEN|WHAT|WHENHE|WHICH|WHO|WHY|WILL|WON\'T|WOULD)[ \'N].*)/i
      /(.*)(AND IT\'S GONE.*)/i
      /WHAT IF I TOLD YOU (.*)/i
      /(WHY THE (FUCK|FRIEND)) (.*)/i
      /WTF (.*)/i
      /(IF .*)(THAT'D BE GREAT)/i
      /(MUCH .*) ((SO|VERY) .*)/i
      /(.*)(EVERYWHERE.*)/i
    ]
    "do it": [
      /just do it/i
    ]
    "trump": [
      /trump/i
    ]
    "cat": [
      /cat me/i
      /cat bomb( (\d+))?/i
      /how many cats are there/i
    ]
    "pug": [
      /pug me/i
      /pug bomb( (\d+))?/i
      /how many pugs are there/i
    ]
    "ship": [
      /ship(ping|z|s|ped)?\s*it/i
      /ship\s*it/i
    ]
    "victory": [
      /victory\b/i
    ]
    "reply": [
      /reply to (.+)/i
    ]
    "flirt": [
      /flirt with @?(.+)/i
    ]
    "image": [
      /(image|img)( me)? (.*)/i
      /animate( me)? (.*)/i
      /(?:mo?u)?sta(?:s|c)h(?:e|ify)?(?: me)? (.*)/i
    ]
  "bot":
    "reply": [
      /PING$/i
      /ADAPTER$/i
      /ECHO (.*)$/i
      /TIME$/i
      /help\s*(.*)?$/i
    ]
  "util":
    "google": [
      /(g|google) (.*)/i
      /(?:youtube|yt)(?: me)?\s(.*)/i
    ]
    "translate": [
      /translate|say/i
    ]
    "map": [
      /((driving|walking|bike|biking|bicycling) )?directions from (.+) t(.+)/i
      /(?:(satellite|terrain|hybrid)[- ])?map( me)? (.+)/i
    ]
    "news": [
      /hn (\d*)/i
    ]
    "twitter": [
      /twitter (\S+)\s*(.+)?/i
    ]
    "where": [
      /time( at)? ([\w\-]+)/i
      /((?:(?!is).)*) is (in|at) (.*)/i
      /I\'*\’*m (in|at) (.*)/i
      /I am (in|at) (.*)/i
      /where is (.+)/i
      /where am I/i
      /weather( at)? ?(.+)?/i
    ],
    "remind": [
      /reminder(s?)/i
      /(rm|remove) reminder (\d+)/i
      /remind ((?:(?!to).)*) to (.*)/i
    ],
    "todo": [
      /todo\s*((?:(?!add).)*) add (.*)/i
      /todo\s*(.*)(show|list)/i
      /todo\s*((?:(?!rm|remove).)*) (rm|remove)(.*)/i
      /todo\s+(.*)clear/i
    ],
    "lomath": [
      /_\.(\w+)(.*)$/i
    ],
    "alias": [
      /I am(?! in| at) (.*)/i
      /I\'*\’*m(?! in| at) (.*)/i
      /My name is(?! in| at) (.*)/i
      /who is (.*)/i
      /who am I/i
      /clear alias for (.*)/i
    ],
    "sentiment": [
      /sa\s*(\d*)\s*(.*)/i
    ]


# given an alias, return the first name that contains the alias
findName = (robot, alias) ->
  _.findKey robot.brain.data.aliases, (aliasArr) ->
    _.includes aliasArr, alias.toLowerCase()

# The userId parser
# if 'me'/i, return 'me'
# else try alias
# else try fuzzy username
# else return undefined
userId = (robot, userName, msg) ->
  userName = _.trim userName.replace(/\@/g, '')
  try 
    if userName.toLowerCase() is 'me' or userName is ''
      candidate = msg.message.user.name
    else
      candidate = findName(robot, userName) or robot.brain.usersForFuzzyName(userName)[0].name
    return candidate
  catch error
    undefined


# the admins field, array of admin emails
admins = process.env.ADMINS.split(',')

# boolean function to see if msg is sent by admin
isAdmin = (msg) ->
  email = msg.envelope.user.email_address
  return _.includes admins, email


module.exports = 
  "typedCmd": typedCmd
  "userId": userId
  "isAdmin": isAdmin
