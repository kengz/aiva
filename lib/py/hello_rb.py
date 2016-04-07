# the ioid of this script for JSON payload 'from'
from os.path import basename
ioid = basename(__file__) # 'hello_rb.py'

# Write the module functions with the proper reply
##########################################

# another module method. To be passed on to other client (ruby)
def passToOtherClient(msg):
  # <function body here>
  # the reply JSON payload.
  reply = {
    'input': 'Hello from Python from js.',
    'to': 'Hello.rb',
    'intent': 'sayHi',
    'from': msg.get('from'),
    'hash': msg.get('hash')
  }
  return reply
