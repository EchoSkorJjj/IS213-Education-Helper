#include <iostream>
#include <grpcpp/grpcpp.h>
#include "pb/subscriptions.pb.h"
#include "proto-services/subscriptions.cpp"

int main() {
    std::string server_address = "0.0.0.0:50053";
    SubscriptionService service;

    grpc::ServerBuilder builder;
    builder.AddListeningPort(server_address, grpc::InsecureServerCredentials());
    builder.RegisterService(&service);

    std::unique_ptr<grpc::Server> server(builder.BuildAndStart());
    std::cout << "Server listening on " << server_address << std::endl;
    server->Wait();

    return 0;
}


// #include <grpcpp/grpcpp.h>
// #include "pb/subscriptions.pb.h"

// int main(int argc, char** argv) {
//     std::string server_address = "0.0.0.0:50053";
//     SubscriptionService service;
    
//     grpc::ServerBuilder builder;
//     builder.AddListeningPort(server_address, grpc::InsecureServerCredentials());
//     builder.RegisterService(&service);
//     std::unique_ptr<grpc::Server> server(builder.BuildAndStart());
//     std::cout << "Server listening on " << server_address << std::endl;

//     server->Wait();

//     return 0;
// }