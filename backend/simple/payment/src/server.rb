require 'grpc'
require 'dotenv'

# Feels like this isn't best practice but the
# only alternative I could find was gemspecs
$:.unshift(File.expand_path('../pb', __dir__))
require_relative 'interceptors/logging'
require_relative 'proto-services/payment'
require_relative 'proto-services/health'

Dotenv.load

server = GRPC::RpcServer.new(interceptors: [LoggingInterceptor.new])
server.add_http2_port('0.0.0.0:50051', :this_port_is_insecure)
server.handle(PaymentServicer.new)
server.handle(HealthServicer.new)

server.run_till_terminated