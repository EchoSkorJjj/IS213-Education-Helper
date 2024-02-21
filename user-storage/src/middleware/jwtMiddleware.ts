import { randomBytes } from 'crypto';
import { Secret } from 'jsonwebtoken';
import * as jwt from 'jsonwebtoken';

import logger from '../logger/logger';

class JWTHandler {
  private static instance: JWTHandler;
  readonly secretKey: Secret;

  private constructor() {
    this.secretKey = process.env.JWT_SECRET_KEY || JWTHandler.generateUniqueIdentifier();
    if (!process.env.JWT_SECRET_KEY) {
      logger.warn('JWT secret key is not defined, a generated key will be used instead');
    }
  }

  public static getInstance(): JWTHandler {
    if (!JWTHandler.instance) {
      JWTHandler.instance = new JWTHandler();
    }
    return JWTHandler.instance;
  }

  public verifyJWT(token: string): any {
    const decoded = jwt.verify(token, this.secretKey);
    return decoded;
  }

  public createJWT(expiresIn: string, payload: object): string {
    return jwt.sign(payload, this.secretKey, { expiresIn });
  }

  private static generateUniqueIdentifier() {
    return randomBytes(16).toString('hex');
  }
}

export default JWTHandler;
