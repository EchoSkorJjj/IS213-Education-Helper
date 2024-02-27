#include "../../include/database.h"
#include "../../include/utils.h"
#include "../../pb/subscriptions.pb.h"

Database &Database::getInstance()
{
    static Database instance;
    return instance;
}

subscription_pb::SubscriptionMessage Database::getSubscriptionByUserId(const std::string &user_id)
{
    pqxx::work W(conn);
    std::string query = "SELECT * FROM subscriptions WHERE user_id = $1";

    pqxx::result results = W.exec_params(query, user_id);
    W.commit();

    if (results.empty())
    {
        throw std::runtime_error("No subscription found for user");
    }

    subscription_pb::SubscriptionMessage subscription_message;
    auto row = results[0];
    subscription_message.set_subscription_id(row["id"].c_str());
    subscription_message.set_user_id(row["user_id"].c_str());
    auto timestamp_ptr = subscription_message.mutable_subscribed_until();
    *timestamp_ptr = pqxx_field_to_timestamp(row["subscribed_until"]);

    return subscription_message;
}

subscription_pb::SubscriptionMessage Database::createOrUpdateSubscriptionByUserId(const std::string &user_id, const time_t subscribed_until)
{
    std::string timestamp_str = time_t_to_string(subscribed_until);

    pqxx::work W(conn);
    std::string insert_query = "INSERT INTO subscriptions (user_id, subscribed_until) "
                               "VALUES ($1, $2) "
                               "ON CONFLICT (user_id) DO UPDATE "
                               "SET subscribed_until = $2";

    W.exec_params(insert_query, user_id, timestamp_str);

    std::string select_query = "SELECT * FROM subscriptions WHERE user_id = $1";
    pqxx::result select_results = W.exec_params(select_query, user_id);
    W.commit();

    if (select_results.empty())
    {
        throw std::runtime_error("Failed to create or update subscription");
    }

    subscription_pb::SubscriptionMessage subscription_message;
    auto row = select_results[0];
    subscription_message.set_subscription_id(row["id"].c_str());
    subscription_message.set_user_id(row["user_id"].c_str());

    auto timestamp_ptr = subscription_message.mutable_subscribed_until();
    *timestamp_ptr = pqxx_field_to_timestamp(row["subscribed_until"]);

    return subscription_message;
}

std::vector<subscription_pb::SubscriptionMessage> Database::getExpiredSubscriptions()
{
    time_t current_time = std::time(nullptr);
    std::string current_timestamp_str = time_t_to_string(current_time);

    pqxx::work W(conn);
    std::string query = "SELECT * FROM subscriptions WHERE subscribed_until <= $1";

    pqxx::result results = W.exec_params(query, current_timestamp_str);
    W.commit();

    std::vector<subscription_pb::SubscriptionMessage> expired_subscriptions;
    for (auto row : results)
    {
        subscription_pb::SubscriptionMessage subscription_message;
        subscription_message.set_subscription_id(row["id"].c_str());
        subscription_message.set_user_id(row["user_id"].c_str());

        auto timestamp_ptr = subscription_message.mutable_subscribed_until();
        *timestamp_ptr = pqxx_field_to_timestamp(row["subscribed_until"]);

        expired_subscriptions.push_back(subscription_message);
    }

    return expired_subscriptions;
}

subscription_pb::SubscriptionMessage Database::deleteSubscriptionByUserId(const std::string &user_id)
{
    pqxx::work W(conn);

    std::string select_query = "SELECT * FROM subscriptions WHERE user_id = $1";
    pqxx::result select_results = W.exec_params(select_query, user_id);

    if (select_results.empty())
    {
        throw std::runtime_error("No subscription found for user");
    }

    subscription_pb::SubscriptionMessage subscription_message;
    auto row = select_results[0];
    subscription_message.set_subscription_id(row["id"].c_str());
    subscription_message.set_user_id(row["user_id"].c_str());

    auto timestamp_ptr = subscription_message.mutable_subscribed_until();
    *timestamp_ptr = pqxx_field_to_timestamp(row["subscribed_until"]);

    std::string delete_query = "DELETE FROM subscriptions WHERE user_id = $1";
    pqxx::result delete_results = W.exec_params(delete_query, user_id);
    W.commit();

    if (delete_results.affected_rows() == 0)
    {
        throw std::runtime_error("Failed to delete subscription");
    }

    return subscription_message;
}

Database::Database() : conn(std::string("dbname=") + std::getenv("DB_NAME") +
                            " user=" + std::getenv("DB_USER") +
                            " password=" + std::getenv("DB_PASSWORD") +
                            " host=" + std::getenv("DB_HOSTADDR") +
                            " port=" + std::getenv("DB_PORT"))
{
    if (!conn.is_open())
    {
        throw std::runtime_error("Can't open database");
    }
}