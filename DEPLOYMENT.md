# Deployment Guide — Blueprints & Bookkeeping

## Architecture Overview

| Layer                      | Technology                                                                                  | Platform                                                                 |
| -------------------------- | ------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------ |
| Frontend + Pages Functions | React + Vite, Cloudflare Pages Functions                                                    | Cloudflare Pages                                                         |
| API server                 | Express 5, Node.js >= 20                                                                    | Railway / Render / Fly.io or a serverless/edge API after migration       |
| Database                   | MongoDB is the owner-selected target; legacy code still uses PostgreSQL/Drizzle temporarily | MongoDB Atlas free/shared tier or another low-cost Mongo-compatible host |

```text
Browser
  |
  +-> Cloudflare Pages (artifacts/website/dist/public)
  |     +-> /api/chat     -> functions/api/chat.ts (Pages Function)
  |     +-> /api/contact  -> functions/api/contact.ts (Pages Function)
  |
  +-> Standalone API server (artifacts/api-server)
        +-> /api/admin/**
        +-> /api/webhooks/**
        +-> /api/openai/**
        +-> all other Express routes
```

Cloudflare Pages Functions handle `/api/chat` and `/api/contact` at the edge.
All remaining API routes are served by the standalone Express server.

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
VITE_API_URL=

# Runtime
OPENAI_API_KEY=<your-openai-api-key>
OPENAI_CHAT_MODEL=gpt-4.1-mini
RESEND_API_KEY=<your-resend-api-key>
OWNER_EMAIL=tea@blueprintsandbookkeeping.com
TURNSTILE_SECRET_KEY=<your-cloudflare-turnstile-secret-key>
```

`wrangler.toml` at the repo root controls the Pages project configuration.
`artifacts/website/public/_routes.json` controls function routing include/exclude.

## Database Direction — MongoDB

MongoDB is the owner-selected production database direction. The current repository still contains legacy PostgreSQL/Drizzle persistence that must be migrated before the API can be described as MongoDB-backed in production. Do not build new persistent features around PostgreSQL unless they are temporary compatibility work.

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
- Legacy warning: the current Express runtime still imports Drizzle/PostgreSQL modules and may require `DATABASE_URL` until the migration above is complete. Treat that as migration debt, not the desired production architecture.

### Environment variables

```bash
NODE_ENV=production
PORT=3001
MONGODB_URI=mongodb+srv://user:password@cluster.example.mongodb.net/blueprints
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
CAL_WEBHOOK_SECRET=<your-cal-webhook-secret>
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

Set the start command on your host to `node artifacts/api-server/dist/index.cjs`.

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

## Verification Checklist

- [ ] Homepage loads without errors
- [ ] Contact form submission succeeds
- [ ] Newsletter signup works
- [ ] Intake / onboarding form works
- [ ] Chat assistant responds (or fails gracefully)
- [ ] `/api/healthz` returns 200
- [ ] Browser console has no CORS errors
- [ ] No unexpected 404 / 405 API responses
- [ ] `/admin/stats` works with `ADMIN_TOKEN`

## Troubleshooting

### CORS blocked in browser

Fix `CORS_ORIGIN` on API server and redeploy.

### `/api/chat` or `/api/contact` returns 404

1. Confirm `wrangler.toml` exists at repo root.
2. Confirm `artifacts/website/public/_routes.json` includes those routes.
3. Confirm Cloudflare deployment included the `functions/` directory.

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

- Choose a low-cost always-on API host for chat, forms, admin, and future tool integrations. Candidate categories: Cloudflare Workers/Pages Functions for lightweight endpoints, Render/Fly/Railway for Node services, or a serverless function platform if cold starts are acceptable.
- Implement the MongoDB migration so `MONGODB_URI` replaces `DATABASE_URL` for production persistence.
- Confirm which email, payment/invoicing, contract-signing, and chatbot providers are actually production-active before advertising or relying on those workflows. QuickBooks Online is the likely primary invoicing path; Stripe and Adobe Sign should remain optional until explicitly enabled.

## Support

For deployment questions contact <tea@blueprintsandbookkeeping.com>.
Also review:

- `.env.example`
- `wrangler.toml`
- `functions/api/`
