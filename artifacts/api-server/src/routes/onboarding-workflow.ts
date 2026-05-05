export type OnboardingFinalizeDeps = {
  getExistingSubmissionByStripeSessionId: (
    stripeSessionId: string,
  ) => Promise<{ id: string } | null>;
  verifyStripeSession: (stripeSessionId: string) => Promise<{
    paymentStatus: string | null;
    customerEmail: string | null;
    stripeSubscriptionId: string | null;
  }>;
  getSubscriptionIdByStripeSubscriptionId: (
    stripeSubscriptionId: string,
  ) => Promise<string | null>;
  insertOnboardingSubmission: (values: {
    clientName: string;
    clientEmail: string;
    businessName: string;
    ownerName: string;
    phone: string | null;
    einBusinessType: string | null;
    currentBookkeepingSoftware: string | null;
    notes: string | null;
    plan: string | null;
    businessState: string;
    stripeSessionId: string;
    subscriptionId: string | null;
  }) => Promise<{ id: string }>;
  insertContactInquiry: (values: {
    formType: string;
    name: string;
    email: string;
    phone: string | null;
    businessName: string;
    servicesInterested: string[] | null;
    message: string | null;
    consentTextVersion: string;
    consentSourcePage: string;
    requestIp: string;
    userAgent: string;
    consentTimestamp: Date;
  }) => Promise<{ id: string }>;
  processContractSubmission: (contactInquiryId: string) => Promise<void>;
  sendOnboardingEmails: () => Promise<void>;
};

export async function finalizeOnboardingSubmission(
  args: {
    clientName: string;
    normalizedClientEmail: string;
    businessName: string;
    ownerName: string;
    phone: string | undefined;
    einBusinessType: string | undefined;
    currentBookkeepingSoftware: string | undefined;
    notes: string | undefined;
    plan: string | undefined;
    stripeSessionId: string;
    normalizedState: string;
    requestIp: string;
    userAgent: string;
  },
  deps: OnboardingFinalizeDeps,
): Promise<{ status: 200 | 201 | 400; body: Record<string, unknown> }> {
  const existing = await deps.getExistingSubmissionByStripeSessionId(
    args.stripeSessionId,
  );
  if (existing) {
    return {
      status: 200,
      body: {
        success: true,
        message: "Onboarding already submitted for this checkout session.",
        id: existing.id,
      },
    };
  }

  const session = await deps.verifyStripeSession(args.stripeSessionId);
  if (session.paymentStatus !== "paid") {
    return {
      status: 400,
      body: {
        error:
          "Payment has not been completed. Please complete checkout first.",
      },
    };
  }

  if (
    session.customerEmail &&
    session.customerEmail.toLowerCase() !== args.normalizedClientEmail
  ) {
    return {
      status: 400,
      body: {
        error:
          "Email does not match the checkout session. Please use the email you checked out with.",
      },
    };
  }

  let subscriptionId: string | null = null;
  if (session.stripeSubscriptionId) {
    subscriptionId = await deps.getSubscriptionIdByStripeSubscriptionId(
      session.stripeSubscriptionId,
    );
  }

  const submission = await deps.insertOnboardingSubmission({
    clientName: args.clientName,
    clientEmail: args.normalizedClientEmail,
    businessName: args.businessName,
    ownerName: args.ownerName,
    phone: args.phone ?? null,
    einBusinessType: args.einBusinessType ?? null,
    currentBookkeepingSoftware: args.currentBookkeepingSoftware ?? null,
    notes: args.notes ?? null,
    plan: args.plan ?? null,
    businessState: args.normalizedState,
    stripeSessionId: args.stripeSessionId,
    subscriptionId,
  });

  const inquiry = await deps.insertContactInquiry({
    formType: "self_service_onboarding",
    name: args.clientName,
    email: args.normalizedClientEmail,
    phone: args.phone ?? null,
    businessName: args.businessName,
    servicesInterested: args.plan ? [args.plan] : null,
    message: args.notes ?? null,
    consentTextVersion: "self-service-onboarding-consent-2026-03-31.1",
    consentSourcePage: "/onboarding",
    requestIp: args.requestIp,
    userAgent: args.userAgent,
    consentTimestamp: new Date(),
  });

  deps.processContractSubmission(inquiry.id).catch((err) => {
    console.error("Contract automation error (non-blocking):", err);
  });
  await deps.sendOnboardingEmails();

  return {
    status: 201,
    body: {
      success: true,
      message:
        "Onboarding form submitted successfully. Contracts will be sent shortly.",
      id: submission.id,
    },
  };
}
