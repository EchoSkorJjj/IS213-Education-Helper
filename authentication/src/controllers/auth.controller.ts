import { Request, Response } from 'express';

import logger from '../logging/logger';
import { TokenCreationResult } from '../middlewares/JWT/interfaces';
import AuthService from '../services/auth.service';
import { TokenData } from '../types';

class AuthController {
  private authService: AuthService;

  constructor() {
    this.authService = new AuthService();
    this.handleGoogleCallback = this.handleGoogleCallback.bind(this);
    this.handleRefreshToken = this.handleRefreshToken.bind(this);
    this.handleLogout = this.handleLogout.bind(this);
  }

  async handleGoogleCallback(req: Request, res: Response) {
    const code = req.body?.code;
    if (!code) {
      logger.info(
        'incoming request for google oauth callback did not have a code\n' +
          req.body,
      );
      return res.status(400).json({ error: 'Google access code is missing' });
    }

    try {
      const tokenData: TokenData = await this.authService.handleGoogleLogin(
        code,
        req,
      );
      this.sendAuthCookies(res, tokenData);
      res.status(200).json({
        success: true,
        user: tokenData.user,
        role: tokenData.userRoleParam,
      });
    } catch (error) {
      logger.error('Error was thrown ' + error);
      return res.status(401).json({ error: 'OAuth callback failed' });
    }
  }

  private sendAuthCookies(res: Response, tokenData: TokenData) {
    const {
      accessToken,
      accessCookieOptions,
      refreshToken,
      refreshCookieOptions,
      identityToken,
      identityCookieOptions,
    } = tokenData;

    const accessCookieName = this.getCookieName(
      'ACCESS_COOKIE_NAME',
      'access_token',
    );
    const refreshCookieName = this.getCookieName(
      'REFRESH_COOKIE_NAME',
      'refresh_token',
    );
    const identityCookieName = this.getCookieName(
      'IDENTITY_COOKIE_NAME',
      'identity_token',
    );

    logger.info('Sending cookies to client');
    res.cookie(accessCookieName, accessToken, accessCookieOptions);
    res.cookie(refreshCookieName, refreshToken, refreshCookieOptions);
    res.cookie(identityCookieName, identityToken, identityCookieOptions);
  }

  private getCookieName(envVariable: string, fallbackName: string): string {
    const cookieName = process.env[envVariable] || fallbackName;
    if (!process.env[envVariable]) {
      logger.warn(
        `Cookie name is not defined in env, falling back to ${fallbackName}`,
      );
    }
    return cookieName;
  }

  async handleRefreshToken(req: Request, res: Response) {
    const refreshToken: string = req.body.refresh_token;

    if (!refreshToken) {
      logger.info(
        'incoming request for refresh token did not have a refresh token\n' +
          req.body,
      );
      return res.status(400).json({ error: 'Refresh token is missing' });
    }

    try {
      const {
        token: accessToken,
        cookieOptions: accessCookieOptions,
      }: TokenCreationResult =
        await this.authService.renewAccessToken(refreshToken);

      const accessCookieName = process.env.ACCESS_COOKIE_NAME || 'access_token';
      if (!process.env.ACCESS_COOKIE_NAME) {
        logger.warn(
          'Cookie name is not defined in env, falling back to access_token',
        );
      }

      logger.info('Sending cookies to client');
      res.cookie(accessCookieName, accessToken, accessCookieOptions);
      res.status(200).json({ success: true, newAccessToken: accessToken });
    } catch (error) {
      logger.error('Error was thrown ' + error);
      return res.status(401).json({ error: 'Refresh token failed' });
    }
  }

  async handleLogout(req: Request, res: Response) {
    const refreshToken: string = req.body.refresh_token;

    try {
      if (!refreshToken) {
        logger.info(
          'incoming request for refresh token did not have a refresh token\n' +
            req.body,
        );
        return res.status(400).json({ error: 'Refresh token is missing' });
      }

      await this.authService.handleLogout(refreshToken);

      res.clearCookie(process.env.ACCESS_COOKIE_NAME || 'access_token', {
        path: '/',
        expires: new Date(1),
      });
      res.clearCookie(process.env.REFRESH_COOKIE_NAME || 'refresh_token', {
        path: '/',
        expires: new Date(1),
      });
      res.clearCookie(process.env.IDENTITY_COOKIE_NAME || 'identity_token', {
        path: '/',
        expires: new Date(1),
      });

      res.status(200).json({ message: 'Logout successful' });
    } catch (error) {
      logger.error('Error was thrown ' + error);
      return res.status(401).json({ error: 'Logout unsuccessful' });
    }
  }
}

export const authController = new AuthController();
