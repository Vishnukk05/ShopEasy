import Redis from 'ioredis';

const redisUrl = process.env.REDIS_URL || 'redis://localhost:6379';
const useRedis = process.env.USE_REDIS === 'true';

class CacheService {
  private client: Redis | null = null;
  private isTest = process.env.NODE_ENV === 'test';

  constructor() {
    if (!this.isTest && useRedis) {
      this.client = new Redis(redisUrl, {
        maxRetriesPerRequest: 1,
        retryStrategy: (times) => {
          if (times > 3) return null;
          return Math.min(times * 50, 2000);
        }
      });
      
      this.client.on('error', (err) => {
        console.error('Redis cache error:', err.message);
      });
    } else {
      console.log('Redis cache disabled. Using memory stub.');
    }
  }

  async get(key: string): Promise<any | null> {
    if (this.isTest || !this.client) return null;
    try {
      const data = await this.client.get(key);
      return data ? JSON.parse(data) : null;
    } catch (err) {
      console.error('Cache get error', err);
      return null;
    }
  }

  async set(key: string, value: any, ttlSeconds: number = 300): Promise<void> {
    if (this.isTest || !this.client) return;
    try {
      await this.client.set(key, JSON.stringify(value), 'EX', ttlSeconds);
    } catch (err) {
      console.error('Cache set error', err);
    }
  }

  async flushAll(): Promise<void> {
    if (this.isTest || !this.client) return;
    try {
      await this.client.flushall();
    } catch (err) {
      console.error('Cache flush error', err);
    }
  }
}

export default new CacheService();
