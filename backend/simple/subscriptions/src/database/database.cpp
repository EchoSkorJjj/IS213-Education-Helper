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

  pqxx::row row = results[0];
  subscription_pb::SubscriptionMessage subscription_message =
      CreateSubscriptionMessage(row);
  return subscription_message;
}

subscription_pb::SubscriptionMessage Database::CreateOrUpdateSubscription(
    const std::string &email, const time_t subscribed_until,
    const std::string &stripe_subscription_id) {
  std::string timestamp_str = TimeT2String(subscribed_until);

  pqxx::work W(conn_);
  std::string insert_query =
      "INSERT INTO subscriptions"
      " (email, stripe_subscription_id, first_subscribed, subscribed_until, "
      "status) VALUES ($1, $2, NOW(), $3, 'active')"
      " ON CONFLICT (email) DO UPDATE SET subscribed_until = $3, "
      "stripe_subscription_id = $2";

  W.exec_params(insert_query, email, stripe_subscription_id, timestamp_str);

  std::string select_query = "SELECT * FROM subscriptions WHERE email = $1";
  pqxx::result select_results = W.exec_params(select_query, email);

  if (select_results.empty()) {
    throw std::runtime_error(
        "Failed to create or update subscription: no subscription found");
  }
  W.commit();

  pqxx::row row = select_results[0];
  subscription_pb::SubscriptionMessage subscription_message =
      CreateSubscriptionMessage(row);
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
  for (pqxx::row row : results) {
    subscription_pb::SubscriptionMessage subscription_message =
        CreateSubscriptionMessage(row);
    expired_subscriptions.push_back(subscription_message);
  }

  return expired_subscriptions;
}

subscription_pb::SubscriptionMessage Database::DeleteExpiredSubscriptionByEmail(
    const std::string &email) {
  pqxx::work W(conn_);

  std::string select_query = "SELECT * FROM subscriptions WHERE email = $1";
  pqxx::result select_results = W.exec_params(select_query, email);

  if (select_results.empty()) {
    throw std::runtime_error("No subscription found for user");
  }

  pqxx::row row = select_results[0];
  subscription_pb::SubscriptionMessage subscription_message =
      CreateSubscriptionMessage(row);
    
  time_t current_time = std::time(nullptr);
  time_t subscribed_until_time = subscription_message.subscribed_until().seconds();

  if (subscribed_until_time > current_time) {
    throw std::runtime_error("Subscription has not expired yet");
  }

  std::string delete_query = "DELETE FROM subscriptions WHERE email = $1";
  pqxx::result delete_results = W.exec_params(delete_query, email);
  W.commit();

  if (delete_results.affected_rows() == 0) {
    throw std::runtime_error("Failed to delete subscription");
  }

  return subscription_message;
}

subscription_pb::SubscriptionMessage Database::CancelSubscriptionByEmail(
    const std::string &email) {
  pqxx::work W(conn_);

  std::string select_query = "SELECT * FROM subscriptions WHERE email = $1";
  pqxx::result select_results = W.exec_params(select_query, email);

  if (select_results.empty()) {
    throw std::runtime_error("No subscription found for user");
  }

  pqxx::row row = select_results[0];
  subscription_pb::SubscriptionMessage subscription_message =
      CreateSubscriptionMessage(row);

  std::string update_query =
      "UPDATE subscriptions SET status = 'cancelled', cancelled_at = NOW() "
      "WHERE email = $1";
  pqxx::result update_results = W.exec_params(update_query, email);
  W.commit();

  if (update_results.affected_rows() == 0) {
    throw std::runtime_error("Failed to cancel subscription");
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