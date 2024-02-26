#include <grpcpp/grpcpp.h>
#include "../pb/subscriptions.pb.h"
#include "../pb/subscriptions.grpc.pb.h"

class SubscriptionService final : public subscription_pb::Subscription::Service
{
    grpc::Status CheckHealth(grpc::ServerContext *context, const subscription_pb::HealthCheckRequest *request, subscription_pb::HealthCheckResponse *response) override
    {
        response->set_status("I AM HIT!");
        return grpc::Status::OK;
    }
};