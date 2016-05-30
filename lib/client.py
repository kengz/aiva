# The client for py; imports all py modules

##########################################
# !Hack for SocketIO py client to work with unicode. Overrides the recv_packet of WebsocketTransport, changing from six.b to six.u when failing
# !Awaiting module author to fix the issue from source
from socketIO_client import SocketIO, WebsocketTransport
import sys
import os
import six
import socket
import websocket

def recv_packet_unicode(self):
    try:
        packet_text = self._connection.recv()
    except websocket.WebSocketTimeoutException as e:
        raise TimeoutError('recv timed out (%s)' % e)
    except websocket.SSLError as e:
        raise ConnectionError('recv disconnected by SSL (%s)' % e)
    except websocket.WebSocketConnectionClosedException as e:
        raise ConnectionError('recv disconnected (%s)' % e)
    except socket.error as e:
        raise ConnectionError('recv disconnected (%s)' % e)
    try:
        encoded = six.b(packet_text)
    except (UnicodeEncodeError):
        # print("six.b latin-l encoding fails, switching to six.u unicode uncoding")
        pass
    else:
        encoded = six.u(packet_text)
    engineIO_packet_type, engineIO_packet_data = parse_packet_text(encoded)
    yield engineIO_packet_type, engineIO_packet_data
    
# Set the new recv_packet_unicode method
WebsocketTransport.recv_packet = recv_packet_unicode

# Hack ends
##########################################
from py import *
print('import py scripts from client.py')

class dotdict(dict):
  """dot.notation access to dictionary attributes"""
  def __getattr__(self, attr):
      return self.get(attr)
  __setattr__= dict.__setitem__
  __delattr__= dict.__delitem__

# the global object to access all modules (nested) in py/
lib_py = dotdict(globals())

def getAt(module, dotpath):
  '''Custom function to return the property of module at dotpath'''
  pathList = dotpath.split('.')
  prop = module
  while len(pathList):
    k = pathList.pop(0)
    try:
      prop = prop[k]
    except Exception:
      prop = getattr(prop, k)
  return prop

# print(lib_py)
# print(getAt(lib_py, "hello.sayHi"))
# print(getAt(lib_py, "ai.nlp"))

def correctReply(reply, msg):
  '''correct the reply JSON'''
  if type(reply) is not dict:
    reply = { "output": reply }
  # autofill if not already exist
  reply["to"] = reply.get("to") or msg.get("from")
  reply["from"] = reply.get("from") or ioid
  reply["hash"] = reply.get("hash") or msg.get("hash")
  return reply
# correctReply({}, {"from": "your mom"})


# 1. Register the socket.io client
##########################################
IOPORT = os.environ.get('IOPORT', '6464')
client = SocketIO('localhost', int(IOPORT))
# the id of this script for io client registration
ioid = 'py'
# first join for serialization
client.emit('join', ioid)
client.on('disconnect', client.disconnect)


# 2. Write module methods and register as handlers
##########################################
# done in your module scripts


# 3. listener to handle incoming payload.
##########################################

# The handle will call handlers using intent = method name
def handle(msg):
  to = msg.get('to') # the target module, e.g. hello
  intent = msg.get('intent') # the module's function, e.g. sayHi()
  reply = None
  if to is not None and intent is not None:
    # try JSON or JSON.input as input
    try:
      reply = getAt(getAt(lib_py, to), intent)(msg)
    except:
      try:
        reply = getAt(getAt(lib_py, to), intent)(msg.get("input"))
      except:
        e = sys.exc_info()[0]
        print('py handle fails.', e)
    finally:
      # try JSON or made-JSON output
      reply = correctReply(reply, msg)
      if reply.get('to') is not None:
        client.emit('pass', reply)
    
# add listener
client.on('take', handle)

# keep-alive
client.wait()
