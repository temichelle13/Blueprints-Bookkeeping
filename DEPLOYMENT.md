# Deployment Guide — Blueprints & Bookkeeping

## Architecture Overview

| Layer                      | Technology                                                                                  | Platform                                                                 |
| -------------------------- | ------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------ |
| Frontend + Pages Functions | React + Vite, Cloudflare Pages Functions                                                    | Cloudflare Pages                                                         |
| API server                 | Express 5, Node.js >= 20                                                                    | Railway (`https://blueprints-bookkeeping-api.up.railway.app`)            |
| Database                   | MongoDB is the owner-selected target; legacy code still uses PostgreSQL/Drizzle temporarily | MongoDB Atlas free/shared tier or another low-cost Mongo-compatible host |

```text
Browser
  |
  +-> Cloudflare Pages (artifacts/website/dist/public)
  |     +-> static marketing pages
  |     +-> VITE_API_URL=https://blueprints-bookkeeping-api.up.railway.app/api
  |
  +-> Railway API server (artifacts/api-server)
        +-> /api/healthz
        +-> /api/contact and /api/newsletter
        +-> /api/openai/** for Aria chat
        +-> /api/admin/**
        +-> /api/webhooks/**
        +-> future scheduling/tool integrations
```

The selected production direction is to keep Cloudflare Pages focused on the frontend and run the real API/chat backend on Railway. Avoid splitting important production form/chat behavior between Cloudflare Pages Functions and Railway unless there is a deliberate reason, because split runtimes make MongoDB persistence, monitoring, and debugging harder.

## Cloudflare Pages — Frontend

### Build settings

| Setting                | Value                                                        |
| ---------------------- | ------------------------------------------------------------ |
| Build command          | `pnpm install && pnpm --filter @workspace/website run build` |
| Build output directory | `artifacts/website/dist/public`                              |
| Root directory         | repo root                                                    |
| Node.js version        | 20                                                           |

### API environment variables

```bash
# Build-time
VITE_API_URL=https://blueprints-bookkeeping-api.up.railway.app/api

# Runtime
OPENAI_API_KEY=<your-openai-api-key>
OPENAI_CHAT_MODEL=gpt-4.1-mini
RESEND_API_KEY=<your-resend-api-key>
OWNER_EMAIL=tea@blueprintsandbookkeeping.com
TURNSTILE_SECRET_KEY=<your-cloudflare-turnstile-secret-key>
```

Cloudflare Pages can be configured through the dashboard variables/secrets UI. This repo may not have a committed `wrangler.toml`, so do not assume one exists. `artifacts/website/public/_routes.json` controls function routing include/exclude.

## Database Direction — MongoDB

MongoDB is the owner-selected production database direction. The current repository still contains legacy PostgreSQL/Drizzle persistence and a Cloudflare Pages Function path with a legacy D1 binding helper, so adding `MONGODB_URI` as a Cloudflare secret is necessary but not sufficient by itself. The application must still be migrated before the API can be described as MongoDB-backed in production. Do not build new persistent features around PostgreSQL unless they are temporary compatibility work.

If the MongoDB URI and other secrets are already set in Cloudflare, do **not** share the secret values in chat or commit them to the repo. The non-secret deployment shape is now selected: Cloudflare Pages frontend, Railway Node API, and MongoDB Atlas using the normal Node MongoDB driver after migration. Do not use the deprecated Atlas Data API as the primary design.

Recommended migration path:

1. Add a MongoDB data package or module with shared connection handling, indexes, and typed collection helpers.
2. Move contact, newsletter, onboarding, conversations, messages, contracts, and admin summaries from Drizzle tables to MongoDB collections.
3. Update API routes and tests to use the MongoDB data layer instead of importing `@workspace/db`.
4. Make `MONGODB_URI` the required production database variable and remove the runtime dependency on `DATABASE_URL`.
5. Keep data export/backfill scripts separate from application startup so deployment does not depend on a local Postgres schema push.

## Standalone API Server — Express

### Prerequisites

- Node.js >= 20
- MongoDB is the intended production database direction.
- Legacy warning: routes that still touch Drizzle/PostgreSQL will fail without `DATABASE_URL` until the migration above is complete. The API can start without `DATABASE_URL` for health checks and non-legacy routes, but this is still migration debt, not the desired production architecture.

### Environment variables

```bash
NODE_ENV=production
PORT=3001
MONGODB_URI=mongodb+srv://user:password@bpbk-cluster.example.mongodb.net/blueprints_bookkeeping
# Legacy current-code compatibility only; remove after MongoDB migration:
DATABASE_URL=postgresql://user:password@host:5432/dbname
CORS_ORIGIN=https://blueprintsandbookkeeping.com,https://www.blueprintsandbookkeeping.com
ADMIN_TOKEN=<generate with: openssl rand -hex 32>
TRUST_PROXY=1
RESEND_API_KEY=<your-resend-api-key>
OWNER_EMAIL=tea@blueprintsandbookkeeping.com
OPENAI_API_KEY=<your-openai-api-key>
OPENAI_CHAT_MODEL=gpt-4.1-mini
TURNSTILE_SECRET_KEY=<your-cloudflare-turnstile-secret-key>
BOOKING_WEBHOOK_SECRET=<your-booking-webhook-secret>
# Optional unless Stripe checkout is enabled:
STRIPE_SECRET_KEY=<your-stripe-secret-key>
STRIPE_WEBHOOK_SECRET=<your-stripe-webhook-signing-secret>
```

### Deploy steps

```bash
pnpm install --frozen-lockfile
pnpm --filter @workspace/api-server run build
# Legacy only until MongoDB migration is complete:
pnpm --filter db push
node artifacts/api-server/dist/index.cjs
```

Set the Railway start command to `node artifacts/api-server/dist/index.cjs`. Set the Railway health check path to `/api/healthz`.

## Legacy Database Migrations

Drizzle migration files are under `lib/db/drizzle/`. These are legacy PostgreSQL artifacts for the current code path, not the desired MongoDB production model.
The applied migration journal is `lib/db/drizzle/meta/_journal.json`.

```bash
pnpm --filter db push
pnpm --filter db generate
```

Note on legacy migration files:

- `0004_add_contact_consent_audit_fields.sql`
- `0004_add_outbound_email_events.sql`

These files are not in `_journal.json` and are currently unapplied stale artifacts.

## Aria Chatbot and Scheduling Direction

Aria should be available whenever the API is healthy, answer accurately from the approved service constraints, and fail gracefully with email/scheduling fallbacks if OpenAI or persistence is unavailable. With the selected Railway + MongoDB architecture, the chatbot can eventually support scheduling workflows, but this must be implemented in phases:

1. **Current safe behavior:** Aria can explain options, collect lead details, and send visitors to the active Calendly scheduling link.
2. **Next production behavior:** Aria can create or update MongoDB lead/conversation records, preserve context, and notify Tea when a visitor asks for follow-up.
3. **Scheduling integration:** Aria can offer Calendly links and, if Calendly API/webhook credentials are added later, check availability or create scheduling handoffs. Until that integration exists, Aria must not claim it has booked, moved, or conflict-checked an appointment.
4. **Conflict checks:** Conflict checking requires a real calendar API connection with read access to the relevant calendar. Calendly embeds alone do not give the API enough information to guarantee conflict checks.

Required production variables for Aria on Railway are `OPENAI_API_KEY`, `OPENAI_CHAT_MODEL`, `MONGODB_URI` after migration, `CORS_ORIGIN`, and `ADMIN_TOKEN`. Keep `BOOKING_WEBHOOK_SECRET` for booking webhook verification if webhook-driven booking records stay active.

## Verification Checklist

- [ ] Homepage loads without errors
- [ ] Contact form submission succeeds
- [ ] Newsletter signup works
- [ ] Intake / onboarding form works
- [ ] Chat assistant responds from the Railway API (or fails gracefully with email/scheduling fallback)
- [ ] `https://blueprints-bookkeeping-api.up.railway.app/api/healthz` returns 200
- [ ] Browser console has no CORS errors
- [ ] No unexpected 404 / 405 API responses
- [ ] `/admin/stats` works with `ADMIN_TOKEN`

## Troubleshooting

### Railway URL returns `Application not found`

If `https://blueprints-bookkeeping-api.up.railway.app` returns Railway fallback JSON with `Application not found`, the code is not currently reachable at that public Railway domain. Check the Railway service domain attachment, deployment status, root directory, build command, start command, and health check path before pointing Cloudflare `VITE_API_URL` at it in production.

### CORS blocked in browser

Fix `CORS_ORIGIN` on API server and redeploy.

### `/api/chat` or `/api/contact` returns 404

1. Confirm Cloudflare Pages deployed the repository root and included the `functions/` directory.
2. Confirm `artifacts/website/public/_routes.json` includes those routes.
3. If using dashboard-only configuration, confirm Pages Functions are enabled there; a committed `wrangler.toml` is not currently required by this repo.

### Forms return 405

Verify the client is sending `POST` and not `GET`.

### Chat shows offline

1. Verify `OPENAI_API_KEY` is set in Cloudflare env.
2. Verify key validity in OpenAI dashboard.
3. Check Cloudflare Pages Function logs.

### Rate-limit false positives behind proxy

Set `TRUST_PROXY=1` so `req.ip` resolves to real client IP.

## Monthly SEO Monitoring

For `https://blueprintsandbookkeeping.com` in Search Console:

1. Open Pages report and filter `Indexed, though blocked by robots.txt`.
2. Keep admin/transactional routes blocked.
3. Fix robots/sitemap drift on any public marketing URL.
4. Record date, URL count, and remediations.
5. If anomalies increase, run `pnpm run check:website-deploy` before shipping.

## Open Production Architecture Decisions

- Implement the MongoDB migration for the existing MongoDB Atlas project `Blueprints-Bookkeeping` / cluster `bpbk-cluster` so `MONGODB_URI` replaces `DATABASE_URL` for production persistence; secrets being present is configuration, not the data-layer migration itself.
- Confirm which email, payment/invoicing, contract-signing, and chatbot providers are actually production-active before advertising or relying on those workflows. QuickBooks Online is the likely primary invoicing path; Stripe and Adobe Sign should remain optional until explicitly enabled.

## Support

For deployment questions contact <tea@blueprintsandbookkeeping.com>.
Also review:

- `.env.example`
- Cloudflare Pages project variables/secrets
- `functions/api/`
