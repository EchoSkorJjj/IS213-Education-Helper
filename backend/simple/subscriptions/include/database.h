#ifndef DATABASE_H
#define DATABASE_H

#include <dotenv.h>

#include <pqxx/pqxx>

#include "../pb/subscriptions.pb.h"

class Database {
 public:
  static Database& GetInstance();

  subscription_pb::SubscriptionMessage GetSubscriptionByEmail(
      const std::string& email);
  subscription_pb::SubscriptionMessage CreateOrUpdateSubscription(
      const std::string& email, const time_t subscribed_until,
      const std::string& subscription_id);

  std::vector<subscription_pb::SubscriptionMessage> GetExpiredSubscriptions();
  subscription_pb::SubscriptionMessage CancelSubscriptionByEmail(
      const std::string& user_id);

    subscription_pb::SubscriptionMessage DeleteExpiredSubscriptionByEmail(const std::string& email);

 private:
  pqxx::connection conn_;

  Database();
  Database(const Database&) = delete;
  Database& operator=(const Database&) = delete;
};

#endif