# The client for rb; imports all rb modules
require 'rubygems'
require File.join('bundler', 'setup')
require File.join('active_support', 'core_ext', 'string')
require 'socket.io-client-simple'

Dir[File.join(File.dirname(__FILE__), 'rb', '*.rb')
  ].sort.each { |file| require file }
puts 'import rb scripts from client.rb'

# 1. Register the socket.io client
#########################################
# Ruby scoping doesn't allow local var to be accessed
# within method, so set global
ioport = (ENV['IOPORT'] || '6466')
CLIENT = SocketIO::Client::Simple.connect 'http://localhost:' + ioport
# the id of this script for io client registration
ioid = 'rb'
# first join for serialization
CLIENT.on :connect do
  CLIENT.emit :join, ioid
end
CLIENT.on :disconnect do
  CLIENT.disconnect
end

# 2. Write module methods and register as handlers
##########################################
# done in your module scripts

# 3. listener to handle incoming payload.
##########################################

# The handle will call handlers using intent = method name
def handle(msg)
  to = msg['to']
  intent = msg['intent']
  return unless to && intent
  begin
    reply = Module.const_get(to.classify).public_send(intent, msg)
    CLIENT.emit(:pass, reply) if reply['to']
  rescue
    puts 'rb handle fails'
  end
end

CLIENT.on :take do |msg|
  handle(msg)
end

# keep-alive
loop do
  sleep 0.3
end
