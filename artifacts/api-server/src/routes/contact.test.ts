import test from "node:test";
import assert from "node:assert/strict";
import {
  escapeHtml,
  ALLOWED_CONSENT_TEXT_VERSIONS,
  ALLOWED_CONSENT_SOURCE_PAGES,
} from "./contact";

test("escapeHtml escapes special characters", () => {
  assert.equal(escapeHtml("A & B"), "A &amp; B");
  assert.equal(escapeHtml("<script>"), "&lt;script&gt;");
  assert.equal(escapeHtml('"quoted"'), "&quot;quoted&quot;");
  assert.equal(escapeHtml("it's"), "it&#39;s");
});

test("ALLOWED_CONSENT_TEXT_VERSIONS accepts known values", () => {
  assert.equal(ALLOWED_CONSENT_TEXT_VERSIONS.has("contact-consent-2026-03-31.1"), true);
  assert.equal(
    ALLOWED_CONSENT_TEXT_VERSIONS.has("self-service-onboarding-consent-2026-03-31.1"),
    true,
  );
  assert.equal(ALLOWED_CONSENT_TEXT_VERSIONS.has("legacy-unknown"), true);
});

test("ALLOWED_CONSENT_TEXT_VERSIONS rejects unknown values", () => {
  assert.equal(ALLOWED_CONSENT_TEXT_VERSIONS.has("v1"), false);
  assert.equal(ALLOWED_CONSENT_TEXT_VERSIONS.has(""), false);
});

test("ALLOWED_CONSENT_SOURCE_PAGES accepts known values", () => {
  assert.equal(ALLOWED_CONSENT_SOURCE_PAGES.has("/contact"), true);
  assert.equal(ALLOWED_CONSENT_SOURCE_PAGES.has("/onboarding"), true);
});

test("ALLOWED_CONSENT_SOURCE_PAGES rejects unknown values", () => {
  assert.equal(ALLOWED_CONSENT_SOURCE_PAGES.has("/admin"), false);
  assert.equal(ALLOWED_CONSENT_SOURCE_PAGES.has("/"), false);
});