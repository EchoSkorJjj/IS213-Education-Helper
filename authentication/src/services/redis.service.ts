import { config } from 'dotenv';
import { createClient } from 'redis';

import logger from '../logging/logger';

config();

export class RedisService {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private client: any;
  private host: string;
  private password: string;

  constructor() {
    if (!process.env.REDIS_URL) {
      logger.error(
        'REDIS_URL is not defined in .env file. Using localhost as url',
      );
      this.host = 'localhost';
    } else {
      this.host = process.env.REDIS_URL;
    }
    if (!process.env.REDIS_PASSWORD) {
      logger.error(
        'REDIS_PASSWORD is not defined in .env. No password is being used. ',
      );
      this.password = '';
    } else {
      this.password = process.env.REDIS_PASSWORD;
    }
    this.client = createClient({
      password: process.env.REDIS_PASSWORD,
      socket: {
        host: this.host,
        port: 6379,
      },
    });
    this.client.connect().catch((error: Error) => {
      logger.error(' Redis connection has failed at ' + error);
    });
  }

  async set(key: string, value: string, expiryInSec?: number) {
    if (expiryInSec) {
      await this.client.setEx(key, expiryInSec, value);
    } else {
      await this.client.set(key, value);
    }
  }

  async get(key: string): Promise<string | null> {
    return await this.client.get(key);
  }

  async remove(key: string): Promise<number> {
    return await this.client.del(key);
  }

  async getKeyByValue(value: string): Promise<string | null> {
    logger.error('getKeyByValue is not implemented yet. Search Key: ' + value);
    return null;
  }
}

export default RedisService;
