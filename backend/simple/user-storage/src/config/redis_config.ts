export const REDIS_CONFIG = {
    REDIS_HOST: process.env.REDIS_HOST || 'user-redis',
    REDIS_PORT: process.env.REDIS_PORT ? parseInt(process.env.REDIS_PORT) : 6379,
    REDIS_USERNAME: process.env.REDIS_USERNAME || 'default',
    REDIS_PASSWORD: process.env.REDIS_PASSWORD || 'password',  
}