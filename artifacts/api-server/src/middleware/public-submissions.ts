import rateLimit, { type RateLimitRequestHandler } from "express-rate-limit";
import type { Request, Response, NextFunction, RequestHandler } from "express";
import { z } from "zod";
import { logger } from "../lib/logger";

const EMAIL_SCHEMA = z.string().trim().email().max(320);
const HTTP_URL_SCHEMA = z
  .string()
  .trim()
  .url()
  .max(2048)
  .refine((value) => {
    try {
      const parsed = new URL(value);
      return parsed.protocol === "http:" || parsed.protocol === "https:";
    } catch {
      return false;
    }
  }, "URL must use http or https");

const failureStore = new Map<string, { count: number; resetAt: number }>();

function routeKey(routeId: string, req: Request): string {
  const ip = req.ip ?? "unknown";
  return `${routeId}:${ip}`;
}

function recordFailedSubmission(
  routeId: string,
  req: Request,
  reason: string,
): void {
  const key = routeKey(routeId, req);
  const now = Date.now();
  const windowMs = 10 * 60 * 1000;
  const existing = failureStore.get(key);

  if (!existing || now > existing.resetAt) {
    failureStore.set(key, { count: 1, resetAt: now + windowMs });
    return;
  }

  existing.count += 1;

  if (existing.count === 5 || existing.count % 10 === 0) {
    logger.warn("Repeated failed public form submissions detected", {
      routeId,
      path: req.path,
      reason,
      attemptsInWindow: existing.count,
      windowSeconds: Math.ceil((existing.resetAt - now) / 1000),
    });
  }

  if (existing.count >= 20) {
    logger.error("Public form abuse spike detected", undefined, {
      routeId,
      path: req.path,
      reason,
      attemptsInWindow: existing.count,
    });
  }
}

function clearFailedSubmission(routeId: string, req: Request): void {
  failureStore.delete(routeKey(routeId, req));
}

export function createSubmissionRateLimiter(config: {
  routeId: string;
  windowMs: number;
  max: number;
}): RateLimitRequestHandler {
  return rateLimit({
    windowMs: config.windowMs,
    max: config.max,
    standardHeaders: true,
    legacyHeaders: false,
    keyGenerator: (req) => routeKey(config.routeId, req),
    handler: (req, res) => {
      const retryAfterSeconds = Math.ceil(config.windowMs / 1000);
      logger.warn("Public submission rate limit exceeded", {
        routeId: config.routeId,
        path: req.path,
        ip: req.ip,
        retryAfterSeconds,
      });

      res.status(429).json({
        error: "Too many submissions. Please wait before trying again.",
        route: config.routeId,
        retryAfterSeconds,
      });
    },
  });
}

export function honeypotProtection(routeId: string): RequestHandler {
  return (req, res, next) => {
    const honeypotRaw = req.body?.website ?? req.body?.companyWebsite ?? "";
    if (typeof honeypotRaw === "string" && honeypotRaw.trim().length > 0) {
      recordFailedSubmission(routeId, req, "honeypot_triggered");
      res.status(201).json({ success: true, message: "Submission received." });
      return;
    }

    next();
  };
}

export function validateEmailStrict(value: unknown): string | null {
  const parsed = EMAIL_SCHEMA.safeParse(value);
  return parsed.success ? parsed.data.toLowerCase() : null;
}

export function validateHttpUrlStrict(value: unknown): string | null {
  if (value === undefined || value === null || value === "") {
    return null;
  }
  const parsed = HTTP_URL_SCHEMA.safeParse(value);
  return parsed.success ? parsed.data : null;
}

export function enforceMaxLength(
  routeId: string,
  req: Request,
  res: Response,
  fields: Array<{ key: string; max: number; required?: boolean }>,
): boolean {
  for (const field of fields) {
    const value = req.body?.[field.key];
    if (value == null) {
      if (field.required) {
        recordFailedSubmission(routeId, req, `missing_${field.key}`);
        res.status(400).json({ error: `${field.key} is required.` });
        return false;
      }
      continue;
    }

    if (typeof value !== "string") {
      recordFailedSubmission(routeId, req, `invalid_type_${field.key}`);
      res.status(400).json({ error: `${field.key} must be a string.` });
      return false;
    }

    if (field.required && value.trim().length === 0) {
      recordFailedSubmission(routeId, req, `missing_${field.key}`);
      res.status(400).json({ error: `${field.key} is required.` });
      return false;
    }

    if (value.length > field.max) {
      recordFailedSubmission(routeId, req, `max_length_${field.key}`);
      res.status(400).json({
        error: `${field.key} must be ${field.max} characters or fewer.`,
      });
      return false;
    }
  }

  return true;
}

export function withSubmissionMonitoring(routeId: string): RequestHandler {
  return (req: Request, res: Response, next: NextFunction): void => {
    const onFinish = () => {
      res.off("finish", onFinish);

      if (res.statusCode >= 400) {
        recordFailedSubmission(routeId, req, `status_${res.statusCode}`);
      } else if (res.statusCode < 300) {
        clearFailedSubmission(routeId, req);
      }
    };

    res.on("finish", onFinish);
    next();
  };
}

export function turnstileProtection(config: {
  routeId: string;
  secret?: string;
  required: boolean;
  action?: string;
}): RequestHandler {
  return async (req, res, next): Promise<void> => {
    const secret = config.secret;
    const token = req.body?.turnstileToken ?? req.body?.captchaToken;

    if (!secret) {
      if (config.required) {
        logger.warn("Turnstile secret missing for protected route", {
          routeId: config.routeId,
        });
      }
      next();
      return;
    }

    if (!token || typeof token !== "string") {
      recordFailedSubmission(config.routeId, req, "missing_turnstile_token");
      res.status(400).json({ error: "CAPTCHA verification is required." });
      return;
    }

    try {
      const params = new URLSearchParams({
        secret,
        response: token,
        remoteip: req.ip ?? "",
      });

      const verification = await fetch(
        "https://challenges.cloudflare.com/turnstile/v0/siteverify",
        {
          method: "POST",
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
          body: params,
        },
      );

      const payload = (await verification.json()) as {
        success?: boolean;
        action?: string;
        [key: string]: unknown;
      };

      if (!payload.success) {
        recordFailedSubmission(config.routeId, req, "turnstile_failed");
        res.status(403).json({ error: "CAPTCHA verification failed." });
        return;
      }

      if (config.action && payload.action && payload.action !== config.action) {
        recordFailedSubmission(
          config.routeId,
          req,
          "turnstile_action_mismatch",
        );
        res.status(403).json({ error: "CAPTCHA action mismatch." });
        return;
      }
    } catch (error) {
      logger.error("Turnstile verification request failed", error as Error, {
        routeId: config.routeId,
      });
      res.status(503).json({ error: "CAPTCHA verification unavailable." });
      return;
    }

    next();
  };
}
