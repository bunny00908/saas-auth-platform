import rateLimit from 'express-rate-limit';
import { AuthRequest } from './auth';

export const rateLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 10, // 10 requests per minute
  keyGenerator: (req: AuthRequest) => {
    return req.user?.id || req.ip || 'anonymous';
  },
  handler: (req, res) => {
    res.status(429).json({ error: 'Too many requests. Rate limit: 10 requests per minute.' });
  },
});
