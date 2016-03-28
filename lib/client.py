# The client for py; imports all py modules

##########################################
# !Hack for SocketIO py client to work with unicode. Overrides the recv_packet of WebsocketTransport, changing from six.b to six.u when failing
# !Awaiting module author to fix the issue from source
from socketIO_client import SocketIO, WebsocketTransport
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
# for now don't import ai in travis
if not os.environ.get('TRAVIS'):
  from py.ai import *

print('import py scripts from client.py')
g = globals()

# 1. Register the socket.io client
##########################################
PORT = os.environ.get('PORT', '8080')
client = SocketIO('localhost', int(PORT))
# the id of this script for client registration
id = 'py'
# first join for serialization
client.emit('join', id)
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
  if to is not None and intent is not None:
    # call the function, get reply
    try:
      reply = getattr(g[to], intent)(msg)
      # if it should reply, send payload to target <to>
      if reply.get('to') is not None:
        client.emit('pass', reply)
    except:
      print('py handle fails.')
    
# add listener
client.on('take', handle)

# keep-alive
client.wait()

# print(g)
# print(g['hello'])
# print(g['dnn_1_deploy'])
# g['dnn_1_deploy'].accuracy()
# g['dnn_1_deploy'].predict([ 5.1, 3.5, 1.4, 0.2])
