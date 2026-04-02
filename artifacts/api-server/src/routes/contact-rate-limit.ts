import type { Request } from "express";
import rateLimit, { ipKeyGenerator } from "express-rate-limit";
import { logger } from "../lib/logger";

export function getContactRateLimitKey(req: Request): string {
  // Rely on express-rate-limit's ipKeyGenerator, which uses req.ip and
  // therefore honors Express's trust proxy configuration.
  return ipKeyGenerator(req.ip ?? "unknown");
}

export const contactLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: getContactRateLimitKey,
  message: {
    error: "Too many submissions from this IP. Please try again later.",
  },
  handler: (req, res, _next, options) => {
    logger.warn("Contact rate limit exceeded", {
      ip: req.ip,
      key: getContactRateLimitKey(req),
      xForwardedFor: req.headers["x-forwarded-for"],
      userAgent: req.get("user-agent") ?? "unknown",
      path: req.originalUrl,
      method: req.method,
    });

    const message =
      typeof options.message === "string"
        ? options.message
        : (options.message ?? {
            error: "Too many submissions from this IP. Please try again later.",
          });

    res.status(options.statusCode).send(message);
  },
});
