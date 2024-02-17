import { randomBytes } from 'crypto';
import { config } from 'dotenv';
import { CookieOptions } from 'express';
import { Secret } from 'jsonwebtoken';
import * as jwt from 'jsonwebtoken';

import {
  accessCookieOptions,
  identityCookieOptions,
  refreshCookieOptions,
} from '../../config/cookieOptions';
import logger from '../../logging/logger';

import {
  AccessClaims,
  IdentityClaims,
  RefreshClaims,
  TokenCreationResult,
  TokenPayload,
  TokenType,
} from './interfaces';

config();

// refer to https://www.iana.org/assignments/jwt/jwt.xhtml for comprehensive list of claims

class JWTHandler {
  readonly secretKey: Secret;
  readonly accessExp: string = '10min';
  readonly refreshExp: string = '7d';
  readonly identityExp: string = '7d';

  constructor() {
    this.secretKey =
      process.env.JWT_SECRET_KEY ||
      (JWTHandler.generateUniqueIdentifier() as Secret);
    if (!process.env.JWT_SECRET_KEY) {
      logger.warn(
        `JWT secret key is not defined, a generated key will be used instead`,
      );
    }
  }

  public createToken(
    userId: string,
    uniqueId: string,
    type: TokenType,
    claims?: AccessClaims | IdentityClaims | RefreshClaims,
  ): TokenCreationResult {
    try {
      let expiration: string;
      let cookieOptions: CookieOptions;
      let payload: TokenPayload;

      switch (type) {
        case TokenType.REFRESH:
          expiration = this.refreshExp;
          cookieOptions = refreshCookieOptions;
          payload = {
            userId: userId,
            uniqueId: uniqueId,
            ...(claims as RefreshClaims),
          };
          break;
        case TokenType.ACCESS:
          expiration = this.accessExp;
          cookieOptions = accessCookieOptions;
          payload = {
            userId: userId,
            uniqueId: uniqueId,
            ...(claims as AccessClaims),
          };
          break;
        case TokenType.IDENTITY:
          expiration = this.identityExp;
          cookieOptions = identityCookieOptions;
          payload = {
            userId: userId,
            uniqueId: uniqueId,
            ...(claims as IdentityClaims),
          };
          break;
        default:
          throw new Error('Invalid token type');
      }

      const token = this.createJWT(expiration, payload);
      return { token, cookieOptions, uniqueId };
    } catch (error) {
      throw new Error(String(error));
    }
  }

  public verifyToken(token: string): TokenPayload {
    const decoded = jwt.verify(token, this.secretKey);
    return decoded as TokenPayload;
  }

  private createJWT(expiresIn: string, payload: TokenPayload) {
    return jwt.sign(payload, this.secretKey, { expiresIn });
  }

  static generateUniqueIdentifier() {
    return randomBytes(16).toString('hex');
  }
}

export default JWTHandler;

// usage
/*
 * const jwtHandler = new JWTHandler();
 * const accessClaims: AccessClaims = {
 *   iss: "issuer",
 *   aud: "audience",
 *   // ... other access token specific claims
 * };
 * const accessToken = jwtHandler.createToken("userId", TokenType.ACCESS, accessClaims);
 */

/*
 * const identityClaims: IdentityClaims = {
 *   name: "John Doe",
 *   given_name: "John",
 *   // ... other identity token specific claims
 * };
 * const identityToken = jwtHandler.createToken("userId", TokenType.IDENTITY, identityClaims);
 */
