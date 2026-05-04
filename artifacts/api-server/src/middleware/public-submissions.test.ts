import test from "node:test";
import assert from "node:assert/strict";
import type { Request, Response } from "express";
import {
  createSubmissionRateLimiter,
  validateEmailStrict,
} from "./public-submissions";

function createMockResponse() {
  const headers = new Map<string, string>();
  let statusCode = 200;
  let jsonBody: unknown = undefined;

  const res = {
    status(code: number) {
      statusCode = code;
      return this;
    },
    json(body: unknown) {
      jsonBody = body;
      return this;
    },
    setHeader(key: string, value: string) {
      headers.set(key.toLowerCase(), value);
      return this;
    },
  } as unknown as Response;

  return {
    res,
    get statusCode() {
      return statusCode;
    },
    get jsonBody() {
      return jsonBody;
    },
    headers,
  };
}

test("validateEmailStrict normalizes valid emails and rejects invalid ones", () => {
  assert.equal(validateEmailStrict("Owner@Example.COM"), "owner@example.com");
  assert.equal(validateEmailStrict("not-an-email"), null);
});

test("createSubmissionRateLimiter keys by route and request IP", async () => {
  const limiter = createSubmissionRateLimiter({
    routeId: "contact",
    windowMs: 60_000,
    max: 1,
  });

  const reqA = {
    ip: "198.51.100.12",
    path: "/contact",
  } as Request;

  let nextCallCount = 0;
  const next = () => {
    nextCallCount += 1;
  };

  await limiter(reqA, createMockResponse().res, next);
  assert.equal(nextCallCount, 1);

  const blockedResponse = createMockResponse();
  await limiter(reqA, blockedResponse.res, next);

  assert.equal(blockedResponse.statusCode, 429);
  assert.deepEqual(blockedResponse.jsonBody, {
    error: "Too many submissions. Please wait before trying again.",
    route: "contact",
    retryAfterSeconds: 60,
  });

  const reqB = {
    ip: "203.0.113.42",
    path: "/contact",
  } as Request;

  await limiter(reqB, createMockResponse().res, next);
  assert.equal(nextCallCount, 2);
});
