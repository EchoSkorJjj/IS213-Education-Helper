#ifndef DATABASE_H
#define DATABASE_H

#include <dotenv.h>

#include <pqxx/pqxx>

#include "../pb/subscriptions.pb.h"

class Database {
 public:
  static Database& GetInstance();

  subscription_pb::SubscriptionMessage GetSubscriptionByEmail(
      const std::string& user_id);
  subscription_pb::SubscriptionMessage CreateOrUpdateSubscriptionByEmail(
      const std::string& user_id, const time_t subscribed_until);
  std::vector<subscription_pb::SubscriptionMessage> GetExpiredSubscriptions();
  subscription_pb::SubscriptionMessage DeleteSubscriptionByEmail(
      const std::string& user_id);

 private:
  pqxx::connection conn_;

  Database();
  Database(const Database&) = delete;
  Database& operator=(const Database&) = delete;
};

#endif