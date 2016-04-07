# the ioid of this script for JSON payload 'from'
from os.path import basename
ioid = basename(__file__) # 'hello.py'

# Write the module functions with the proper reply
##########################################

def foo(input):
  match = input.find('Hello') > -1
  return 'Hello from Python.' if match else 'Who are you?'

# module method. Feel free to add more
def sayHi(msg):
  # the reply JSON payload.
  reply = {
    'output': foo(msg.get('input')),
    'to': msg.get('from'),
    'from': ioid,
    'hash': msg.get('hash')
  }
  # the py client will send this to target <to>
  return reply
