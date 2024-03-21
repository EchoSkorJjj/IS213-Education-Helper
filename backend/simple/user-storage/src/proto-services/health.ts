import * as grpc from '@grpc/grpc-js';

import * as health_pb from "../../pb/health"

class Health extends health_pb.grpc.health.v1.UnimplementedHealthService {
    Check(call: grpc.ServerUnaryCall<health_pb.grpc.health.v1.HealthCheckRequest, health_pb.grpc.health.v1.HealthCheckResponse>, callback: grpc.sendUnaryData<health_pb.grpc.health.v1.HealthCheckResponse>): void {
        const response = new health_pb.grpc.health.v1.HealthCheckResponse({
            status: health_pb.grpc.health.v1.HealthCheckResponse.ServingStatus.SERVING,
        });

        callback(null, response);
    }

    Watch(call: grpc.ServerWritableStream<health_pb.grpc.health.v1.HealthCheckRequest, health_pb.grpc.health.v1.HealthCheckResponse>): void {
        const response = new health_pb.grpc.health.v1.HealthCheckResponse({
            status: health_pb.grpc.health.v1.HealthCheckResponse.ServingStatus.SERVING,
        });

        call.write(response);
    }
}

export default Health;