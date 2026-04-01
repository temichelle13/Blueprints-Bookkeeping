import test from "node:test";
import assert from "node:assert/strict";
import type { Request } from "express";
import { getContactRateLimitKey } from "./contact-rate-limit";

test("getContactRateLimitKey uses req.ip as resolved by Express trust proxy", () => {
  // Express trust proxy sets req.ip to the real client IP from X-Forwarded-For.
  // The key generator relies on req.ip, not the raw header.
  const req = {
    ip: "198.51.100.20",
    socket: { remoteAddress: "10.1.1.1" },
    headers: {
      "x-forwarded-for": "198.51.100.20, 10.1.1.1",
    },
  } as unknown as Request;

  assert.equal(getContactRateLimitKey(req), "198.51.100.20");
});

test("getContactRateLimitKey uses req.ip for direct connections", () => {
  const req = {
    ip: "10.1.1.10",
    socket: { remoteAddress: "10.1.1.10" },
    headers: {},
  } as unknown as Request;

  assert.equal(getContactRateLimitKey(req), "10.1.1.10");
});
