#include "../../include/utils.h"

#include <iomanip>

#include "../../pb/subscriptions.grpc.pb.h"

std::string TimeT2String(const std::time_t &time) {
  std::tm *tm = std::gmtime(&time);
  std::stringstream ss;
  ss << std::put_time(tm, "%Y-%m-%d %H:%M:%S");
  return ss.str();
}

google::protobuf::Timestamp TimeT2GoogleTimestamp(const std::time_t &time) {
  google::protobuf::Timestamp timestamp;
  timestamp.set_seconds(time);
  timestamp.set_nanos(0);

  return timestamp;
}

google::protobuf::Timestamp PqxxField2GoogleTimestamp(
    const pqxx::field &field) {
  std::tm tm = {};
  std::stringstream ss(pqxx::to_string(field));
  ss >> std::get_time(&tm, "%Y-%m-%d %H:%M:%S");
  time_t time_in_seconds = std::mktime(&tm);

  return TimeT2GoogleTimestamp(time_in_seconds);
}

subscription_pb::ResponseMetadata GenerateMetadata(
    const std::string &request_id) {
  subscription_pb::ResponseMetadata metadata;
  metadata.set_request_id(request_id);

  auto now = std::chrono::system_clock::now();
  int nanos = std::chrono::duration_cast<std::chrono::nanoseconds>(
                  now.time_since_epoch())
                  .count() %
              1000000000;
  int seconds =
      std::chrono::duration_cast<std::chrono::seconds>(now.time_since_epoch())
          .count();

  auto timestamp = metadata.mutable_timestamp();
  timestamp->set_seconds(seconds);
  timestamp->set_nanos(nanos);

  return metadata;
}