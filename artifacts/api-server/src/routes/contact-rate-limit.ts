import type { Request } from "express";
import rateLimit, { ipKeyGenerator } from "express-rate-limit";

export function getContactRateLimitKey(req: Request): string {
  const forwardedFor = req.headers["x-forwarded-for"];
  const forwardedValue = Array.isArray(forwardedFor)
    ? forwardedFor[0]
    : forwardedFor;

  if (typeof forwardedValue === "string" && forwardedValue.trim().length > 0) {
    const [firstHop] = forwardedValue.split(",");
    const clientIp = firstHop?.trim();
    if (clientIp) {
      return clientIp;
    }
  }

  return ipKeyGenerator(req.ip || req.socket.remoteAddress || "unknown");
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
    console.warn("Contact rate limit exceeded", {
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
