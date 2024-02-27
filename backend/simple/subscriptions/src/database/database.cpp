#include "../../include/database.h"

Database &Database::getInstance()
{
    static Database instance;
    return instance;
}

template <typename... Args>
pqxx::result Database::query(const std::string &sql, Args... args)
{
    pqxx::work W(conn);
    pqxx::result R = W.exec_params(sql, args...);
    W.commit();
    return R;
}

Database::Database() : 
    conn(std::string("dbname=") + std::getenv("DB_NAME") + 
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