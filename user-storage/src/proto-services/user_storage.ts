import * as grpc from '@grpc/grpc-js';
import { user_storage_pb } from '../../pb/user_storage';
import logger from '../logger/logger';

import AuthService from '../services/auth.service';

import { dateToGoogleTimeStamp, getPayload, getResponseMetaData, getServiceResponse, getMetaData } from '../utils';

class UserStorage extends user_storage_pb.UnimplementedUserStorageService {
    async GoogleAuth(call: grpc.ServerUnaryCall<user_storage_pb.AuthRequest, user_storage_pb.ServiceResponseWrapper>, callback: grpc.sendUnaryData<user_storage_pb.ServiceResponseWrapper>): Promise<void> {
        const metadata = call.metadata.getMap();
    
        const request_id = getMetaData(metadata, 'kong-request-id');

        const code = call.request.code;

        logger.info(request_id);

        if (!code) {
            const error = {
                code: grpc.status.INVALID_ARGUMENT,
                message: 'Auth code is required'
            };
            callback(error, null); 
            return;
        }

        try {
            const authService = new AuthService();

            // Get user data from Google API
            const userData = await authService.handleGoogleLogin(code);

            // Current date and convert to Google Timestamp
            const currentDate = new Date();
            const timestamp = dateToGoogleTimeStamp(currentDate);

            // Create a payload
            const payload = getPayload('user_storage.AuthResponse', {
                username: userData.name,
                email: userData.email,
                role: 'User'
            });

            const responseMetadata = getResponseMetaData(request_id, timestamp);
            const serviceResponse = getServiceResponse(responseMetadata, payload);

            callback(null, serviceResponse);
        } catch (err: any) {
            logger.error(err);
            const error = {
                code: grpc.status.INTERNAL,
                message: err.message,
            };
            callback(error, null);
        }
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