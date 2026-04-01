import test from "node:test";
import assert from "node:assert/strict";

import {
  BOOKKEEPER_INTENT,
  LEGACY_BOOKKEEPER_INTENT,
  isBookkeeperIntentParam,
} from "./contact-intent";

test("accepts canonical bookkeeper intent", () => {
  assert.equal(isBookkeeperIntentParam(BOOKKEEPER_INTENT), true);
});

test("accepts legacy bookkeeper intent for backward compatibility", () => {
  assert.equal(isBookkeeperIntentParam(LEGACY_BOOKKEEPER_INTENT), true);
});

test("rejects unknown or missing intents", () => {
  assert.equal(isBookkeeperIntentParam(null), false);
  assert.equal(isBookkeeperIntentParam(""), false);
  assert.equal(isBookkeeperIntentParam("sales"), false);
});
