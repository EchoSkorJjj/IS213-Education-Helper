import { user_storage_pb } from '../../pb/user_storage';
import * as GoogleTimestamp from "../../pb/google/protobuf/timestamp";
import * as GoogleAny from '../../pb/google/protobuf/any';

export const getResponseMetaData = (request_id: string, timestamp: GoogleTimestamp.google.protobuf.Timestamp): user_storage_pb.ResponseMetadata => {
    const responseMetadata = new user_storage_pb.ResponseMetadata();
    responseMetadata.request_id = request_id;
    responseMetadata.timestamp = timestamp;
    return responseMetadata;
}

export const getServiceResponse = (metadata: user_storage_pb.ResponseMetadata, payload: GoogleAny.google.protobuf.Any): user_storage_pb.ServiceResponseWrapper => {
    const serviceResponse = new user_storage_pb.ServiceResponseWrapper();
    serviceResponse.metadata = metadata;
    serviceResponse.payload = payload;
    return serviceResponse;
}