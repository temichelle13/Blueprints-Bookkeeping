import test from "node:test";
import assert from "node:assert/strict";
import type { Request } from "express";
import {
  getOpenAiIpKey,
  getOpenAiRateLimitPayload,
  OPENAI_CONVERSATION_MAX_MESSAGES,
  OPENAI_MESSAGE_MAX_LENGTH,
  validateConversationMessageCap,
  validateOpenAiMessageContent,
} from "./openai/guards";

test("getOpenAiIpKey uses req.ip resolved by Express trust proxy", () => {
  const req = {
    ip: "198.51.100.99",
    headers: {
      "x-forwarded-for": "198.51.100.99, 10.0.0.1",
    },
  } as unknown as Request;

  assert.equal(getOpenAiIpKey(req), "198.51.100.99");
});

test("getOpenAiRateLimitPayload returns UI-friendly 429 payload", () => {
  const payload = getOpenAiRateLimitPayload("OPENAI_MESSAGE_RATE_LIMITED", 60);

  assert.equal(payload.code, "OPENAI_MESSAGE_RATE_LIMITED");
  assert.equal(payload.retryAfterSeconds, 60);
  assert.match(payload.error, /Too many chat requests/i);
});

test("validateOpenAiMessageContent rejects missing content", () => {
  assert.deepEqual(validateOpenAiMessageContent("   "), {
    error: "content is required",
    code: "MESSAGE_CONTENT_REQUIRED",
  });
});

test("validateOpenAiMessageContent rejects oversized payloads", () => {
  const oversized = "x".repeat(OPENAI_MESSAGE_MAX_LENGTH + 1);
  const error = validateOpenAiMessageContent(oversized);

  assert.equal(error?.code, "MESSAGE_TOO_LONG");
  assert.equal(error?.maxLength, OPENAI_MESSAGE_MAX_LENGTH);
});

test("validateConversationMessageCap rejects requests once cap is reached", () => {
  const error = validateConversationMessageCap(
    OPENAI_CONVERSATION_MAX_MESSAGES,
  );

  assert.equal(error?.code, "CONVERSATION_MESSAGE_CAP_REACHED");
  assert.equal(error?.maxMessages, OPENAI_CONVERSATION_MAX_MESSAGES);
});
