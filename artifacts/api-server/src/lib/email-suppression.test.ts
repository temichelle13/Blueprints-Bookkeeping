import test from "node:test";
import assert from "node:assert/strict";
import { normalizeEmail } from "./email-suppression";

test("normalizeEmail lowercases email", () => {
  assert.equal(normalizeEmail("User@Example.COM"), "user@example.com");
});

test("normalizeEmail trims whitespace", () => {
  assert.equal(normalizeEmail("  alice@example.com  "), "alice@example.com");
});

test("normalizeEmail handles already-normalized input", () => {
  assert.equal(normalizeEmail("alice@example.com"), "alice@example.com");
});

test("normalizeEmail trims and lowercases together", () => {
  assert.equal(normalizeEmail("  ALICE@EXAMPLE.COM  "), "alice@example.com");
});
