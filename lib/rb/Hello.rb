# Ruby module definition is restrictive, thus the filename must be capitalized and be exactly the same as module name

module Hello
  class << self
  # the id of this script for JSON payload 'from'
  @@id = File.basename(__FILE__)

    # module method definition
    def sayHi(msg)
      reply = {
        'output' => 'Hello from Ruby.',
        'to' => msg['from'],
        'from' => @@id,
        'hash' => msg['hash']
      }
      return reply
    end

  end
end

