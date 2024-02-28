import logger from '../logger/logger';
import { APP_CONFIG } from '../config';

import GoogleAPIService from './googleapi.service';
import UserService from './user.service';
import RedisService from './redis.service';
import OAuthClientService from './oauth.service';

import JWTHandler from '../middleware/jwtMiddleware';

import { GoogleUserInfo, ClientUserData } from '../types';

import fs from 'fs';

type OnFileContent = (filename: string, content: string) => void;
type OnError = (err: NodeJS.ErrnoException) => void;

class AuthService {
    private static instance: AuthService;

    private googleAPIService: GoogleAPIService;
    private userService: UserService;
    private jwtHandler: JWTHandler;
    private redisClient: RedisService;
    private oAuthClientService: OAuthClientService;

    constructor() {
        this.googleAPIService = GoogleAPIService.getInstance();
        this.userService = UserService.getInstance();
        this.jwtHandler = JWTHandler.getInstance();
        this.redisClient = RedisService.getInstance();
        this.oAuthClientService = OAuthClientService.getInstance();
    }

    public static getInstance(): AuthService {
        if (!AuthService.instance) {
          AuthService.instance = new AuthService();
        }
        return AuthService.instance;
    }

    async handleGoogleLogin(code: string): Promise<ClientUserData> {
        const { googleOAuth2Client } = this.oAuthClientService;
        const { tokens } = await googleOAuth2Client.getToken(code);
        googleOAuth2Client.setCredentials(tokens);
        const userCredentials = googleOAuth2Client.credentials;

        if (userCredentials.access_token) {
            try {
                const userData: GoogleUserInfo = await this.googleAPIService.getUserData(
                    userCredentials.access_token,
                );
                const user = this.userService.findOrCreateUser({
                    name: userData.name,
                    email: userData.email,
                    given_name: userData.given_name,
                    family_name: userData.family_name,
                    profile_pic: userData.picture,
                });
                return user;
            } catch (error) {
                throw error;
            }
        } else {
            logger.error('Google Oauth2 Access token is undefined.');
            throw new Error('Google Oauth2 Access token is undefined.');
        }
    }

    async handleMyInfoLogin(MYINFO_OAUTH_CODE: string, MYINFO_UNIQUE_ID: string): Promise<ClientUserData> {
        const { myInfoConnector } = this.oAuthClientService;
        const decoded = this.jwtHandler.verifyJWT(MYINFO_UNIQUE_ID);

        if (!decoded) {
            throw new Error("Unauthorized");
        }

        if (!decoded.myinfo_auth) {
            throw new Error("Unauthorized");
        }

        try {
            const codeVerifier = await this.redisClient.get(`myinfo_auth_flow:${MYINFO_UNIQUE_ID}`);

            if (!codeVerifier) {
                throw new Error("Unauthorized");
            }

            const privateSigningKey = fs.readFileSync(
                APP_CONFIG.MYINFO_CLIENT_PRIVATE_SIGNING_KEY,
                "utf8"
            );

            // const privateSigningKey = APP_CONFIG.MYINFO_CLIENT_PRIVATE_SIGNING_KEY;

            const privateEncryptionKeys: string[] = [];
            // retrieve private encryption keys and decode to utf8 from FS, insert all keys to array
            AuthService.readFiles(
                APP_CONFIG.MYINFO_CLIENT_PRIVATE_ENCRYPTION_KEYS,
                (filename, content) => {
                    privateEncryptionKeys.push(content);
                },
                (err) => {
                throw err;
                }
            );
            // privateEncryptionKeys.push(APP_CONFIG.MYINFO_CLIENT_PRIVATE_ENCRYPTION_KEYS);

            const userData = await myInfoConnector.getMyInfoPersonData(
                MYINFO_OAUTH_CODE,
                codeVerifier,
                privateSigningKey,
                privateEncryptionKeys
            );

            if (userData) {
                const nameArray = userData.name.value.split(" ");
                const user = await this.userService.findOrCreateUser({
                    name: userData.name.value,
                    email: userData.email.value,
                    given_name: nameArray[0],
                    family_name: nameArray.slice(1).join(" "),
                    profile_pic: "",
                });

                return user;
            } else {
                logger.error("Invalid OAuth code");
                throw new Error("Invalid OAuth code");
            }
        } catch (err) {
            logger.error(err);
            throw err;
        }
    }

    async handleSgIdLogin(SGID_OAUTH_CODE: string, SGID_UNIQUE_ID: string): Promise<ClientUserData> {
        const { sgidClient } = this.oAuthClientService;
        const decoded = this.jwtHandler.verifyJWT(SGID_UNIQUE_ID);

        if (!decoded) {
            throw new Error("Unauthorized");
        }

        if (!decoded.sgid_auth) {
            throw new Error("Unauthorized");
        }

        try {
            const data = await this.redisClient.get(`sgid_auth_flow:${SGID_UNIQUE_ID}`);

            if (!data) {
                throw new Error("Unauthorized");
            }

            const { codeVerifier, nonce } = JSON.parse(data);

            const { accessToken, sub } = await sgidClient.callback({
                code: SGID_OAUTH_CODE,
                nonce,
                codeVerifier,
            })

            const userinfo = await sgidClient.userinfo({
                accessToken,
                sub,
            })

            if (userinfo) {
                const nameArray = userinfo.data["myinfo.name"].split(" ");
                const user = await this.userService.findOrCreateUser({
                    name: userinfo.data["myinfo.name"],
                    // uncomment once email is available
                    // email: userinfo.data.email,
                    email: 'dummyemail@gmail.com',
                    given_name: nameArray[0],
                    family_name: nameArray.slice(1).join(" "),
                    profile_pic: "",
                });

                return user;
            } else {
                logger.error("Invalid OAuth code");
                throw new Error("Invalid OAuth code");
            }
        } catch (err) {
            logger.error(err);
            throw err;
        }
    }

    private static readFiles(dirname: string, onFileContent: OnFileContent, onError: OnError): void {
        fs.readdir(dirname, function (err, filenames) {
          if (err) {
            onError(err);
            return;
          }
          filenames.forEach(function (filename) {
            fs.readFile(dirname + filename, "utf8", function (err, content) {
              if (err) {
                onError(err);
                return;
              }
              onFileContent(filename, content);
            });
          });
        });
    }
}

export default AuthService;