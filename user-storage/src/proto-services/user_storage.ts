import * as grpc from '@grpc/grpc-js';
import { user_storage_pb } from '../../pb/user_storage';
import logger from '../logger/logger';

class UserStorage extends user_storage_pb.UnimplementedUserStorageService {
    Test(call: grpc.ServerUnaryCall<user_storage_pb.TestRequest, user_storage_pb.TestResponse>, callback: grpc.sendUnaryData<user_storage_pb.TestResponse>): void {
        logger.info(call.request.message);

        callback(null, new user_storage_pb.TestResponse(
            {
                message: call.request.message
            }
        ));
    }

    Authenticate(call: grpc.ServerUnaryCall<user_storage_pb.AuthRequest, user_storage_pb.ServiceResponseWrapper>, callback: grpc.sendUnaryData<user_storage_pb.ServiceResponseWrapper>): void {
        logger.info(call.request.request_id);
        logger.info(call.request.google_oauth_code);

        callback(null, new user_storage_pb.ServiceResponseWrapper(
            
        ));
    }

    GetUser(call: grpc.ServerUnaryCall<user_storage_pb.GetUserRequest, user_storage_pb.ServiceResponseWrapper>, callback: grpc.sendUnaryData<user_storage_pb.ServiceResponseWrapper>): void {
        logger.info(call.request.request_id);
        logger.info(call.request.user_id);

        callback(null, new user_storage_pb.ServiceResponseWrapper(
            
        ));
    }

    UpdateUser(call: grpc.ServerUnaryCall<user_storage_pb.UpdateUserRequest, user_storage_pb.ServiceResponseWrapper>, callback: grpc.sendUnaryData<user_storage_pb.ServiceResponseWrapper>): void {
        logger.info(call.request.request_id);
        logger.info(call.request.user.user_id);
        logger.info(call.request.user.username);
        logger.info(call.request.user.first_name);
        logger.info(call.request.user.last_name);
        logger.info(call.request.user.email);

        callback(null, new user_storage_pb.ServiceResponseWrapper(
            
        ));
    }

    DeleteUser(call: grpc.ServerUnaryCall<user_storage_pb.DeleteUserRequest, user_storage_pb.ServiceResponseWrapper>, callback: grpc.sendUnaryData<user_storage_pb.ServiceResponseWrapper>): void {
        logger.info(call.request.request_id);
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