#include <dotenv.h>
#include <grpcpp/grpcpp.h>

#include <iostream>

#include "../pb/health.pb.h"
#include "../pb/subscriptions.pb.h"
#include "./proto-services/health.cpp"
#include "./proto-services/subscriptions.cpp"
#include "database.h"

int main() {
  dotenv::init();

  std::string server_address = std::getenv("GRPC_SERVER_ADDRESS");
  SubscriptionService service;
  HealthService health;

  grpc::ServerBuilder builder;
  builder.AddListeningPort(server_address, grpc::InsecureServerCredentials());
  builder.RegisterService(&service);
  builder.RegisterService(&health);
  Database &db = Database::GetInstance();

  std::unique_ptr<grpc::Server> server(builder.BuildAndStart());
  std::cout << "Server listening on " << server_address << std::endl;
  server->Wait();

  return 0;
}
