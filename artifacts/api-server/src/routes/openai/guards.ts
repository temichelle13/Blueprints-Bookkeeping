import type { Request } from "express";
import rateLimit, { ipKeyGenerator } from "express-rate-limit";
import { logger } from "../../lib/logger";

export const OPENAI_MESSAGE_MAX_LENGTH = 4000;
export const OPENAI_CONVERSATION_MAX_MESSAGES = 60;

const ANOMALY_WINDOW_MS = 60 * 1000;
const ANOMALY_LOG_THRESHOLDS = new Set([20, 40, 80]);

const requestVolumeStore = new Map<
  string,
  { count: number; resetAt: number }
>();

export type OpenAiValidationErrorCode =
  | "MESSAGE_CONTENT_REQUIRED"
  | "MESSAGE_TOO_LONG"
  | "CONVERSATION_MESSAGE_CAP_REACHED"
  | "OPENAI_CONVERSATION_RATE_LIMITED"
  | "OPENAI_MESSAGE_RATE_LIMITED";

export interface OpenAiValidationErrorPayload {
  error: string;
  code: OpenAiValidationErrorCode;
  retryAfterSeconds?: number;
  maxLength?: number;
  maxMessages?: number;
}

export function getOpenAiIpKey(req: Request): string {
  return ipKeyGenerator(req.ip ?? "unknown");
}

function getRetryAfterSeconds(windowMs: number): number {
  return Math.ceil(windowMs / 1000);
}

export function getOpenAiRateLimitPayload(
  code: "OPENAI_CONVERSATION_RATE_LIMITED" | "OPENAI_MESSAGE_RATE_LIMITED",
  retryAfterSeconds: number,
): OpenAiValidationErrorPayload {
  return {
    error:
      "Too many chat requests right now. Please wait a moment before trying again.",
    code,
    retryAfterSeconds,
  };
}

export function createOpenAiConversationLimiter() {
  const windowMs = 60 * 1000;
  return rateLimit({
    windowMs,
    max: 8,
    standardHeaders: true,
    legacyHeaders: false,
    keyGenerator: getOpenAiIpKey,
    handler: (req, res) => {
      const retryAfterSeconds = getRetryAfterSeconds(windowMs);
      logger.warn("OpenAI conversation creation rate limit exceeded", {
        ip: req.ip,
        key: getOpenAiIpKey(req),
        path: req.originalUrl,
        method: req.method,
        retryAfterSeconds,
      });

      res
        .status(429)
        .json(
          getOpenAiRateLimitPayload(
            "OPENAI_CONVERSATION_RATE_LIMITED",
            retryAfterSeconds,
          ),
        );
    },
  });
}

export function createOpenAiMessageLimiter() {
  const windowMs = 60 * 1000;
  return rateLimit({
    windowMs,
    max: 25,
    standardHeaders: true,
    legacyHeaders: false,
    keyGenerator: getOpenAiIpKey,
    handler: (req, res) => {
      const retryAfterSeconds = getRetryAfterSeconds(windowMs);
      logger.warn("OpenAI message send rate limit exceeded", {
        ip: req.ip,
        key: getOpenAiIpKey(req),
        path: req.originalUrl,
        method: req.method,
        conversationId: req.params.id,
        retryAfterSeconds,
      });

      res
        .status(429)
        .json(
          getOpenAiRateLimitPayload(
            "OPENAI_MESSAGE_RATE_LIMITED",
            retryAfterSeconds,
          ),
        );
    },
  });
}

export function validateOpenAiMessageContent(
  content: unknown,
): OpenAiValidationErrorPayload | null {
  if (typeof content !== "string" || content.trim().length === 0) {
    return {
      error: "content is required",
      code: "MESSAGE_CONTENT_REQUIRED",
    };
  }

  if (content.length > OPENAI_MESSAGE_MAX_LENGTH) {
    return {
      error: `Message must be ${OPENAI_MESSAGE_MAX_LENGTH} characters or fewer.`,
      code: "MESSAGE_TOO_LONG",
      maxLength: OPENAI_MESSAGE_MAX_LENGTH,
    };
  }

  return null;
}

export function validateConversationMessageCap(
  currentMessageCount: number,
): OpenAiValidationErrorPayload | null {
  if (currentMessageCount >= OPENAI_CONVERSATION_MAX_MESSAGES) {
    return {
      error:
        "This conversation reached its message limit. Please start a new chat.",
      code: "CONVERSATION_MESSAGE_CAP_REACHED",
      maxMessages: OPENAI_CONVERSATION_MAX_MESSAGES,
    };
  }

  return null;
}

export function recordOpenAiRequestVolume(params: {
  routeId: "conversation_create" | "message_send";
  req: Request;
  conversationId?: string | number;
}): void {
  const ip = params.req.ip ?? "unknown";
  const conversationKey = params.conversationId ?? "none";
  const key = `${params.routeId}:${ip}:${conversationKey}`;
  const now = Date.now();
  const existing = requestVolumeStore.get(key);

  if (!existing || now > existing.resetAt) {
    requestVolumeStore.set(key, {
      count: 1,
      resetAt: now + ANOMALY_WINDOW_MS,
    });
    return;
  }

  existing.count += 1;

  if (ANOMALY_LOG_THRESHOLDS.has(existing.count)) {
    logger.warn("OpenAI request volume anomaly detected", {
      routeId: params.routeId,
      ip,
      conversationId: params.conversationId,
      requestVolume: existing.count,
      windowSeconds: Math.ceil((existing.resetAt - now) / 1000),
    });
  }
}
