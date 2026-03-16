import { Router, type IRouter } from "express";
import Stripe from "stripe";
import { db, subscriptionsTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import { Resend } from "resend";

const router: IRouter = Router();

const OWNER_EMAIL = "tea@blueprintsandbookkeeping.com";
const FROM_ADDRESS = "Blueprints & Bookkeeping <noreply@blueprintsandbookkeeping.com>";
const SITE_URL = process.env["SITE_URL"] || "https://blueprintsandbookkeeping.com";

function getStripe(): Stripe | null {
  const key = process.env["STRIPE_SECRET_KEY"];
  if (!key) return null;
  return new Stripe(key);
}

function getResend(): Resend | null {
  const key = process.env["RESEND_API_KEY"];
  if (!key) return null;
  return new Resend(key);
}

const PLAN_CONFIG: Record<string, { name: string; monthlyPriceId: string; annualPriceId: string }> = {
  essentials: {
    name: "Essentials",
    monthlyPriceId: process.env["STRIPE_ESSENTIALS_MONTHLY_PRICE_ID"] || "",
    annualPriceId: process.env["STRIPE_ESSENTIALS_ANNUAL_PRICE_ID"] || "",
  },
  growth: {
    name: "Growth",
    monthlyPriceId: process.env["STRIPE_GROWTH_MONTHLY_PRICE_ID"] || "",
    annualPriceId: process.env["STRIPE_GROWTH_ANNUAL_PRICE_ID"] || "",
  },
};

const DEPOSIT_CONFIG: Record<string, { name: string; amountCents: number; description: string }> = {
  essentials: {
    name: "Essentials Bookkeeping Deposit",
    amountCents: 50000,
    description: "First month deposit for the Essentials bookkeeping plan.",
  },
  growth: {
    name: "Growth Bookkeeping Deposit",
    amountCents: 90000,
    description: "First month deposit for the Growth bookkeeping plan.",
  },
  startup_roadmap: {
    name: "Startup Roadmap Deposit",
    amountCents: 125000,
    description: "50% deposit to begin your Startup Roadmap business plan.",
  },
  sba_investor: {
    name: "SBA / Investor Package Deposit",
    amountCents: 200000,
    description: "50% deposit to begin your SBA / Investor Package business plan.",
  },
};

router.post("/payments/create-checkout-session", async (req, res): Promise<void> => {
  const stripe = getStripe();
  if (!stripe) {
    res.status(503).json({ error: "Payment processing is not configured." });
    return;
  }

  const { plan, interval } = req.body as { plan?: string; interval?: string };

  if (!plan || !PLAN_CONFIG[plan]) {
    res.status(400).json({ error: "Invalid plan. Choose 'essentials' or 'growth'." });
    return;
  }

  const billingInterval = interval === "annual" ? "annual" : "monthly";
  const config = PLAN_CONFIG[plan];
  const priceId = billingInterval === "annual" ? config.annualPriceId : config.monthlyPriceId;

  if (!priceId) {
    res.status(503).json({ error: `Stripe price not configured for ${config.name} (${billingInterval}).` });
    return;
  }

  try {
    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      payment_method_types: ["card"],
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${SITE_URL}/welcome?session_id={CHECKOUT_SESSION_ID}&plan=${plan}`,
      cancel_url: `${SITE_URL}/pricing`,
      metadata: { plan, billingInterval },
      subscription_data: {
        metadata: { plan, billingInterval },
      },
    });

    res.json({ url: session.url });
  } catch (err) {
    console.error("Stripe checkout session error:", err);
    res.status(500).json({ error: "Failed to create checkout session." });
  }
});

router.post("/payments/create-deposit-session", async (req, res): Promise<void> => {
  const stripe = getStripe();
  if (!stripe) {
    res.status(503).json({ error: "Payment processing is not configured." });
    return;
  }

  const { service } = req.body as { service?: string };

  if (!service || !DEPOSIT_CONFIG[service]) {
    res.status(400).json({ error: "Invalid service. Choose 'essentials', 'growth', 'startup_roadmap', or 'sba_investor'." });
    return;
  }

  const config = DEPOSIT_CONFIG[service];

  try {
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: config.name,
              description: config.description,
            },
            unit_amount: config.amountCents,
          },
          quantity: 1,
        },
      ],
      success_url: `${SITE_URL}/payment-success?session_id={CHECKOUT_SESSION_ID}&service=${service}`,
      cancel_url: `${SITE_URL}/pricing`,
      metadata: { service, type: "deposit" },
    });

    res.json({ url: session.url });
  } catch (err) {
    console.error("Stripe deposit session error:", err);
    res.status(500).json({ error: "Failed to create deposit checkout session." });
  }
});

router.post("/payments/webhook", async (req, res): Promise<void> => {
  const stripe = getStripe();
  if (!stripe) {
    res.status(503).json({ error: "Stripe not configured." });
    return;
  }

  const sig = req.headers["stripe-signature"] as string;
  const webhookSecret = process.env["STRIPE_WEBHOOK_SECRET"];

  if (!webhookSecret) {
    console.error("STRIPE_WEBHOOK_SECRET not set.");
    res.status(500).json({ error: "Webhook secret not configured." });
    return;
  }

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
  } catch (err) {
    console.error("Webhook signature verification failed:", err);
    res.status(400).json({ error: "Invalid webhook signature." });
    return;
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        if (session.metadata?.type === "deposit") {
          await handleDepositCompleted(session);
        } else {
          await handleCheckoutCompleted(session);
        }
        break;
      }
      case "invoice.payment_failed": {
        const invoice = event.data.object as Stripe.Invoice;
        await handlePaymentFailed(invoice);
        break;
      }
      case "customer.subscription.deleted": {
        const subscription = event.data.object as Stripe.Subscription;
        await handleSubscriptionCanceled(subscription);
        break;
      }
      default:
        break;
    }
    res.json({ received: true });
  } catch (err) {
    console.error(`Error handling webhook event ${event.type}:`, err);
    res.status(500).json({ error: "Webhook handler failed." });
  }
});

async function handleCheckoutCompleted(session: Stripe.Checkout.Session): Promise<void> {
  const plan = session.metadata?.plan || "unknown";
  const billingInterval = session.metadata?.billingInterval || "monthly";
  const customerEmail = session.customer_details?.email || "";
  const customerName = session.customer_details?.name || "";
  const customerId = typeof session.customer === "string" ? session.customer : session.customer?.id || "";
  const subscriptionId = typeof session.subscription === "string" ? session.subscription : session.subscription?.id || "";

  const existing = await db
    .select()
    .from(subscriptionsTable)
    .where(eq(subscriptionsTable.stripeSubscriptionId, subscriptionId))
    .limit(1);

  if (existing.length > 0) {
    return;
  }

  await db.insert(subscriptionsTable).values({
    stripeCustomerId: customerId,
    stripeSubscriptionId: subscriptionId,
    plan,
    billingInterval,
    status: "active",
    clientName: customerName,
    clientEmail: customerEmail,
  });

  const resend = getResend();
  if (resend && customerEmail) {
    const planLabel = PLAN_CONFIG[plan]?.name || plan;

    await Promise.allSettled([
      resend.emails.send({
        from: FROM_ADDRESS,
        to: customerEmail,
        subject: `Welcome to Blueprints & Bookkeeping — ${planLabel} Plan`,
        html: buildClientConfirmationEmail(customerName, planLabel, billingInterval),
      }),
      resend.emails.send({
        from: FROM_ADDRESS,
        to: OWNER_EMAIL,
        subject: `New Self-Service Subscriber: ${customerName} — ${planLabel}`,
        html: buildAdminNotificationEmail(customerName, customerEmail, planLabel, billingInterval),
      }),
    ]);
  }
}

async function handleDepositCompleted(session: Stripe.Checkout.Session): Promise<void> {
  const service = session.metadata?.service || "unknown";
  const customerEmail = session.customer_details?.email || "";
  const customerName = session.customer_details?.name || "";
  const depositConfig = DEPOSIT_CONFIG[service];
  const serviceName = depositConfig?.name || service;
  const amountPaid = session.amount_total ? `$${(session.amount_total / 100).toFixed(2)}` : "N/A";

  const resend = getResend();
  if (resend) {
    await Promise.allSettled([
      ...(customerEmail
        ? [
            resend.emails.send({
              from: FROM_ADDRESS,
              to: customerEmail,
              subject: `Deposit Received — ${serviceName}`,
              html: buildDepositClientEmail(customerName || "Client", serviceName, amountPaid),
            }),
          ]
        : []),
      resend.emails.send({
        from: FROM_ADDRESS,
        to: OWNER_EMAIL,
        subject: `Deposit Received: ${customerName || customerEmail || "Unknown"} — ${serviceName}`,
        html: buildDepositAdminEmail(customerName, customerEmail, serviceName, amountPaid),
      }),
    ]);
  }
}

async function handlePaymentFailed(invoice: Stripe.Invoice): Promise<void> {
  const customerEmail = typeof invoice.customer_email === "string" ? invoice.customer_email : "";
  const customerName = typeof invoice.customer_name === "string" ? invoice.customer_name : "";
  const sub = (invoice as unknown as Record<string, unknown>)["subscription"];
  const subscriptionId = typeof sub === "string" ? sub : (sub && typeof sub === "object" && "id" in sub ? (sub as { id: string }).id : "");

  if (subscriptionId) {
    const now = new Date();
    await db
      .update(subscriptionsTable)
      .set({ status: "past_due", updatedAt: now })
      .where(eq(subscriptionsTable.stripeSubscriptionId, subscriptionId));
  }

  const resend = getResend();
  if (resend && customerEmail) {
    await Promise.allSettled([
      resend.emails.send({
        from: FROM_ADDRESS,
        to: customerEmail,
        subject: "Payment Failed — Blueprints & Bookkeeping",
        html: buildPaymentFailedEmail(customerName || "Client"),
      }),
      resend.emails.send({
        from: FROM_ADDRESS,
        to: OWNER_EMAIL,
        subject: `Payment Failed: ${customerName || customerEmail}`,
        html: `<div style="font-family:Inter,Arial,sans-serif;max-width:600px;margin:0 auto;color:#1a1a2e;">
          <div style="background:#dc2626;padding:24px 32px;border-radius:8px 8px 0 0;">
            <h1 style="color:white;margin:0;font-size:20px;">Payment Failed</h1>
          </div>
          <div style="background:#f8f9ff;padding:32px;border-radius:0 0 8px 8px;border:1px solid #e2e5f0;">
            <p>A subscription payment failed for <strong>${customerName || "Unknown"}</strong> (${customerEmail}).</p>
            <p>Stripe will automatically retry. Check the <a href="https://dashboard.stripe.com" style="color:#6366f1;">Stripe dashboard</a> for details.</p>
          </div>
        </div>`,
      }),
    ]);
  }
}

async function handleSubscriptionCanceled(subscription: Stripe.Subscription): Promise<void> {
  const now = new Date();
  await db
    .update(subscriptionsTable)
    .set({ status: "canceled", canceledAt: now, updatedAt: now })
    .where(eq(subscriptionsTable.stripeSubscriptionId, subscription.id));

  const existing = await db
    .select()
    .from(subscriptionsTable)
    .where(eq(subscriptionsTable.stripeSubscriptionId, subscription.id))
    .limit(1);

  const sub = existing[0];

  const resend = getResend();
  if (resend && sub) {
    await Promise.allSettled([
      resend.emails.send({
        from: FROM_ADDRESS,
        to: sub.clientEmail,
        subject: "Subscription Canceled — Blueprints & Bookkeeping",
        html: `<div style="font-family:Inter,Arial,sans-serif;max-width:600px;margin:0 auto;color:#1a1a2e;">
          <div style="background:#6366f1;padding:24px 32px;border-radius:8px 8px 0 0;">
            <h1 style="color:white;margin:0;font-size:20px;">Subscription Canceled</h1>
          </div>
          <div style="background:#f8f9ff;padding:32px;border-radius:0 0 8px 8px;border:1px solid #e2e5f0;">
            <p>Hi ${sub.clientName},</p>
            <p>Your subscription has been canceled. You'll continue to have access until the end of your current billing period.</p>
            <p>If you change your mind, you can resubscribe anytime at <a href="${SITE_URL}/pricing" style="color:#6366f1;">our pricing page</a>.</p>
            <p>Thank you for being a client.</p>
            <p style="font-weight:600;">Tea Larson-Hetrick<br><span style="font-weight:normal;color:#666;">Blueprints & Bookkeeping LLC</span></p>
          </div>
        </div>`,
      }),
      resend.emails.send({
        from: FROM_ADDRESS,
        to: OWNER_EMAIL,
        subject: `Subscription Canceled: ${sub.clientName}`,
        html: `<div style="font-family:Inter,Arial,sans-serif;max-width:600px;margin:0 auto;color:#1a1a2e;">
          <div style="background:#dc2626;padding:24px 32px;border-radius:8px 8px 0 0;">
            <h1 style="color:white;margin:0;font-size:20px;">Subscription Canceled</h1>
          </div>
          <div style="background:#f8f9ff;padding:32px;border-radius:0 0 8px 8px;border:1px solid #e2e5f0;">
            <p><strong>${sub.clientName}</strong> (${sub.clientEmail}) has canceled their <strong>${sub.plan}</strong> subscription.</p>
          </div>
        </div>`,
      }),
    ]);
  }
}

function buildClientConfirmationEmail(name: string, plan: string, interval: string): string {
  return `<div style="font-family:Inter,Arial,sans-serif;max-width:600px;margin:0 auto;color:#1a1a2e;">
    <div style="background:#6366f1;padding:24px 32px;border-radius:8px 8px 0 0;">
      <h1 style="color:white;margin:0;font-size:20px;">Welcome to Blueprints & Bookkeeping!</h1>
    </div>
    <div style="background:#f8f9ff;padding:32px;border-radius:0 0 8px 8px;border:1px solid #e2e5f0;">
      <p>Hi ${name},</p>
      <p>Thank you for subscribing to the <strong>${plan}</strong> plan (billed ${interval === "annual" ? "annually" : "monthly"}).</p>
      <h3 style="margin-top:24px;color:#6366f1;">Next Steps</h3>
      <ol style="line-height:2;">
        <li><strong>Complete your onboarding form</strong> — <a href="${SITE_URL}/onboarding" style="color:#6366f1;">Fill it out here</a></li>
        <li>You'll receive your Engagement Letter and NDA via Adobe Sign shortly</li>
        <li>Upload documents securely via our <a href="${SITE_URL}/contact" style="color:#6366f1;">secure portal</a></li>
      </ol>
      <p style="margin-top:24px;">Questions? Reply to this email or call us at <strong>(541) 319-8654</strong>.</p>
      <p style="font-weight:600;">Tea Larson-Hetrick<br><span style="font-weight:normal;color:#666;">Blueprints & Bookkeeping LLC</span></p>
      <hr style="border:none;border-top:1px solid #e2e5f0;margin:24px 0;">
      <p style="font-size:12px;color:#999;">Manage your subscription anytime via the link in your Stripe receipt email.</p>
    </div>
  </div>`;
}

function buildAdminNotificationEmail(name: string, email: string, plan: string, interval: string): string {
  return `<div style="font-family:Inter,Arial,sans-serif;max-width:600px;margin:0 auto;color:#1a1a2e;">
    <div style="background:#16a34a;padding:24px 32px;border-radius:8px 8px 0 0;">
      <h1 style="color:white;margin:0;font-size:20px;">New Self-Service Subscriber!</h1>
    </div>
    <div style="background:#f8f9ff;padding:32px;border-radius:0 0 8px 8px;border:1px solid #e2e5f0;">
      <table style="width:100%;border-collapse:collapse;">
        <tr><td style="padding:8px 0;color:#666;font-size:14px;width:120px;">Name</td><td style="padding:8px 0;font-weight:600;">${name}</td></tr>
        <tr><td style="padding:8px 0;color:#666;font-size:14px;">Email</td><td style="padding:8px 0;"><a href="mailto:${email}" style="color:#6366f1;">${email}</a></td></tr>
        <tr><td style="padding:8px 0;color:#666;font-size:14px;">Plan</td><td style="padding:8px 0;font-weight:600;">${plan}</td></tr>
        <tr><td style="padding:8px 0;color:#666;font-size:14px;">Billing</td><td style="padding:8px 0;">${interval === "annual" ? "Annual" : "Monthly"}</td></tr>
      </table>
      <p style="margin-top:20px;">The client has been directed to complete the <a href="${SITE_URL}/onboarding" style="color:#6366f1;">onboarding intake form</a>. Contract automation will trigger once they submit.</p>
    </div>
  </div>`;
}

function buildPaymentFailedEmail(name: string): string {
  return `<div style="font-family:Inter,Arial,sans-serif;max-width:600px;margin:0 auto;color:#1a1a2e;">
    <div style="background:#dc2626;padding:24px 32px;border-radius:8px 8px 0 0;">
      <h1 style="color:white;margin:0;font-size:20px;">Payment Issue</h1>
    </div>
    <div style="background:#f8f9ff;padding:32px;border-radius:0 0 8px 8px;border:1px solid #e2e5f0;">
      <p>Hi ${name},</p>
      <p>We were unable to process your latest subscription payment. Please update your payment method to avoid service interruption.</p>
      <p>You can update your billing info through the link in your original Stripe receipt email, or contact us directly.</p>
      <p>Questions? Reply to this email or call us at <strong>(541) 319-8654</strong>.</p>
      <p style="font-weight:600;">Tea Larson-Hetrick<br><span style="font-weight:normal;color:#666;">Blueprints & Bookkeeping LLC</span></p>
    </div>
  </div>`;
}

function buildDepositClientEmail(name: string, service: string, amount: string): string {
  return `<div style="font-family:Inter,Arial,sans-serif;max-width:600px;margin:0 auto;color:#1a1a2e;">
    <div style="background:#6366f1;padding:24px 32px;border-radius:8px 8px 0 0;">
      <h1 style="color:white;margin:0;font-size:20px;">Deposit Received</h1>
    </div>
    <div style="background:#f8f9ff;padding:32px;border-radius:0 0 8px 8px;border:1px solid #e2e5f0;">
      <p>Hi ${name},</p>
      <p>Thank you! We've received your deposit of <strong>${amount}</strong> for <strong>${service}</strong>.</p>
      <h3 style="margin-top:24px;color:#6366f1;">What Happens Next</h3>
      <ol style="line-height:2;">
        <li>Tea will reach out within 1 business day to schedule your kickoff call.</li>
        <li>You'll receive your Engagement Letter and NDA via Adobe Sign.</li>
        <li>Complete your <a href="${SITE_URL}/onboarding" style="color:#6366f1;">onboarding intake form</a> to get started.</li>
      </ol>
      <p style="margin-top:24px;">Questions? Reply to this email or call us at <strong>(541) 319-8654</strong>.</p>
      <p style="font-weight:600;">Tea Larson-Hetrick<br><span style="font-weight:normal;color:#666;">Blueprints & Bookkeeping LLC</span></p>
    </div>
  </div>`;
}

function buildDepositAdminEmail(name: string, email: string, service: string, amount: string): string {
  return `<div style="font-family:Inter,Arial,sans-serif;max-width:600px;margin:0 auto;color:#1a1a2e;">
    <div style="background:#16a34a;padding:24px 32px;border-radius:8px 8px 0 0;">
      <h1 style="color:white;margin:0;font-size:20px;">New Deposit Received!</h1>
    </div>
    <div style="background:#f8f9ff;padding:32px;border-radius:0 0 8px 8px;border:1px solid #e2e5f0;">
      <table style="width:100%;border-collapse:collapse;">
        <tr><td style="padding:8px 0;color:#666;font-size:14px;width:120px;">Name</td><td style="padding:8px 0;font-weight:600;">${name || "Not provided"}</td></tr>
        <tr><td style="padding:8px 0;color:#666;font-size:14px;">Email</td><td style="padding:8px 0;"><a href="mailto:${email}" style="color:#6366f1;">${email || "Not provided"}</a></td></tr>
        <tr><td style="padding:8px 0;color:#666;font-size:14px;">Service</td><td style="padding:8px 0;font-weight:600;">${service}</td></tr>
        <tr><td style="padding:8px 0;color:#666;font-size:14px;">Amount</td><td style="padding:8px 0;font-weight:600;color:#16a34a;">${amount}</td></tr>
      </table>
      <p style="margin-top:20px;">Check the <a href="https://dashboard.stripe.com" style="color:#6366f1;">Stripe dashboard</a> for full details.</p>
    </div>
  </div>`;
}

export default router;
