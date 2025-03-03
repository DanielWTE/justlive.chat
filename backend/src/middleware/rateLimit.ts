import rateLimit from 'express-rate-limit';
import { Request } from 'express';

// Rate limit per domain
export const domainRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each domain to 100 requests per windowMs
  message: {
    error: "Too many requests from this domain, please try again later",
  },
  keyGenerator: (req: Request) => {
    const origin = req.get('origin');
    if (!origin) return req.ip || 'unknown'; // Fallback to IP or 'unknown'
    return origin.toLowerCase()
      .replace(/^https?:\/\//, '')  // Remove protocol
      .replace(/:\d+$/, '')         // Remove port
      .replace(/\/$/, '');          // Remove trailing slash
  },
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
}); 