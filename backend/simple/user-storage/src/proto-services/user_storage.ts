import * as grpc from '@grpc/grpc-js';
import { generatePkcePair } from '@opengovsg/sgid-client'

import { user_storage_pb } from '../../pb/user_storage';
import logger from '../logger/logger';
import AuthService from '../services/auth.service';
import UserService from '../services/user.service';
import RedisService from '../services/redis.service';
import OAuthClientService from '../services/oauth.service';
import JWTHandler from '../middleware/jwtMiddleware';
import { isNullOrUndefined } from '../utils';
import * as jwt from 'jsonwebtoken';

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
    
        const requestId = getMetaData(metadata, 'kong-request-id');

        const googleOAuthCode = call.request.code;

        const code_error = isNullOrUndefined(googleOAuthCode);
        if (code_error) {
            callback(code_error, null); 
            return;
        }

        try {
            const jwtHandler = JWTHandler.getInstance();
            const authService = AuthService.getInstance();

            // Get user data from Google API
            const userData = await authService.handleGoogleLogin(googleOAuthCode);

            // Current date and convert to Google Timestamp
            const currentDate = new Date();
            const timestamp = dateToGoogleTimeStamp(currentDate);

            // Create a payload
            const payload = getPayload('user_storage.AuthResponse', {
                user_id: userData.user_id,
                username: userData.username,
                first_name: userData.first_name,
                last_name: userData.last_name,
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

            const responseMetadata = getResponseMetaData(requestId, timestamp);
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

        const myInfoUniqueId = jwtHandler.createJWT('5m', { myinfo_auth: true });
        try {
            const redisClient = RedisService.getInstance();

            await redisClient.set(`myinfo_auth_flow:${myInfoUniqueId}`, pkceCodePair.codeVerifier, 300);
            
            const metadata = new grpc.Metadata();
            metadata.set('x-myinfo-unique-id', myInfoUniqueId);
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
        const requestId = getMetaData(metadata, 'kong-request-id');
        const myInfoOAuthCode = call.request.code;

        const myInfoUniqueId = getMetaData(metadata, 'authorization');
        const myInfoUniqueIdError = isNullOrUndefined(myInfoUniqueId);
        if (myInfoUniqueIdError) {
            callback(myInfoUniqueIdError, null);
            return;
        }

        const token = myInfoUniqueId.split(' ')[1]?.trim(); 
        try {
            const authService = AuthService.getInstance();

            // Get the user data from MyInfo API
            const userData = await authService.handleMyInfoLogin(myInfoOAuthCode, token);

            // Current date and convert to Google Timestamp
            const currentDate = new Date();
            const timestamp = dateToGoogleTimeStamp(currentDate);

            // Create a payload
            const payload = getPayload('user_storage.AuthResponse', {
                user_id: userData.user_id,
                username: userData.username,
                first_name: userData.first_name,
                last_name: userData.last_name,
                email: userData.email,
                role: userData.role,
                profile_pic: userData.profile_pic,
                is_paid: userData.is_paid,
            });

            const access_token = jwtHandler.createJWT('1m', {
                user_id: userData.user_id,
                role: userData.role
            });

            const newMetadata = new grpc.Metadata();
            newMetadata.set('x-access-token', access_token);
            call.sendMetadata(newMetadata);

            const responseMetadata = getResponseMetaData(requestId, timestamp);
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

        const sgIdUniqueId = jwtHandler.createJWT('5m', { sgid_auth: true });
        try {
            const redisClient = RedisService.getInstance();

            await redisClient.set(`sgid_auth_flow:${sgIdUniqueId}`, JSON.stringify(jwt_payload), 300);
            
            const metadata = new grpc.Metadata();
            metadata.set('x-sgid-unique-id', sgIdUniqueId);
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
        const requestId = getMetaData(metadata, 'kong-request-id');
        const sgIdOAuthCode = call.request.code;

        const sgIdUniqueId = getMetaData(metadata, 'authorization');
        const sgIdUniqueIdError = isNullOrUndefined(sgIdUniqueId);
        if (sgIdUniqueIdError) {
            callback(sgIdUniqueIdError, null);
            return;
        }

        const token = sgIdUniqueId.split(' ')[1]?.trim(); 
        try {
            const authService = AuthService.getInstance();

            // Get the user data from SGID API
            const userData = await authService.handleSgIdLogin(sgIdOAuthCode, token);

            // Current date and convert to Google Timestamp
            const currentDate = new Date();
            const timestamp = dateToGoogleTimeStamp(currentDate);

            // Create a payload
            const payload = getPayload('user_storage.AuthResponse', {
                user_id: userData.user_id,
                username: userData.username,
                first_name: userData.first_name,
                last_name: userData.last_name,
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

            const responseMetadata = getResponseMetaData(requestId, timestamp);
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
        const requestId = getMetaData(metadata, 'kong-request-id');

        const authzHeader = getMetaData(metadata, 'authorization');
        const authzHeaderIdError = isNullOrUndefined(authzHeader);
        if (authzHeaderIdError) {
            callback(authzHeaderIdError, null);
            return;
        }

        const AUTHZ_TOKEN = authzHeader.split(' ')[1]?.trim();
        try {
            const currentDate = new Date();
            const timestamp = dateToGoogleTimeStamp(currentDate);

            const payload = getPayload('userStorage.LogoutResponse', {
                message: 'User logged out successfully',
            })

            const responseMetadata = getResponseMetaData(requestId, timestamp);
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
            if (err instanceof jwt.TokenExpiredError) {
                logger.info('Token has expired.');
                const currentDate = new Date();
                const timestamp = dateToGoogleTimeStamp(currentDate);

                const payload = getPayload('userStorage.LogoutResponse', {
                    message: 'User logged out successfully',
                })

                const responseMetadata = getResponseMetaData(requestId, timestamp);
                const serviceResponse = getServiceResponse(responseMetadata, payload);
                callback(null, serviceResponse);
            } else {
                logger.error(err);
                const error = {
                    code: grpc.status.INTERNAL,
                    message: err.message,
                };
                callback(error, null);
            }
        }
    }

    async GetUser(call: grpc.ServerUnaryCall<user_storage_pb.GetUserRequest, user_storage_pb.ServiceResponseWrapper>, callback: grpc.sendUnaryData<user_storage_pb.ServiceResponseWrapper>): Promise<void> {
        const user_id = call.request.user_id;
        
        const metadata = call.metadata.getMap();
        const requestId = getMetaData(metadata, 'kong-request-id');

        try {
            const userService = UserService.getInstance();

            const userData = await userService.getUserById(user_id);

            if (!userData) {
                const error = {
                    code: grpc.status.NOT_FOUND,
                    message: 'User not found',
                };
                callback(error, null);
                return;
            }

            // Current date and convert to Google Timestamp
            const currentDate = new Date();
            const timestamp = dateToGoogleTimeStamp(currentDate);

            // Create a payload
            const payload = getPayload('user_storage.AuthResponse', {
                user_id: userData.user_id,
                username: userData.username,
                first_name: userData.first_name,
                last_name: userData.last_name,
                email: userData.email,
                role: userData.role,
                profile_pic: userData.profile_pic,
                is_paid: userData.is_paid,
            });

            const responseMetadata = getResponseMetaData(requestId, timestamp);
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

    async UpdateUser(call: grpc.ServerUnaryCall<user_storage_pb.UpdateUserRequest, user_storage_pb.ServiceResponseWrapper>, callback: grpc.sendUnaryData<user_storage_pb.ServiceResponseWrapper>): Promise<void> {
        const metadata = call.metadata.getMap();
        const requestId = getMetaData(metadata, 'kong-request-id');

        try {
            const userService = UserService.getInstance();

            const userData = await userService.updateUser({
                user_id: call.request.user.user_id,
                username: call.request.user.username,
                first_name: call.request.user.first_name,
                last_name: call.request.user.last_name,
                email: call.request.user.email,
            })

            if (!userData) {
                const error = {
                    code: grpc.status.NOT_FOUND,
                    message: 'Error updating user',
                };
                callback(error, null);
                return;
            }

            // Current date and convert to Google Timestamp
            const currentDate = new Date();
            const timestamp = dateToGoogleTimeStamp(currentDate);

            // Create a payload
            const payload = getPayload('user_storage.AuthResponse', {
                user_id: userData.user_id,
                username: userData.username,
                first_name: userData.first_name,
                last_name: userData.last_name,
                email: userData.email,
                role: userData.role,
                profile_pic: userData.profile_pic,
                is_paid: userData.is_paid,
            });

            const responseMetadata = getResponseMetaData(requestId, timestamp);
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

    async DeleteUser(call: grpc.ServerUnaryCall<user_storage_pb.DeleteUserRequest, user_storage_pb.ServiceResponseWrapper>, callback: grpc.sendUnaryData<user_storage_pb.ServiceResponseWrapper>): Promise<void> {
        const metadata = call.metadata.getMap();
        const requestId = getMetaData(metadata, 'kong-request-id');

        try {
            const userService = UserService.getInstance();

            const isDeleted = await userService.deleteUser(call.request.user_id);

            if (!isDeleted) {
                const error = {
                    code: grpc.status.NOT_FOUND,
                    message: 'Error updating user',
                };
                callback(error, null);
                return;
            }

            // Current date and convert to Google Timestamp
            const currentDate = new Date();
            const timestamp = dateToGoogleTimeStamp(currentDate);

            // Create a payload
            const payload = getPayload('user_storage.AuthResponse', {
                message: 'User deleted successfully',
            });

            const responseMetadata = getResponseMetaData(requestId, timestamp);
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

    async SaveNote(call: grpc.ServerUnaryCall<user_storage_pb.SaveNoteRequest, user_storage_pb.SaveNoteResponse>, callback: grpc.sendUnaryData<user_storage_pb.SaveNoteResponse>): Promise<void> {
        const user_id = call.request.user_id;
        const note = call.request.notes_ids;

        try {
            const userService = UserService.getInstance();

            const userData = await userService.saveNotes({
                user_id: user_id,
                notes_ids: note,
            });

            if (!userData) {
                const error = {
                    code: grpc.status.NOT_FOUND,
                    message: 'Error saving note',
                };
                callback(error, null);
                return;
            }

            const response = new user_storage_pb.SaveNoteResponse({
                success: true,
                saved_notes_ids: userData.saved_notes_ids,
            });

            callback(null, response);
        } catch (err: any) {
            logger.error(err);
            const error = {
                code: grpc.status.INVALID_ARGUMENT,
                message: err.message,
            };
            callback(error, null);
        }
    }

    async DeleteSavedNote(call: grpc.ServerUnaryCall<user_storage_pb.DeleteSavedNoteRequest, user_storage_pb.DeleteSavedNoteResponse>, callback: grpc.sendUnaryData<user_storage_pb.DeleteSavedNoteResponse>): Promise<void> {
        const user_id = call.request.user_id;
        const note_id = call.request.note_id;

        try {
            const userService = UserService.getInstance();

            const userData = await userService.deleteNotes({
                user_id: user_id,
                note_id: note_id,
            });

            if (!userData) {
                const error = {
                    code: grpc.status.NOT_FOUND,
                    message: 'Error deleting note',
                };
                callback(error, null);
                return;
            }

            const response = new user_storage_pb.DeleteSavedNoteResponse({
                success: true,
            });

            callback(null, response);
        } catch (err: any) {
            logger.error(err);
            const error = {
                code: grpc.status.INVALID_ARGUMENT,
                message: err.message,
            };
            callback(error, null);
        }
    }

    async GetSavedNotes(call: grpc.ServerUnaryCall<user_storage_pb.GetSavedNotesRequest, user_storage_pb.GetSavedNotesResponse>, callback: grpc.sendUnaryData<user_storage_pb.GetSavedNotesResponse>): Promise<void> {
        const metadata = call.metadata.getMap();
        const requestId = getMetaData(metadata, 'kong-request-id');

        const user_id = call.request.user_id;

        if (!requestId) {
            const error = {
                code: grpc.status.INVALID_ARGUMENT,
                message: "Invalid request: request id not found",
            };
            callback(error, null);
        }

        try {
            const userService = UserService.getInstance();

            const notes_id = await userService.getNotes(user_id);

            const response = new user_storage_pb.GetSavedNotesResponse({
                saved_notes_ids: notes_id
            })

            callback(null, response);
        } catch (err: any) {
            logger.error(err);
            const error = {
                code: grpc.status.INVALID_ARGUMENT,
                message: err.message,
            };
            callback(error, null);
        }
    }
}

export default UserStorage;