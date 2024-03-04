#include "../../include/database.h"

#include "../../include/utils.h"
#include "../../pb/subscriptions.pb.h"

Database &Database::GetInstance() {
  static Database instance;
  return instance;
}

subscription_pb::SubscriptionMessage Database::GetSubscriptionByEmail(
    const std::string &email) {
  pqxx::work W(conn_);
  std::string query = "SELECT * FROM subscriptions WHERE email = $1";

  pqxx::result results = W.exec_params(query, email);
  W.commit();

  if (results.empty()) {
    throw std::runtime_error("No subscription found for user");
  }

  subscription_pb::SubscriptionMessage subscription_message;
  auto row = results[0];
  subscription_message.set_subscription_id(row["id"].c_str());
  subscription_message.set_email(row["email"].c_str());
  auto timestamp_ptr = subscription_message.mutable_subscribed_until();
  *timestamp_ptr = PqxxField2GoogleTimestamp(row["subscribed_until"]);

  return subscription_message;
}

subscription_pb::SubscriptionMessage
Database::CreateOrUpdateSubscriptionByEmail(const std::string &email,
                                             const time_t subscribed_until) {
  std::string timestamp_str = TimeT2String(subscribed_until);

  pqxx::work W(conn_);
  std::string insert_query =
      "INSERT INTO subscriptions (email, subscribed_until) "
      "VALUES ($1, $2) "
      "ON CONFLICT (email) DO UPDATE "
      "SET subscribed_until = $2";

  W.exec_params(insert_query, email, timestamp_str);

  std::string select_query = "SELECT * FROM subscriptions WHERE email = $1";
  pqxx::result select_results = W.exec_params(select_query, email);
  W.commit();

  if (select_results.empty()) {
    throw std::runtime_error("Failed to create or update subscription");
  }

  subscription_pb::SubscriptionMessage subscription_message;
  auto row = select_results[0];
  subscription_message.set_subscription_id(row["id"].c_str());
  subscription_message.set_email(row["email"].c_str());

  auto timestamp_ptr = subscription_message.mutable_subscribed_until();
  *timestamp_ptr = PqxxField2GoogleTimestamp(row["subscribed_until"]);

  return subscription_message;
}

std::vector<subscription_pb::SubscriptionMessage>
Database::GetExpiredSubscriptions() {
  time_t current_time = std::time(nullptr);
  std::string current_timestamp_str = TimeT2String(current_time);

  pqxx::work W(conn_);
  std::string query =
      "SELECT * FROM subscriptions WHERE subscribed_until <= $1";

  pqxx::result results = W.exec_params(query, current_timestamp_str);
  W.commit();

  std::vector<subscription_pb::SubscriptionMessage> expired_subscriptions;
  for (auto row : results) {
    subscription_pb::SubscriptionMessage subscription_message;
    subscription_message.set_subscription_id(row["id"].c_str());
    subscription_message.set_email(row["email"].c_str());

    auto timestamp_ptr = subscription_message.mutable_subscribed_until();
    *timestamp_ptr = PqxxField2GoogleTimestamp(row["subscribed_until"]);

    expired_subscriptions.push_back(subscription_message);
  }

  return expired_subscriptions;
}

subscription_pb::SubscriptionMessage Database::DeleteSubscriptionByEmail(
    const std::string &email) {
  pqxx::work W(conn_);

  std::string select_query = "SELECT * FROM subscriptions WHERE email = $1";
  pqxx::result select_results = W.exec_params(select_query, email);

  if (select_results.empty()) {
    throw std::runtime_error("No subscription found for user");
  }

  subscription_pb::SubscriptionMessage subscription_message;
  auto row = select_results[0];
  subscription_message.set_subscription_id(row["id"].c_str());
  subscription_message.set_email(row["email"].c_str());

  auto timestamp_ptr = subscription_message.mutable_subscribed_until();
  *timestamp_ptr = PqxxField2GoogleTimestamp(row["subscribed_until"]);

  std::string delete_query = "DELETE FROM subscriptions WHERE email = $1";
  pqxx::result delete_results = W.exec_params(delete_query, email);
  W.commit();

  if (delete_results.affected_rows() == 0) {
    throw std::runtime_error("Failed to delete subscription");
  }

  return subscription_message;
}

Database::Database()
    : conn_(std::string("dbname=") + std::getenv("DB_NAME") + " user=" +
            std::getenv("DB_USER") + " password=" + std::getenv("DB_PASSWORD") +
            " host=" + std::getenv("DB_HOSTADDR") +
            " port=" + std::getenv("DB_PORT")) {
  if (!conn_.is_open()) {
    throw std::runtime_error("Can't open database");
  }
}