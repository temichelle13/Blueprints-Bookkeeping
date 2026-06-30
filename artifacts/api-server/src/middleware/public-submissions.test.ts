import test from "node:test";
import assert from "node:assert/strict";
import type { Request, Response as ExpressResponse } from "express";
import {
  createSubmissionRateLimiter,
  turnstileProtection,
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
  } as unknown as ExpressResponse;

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

test("turnstileProtection rejects missing cf-turnstile-response token", async () => {
  const previousTurnstileSecretKey = process.env["TURNSTILE_SECRET_KEY"];
  process.env["TURNSTILE_SECRET_KEY"] = "test-secret";

  try {
    const middleware = turnstileProtection({
      routeId: "contact",
      required: true,
      action: "lead_form",
    });
    const req = {
      body: {},
      path: "/contact",
      ip: "198.51.100.55",
      socket: { remoteAddress: "198.51.100.55" },
      get: (_name: string) => undefined,
    } as unknown as Request;
    const response = createMockResponse();
    let nextCalled = false;

    await middleware(req, response.res, () => {
      nextCalled = true;
    });

    assert.equal(nextCalled, false);
    assert.equal(response.statusCode, 400);
    assert.deepEqual(response.jsonBody, {
      error: "Verification is required. Please complete the challenge.",
    });
  } finally {
    if (previousTurnstileSecretKey === undefined) {
      delete process.env["TURNSTILE_SECRET_KEY"];
    } else {
      process.env["TURNSTILE_SECRET_KEY"] = previousTurnstileSecretKey;
    }
  }
});

test("turnstileProtection rejects invalid-input-response token", async () => {
  process.env["TURNSTILE_SECRET_KEY"] = "test-secret";
  const originalFetch = globalThis.fetch;
  globalThis.fetch = (async () =>
    ({
      ok: true,
      json: async () => ({
        success: false,
        "error-codes": ["invalid-input-response"],
      }),
    }) as unknown as Response) as typeof fetch;

  const middleware = turnstileProtection({
    routeId: "contact",
    required: true,
    action: "lead_form",
  });
  const req = {
    body: { "cf-turnstile-response": "invalid-token" },
    path: "/contact",
    ip: "198.51.100.56",
    socket: { remoteAddress: "198.51.100.56" },
    get: (_name: string) => undefined,
  } as unknown as Request;
  const response = createMockResponse();

  try {
    await middleware(req, response.res, () => undefined);
  } finally {
    globalThis.fetch = originalFetch;
  }

  assert.equal(response.statusCode, 400);
  assert.deepEqual(response.jsonBody, {
    error: "Verification token is invalid. Please retry verification.",
  });
});

test("turnstileProtection rejects timeout-or-duplicate token", async () => {
  process.env["TURNSTILE_SECRET_KEY"] = "test-secret";
  const originalFetch = globalThis.fetch;
  globalThis.fetch = (async () =>
    ({
      ok: true,
      json: async () => ({
        success: false,
        "error-codes": ["timeout-or-duplicate"],
      }),
    }) as unknown as Response) as typeof fetch;

  const middleware = turnstileProtection({
    routeId: "contact",
    required: true,
    action: "lead_form",
  });
  const req = {
    body: { "cf-turnstile-response": "expired-token" },
    path: "/contact",
    ip: "198.51.100.57",
    socket: { remoteAddress: "198.51.100.57" },
    get: (_name: string) => undefined,
  } as unknown as Request;
  const response = createMockResponse();

  try {
    await middleware(req, response.res, () => undefined);
  } finally {
    globalThis.fetch = originalFetch;
  }

  assert.equal(response.statusCode, 400);
  assert.deepEqual(response.jsonBody, {
    error:
      "Verification expired or was already used. Please complete the challenge again.",
  });
});

test("turnstileProtection allows valid token and uses env secret", async () => {
  process.env["TURNSTILE_SECRET_KEY"] = "test-secret";
  process.env["SITE_URL"] = "https://blueprintsandbookkeeping.com";
  const originalFetch = globalThis.fetch;
  let postedSecret = "";
  globalThis.fetch = (async (_url, init) => {
    postedSecret =
      init?.body instanceof URLSearchParams
        ? (init.body.get("secret") ?? "")
        : "";
    return {
      ok: true,
      json: async () => ({
        success: true,
        action: "lead_form",
        hostname: "blueprintsandbookkeeping.com",
      }),
    } as unknown as Response;
  }) as typeof fetch;

  const middleware = turnstileProtection({
    routeId: "contact",
    required: true,
    action: "lead_form",
  });
  const req = {
    body: { "cf-turnstile-response": "valid-token" },
    path: "/contact",
    ip: "198.51.100.58",
    socket: { remoteAddress: "198.51.100.58" },
    get: (name: string) =>
      name.toLowerCase() === "cf-connecting-ip" ? "198.51.100.58" : undefined,
  } as unknown as Request;
  const response = createMockResponse();
  let nextCalled = false;

  try {
    await middleware(req, response.res, () => {
      nextCalled = true;
    });
  } finally {
    globalThis.fetch = originalFetch;
  }

  assert.equal(postedSecret, "test-secret");
  assert.equal(nextCalled, true);
  assert.equal(response.statusCode, 200);
});
