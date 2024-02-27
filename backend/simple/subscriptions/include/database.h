#ifndef DATABASE_H
#define DATABASE_H

#include <pqxx/pqxx>
#include <dotenv.h>
#include "../pb/subscriptions.pb.h"

class Database
{
public:
    static Database &getInstance();
    
    pqxx::result getSubscriptionByUserId(const std::string &user_id);
    subscription_pb::SubscriptionMessage createOrUpdateSubscriptionByUserId(const std::string &user_id, const time_t subscribed_until);
    pqxx::result getExpiredSubscriptions();
    pqxx::result deleteSubscriptionByUserId(const std::string &user_id);

private:
    pqxx::connection conn;

    Database();
    Database(const Database &) = delete;
    Database &operator=(const Database &) = delete;
};

#endif