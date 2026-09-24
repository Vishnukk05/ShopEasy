import helmet from 'helmet';
import cors from 'cors';
import rateLimit, { MemoryStore } from 'express-rate-limit';
import { RedisStore } from 'rate-limit-redis';
import redisClient from '../utils/redis';

// Strict CORS: only allow the specific frontend URL
export const corsMiddleware = cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
});

// Advanced Helmet with strict CSP
export const helmetMiddleware = helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", "data:", "https:"],
      connectSrc: ["'self'", process.env.FRONTEND_URL || 'http://localhost:3000'],
    },
  },
  crossOriginResourcePolicy: { policy: "same-site" },
});

const getStore = () => {
  if (redisClient) {
    return new RedisStore({
      sendCommand: (...args: string[]) => redisClient!.call(args[0], ...args.slice(1)) as any,
    });
  }
  return new MemoryStore();
};

// Redis-backed Global Rate Limiter
export const rateLimitMiddleware = process.env.NODE_ENV === 'test' ? (req: any, res: any, next: any) => next() : rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  standardHeaders: true,
  legacyHeaders: false,
  store: getStore(),
});

// Specialized Auth Rate Limiter (Stricter)
export const authRateLimiter = process.env.NODE_ENV === 'test' ? (req: any, res: any, next: any) => next() : rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // Max 10 failed logins/OTPs per IP
  standardHeaders: true,
  legacyHeaders: false,
  store: getStore(),
  message: { message: 'Too many authentication attempts from this IP, please try again after 15 minutes.' }
});

export const securityMiddlewares = [
  helmetMiddleware,
  corsMiddleware,
  rateLimitMiddleware
];
