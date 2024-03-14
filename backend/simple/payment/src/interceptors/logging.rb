require 'logger'
require_relative '../../pb/payment_pb'

class LoggingInterceptor < GRPC::ServerInterceptor
    def initialize
        @logger = Logger.new(STDOUT)
        @logger.formatter = proc do |severity, datetime, progname, msg|
            "#{datetime}: #{severity} - #{msg}\n"
        end
    end

    def request_response(request: nil, call: nil, method: nil, &block)
        start_time = Time.now
        success = true
        result = nil
        if request.is_a?(Payment::WebhookRequest)
            @logger.info("Stripes signature: #{call.metadata["stripe-signature"]}")
        end
        begin
            result = yield
        rescue => e
            success = false
            @logger.error("Error during call: #{e.message}")
        end
        begin
            @logger.info("Type: Unary - Method: #{method} - Time: #{Time.now - start_time} - Success: #{success}")
        rescue => e
            @logger.error("Error during logging: #{e.message}")
        end
        result
    end

    def client_streamer(call: nil, method: nil, &block)
        start_time = Time.now
        success = true
        result = nil
        begin
            result = yield
        rescue => e
            success = false
            @logger.error("Error during call: #{e.message}")
        end
        begin
            @logger.info("Type: Client streaming - Method: #{method} - Time: #{Time.now - start_time} - Success: #{success}")
        rescue => e
            @logger.error("Error during logging: #{e.message}")
        end
        result
    end

    def server_streamer(request: nil, call: nil, method: nil, &block)
        start_time = Time.now
        success = true
        result = nil
        begin
            result = yield
        rescue => e
            success = false
            @logger.error("Error during call: #{e.message}")
        end
        begin
            @logger.info("Type: Server streaming - Method: #{method} - Time: #{Time.now - start_time} - Success: #{success}")
        rescue => e
            @logger.error("Error during logging: #{e.message}")
        end
        result
    end

    def bidi_streamer(request: nil, call: nil, method: nil, &block)
        start_time = Time.now
        success = true
        result = nil
        begin
            result = yield
        rescue => e
            success = false
            @logger.error("Error during call: #{e.message}")
        end
        begin
            @logger.info("Type: Bidirectional streaming - Method: #{method} - Time: #{Time.now - start_time} - Success: #{success}")
        rescue => e
            @logger.error("Error during logging: #{e.message}")
        end
        result
    end
end