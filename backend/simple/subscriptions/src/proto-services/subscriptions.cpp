#include <grpcpp/grpcpp.h>

#include <chrono>
#include <pqxx/pqxx>

#include "../../include/database.h"
#include "../../include/utils.h"
#include "../../pb/subscriptions.grpc.pb.h"
#include "../../pb/subscriptions.pb.h"

class SubscriptionService final
    : public subscription_pb::Subscription::Service {
  grpc::Status CreateOrUpdateSubscription(
      grpc::ServerContext *context,
      const subscription_pb::CreateOrUpdateSubscriptionRequest *request,
      subscription_pb::CreateOrUpdateSubscriptionResponse *response) override {
    std::string stripe_subscription_id = request->stripe_subscription_id();
    std::string email = request->email();
    google::protobuf::Timestamp subscribed_until_timestamp =
        request->subscribed_until();
    time_t subscribed_until = subscribed_until_timestamp.seconds();

    if (email.empty()) {
      return grpc::Status(grpc::StatusCode::INVALID_ARGUMENT, "Email is empty");
    }

    try {
      Database &db = Database::GetInstance();
      subscription_pb::SubscriptionMessage created_subscription =
          db.CreateOrUpdateSubscription(email, subscribed_until,
                                        stripe_subscription_id);

      subscription_pb::ResponseMetadata metadata = GenerateMetadata("1");

      response->mutable_metadata()->CopyFrom(metadata);
      response->mutable_details()->CopyFrom(created_subscription);
    } catch (const std::exception &e) {
      std::cout << "Error creating subscription: " << e.what() << "\n"
                << std::endl;
      return grpc::Status(grpc::StatusCode::INTERNAL, e.what());
    }

    std::cout << "Successfully created subscription" << std::endl;
    return grpc::Status::OK;
  }

  grpc::Status GetSubscription(
      grpc::ServerContext *context,
      const subscription_pb::GetSubscriptionRequest *request,
      subscription_pb::GetSubscriptionResponse *response) override {
    std::string email = request->email();
    if (email.empty()) {
      return grpc::Status(grpc::StatusCode::INVALID_ARGUMENT, "Email is empty");
    }

    try {
      Database &db = Database::GetInstance();
      subscription_pb::SubscriptionMessage requested_subscription =
          db.GetSubscriptionByEmail(email);
      subscription_pb::ResponseMetadata metadata = GenerateMetadata("1");

      response->mutable_metadata()->CopyFrom(metadata);
      response->mutable_details()->CopyFrom(requested_subscription);
    } catch (const std::exception &e) {
      std::cout << "Error getting subscription: " << e.what() << "\n"
                << std::endl;
      return grpc::Status(grpc::StatusCode::INTERNAL, e.what());
    }

    std::cout << "Successfully retrieved subscription" << std::endl;
    return grpc::Status::OK;
  }

  grpc::Status CancelSubscription(
      grpc::ServerContext *context,
      const subscription_pb::CancelSubscriptionRequest *request,
      subscription_pb::CancelSubscriptionResponse *response) override {
    std::string email = request->email();
    if (email.empty()) {
      return grpc::Status(grpc::StatusCode::INVALID_ARGUMENT, "Email is empty");
    }

    try {
      Database &db = Database::GetInstance();
      subscription_pb::SubscriptionMessage cancelled_subscription =
          db.CancelSubscriptionByEmail(email);
      subscription_pb::ResponseMetadata metadata = GenerateMetadata("1");

      response->mutable_metadata()->CopyFrom(metadata);
      response->mutable_details()->CopyFrom(cancelled_subscription);
    } catch (const std::exception &e) {
      std::cout << "Error deleting subscription: " << e.what() << "\n"
                << std::endl;
      return grpc::Status(grpc::StatusCode::INTERNAL, e.what());
    }

    std::cout << "Successfully deleted subscription" << std::endl;
    return grpc::Status::OK;
  }

  grpc::Status GetExpiredSubscriptions(
      grpc::ServerContext *context,
      const subscription_pb::GetExpiredSubscriptionsRequest *request,
      subscription_pb::GetExpiredSubscriptionsResponse *response) override {
    try {
      Database &db = Database::GetInstance();
      std::vector<subscription_pb::SubscriptionMessage> expired_subscriptions =
          db.GetExpiredSubscriptions();
      subscription_pb::ResponseMetadata metadata = GenerateMetadata("1");

      response->mutable_metadata()->CopyFrom(metadata);
      for (const auto &subscription : expired_subscriptions) {
        subscription_pb::SubscriptionMessage *expired_subscription =
            response->add_expired_subscriptions();
        expired_subscription->CopyFrom(subscription);
      }
    } catch (const std::exception &e) {
      std::cout << "Error getting expired subscriptions: " << e.what() << "\n"
                << std::endl;
      return grpc::Status(grpc::StatusCode::INTERNAL, e.what());
    }

    std::cout << "Successfully retrieved expired subscriptions" << std::endl;
    return grpc::Status::OK;
  }

  grpc::Status DeleteExpiredSubscription(
      grpc::ServerContext *context,
      const subscription_pb::DeleteExpiredSubscriptionRequest *request,
      subscription_pb::DeleteExpiredSubscriptionResponse *response) override {
    std::string email = request->email();
    if (email.empty()) {
      return grpc::Status(grpc::StatusCode::INVALID_ARGUMENT, "Email is empty");
    }

    try {
      Database &db = Database::GetInstance();
      subscription_pb::SubscriptionMessage deleted_subscription =
          db.DeleteExpiredSubscriptionByEmail(email);
      subscription_pb::ResponseMetadata metadata = GenerateMetadata("1");

      response->mutable_metadata()->CopyFrom(metadata);
      response->mutable_details()->CopyFrom(deleted_subscription);
    } catch (const std::exception &e) {
      std::cout << "Error deleting subscription: " << e.what() << "\n"
                << std::endl;
      return grpc::Status(grpc::StatusCode::INTERNAL, e.what());
    }

    std::cout << "Successfully deleted subscription" << std::endl;
    return grpc::Status::OK;
  }
};