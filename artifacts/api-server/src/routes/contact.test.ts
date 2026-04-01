import assert from "node:assert/strict";
import test from "node:test";
import { createContactHandler } from "./contact";

type MockResponse = {
  statusCode: number;
  body: unknown;
  status: (code: number) => MockResponse;
  json: (payload: unknown) => MockResponse;
};

function createMockResponse(): MockResponse {
  return {
    statusCode: 200,
    body: null,
    status(code: number) {
      this.statusCode = code;
      return this;
    },
    json(payload: unknown) {
      this.body = payload;
      return this;
    },
  };
}

function baseBody() {
  return {
    formType: "quick",
    name: "Taylor Example",
    email: "taylor@example.com",
    phone: null,
    message: "Need monthly bookkeeping support.",
    businessName: "Example LLC",
    industry: "Services",
    servicesInterested: ["bookkeeping"],
    monthlyRevenueRange: "$10k-$25k",
    biggestChallenge: "Cash flow planning",
    preferredContactMethod: "email",
    smsConsent: false,
  };
}

test("returns 201 when email provider is unavailable", async () => {
  let processCalled = false;

  const handler = createContactHandler({
    tryGetResend: () => null,
    tryGetOwnerEmail: () => "owner@example.com",
    insertInquiry: async () => ({ id: 101 }),
    isEmailSuppressed: async () => false,
    logWarn: () => {},
    logError: () => {},
    processFormSubmission: async () => {
      processCalled = true;
      return [];
    },
  });

  const req = { body: baseBody() };
  const res = createMockResponse();

  await handler(req as never, res as never);

  assert.equal(res.statusCode, 201);
  assert.deepEqual(res.body, {
    success: true,
    message: "Thank you for your inquiry! We will be in touch within 48 hours.",
    id: 101,
  });
  assert.equal(processCalled, true);
});

test("returns 201 when owner email is unavailable", async () => {
  let processCalled = false;

  const handler = createContactHandler({
    tryGetResend: () =>
      ({ emails: { send: async () => ({ id: "mock" }) } }) as never,
    tryGetOwnerEmail: () => null,
    insertInquiry: async () => ({ id: 202 }),
    isEmailSuppressed: async () => false,
    logWarn: () => {},
    logError: () => {},
    processFormSubmission: async () => {
      processCalled = true;
      return [];
    },
  });

  const req = { body: baseBody() };
  const res = createMockResponse();

  await handler(req as never, res as never);

  assert.equal(res.statusCode, 201);
  assert.deepEqual(res.body, {
    success: true,
    message: "Thank you for your inquiry! We will be in touch within 48 hours.",
    id: 202,
  });
  assert.equal(processCalled, true);
});
