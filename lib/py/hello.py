# the id of this script for JSON payload 'from'
from os.path import basename
id = basename(__file__) # 'hello.py'

# Write the module functions with the proper reply
##########################################

# module method. Feel free to add more
def sayHi(msg):
  # <function body here>
  # the reply JSON payload.
  reply = {
    'output': 'Hello from Python.',
    'to': msg.get('from'),
    'from': id,
    'hash': msg.get('hash'),
  }
  # the py client will send this to target <to>
  return reply
