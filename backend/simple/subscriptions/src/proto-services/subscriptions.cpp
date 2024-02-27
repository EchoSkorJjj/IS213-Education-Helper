#include <chrono>
#include <grpcpp/grpcpp.h>
#include <pqxx/pqxx>

#include "../../include/utils.h"
#include "../../pb/subscriptions.pb.h"
#include "../../pb/subscriptions.grpc.pb.h"
#include "../../include/database.h"

class SubscriptionService final : public subscription_pb::Subscription::Service
{
    grpc::Status CreateOrUpdateSubscription(grpc::ServerContext *context, const subscription_pb::CreateOrUpdateSubscriptionRequest *request, subscription_pb::CreateOrUpdateSubscriptionResponse *response) override
    {
        std::string user_id = request->user_id();
        google::protobuf::Timestamp subscribed_until_timestamp = request->subscribed_until();
        time_t subscribed_until = subscribed_until_timestamp.seconds();

        if (user_id.empty())
        {
            return grpc::Status(grpc::StatusCode::INVALID_ARGUMENT, "User ID is empty");
        }

        try
        {
            Database &db = Database::getInstance();
            subscription_pb::SubscriptionMessage created_subscription = db.createOrUpdateSubscriptionByUserId(user_id, subscribed_until);

            subscription_pb::ResponseMetadata metadata = generateMetadata("1");

            response->mutable_metadata()->CopyFrom(metadata);
            response->mutable_details()->CopyFrom(created_subscription);
        }
        catch (const std::exception &e)
        {
            std::cout << "Error creating subscription: " << e.what() << "\n"
                      << std::endl;
            return grpc::Status(grpc::StatusCode::INTERNAL, e.what());
        }

        std::cout << "Successfully created subscription" << std::endl;
        return grpc::Status::OK;
    }

    grpc::Status GetSubscription(grpc::ServerContext *context, const subscription_pb::GetSubscriptionRequest *request, subscription_pb::GetSubscriptionResponse *response) override
    {
        std::string user_id = request->user_id();
        if (user_id.empty())
        {
            return grpc::Status(grpc::StatusCode::INVALID_ARGUMENT, "User ID is empty");
        }

        try
        {
            Database &db = Database::getInstance();
            subscription_pb::SubscriptionMessage requested_subscription = db.getSubscriptionByUserId(user_id);
            subscription_pb::ResponseMetadata metadata = generateMetadata("1");

            response->mutable_metadata()->CopyFrom(metadata);
            response->mutable_details()->CopyFrom(requested_subscription);
        }
        catch (const std::exception &e)
        {
            std::cout << "Error getting subscription: " << e.what() << "\n"
                      << std::endl;
            return grpc::Status(grpc::StatusCode::INTERNAL, e.what());
        }

        std::cout << "Successfully retrieved subscription" << std::endl;
        return grpc::Status::OK;
    }

    grpc::Status DeleteSubscription(grpc::ServerContext *context, const subscription_pb::DeleteSubscriptionRequest *request, subscription_pb::DeleteSubscriptionResponse *response) override
    {
        std::string user_id = request->user_id();
        if (user_id.empty())
        {
            return grpc::Status(grpc::StatusCode::INVALID_ARGUMENT, "User ID is empty");
        }

        try
        {
            Database &db = Database::getInstance();
            subscription_pb::SubscriptionMessage deleted_subscription = db.deleteSubscriptionByUserId(user_id);
            subscription_pb::ResponseMetadata metadata = generateMetadata("1");

            response->mutable_metadata()->CopyFrom(metadata);
            *response->mutable_subscription_id() = deleted_subscription.subscription_id();
            *response->mutable_user_id() = deleted_subscription.user_id();
        }
        catch (const std::exception &e)
        {
            std::cout << "Error deleting subscription: " << e.what() << "\n"
                      << std::endl;
            return grpc::Status(grpc::StatusCode::INTERNAL, e.what());
        }

        std::cout << "Successfully retrieved subscription" << std::endl;
        return grpc::Status::OK;
    }

    grpc::Status CheckHealth(grpc::ServerContext *context, const subscription_pb::HealthCheckRequest *request, subscription_pb::HealthCheckResponse *response) override
    {
        response->set_status("I AM HIT!");
        return grpc::Status::OK;
    }
};