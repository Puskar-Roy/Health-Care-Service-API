import Redis from 'ioredis';
import config from './config';


const redisClient = new Redis({
  host: config.REDIS_HOST || '127.0.0.1',
  port: config.REDIS_PORT || 6379,
});

redisClient.on('connect', () => {
  console.log('[💽] Connected to Redis');
});

redisClient.on('error', (error) => {
  console.error('[🤖] Redis connection error:', error);
});

export default redisClient;
