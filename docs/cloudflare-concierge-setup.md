# Cloudflare Assistant Concierge Setup

This is the active Cloudflare path for Aria, public forms, website feedback,
assistant feedback, D1 storage, and Resend notifications.

## Bindings

Create a D1 database in Cloudflare and bind it to the Pages project as:

```text
CONCIERGE_DB
```

Bind Workers AI to the Pages project as:

```text
AI
```

Workers AI bindings for Pages Functions are configured in the Cloudflare
dashboard.

## D1 Migration

Apply the schema in:

```text
migrations/0001_cloudflare_concierge.sql
```

With Wrangler, the flow is:

```bash
wrangler d1 create blueprints-bookkeeping-concierge
wrangler d1 migrations apply blueprints-bookkeeping-concierge --local
wrangler d1 migrations apply blueprints-bookkeeping-concierge --remote
```

Copy `wrangler.example.toml` to `wrangler.toml` only after replacing the D1
database ID.

## Secrets And Variables

Required encrypted secret:

```text
RESEND_API_KEY
```

Recommended variables:

```text
OWNER_EMAIL=tea@blueprintsandbookkeeping.com
FROM_EMAIL=Blueprints & Bookkeeping <noreply@blueprintsandbookkeeping.com>
AI_MODEL=@cf/meta/llama-3.1-8b-instruct
ALLOWED_ORIGINS=https://blueprintsandbookkeeping.com,https://www.blueprintsandbookkeeping.com
```

Optional encrypted secret:

```text
TURNSTILE_SECRET_KEY
```

If `TURNSTILE_SECRET_KEY` is present, public submissions and chat messages require
a Turnstile token in `turnstileToken` or `cf-turnstile-response`.

## Active Endpoints

```text
GET  /api/healthz
POST /api/contact
POST /api/newsletter/subscribe
POST /api/feedback
POST /api/assistant/feedback
POST /api/openai/conversations
POST /api/openai/conversations/:id/messages
```

## Cloudflare Migration Inventory

These endpoints are still used or integration-relevant but are not implemented in
the Cloudflare API yet. Migrate the needed ones into `functions/api/[[path]].ts`
before removing the old Express package, or intentionally retire the matching
website feature.

```text
GET/POST /api/newsletter/unsubscribe
POST     /api/onboarding
POST     /api/payments/create-checkout-session
POST     /api/payments/create-deposit-session
POST     /api/payments/webhook
GET/PATCH/POST/DELETE /api/admin/*
GET/PATCH/POST        /api/admin/nexus/*
GET/POST/PUT/DELETE   /api/contracts/*
GET/POST              /api/documents/*
POST                  /api/webhooks/cal
POST                  /api/webhooks/resend
GET                   /api/openai/conversations/:id
```

Payments, contracts, Adobe Sign, admin dashboards, and background schedulers are
not Cloudflare-native yet. Do not proxy to the old API in production if that
service was never reliable; build the needed endpoints directly in the
Cloudflare path.
