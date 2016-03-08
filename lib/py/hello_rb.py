# the id of this script for JSON payload 'from'
from os.path import basename
id = basename(__file__) # 'hello_rb.py'

# Write the module functions with the proper reply
##########################################

# another module method. To be passed on to other client (ruby)
def passToOtherClient(msg):
  # <function body here>
  # the reply JSON payload.
  reply = {
    'input': 'Hello from Python.',
    'to': 'Hello.rb',
    'intent': 'sayHi',
    'from': msg.get('from'),
    'hash': msg.get('hash'),
  }
  return reply
