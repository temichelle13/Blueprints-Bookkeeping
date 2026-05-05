import test from "node:test";
import assert from "node:assert/strict";
import {
  finalizeOnboardingSubmission,
  type OnboardingFinalizeDeps,
} from "./onboarding-workflow";

function makeBaseArgs() {
  return {
    clientName: "Casey Client",
    normalizedClientEmail: "casey@example.com",
    businessName: "Casey Co",
    ownerName: "Casey",
    phone: "555-555-5555",
    einBusinessType: "LLC",
    currentBookkeepingSoftware: "QuickBooks",
    notes: "Please help",
    plan: "Growth",
    stripeSessionId: "cs_test_123",
    normalizedState: "OR",
    requestIp: "203.0.113.10",
    userAgent: "unit-test",
  };
}

test("unpaid session returns 400 and does not persist inquiry", async () => {
  let inquiryWrites = 0;
  let onboardingWrites = 0;

  const deps: OnboardingFinalizeDeps = {
    getExistingSubmissionByStripeSessionId: async () => null,
    verifyStripeSession: async () => ({
      paymentStatus: "unpaid",
      customerEmail: "casey@example.com",
      stripeSubscriptionId: null,
    }),
    getSubscriptionIdByStripeSubscriptionId: async () => null,
    insertOnboardingSubmission: async () => {
      onboardingWrites += 1;
      return { id: "1" };
    },
    insertContactInquiry: async () => {
      inquiryWrites += 1;
      return { id: "1" };
    },
    processContractSubmission: async () => {},
    sendOnboardingEmails: async () => {},
  };

  const result = await finalizeOnboardingSubmission(makeBaseArgs(), deps);

  assert.equal(result.status, 400);
  assert.equal(inquiryWrites, 0);
  assert.equal(onboardingWrites, 0);
});

test("paid session persists inquiry and runs downstream actions", async () => {
  let contractCalls = 0;
  let emailCalls = 0;
  let persistedEmail = "";

  const deps: OnboardingFinalizeDeps = {
    getExistingSubmissionByStripeSessionId: async () => null,
    verifyStripeSession: async () => ({
      paymentStatus: "paid",
      customerEmail: "casey@example.com",
      stripeSubscriptionId: "sub_123",
    }),
    getSubscriptionIdByStripeSubscriptionId: async () => "sub_42",
    insertOnboardingSubmission: async () => ({ id: "99" }),
    insertContactInquiry: async (values) => {
      persistedEmail = values.email;
      return { id: "77" };
    },
    processContractSubmission: async () => {
      contractCalls += 1;
    },
    sendOnboardingEmails: async () => {
      emailCalls += 1;
    },
  };

  const result = await finalizeOnboardingSubmission(makeBaseArgs(), deps);

  assert.equal(result.status, 201);
  assert.equal(persistedEmail, "casey@example.com");
  assert.equal(contractCalls, 1);
  assert.equal(emailCalls, 1);
});

test("repeated stripeSessionId returns 200 and skips duplicate work", async () => {
  let inquiryWrites = 0;
  const deps: OnboardingFinalizeDeps = {
    getExistingSubmissionByStripeSessionId: async () => ({ id: "12" }),
    verifyStripeSession: async () => ({
      paymentStatus: "paid",
      customerEmail: "casey@example.com",
      stripeSubscriptionId: null,
    }),
    getSubscriptionIdByStripeSubscriptionId: async () => null,
    insertOnboardingSubmission: async () => ({ id: "1" }),
    insertContactInquiry: async () => {
      inquiryWrites += 1;
      return { id: "1" };
    },
    processContractSubmission: async () => {},
    sendOnboardingEmails: async () => {},
  };

  const result = await finalizeOnboardingSubmission(makeBaseArgs(), deps);

  assert.equal(result.status, 200);
  assert.equal(inquiryWrites, 0);
});
