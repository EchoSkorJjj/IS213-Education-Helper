#include "../../include/utils.h"

template <typename T>
google::protobuf::Any pack_to_any(const T& message) {
    google::protobuf::Any any;
    any.PackFrom(message);
    return any;   
}