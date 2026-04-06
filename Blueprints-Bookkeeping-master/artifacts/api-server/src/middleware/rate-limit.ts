import type { Request, Response, NextFunction } from "express";
import { logger } from "../lib/logger";

interface RateLimitEntry {
  count: number;
  resetAt: number;
}

interface RateLimitConfig {
  windowMs: number; // Time window in milliseconds
  maxRequests: number; // Maximum requests per window
  message?: string;
}

/**
 * Simple in-memory rate limiter
 * For production, consider using Redis-backed rate limiting
 */
class RateLimiter {
  private store = new Map<string, RateLimitEntry>();
  private config: Required<RateLimitConfig>;

  constructor(config: RateLimitConfig) {
    this.config = {
      ...config,
      message: config.message || "Too many requests, please try again later.",
    };

    // Cleanup expired entries every minute
    setInterval(() => this.cleanup(), 60000);
  }

  private cleanup(): void {
    const now = Date.now();
    for (const [key, entry] of this.store.entries()) {
      if (now > entry.resetAt) {
        this.store.delete(key);
      }
    }
  }

  private getKey(req: Request): string {
    // Use IP address as the key
    // In production with proxy, use req.headers['x-forwarded-for'] or similar
    return req.ip || req.socket.remoteAddress || "unknown";
  }

  middleware() {
    return (req: Request, res: Response, next: NextFunction): void => {
      const key = this.getKey(req);
      const now = Date.now();

      let entry = this.store.get(key);

      if (!entry || now > entry.resetAt) {
        // Create new entry for this window
        entry = {
          count: 1,
          resetAt: now + this.config.windowMs,
        };
        this.store.set(key, entry);
        next();
        return;
      }

      entry.count++;

      if (entry.count > this.config.maxRequests) {
        const retryAfter = Math.ceil((entry.resetAt - now) / 1000);

        logger.warn("Rate limit exceeded", {
          ip: key,
          path: req.path,
          count: entry.count,
          retryAfter,
        });

        res.setHeader("Retry-After", retryAfter.toString());
        res.setHeader("X-RateLimit-Limit", this.config.maxRequests.toString());
        res.setHeader("X-RateLimit-Remaining", "0");
        res.setHeader("X-RateLimit-Reset", entry.resetAt.toString());

        res.status(429).json({
          error: this.config.message,
          retryAfter,
        });
        return;
      }

      // Set rate limit headers
      res.setHeader("X-RateLimit-Limit", this.config.maxRequests.toString());
      res.setHeader(
        "X-RateLimit-Remaining",
        (this.config.maxRequests - entry.count).toString(),
      );
      res.setHeader("X-RateLimit-Reset", entry.resetAt.toString());

      next();
    };
  }
}

/**
 * Rate limiter for admin endpoints
 * Allows 100 requests per 15 minutes per IP
 */
export const adminRateLimiter = new RateLimiter({
  windowMs: 15 * 60 * 1000, // 15 minutes
  maxRequests: 100,
  message: "Too many admin requests, please try again later.",
});

/**
 * Strict rate limiter for authentication attempts
 * Allows 5 requests per 15 minutes per IP
 */
export const authRateLimiter = new RateLimiter({
  windowMs: 15 * 60 * 1000, // 15 minutes
  maxRequests: 5,
  message: "Too many authentication attempts, please try again later.",
});

/**
 * General API rate limiter
 * Allows 1000 requests per 15 minutes per IP
 */
export const apiRateLimiter = new RateLimiter({
  windowMs: 15 * 60 * 1000, // 15 minutes
  maxRequests: 1000,
});
