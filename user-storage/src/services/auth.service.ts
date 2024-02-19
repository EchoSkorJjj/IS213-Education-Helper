import { OAuth2Client } from 'google-auth-library';

import logger from '../logger/logger';

import GoogleAPIService from './googleapi.service';
import UserService from './user.service';

import { GoogleUserInfo } from '../types';

class AuthService {
    private googleAPIService: GoogleAPIService;
    private userService: UserService;

    constructor() {
        this.googleAPIService = new GoogleAPIService();
        this.userService = new UserService();
    }

    async handleGoogleLogin(code: string): Promise<any> {
        const oAuth2Client = new OAuth2Client(
            process.env.GOOGLE_CLIENT_ID,
            process.env.GOOGLE_CLIENT_SECRET,
            'postmessage',
        );

        const { tokens } = await oAuth2Client.getToken(code);
        oAuth2Client.setCredentials(tokens);
        const userCredentials = oAuth2Client.credentials;

        if (userCredentials.access_token) {
            try {
                const userData: GoogleUserInfo = await this.googleAPIService.getUserData(
                    userCredentials.access_token,
                );
                
                const user = await this.userService.findOrCreateUser(userData);
                return user;
            } catch (error) {
                throw error;
            }
        } else {
            logger.error('Google Oauth2 Access token is undefined.');
            throw new Error('Google Oauth2 Access token is undefined.');
        }
    }
}

export default AuthService;