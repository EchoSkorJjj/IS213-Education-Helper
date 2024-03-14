require_relative '../../pb/health_pb'
require_relative '../../pb/health_services_pb'

class HealthServicer < Grpc::Health::V1::Health::Service
    def check(health_check_request, _unused_call)
        Grpc::Health::V1::HealthCheckResponse.new(status: :SERVING)
    end

    def watch(health_check_request, _call)
        return enum_for(:watch, health_check_request, _call) unless block_given?
        loop do
            yield Grpc::Health::V1::HealthCheckResponse.new(status: :SERVING)
            sleep 1
        end
    end
end