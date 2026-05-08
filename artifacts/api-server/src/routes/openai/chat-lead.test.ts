import test from "node:test";
import assert from "node:assert/strict";
import { LEAD_KEYWORDS, isLeadMessage } from "./index";

test("isLeadMessage returns false when no lead intent is present", () => {
  assert.equal(
    isLeadMessage(
      "Can you explain your monthly reporting cadence?",
      "We provide monthly reporting and strategic insights.",
    ),
    false,
  );
});

test("isLeadMessage matches keywords in user message case-insensitively", () => {
  assert.equal(
    isLeadMessage("MY EMAIL is owner@example.com", "Thanks for sharing."),
    true,
  );
});

test("isLeadMessage matches keywords in assistant response", () => {
  assert.equal(
    isLeadMessage(
      "Tell me more.",
      "Great, you said you're ready to move forward and we can help.",
    ),
    true,
  );
});

test("lead keywords include critical contact intent phrases", () => {
  assert.equal(LEAD_KEYWORDS.includes("my email"), true);
  assert.equal(LEAD_KEYWORDS.includes("i want to get started"), true);
  assert.equal(LEAD_KEYWORDS.includes("how much would it cost"), true);
});

test("LEAD_KEYWORDS should remain non-empty and unique", () => {
  assert.ok(LEAD_KEYWORDS.length > 0);
  const unique = new Set(LEAD_KEYWORDS);
  assert.equal(unique.size, LEAD_KEYWORDS.length);
});