#include <pqxx/pqxx>
#include <dotenv.h>

class Database
{
public:
    static Database &getInstance();
    
    template <typename... Args>
    pqxx::result query(const std::string &sql, Args... args);

private:
    pqxx::connection conn;

    Database();
    Database(const Database &) = delete;
    Database &operator=(const Database &) = delete;
};