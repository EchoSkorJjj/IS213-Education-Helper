import * as grpc from '@grpc/grpc-js';
import { user_storage_pb } from '../../pb/user_storage';
import * as google_timestamp from '../../pb/google/protobuf/timestamp';
import * as google_any from '../../pb/google/protobuf/any';
import logger from '../logger/logger';
class UserStorage extends user_storage_pb.UnimplementedUserStorageService {
    GoogleAuth(call: grpc.ServerUnaryCall<user_storage_pb.AuthRequest, user_storage_pb.ServiceResponseWrapper>, callback: grpc.sendUnaryData<user_storage_pb.ServiceResponseWrapper>): void {
        const metadata = call.metadata.getMap();
    
        // Retrieve the Kong request ID from the metadata
        const request_id_raw = metadata['kong-request-id'];
        const request_id = Array.isArray(request_id_raw) ? request_id_raw[0] : request_id_raw;
        const request_id_str = typeof request_id === 'string' ? request_id : request_id?.toString();

        const code = call.request.code;

        logger.info(request_id);
        logger.info(code);

        if (!code) {
            const error = {
                code: grpc.status.INVALID_ARGUMENT,
                message: 'Auth code is required'
            };
            callback(error, null); 
            return;
        }

        // Current time in seconds and nanoseconds for the Timestamp
        const now = new Date();
        const seconds = Math.floor(now.getTime() / 1000);
        const nanos = (now.getTime() % 1000) * 1000000;

        const timestamp = new google_timestamp.google.protobuf.Timestamp({
            seconds: seconds,
            nanos: nanos
        });

        const responseMetadata = new user_storage_pb.ResponseMetadata();
        responseMetadata.request_id = request_id_str;
        responseMetadata.timestamp = timestamp;

        const payload = new google_any.google.protobuf.Any({
            type_url: 'google.protobuf.StringValue',
            value: Buffer.from(JSON.stringify({
                username: 'testuser',
                role: 'Admin'
            }))
        })

        const serviceResponse = new user_storage_pb.ServiceResponseWrapper();
        serviceResponse.metadata = responseMetadata;
        serviceResponse.payload = payload;

        callback(null, serviceResponse);
    }

    AppleAuth(call: grpc.ServerUnaryCall<user_storage_pb.AuthRequest, user_storage_pb.ServiceResponseWrapper>, callback: grpc.sendUnaryData<user_storage_pb.ServiceResponseWrapper>): void {
        logger.info(call.request.code);

        callback(null, new user_storage_pb.ServiceResponseWrapper(
            
        ));
    }

    GetUser(call: grpc.ServerUnaryCall<user_storage_pb.GetUserRequest, user_storage_pb.ServiceResponseWrapper>, callback: grpc.sendUnaryData<user_storage_pb.ServiceResponseWrapper>): void {
        logger.info(call.request.user_id);

        callback(null, new user_storage_pb.ServiceResponseWrapper(
            
        ));
    }

    UpdateUser(call: grpc.ServerUnaryCall<user_storage_pb.UpdateUserRequest, user_storage_pb.ServiceResponseWrapper>, callback: grpc.sendUnaryData<user_storage_pb.ServiceResponseWrapper>): void {
        logger.info(call.request.user.user_id);
        logger.info(call.request.user.username);
        logger.info(call.request.user.first_name);
        logger.info(call.request.user.last_name);
        logger.info(call.request.user.email);

        callback(null, new user_storage_pb.ServiceResponseWrapper(
            
        ));
    }

    DeleteUser(call: grpc.ServerUnaryCall<user_storage_pb.DeleteUserRequest, user_storage_pb.ServiceResponseWrapper>, callback: grpc.sendUnaryData<user_storage_pb.ServiceResponseWrapper>): void {
        logger.info(call.request.user_id);

        callback(null, new user_storage_pb.ServiceResponseWrapper(
            
        ));
    }

    CheckHealth(call: grpc.ServerUnaryCall<user_storage_pb.HealthCheckRequest, user_storage_pb.HealthCheckResponse>, callback: grpc.sendUnaryData<user_storage_pb.HealthCheckResponse>): void {
        callback(null, new user_storage_pb.HealthCheckResponse(
            
        ));
    }
    
}

export default UserStorage;