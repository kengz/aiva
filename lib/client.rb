# The client for rb; imports all rb modules

require 'rubygems'
require 'bundler/setup'
require 'socket.io-client-simple'

Dir[File.dirname(__FILE__) + '/rb/*.rb'].each {|file| require file }
puts 'import rb scripts from client.rb'

# 1. Register the socket.io client
##########################################
# Ruby scoping doesn't allow local var to be accessed within method, so set global
port = (ENV['PORT'] || '8080')
$client = SocketIO::Client::Simple.connect 'http://localhost:'+port
# the id of this script for io client registration
ioid = 'rb'
# first join for serialization
$client.on :connect do
  $client.emit :join, ioid
  p "emitted join with", ioid
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
      # !Note that the access isn't flexible as in py and js where dotpath can be use
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
  sleep 0.3
end
