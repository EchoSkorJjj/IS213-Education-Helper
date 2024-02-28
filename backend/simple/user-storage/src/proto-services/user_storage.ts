import * as grpc from '@grpc/grpc-js';
import { generatePkcePair } from '@opengovsg/sgid-client'

import { user_storage_pb } from '../../pb/user_storage';
import logger from '../logger/logger';
import AuthService from '../services/auth.service';
import RedisService from '../services/redis.service';
import OAuthClientService from '../services/oauth.service';
import JWTHandler from '../middleware/jwtMiddleware';
import { isNullOrUndefined } from '../utils';

import { 
    dateToGoogleTimeStamp, 
    getPayload, 
    getResponseMetaData, 
    getServiceResponse, 
    getMetaData 
} from '../utils';

class UserStorage extends user_storage_pb.UnimplementedUserStorageService {
    async GoogleAuth(call: grpc.ServerUnaryCall<user_storage_pb.AuthRequest, user_storage_pb.ServiceResponseWrapper>, callback: grpc.sendUnaryData<user_storage_pb.ServiceResponseWrapper>): Promise<void> {
        const metadata = call.metadata.getMap();
    
        const request_id = getMetaData(metadata, 'kong-request-id');

        const GOOGLE_OAUTH_CODE = call.request.code;

        const code_error = isNullOrUndefined(GOOGLE_OAUTH_CODE);
        if (code_error) {
            callback(code_error, null); 
            return;
        }

        try {
            const jwtHandler = JWTHandler.getInstance();
            const authService = AuthService.getInstance();

            // Get user data from Google API
            const userData = await authService.handleGoogleLogin(GOOGLE_OAUTH_CODE);

            // Current date and convert to Google Timestamp
            const currentDate = new Date();
            const timestamp = dateToGoogleTimeStamp(currentDate);

            // Create a payload
            const payload = getPayload('user_storage.AuthResponse', {
                user_id: userData.user_id,
                username: userData.username,
                email: userData.email,
                role: userData.role,
                profile_pic: userData.profile_pic,
                is_paid: userData.is_paid,
            });

            const access_token = jwtHandler.createJWT('10m', {
                user_id: userData.user_id,
                role: userData.role
            });

            const metadata = new grpc.Metadata();
            metadata.set('x-access-token', access_token);
            call.sendMetadata(metadata);

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

    async MyInfoCode(call: grpc.ServerUnaryCall<user_storage_pb.MyInfoCodeRequest, user_storage_pb.MyInfoCodeResponse>, callback: grpc.sendUnaryData<user_storage_pb.MyInfoCodeResponse>): Promise<void> {
        const oAuthClientService = OAuthClientService.getInstance();
        const connector = oAuthClientService.myInfoConnector;

        const jwtHandler = JWTHandler.getInstance();

        const pkceCodePair = connector.generatePKCECodePair();

        const MYINFO_UNIQUE_ID = jwtHandler.createJWT('5m', { myinfo_auth: true });
        try {
            const redisClient = RedisService.getInstance();

            await redisClient.set(`myinfo_auth_flow:${MYINFO_UNIQUE_ID}`, pkceCodePair.codeVerifier, 300);
            
            const metadata = new grpc.Metadata();
            metadata.set('x-myinfo-unique-id', MYINFO_UNIQUE_ID);
            call.sendMetadata(metadata);

            callback(null, new user_storage_pb.MyInfoCodeResponse(
                {
                    code_challenge: pkceCodePair.codeChallenge,
                }
            ));
        } catch (err: any) {
            logger.error(err);
            const error = {
                code: grpc.status.INTERNAL,
                message: err.message,
            };
            callback(error, null);
        }
    }

    async MyInfoAuth(call: grpc.ServerUnaryCall<user_storage_pb.AuthRequest, user_storage_pb.ServiceResponseWrapper>, callback: grpc.sendUnaryData<user_storage_pb.ServiceResponseWrapper>): Promise<void> {
        const jwtHandler = JWTHandler.getInstance();

        const metadata = call.metadata.getMap();
        const request_id = getMetaData(metadata, 'kong-request-id');
        const MYINFO_OAUTH_CODE = call.request.code;

        const MYINFO_UNIQUE_ID = getMetaData(metadata, 'authorization');
        const MYINFO_UNIQUE_ID_ERROR = isNullOrUndefined(MYINFO_UNIQUE_ID);
        if (MYINFO_UNIQUE_ID_ERROR) {
            callback(MYINFO_UNIQUE_ID_ERROR, null);
            return;
        }

        const token = MYINFO_UNIQUE_ID.split(' ')[1]?.trim(); 
        try {
            const authService = AuthService.getInstance();

            // Get the user data from MyInfo API
            const userData = await authService.handleMyInfoLogin(MYINFO_OAUTH_CODE, token);

            // Current date and convert to Google Timestamp
            const currentDate = new Date();
            const timestamp = dateToGoogleTimeStamp(currentDate);

            // Create a payload
            const payload = getPayload('user_storage.AuthResponse', {
                user_id: userData.user_id,
                username: userData.username,
                email: userData.email,
                role: userData.role,
                profile_pic: userData.profile_pic,
                is_paid: userData.is_paid,
            });

            const access_token = jwtHandler.createJWT('10m', {
                user_id: userData.user_id,
                role: userData.role
            });

            const newMetadata = new grpc.Metadata();
            newMetadata.set('x-access-token', access_token);
            call.sendMetadata(newMetadata);

            const responseMetadata = getResponseMetaData(request_id, timestamp);
            const serviceResponse = getServiceResponse(responseMetadata, payload);

            callback(null, serviceResponse);
        } catch (err: any) {
            logger.error(err);
            const error = {
                code: grpc.status.INVALID_ARGUMENT,
                message: err.message,
            };
            callback(error, null);
        }
    }

    async SgIdAuthUrl(call: grpc.ServerUnaryCall<user_storage_pb.SgIdAuthUrlRequest, user_storage_pb.SgIdAuthUrlResponse>, callback: grpc.sendUnaryData<user_storage_pb.SgIdAuthUrlResponse>): Promise<void> {
        const oAuthClientService = OAuthClientService.getInstance();
        const sgidClient = oAuthClientService.sgidClient;
        const jwtHandler = JWTHandler.getInstance();
        
        const { codeChallenge, codeVerifier } = generatePkcePair();

        const { url, nonce } = sgidClient.authorizationUrl({
            codeChallenge,
            scope: ['openid', 'myinfo.name'],
        })

        const jwt_payload = {
            codeVerifier: codeVerifier,
            nonce: nonce,
        }

        const SGID_UNIQUE_ID = jwtHandler.createJWT('5m', { sgid_auth: true });
        try {
            const redisClient = RedisService.getInstance();

            await redisClient.set(`sgid_auth_flow:${SGID_UNIQUE_ID}`, JSON.stringify(jwt_payload), 300);
            
            const metadata = new grpc.Metadata();
            metadata.set('x-sgid-unique-id', SGID_UNIQUE_ID);
            call.sendMetadata(metadata);

            callback(null, new user_storage_pb.SgIdAuthUrlResponse(
                {
                    auth_url: url,
                }
            ));
        } catch (err: any) {
            logger.error(err);
            const error = {
                code: grpc.status.INTERNAL,
                message: err.message,
            };
            callback(error, null);
        }
    }

    async SgIdAuth(call: grpc.ServerUnaryCall<user_storage_pb.AuthRequest, user_storage_pb.ServiceResponseWrapper>, callback: grpc.sendUnaryData<user_storage_pb.ServiceResponseWrapper>): Promise<void> {
        const jwtHandler = JWTHandler.getInstance();

        const metadata = call.metadata.getMap();
        const request_id = getMetaData(metadata, 'kong-request-id');
        const SGID_OAUTH_CODE = call.request.code;

        const SGID_UNIQUE_ID = getMetaData(metadata, 'authorization');
        const SGID_UNIQUE_ID_ERROR = isNullOrUndefined(SGID_UNIQUE_ID);
        if (SGID_UNIQUE_ID_ERROR) {
            callback(SGID_UNIQUE_ID_ERROR, null);
            return;
        }

        const token = SGID_UNIQUE_ID.split(' ')[1]?.trim(); 
        try {
            const authService = AuthService.getInstance();

            // Get the user data from SGID API
            const userData = await authService.handleSgIdLogin(SGID_OAUTH_CODE, token);

            // Current date and convert to Google Timestamp
            const currentDate = new Date();
            const timestamp = dateToGoogleTimeStamp(currentDate);

            // Create a payload
            const payload = getPayload('user_storage.AuthResponse', {
                user_id: userData.user_id,
                username: userData.username,
                email: userData.email,
                role: userData.role,
                profile_pic: userData.profile_pic,
                is_paid: userData.is_paid,
            });

            const access_token = jwtHandler.createJWT('10m', {
                user_id: userData.user_id,
                role: userData.role
            });

            const newMetadata = new grpc.Metadata();
            newMetadata.set('x-access-token', access_token);
            call.sendMetadata(newMetadata);

            const responseMetadata = getResponseMetaData(request_id, timestamp);
            const serviceResponse = getServiceResponse(responseMetadata, payload);

            callback(null, serviceResponse);
        } catch (err: any) {
            logger.error(err);
            const error = {
                code: grpc.status.INVALID_ARGUMENT,
                message: err.message,
            };
            callback(error, null);
        }
    }

    async Logout(call: grpc.ServerUnaryCall<user_storage_pb.LogoutRequest, user_storage_pb.ServiceResponseWrapper>, callback: grpc.sendUnaryData<user_storage_pb.ServiceResponseWrapper>): Promise<void> {
        const jwtHandler = JWTHandler.getInstance();

        const metadata = call.metadata.getMap();
        const request_id = getMetaData(metadata, 'kong-request-id');

        const AUTHZ_HEADER = getMetaData(metadata, 'authorization');
        const AUTHZ_HEADER_ID_ERROR = isNullOrUndefined(AUTHZ_HEADER);
        if (AUTHZ_HEADER_ID_ERROR) {
            callback(AUTHZ_HEADER_ID_ERROR, null);
            return;
        }

        const AUTHZ_TOKEN = AUTHZ_HEADER.split(' ')[1]?.trim();
        try {
            const currentDate = new Date();
            const timestamp = dateToGoogleTimeStamp(currentDate);

            const payload = getPayload('userStorage.LogoutResponse', {
                message: 'User logged out successfully',
            })

            const responseMetadata = getResponseMetaData(request_id, timestamp);
            const serviceResponse = getServiceResponse(responseMetadata, payload);

            const decodedToken = jwtHandler.verifyJWT(AUTHZ_TOKEN);
            if (!decodedToken.exp) {
                logger.info('Token does not have an expiration time.');
                callback(null, serviceResponse);
            }

            const currentTime = Math.floor(Date.now() / 1000);
            const expiryInSec = decodedToken.exp - currentTime;

            const redisClient = RedisService.getInstance();

            await redisClient.set(`revoked:${AUTHZ_TOKEN}`, decodedToken.user_id, expiryInSec);
            
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