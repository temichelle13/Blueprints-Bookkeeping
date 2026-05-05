# Cloudflare Pages API Platform Design (Blueprints & Bookkeeping)

Date: 2026-04-05  
Author: Codex agent

## 1) Context review (current state)

The repository currently has **three backend surfaces**:

1. **Cloudflare Pages Functions stubs** in `functions/api/` (`chat.ts`, `contact.ts`) that currently only contain env key tokens and are not functional handlers.
2. A full **Express API server** in `artifacts/api-server` with production-grade integrations, validation, auth middleware, webhook handling, and database access.
3. Shared OpenAPI/zod/client packages in `lib/api-spec`, `lib/api-zod`, and `lib/api-client-react` that the website consumes.

### Key integrations discovered in use

- **OpenAI** (`/api/openai/*`) for chat/conversation flow.
- **Resend** for contact, newsletter, feedback, and operational notifications.
- **Stripe** for checkout/session creation and webhook fulfillment.
- **Adobe Sign + Adobe CC Storage** for contracts/documents.
- **Booking webhook endpoint** (`/api/contracts/webhooks/booking`) documented as Calendly/manual webhook entry.
- **Twilio** for owner SMS notifications.
- **Apollo.io** optional enrichment key surfaced in env schema.
- **Postgres/Drizzle** for contracts, bookings, inquiries, subscriptions, admin data.

### Critical migration and production risks identified

1. **Non-functional Pages Functions stubs** can be mistaken for production handlers and silently break when deployed on Pages-only assumptions.
2. Existing API server includes **long-running schedulers** (contract sync, nexus checks, retention, email retries) that are **not Cloudflare Workers-native** patterns.
3. Some integrations rely on Node-oriented SDK/runtime behavior and robust raw webhook handling, better suited to a dedicated Node server boundary.
4. **Cal.com webhook path existed in API routing** while business operation is now Calendly; this creates maintenance and compliance confusion.

## 2) Approaches considered

### Approach A — Cloudflare Workers-only backend

- Put every API endpoint directly into Pages Functions/Workers.
- Pros: single platform, edge latency, simplified DNS.
- Cons: high rewrite risk for Node-first modules, scheduler redesign to queues/cron, webhook and SDK parity work, longer stabilization.

### Approach B — Dedicated Node API server + Pages frontend (recommended)

- Keep frontend on Cloudflare Pages.
- Run API server on Railway/Render/Fly/Cloud Run.
- Expose API via `api.<domain>` and set `VITE_API_URL`.
- Keep secrets in server runtime, not browser.
- Pros: minimal risk, fastest migration from current code, strongest compatibility with Stripe/Adobe/Resend/Twilio stack.
- Cons: extra service to operate.

### Approach C — Hybrid edge gateway + Node core API

- Cloudflare Worker handles edge auth/rate-limiting/cache/proxy.
- Node API handles sensitive webhooks, file ops, long-running jobs.
- Pros: best performance and security layering.
- Cons: highest operational complexity.

### Recommendation

Use **Approach B now** (stabilize quickly), then evolve to **Approach C** in phase 2 if traffic/perf/security demands justify edge gateway controls.

## 3) Target API design by integration

## 3.1 OpenAI

- Keep in Node API: `/api/openai/conversations`, `/api/openai/messages`.
- Add strict request budgets: per-IP + per-session + per-user-agent throttles.
- Add output filtering for financial/legal-risk language guardrails.
- Log prompt/response metadata only (no full PII payloads by default).

## 3.2 Resend (contact/newsletter/feedback/ops)

- Keep all send operations server-side only.
- Enforce SPF/DKIM/DMARC alignment for domain reputation.
- Persist delivery/complaint/bounce events from `/api/webhooks/resend` into suppression and event tables.
- Add idempotency key strategy for duplicate form submits.

## 3.3 Stripe

- Keep checkout/session creation and webhook verification in Node API.
- Lock webhook endpoint to raw body verification only (already implemented pattern).
- Add event replay protection and deterministic fulfillment transaction boundaries.
- Route payment events into audit log table for reconciliation.

## 3.4 Adobe Sign + document storage

- Keep OAuth refresh + transient docs + agreement lifecycle in Node API.
- Encrypt document identifiers and storage metadata at rest.
- Add explicit document retention policy mapping to bookkeeping engagement terms.

## 3.5 Booking (Calendly)

- Standardize on `/api/contracts/webhooks/booking` for Calendly/manual booking events.
- Remove Cal.com-specific routing and environment dependence.
- Require shared secret header and optionally HMAC signing if enabled in Calendly pipeline.

## 3.6 Twilio

- Keep owner alerting server-side; never expose account creds client-side.
- Add notification circuit-breaker and fallback-to-email behavior.

## 3.7 Apollo (optional)

- Keep enrichment optional and isolated to non-blocking background path.
- For compliance, do not enrich/retain any fields beyond stated privacy policy scope.

## 4) Cloudflare Pages integration pattern

- Website stays on Cloudflare Pages.
- Set production `VITE_API_URL=https://api.blueprintsandbookkeeping.com`.
- Configure CORS allowlist in API server to only website origins.
- Use Cloudflare DNS + WAF in front of `api` origin.
- Apply bot fight mode/rate-limits on API hostname where possible.

## 5) Migration plan (from current mixed state)

### Phase 0 — cleanup and source-of-truth

1. Deprecate/remove misleading Pages Functions stubs from deployment path.
2. Keep `artifacts/api-server` as sole backend source of truth.
3. Remove Cal.com route/config references and maintain Calendly booking webhook only.

### Phase 1 — deployable baseline

1. Provision managed Node runtime for API server.
2. Point `api` subdomain to API runtime.
3. Set envs: DB, Stripe, Resend, OpenAI, Adobe, Twilio, admin token.
4. Run DB migrations and smoke-test health + webhook signature checks.

### Phase 2 — hardening

1. Add centralized request correlation IDs.
2. Add structured security event logging.
3. Add synthetic monitoring for contact/newsletter/checkout/onboarding paths.
4. Add error-budget alerts (5xx, webhook failures, queue backlogs).

### Phase 3 — optimization

1. Optional Cloudflare Worker API gateway for edge controls.
2. Cache non-sensitive read endpoints with short TTL.
3. Introduce async queues for heavier outbound tasks.

## 6) Compliance and legal recommendations (bookkeeping-specific)

1. **Data minimization**: collect only required business/contact/tax prep fields.
2. **Consent capture**: preserve timestamp/IP/policy version on contact + newsletter + SMS consent.
3. **Retention controls**: enforce scheduled deletion/anonymization for stale inquiries and failed leads.
4. **Incident response**: maintain breach-notification SOP and tabletop runbook.
5. **Email/SMS compliance**: maintain unsubscribe and suppression enforcement across all outbound systems.
6. **Contract evidence chain**: store agreement status transitions and immutable audit metadata.
7. **State tax guidance disclaimer**: keep scope boundaries clear (bookkeeping vs legal/tax advice where applicable).

## 7) Security recommendations

1. Enforce mTLS or IP allowlist where providers support it for webhooks.
2. Rotate secrets quarterly; automate via provider secret stores.
3. Add per-route rate-limits (public forms, AI endpoints, auth-sensitive admin APIs).
4. Ensure admin routes require bearer token + origin checks + brute-force backoff.
5. Encrypt sensitive DB backups and verify restore drills quarterly.
6. Add SAST/dep scanning in CI for server and website packages.

## 8) SEO and web experience recommendations tied to API layer

1. Ensure form endpoints return deterministic, user-friendly errors to reduce abandonment.
2. Provide resilient fallback UX when API is degraded (queued submission notice).
3. Add server-side anti-spam scoring to protect form quality and conversion signal.
4. Track API latency/error metrics and correlate with Core Web Vitals regressions.

## 9) Definition of done for migration

- Pages frontend calls only one production API base URL.
- All active integrations pass end-to-end tests in staging.
- Webhook signature verification enforced for Stripe/Resend/booking webhook path.
- Cal.com references removed from active runtime configuration.
- Compliance checklist completed and documented.
