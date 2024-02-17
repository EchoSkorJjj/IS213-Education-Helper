/* eslint-disable no-nested-ternary */
import { Request } from 'express';
import * as expressUseragent from 'express-useragent';
import { OAuth2Client } from 'google-auth-library';
import { TokenExpiredError } from 'jsonwebtoken';

import logger from '../logging/logger';
import { TokenType } from '../middlewares/JWT/interfaces';
import JWTHandler from '../middlewares/JWT/jwtMiddleware';
import { DeviceType, GoogleUserInfo, RoleGroups, TokenData } from '../types';

import { GoogleAPIService } from './googleapi.service';
import RedisService from './redis.service';
import { DatabaseService } from './typeorm.service';
import { UserService } from './user.service';

export class AuthService {
  private jwtHandler: JWTHandler;
  /*
   * in the most technical of sense this should not take in a specific service but
   * should follow a dependency injection pattern where any service can be injected with its methods
   * available and the same. IDK need to discuss this w @zt.yue
   */
  private googleAPIService: GoogleAPIService;
  private redisService: RedisService;
  private userService: UserService;

  constructor() {
    this.jwtHandler = new JWTHandler();
    this.googleAPIService = new GoogleAPIService();
    this.redisService = new RedisService();
    this.userService = new UserService(DatabaseService);
  }

  private validateEnvironmentVariables() {
    if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) {
      logger.error('Google Client ID or Client Secret is not defined in .env');
      throw new Error('Missing environment variables for Google Client.');
    }
  }

  private getDeviceType(useragent: expressUseragent.Details): DeviceType {
    if (useragent.isDesktop) return DeviceType.DESKTOP;
    if (useragent.isMobile) return DeviceType.MOBILE;
    if (useragent.isTablet) return DeviceType.TABLET;
    return DeviceType.UNKNOWN;
  }

  private createUserDeviceParam(
    req: Request,
    useragent: expressUseragent.Details,
  ) {
    return {
      ipAddress: req.ip,
      userAgent: req.headers['user-agent'],
      deviceType: this.getDeviceType(useragent),
    };
  }

  // eslint-disable-next-line max-statements
  async handleGoogleLogin(code: string, req: Request): Promise<TokenData> {
    this.validateEnvironmentVariables();

    const oAuth2Client = new OAuth2Client(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      'postmessage',
    );

    const { tokens } = await oAuth2Client.getToken(code);
    oAuth2Client.setCredentials(tokens);
    const userAuth = oAuth2Client.credentials;

    if (userAuth.access_token) {
      const userData: GoogleUserInfo = await this.googleAPIService.getUserData(
        userAuth.access_token,
      );

      const useragent = expressUseragent.parse(req.headers['user-agent']);

      const userParam = {
        name: userData.name,
        email: userData.email,
        picture: userData.picture,
        googleRefreshToken: userAuth.refresh_token,
      };

      const userDeviceParam = this.createUserDeviceParam(req, useragent);

      const userLocationParam = {
        geolocation: '',
      };

      const userRoleParam = RoleGroups.USER;

      try {
        const user = await this.userService.createUser(
          userParam,
          userDeviceParam,
          userLocationParam,
          userRoleParam,
        );
        logger.info(`User ${user.id} created.`);

        const {
          token: refreshToken,
          cookieOptions: refreshCookieOptions,
          uniqueId,
        } = this.jwtHandler.createToken(
          user.id,
          JWTHandler.generateUniqueIdentifier(),
          TokenType.REFRESH,
        );

        const { token: accessToken, cookieOptions: accessCookieOptions } =
          this.jwtHandler.createToken(user.id, uniqueId, TokenType.ACCESS);

        const { token: identityToken, cookieOptions: identityCookieOptions } =
          this.jwtHandler.createToken(user.id, uniqueId, TokenType.IDENTITY, {
            name: userData.name,
            userRole: userRoleParam,
            // eslint-disable-next-line camelcase
            given_name: userData.given_name,
            // eslint-disable-next-line camelcase
            family_name: userData.family_name,
            email: userData.email,
            ipAddress: req.ip,
            userAgent: req.headers['user-agent'],
            deviceType: this.getDeviceType(useragent),
            geolocation: '',
          });

        return {
          accessToken,
          accessCookieOptions,
          refreshToken,
          refreshCookieOptions,
          identityToken,
          identityCookieOptions,
          user,
          userRoleParam,
        };
      } catch (error) {
        logger.error(`Error authenticating user: ${error.message}`);
        throw new Error(`Error authenticating user: ${error.message}`);
      }
    } else {
      throw new Error('Google Oauth2 Access token is undefined.');
    }
  }

  async renewAccessToken(refreshToken: string) {
    try {
      const decoded = this.jwtHandler.verifyToken(refreshToken);
      const exist = await this.redisService.get(`revoked:${decoded.uniqueId}`); // check if uniqueId is in redis revoked list

      if (exist) {
        throw new Error('Refresh token is revoked.');
      }

      // TODO: check if userId is in sql database

      return this.jwtHandler.createToken(
        decoded.userId,
        decoded.uniqueId,
        TokenType.ACCESS,
      );
    } catch (error) {
      throw new Error(String(error));
    }
  }

  async handleLogout(refreshToken: string) {
    try {
      const decoded = this.jwtHandler.verifyToken(refreshToken);

      if (!decoded.exp) {
        logger.info('Token does not have an expiration time.');
        throw new Error('Token does not have an expiration time.');
      }

      const currentTime = Math.floor(Date.now() / 1000); // time in second
      const expiryInSec = decoded.exp - currentTime;

      // Add uniqueId to redis revocation list
      await this.redisService.set(
        `revoked:${decoded.uniqueId}`,
        'revoked',
        expiryInSec,
      );
    } catch (error) {
      if (error instanceof TokenExpiredError) {
        logger.info('Attempt to logout with an expired token');
      } else {
        throw new Error(String(error));
      }
    }
  }
}

export default AuthService;
