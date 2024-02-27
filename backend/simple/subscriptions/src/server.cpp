#include <iostream>
#include <grpcpp/grpcpp.h>
#include <dotenv.h>
#include "../pb/subscriptions.pb.h"
#include "database.h"
#include "./proto-services/subscriptions.cpp"

int main() {
    dotenv::init();

    std::string server_address = std::getenv("GRPC_SERVER_ADDRESS");
    SubscriptionService service;

    grpc::ServerBuilder builder;
    builder.AddListeningPort(server_address, grpc::InsecureServerCredentials());
    builder.RegisterService(&service);
    Database &db = Database::getInstance();

    std::unique_ptr<grpc::Server> server(builder.BuildAndStart());
    std::cout << "Server listening on " << server_address << std::endl;
    server->Wait();

    return 0;
}
