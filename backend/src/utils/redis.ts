import Redis from 'ioredis';

const redisClient = new Redis(process.env.REDIS_URL || 'redis://localhost:6379');

redisClient.on('error', (err) => console.error('Redis Client Error', err));
redisClient.on('connect', () => console.log('Redis Client Connected'));

export const getCache = async (key: string): Promise<string | null> => {
  return await redisClient.get(key);
};

export const setCache = async (key: string, value: string, ttlSeconds?: number): Promise<void> => {
  if (ttlSeconds) {
    await redisClient.set(key, value, 'EX', ttlSeconds);
  } else {
    await redisClient.set(key, value);
  }
};

export default redisClient;
