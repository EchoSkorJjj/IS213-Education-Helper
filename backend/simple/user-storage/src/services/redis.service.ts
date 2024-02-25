import { RedisClientType, createClient } from 'redis';
import logger from "../logger/logger";
import { REDIS_CONFIG } from '../config';

class RedisService {
  private static instance: RedisService;
  private client: RedisClientType;

  // Make the constructor private to prevent direct construction calls with the `new` operator.
  private constructor() {
    this.client = createClient({
      password: REDIS_CONFIG.REDIS_PASSWORD,
      socket: {
        host: REDIS_CONFIG.REDIS_HOST,
        port: REDIS_CONFIG.REDIS_PORT,
      },
    });

    this.client.connect().catch((error: Error) => {
      logger.error('Redis connection has failed: ' + error.message);
    });
  }

  public static getInstance(): RedisService {
    if (!RedisService.instance) {
      RedisService.instance = new RedisService();
    }
    return RedisService.instance;
  }

  async set(key: string, value: string, expiryInSec?: number): Promise<void> {
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