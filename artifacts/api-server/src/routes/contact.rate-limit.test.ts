import test from "node:test";
import assert from "node:assert/strict";
import type { Request } from "express";
import { getContactRateLimitKey } from "./contact-rate-limit";

test("getContactRateLimitKey prefers first X-Forwarded-For IP", () => {
  const req = {
    ip: "10.1.1.10",
    headers: {
      "x-forwarded-for": "198.51.100.20, 203.0.113.9",
    },
  } as unknown as Request;

  assert.equal(getContactRateLimitKey(req), "198.51.100.20");
});

test("getContactRateLimitKey falls back to req.ip when X-Forwarded-For missing", () => {
  const req = {
    ip: "10.1.1.10",
    headers: {},
  } as unknown as Request;

  assert.equal(getContactRateLimitKey(req), "10.1.1.10");
});
