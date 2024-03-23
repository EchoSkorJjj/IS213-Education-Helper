#include "../../include/utils.h"

#include <iomanip>

#include "../../pb/subscriptions.grpc.pb.h"

std::string TimeT2String(const std::time_t &time) {
  std::tm *tm = std::gmtime(&time);
  std::stringstream ss;
  ss << std::put_time(tm, "%Y-%m-%d %H:%M:%S");
  return ss.str();
}

google::protobuf::Timestamp TimeT2GoogleTimestamp(const std::time_t &time) {
  google::protobuf::Timestamp timestamp;
  timestamp.set_seconds(time);
  timestamp.set_nanos(0);

  return timestamp;
}

google::protobuf::Timestamp PqxxField2GoogleTimestamp(
    const pqxx::field &field) {
  std::tm tm = {};
  std::stringstream ss(pqxx::to_string(field));
  ss >> std::get_time(&tm, "%Y-%m-%d %H:%M:%S");
  time_t time_in_seconds = std::mktime(&tm);

  return TimeT2GoogleTimestamp(time_in_seconds);
}

subscription_pb::ResponseMetadata GenerateMetadata(
    const std::string &request_id) {
  subscription_pb::ResponseMetadata metadata;
  metadata.set_request_id(request_id);

  auto now = std::chrono::system_clock::now();
  int nanos = std::chrono::duration_cast<std::chrono::nanoseconds>(
                  now.time_since_epoch())
                  .count() %
              1000000000;
  int seconds =
      std::chrono::duration_cast<std::chrono::seconds>(now.time_since_epoch())
          .count();

  auto timestamp = metadata.mutable_timestamp();
  timestamp->set_seconds(seconds);
  timestamp->set_nanos(nanos);

  return metadata;
}

subscription_pb::SubscriptionMessage CreateSubscriptionMessage(pqxx::row &row) {
  subscription_pb::SubscriptionMessage subscription_message;
  subscription_message.set_id(row["id"].c_str());
  subscription_message.set_email(row["email"].c_str());
  subscription_message.set_stripe_subscription_id(
      row["stripe_subscription_id"].c_str());
  subscription_message.set_status(row["status"].c_str());

  auto first_subscribed_ptr = subscription_message.mutable_first_subscribed();
  *first_subscribed_ptr = PqxxField2GoogleTimestamp(row["first_subscribed"]);

  auto subscribed_until_ptr = subscription_message.mutable_subscribed_until();
  *subscribed_until_ptr = PqxxField2GoogleTimestamp(row["subscribed_until"]);

  auto cancelled_at_ptr = subscription_message.mutable_cancelled_at();
  *cancelled_at_ptr = PqxxField2GoogleTimestamp(row["cancelled_at"]);

  return subscription_message;
}