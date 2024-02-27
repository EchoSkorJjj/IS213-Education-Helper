#include <chrono>
#include <grpcpp/grpcpp.h>
// #include "../../include/utils.h"
#include "../../pb/subscriptions.pb.h"
#include "../../pb/subscriptions.grpc.pb.h"

class SubscriptionService final : public subscription_pb::Subscription::Service
{
    grpc::Status CreateSubscription(grpc::ServerContext *context, const subscription_pb::CreateSubscriptionRequest *request, subscription_pb::ServiceResponseWrapper *response) override
    {
        subscription_pb::ResponseMetadata metadata;
        metadata.set_request_id("1");

        auto now = std::chrono::system_clock::now();
        int seconds = std::chrono::duration_cast<std::chrono::seconds>(now.time_since_epoch()).count();
        int nanos = std::chrono::duration_cast<std::chrono::nanoseconds>(now.time_since_epoch()).count() % 1000000000;

        google::protobuf::Timestamp timestamp;
        timestamp.set_seconds(seconds);
        timestamp.set_nanos(nanos);
        metadata.set_allocated_timestamp(&timestamp);

        response->set_allocated_metadata(&metadata);
        response->set_allocated_payload({});

        return grpc::Status::OK;
    }

    grpc::Status GetSubscription(grpc::ServerContext *context, const subscription_pb::GetSubscriptionRequest *request, subscription_pb::ServiceResponseWrapper *response) override
    {
        subscription_pb::ResponseMetadata metadata;
        metadata.set_request_id("1");

        auto now = std::chrono::system_clock::now();
        int seconds = std::chrono::duration_cast<std::chrono::seconds>(now.time_since_epoch()).count();
        int nanos = std::chrono::duration_cast<std::chrono::nanoseconds>(now.time_since_epoch()).count() % 1000000000;

        google::protobuf::Timestamp timestamp;
        timestamp.set_seconds(seconds);
        timestamp.set_nanos(nanos);
        metadata.set_allocated_timestamp(&timestamp);

        response->set_allocated_metadata(&metadata);
        response->set_allocated_payload({});

        return grpc::Status::OK;
    }

    grpc::Status DeleteSubscription(grpc::ServerContext *context, const subscription_pb::DeleteSubscriptionRequest *request, subscription_pb::ServiceResponseWrapper *response) override
    {
        subscription_pb::ResponseMetadata *metadata = new subscription_pb::ResponseMetadata();
        metadata->set_request_id("1");

        auto now = std::chrono::system_clock::now();
        int seconds = std::chrono::duration_cast<std::chrono::seconds>(now.time_since_epoch()).count();
        int nanos = std::chrono::duration_cast<std::chrono::nanoseconds>(now.time_since_epoch()).count() % 1000000000;

        google::protobuf::Timestamp *timestamp = new google::protobuf::Timestamp();
        timestamp->set_seconds(seconds);
        timestamp->set_nanos(nanos);
        metadata->set_allocated_timestamp(timestamp);
        response->set_allocated_metadata(metadata);

        subscription_pb::DeleteSubscriptionResponse *content = new subscription_pb::DeleteSubscriptionResponse();
        content->set_subscription_id("1");
        content->set_user_id("2");

        google::protobuf::Any *payload = new google::protobuf::Any();
        payload->PackFrom(*content);
        response->set_allocated_payload(payload);

        return grpc::Status::OK;
    }

    grpc::Status CheckHealth(grpc::ServerContext *context, const subscription_pb::HealthCheckRequest *request, subscription_pb::HealthCheckResponse *response) override
    {
        response->set_status("I AM HIT!");
        return grpc::Status::OK;
    }
};