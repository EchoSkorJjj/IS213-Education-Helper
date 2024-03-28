#include <grpcpp/grpcpp.h>

#include "../../pb/health.grpc.pb.h"

class HealthService final : public grpc::health::v1::Health::Service {
  grpc::Status Check(grpc::ServerContext *context,
                     const grpc::health::v1::HealthCheckRequest *request,
                     grpc::health::v1::HealthCheckResponse *response) override {
    response->set_status(grpc::health::v1::HealthCheckResponse::SERVING);
    return grpc::Status::OK;
  }

  grpc::Status Watch(grpc::ServerContext *context,
                     const grpc::health::v1::HealthCheckRequest *request,
                     grpc::ServerWriter<grpc::health::v1::HealthCheckResponse>
                         *writer) override {
    grpc::health::v1::HealthCheckResponse response;
    response.set_status(grpc::health::v1::HealthCheckResponse::SERVING);
    writer->Write(response);
    return grpc::Status::OK;
  }
};