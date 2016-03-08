# The client for rb; imports all rb modules

require 'rubygems'
require 'bundler/setup'
require 'socket.io-client-simple'

Dir[File.dirname(__FILE__) + '/rb/*.rb'].each {|file| require file }
puts 'import rb scripts from client.rb'

# 1. Register the socket.io client
##########################################
# Ruby scoping doesn't allow local var to be accessed within method, so set global
$client = SocketIO::Client::Simple.connect 'http://localhost:8080'
# the id of this script for client registration
id = 'rb'
# first join for serialization
$client.on :connect do
  $client.emit :join, id
end
$client.on :disconnect do
  $client.disconnect()
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
  if to && intent
    begin
      reply = Module.const_get(to).method(intent).call(msg)
      if reply['to']
        $client.emit(:pass, reply)
      end
    rescue
      puts 'rb handle fails'
    end
  end
end

$client.on :take do |msg|
  handle(msg)
end


# keep-alive
loop do
end
