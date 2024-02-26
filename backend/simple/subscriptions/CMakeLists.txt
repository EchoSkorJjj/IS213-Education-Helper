cmake_minimum_required(VERSION 3.13)
project(SUBSCRIPTIONS_SERVICE)

# Find the gRPC package
find_package(protobuf CONFIG REQUIRED)
find_package(gRPC CONFIG REQUIRED)

# Add the server executable
add_executable(SUBSCRIPTIONS_SERVICE
    pb/subscriptions.pb.cc
    pb/subscriptions.grpc.pb.cc
    proto-services/subscriptions.cpp
    server.cpp
)

# # Link the server executable with the gRPC libraries
target_link_libraries(SUBSCRIPTIONS_SERVICE
    gRPC::grpc++
    gRPC::grpc++_reflection
    protobuf::libprotobuf
)