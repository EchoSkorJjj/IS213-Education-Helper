cmake_minimum_required(VERSION 3.13)
project(SUBSCRIPTIONS_SERVICE)

include_directories(${CMAKE_SOURCE_DIR}/include)
find_package(protobuf CONFIG REQUIRED)
find_package(gRPC CONFIG REQUIRED)

find_library(PQXX_LIB pqxx)
find_library(PQ_LIB pq)

add_executable(SUBSCRIPTIONS_SERVICE
    pb/subscriptions.pb.cc
    pb/subscriptions.grpc.pb.cc
    src/proto-services/subscriptions.cpp
    src/database/database.cpp
    src/server.cpp
)

target_link_libraries(SUBSCRIPTIONS_SERVICE
    gRPC::grpc++
    gRPC::grpc++_reflection
    protobuf::libprotobuf
    ${PQXX_LIB}
    ${PQ_LIB})