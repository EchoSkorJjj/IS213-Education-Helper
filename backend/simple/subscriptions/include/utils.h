#ifndef UTILS_H
#define UTILS_H

#include <pqxx/pqxx>
#include <grpcpp/grpcpp.h>
#include "../pb/subscriptions.grpc.pb.h"

std::string time_t_to_string(const time_t &time);
google::protobuf::Timestamp time_t_to_timestamp(const time_t &time);
google::protobuf::Timestamp pqxx_field_to_timestamp(const pqxx::field &field);

#endif