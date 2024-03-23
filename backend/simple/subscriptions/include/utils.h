#ifndef UTILS_H
#define UTILS_H

#include <grpcpp/grpcpp.h>

#include <pqxx/pqxx>

#include "../pb/subscriptions.grpc.pb.h"

std::string TimeT2String(const time_t &time);
google::protobuf::Timestamp TimeT2GoogleTimestamp(const time_t &time);
google::protobuf::Timestamp PqxxField2GoogleTimestamp(const pqxx::field &field);
subscription_pb::ResponseMetadata GenerateMetadata(
    const std::string &request_id);
subscription_pb::SubscriptionMessage CreateSubscriptionMessage(pqxx::row &row);
#endif