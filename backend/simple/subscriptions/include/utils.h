#ifndef UTILS_H
#define UTILS_H

#include <grpcpp/grpcpp.h>

template <typename T>
google::protobuf::Any pack_to_any(const T &message);

#endif