import Redis from 'ioredis';

const useRedis = process.env.USE_REDIS === 'true';

const redisClient = useRedis ? new Redis(process.env.REDIS_URL || 'redis://localhost:6379', {
  maxRetriesPerRequest: 1,
  retryStrategy: (times) => {
    if (times > 3) return null;
    return Math.min(times * 50, 2000);
  }
}) : null;

if (redisClient) {
  redisClient.on('error', (err) => console.error('Redis Client Error', err));
  redisClient.on('connect', () => console.log('Redis Client Connected'));
} else {
  console.log('Redis client disabled in utils/redis.ts');
}

export const getCache = async (key: string): Promise<string | null> => {
  if (!redisClient) return null;
  return await redisClient.get(key);
};

export const setCache = async (key: string, value: string, ttlSeconds?: number): Promise<void> => {
  if (!redisClient) return;
  if (ttlSeconds) {
    await redisClient.set(key, value, 'EX', ttlSeconds);
  } else {
    await redisClient.set(key, value);
  }
};

export default redisClient;
