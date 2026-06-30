# Deployment Guide — Blueprints & Bookkeeping

## Architecture Overview

| Layer                      | Technology                                                            | Platform                                                                                      |
| -------------------------- | --------------------------------------------------------------------- | --------------------------------------------------------------------------------------------- |
| Frontend + Pages Functions | React + Vite, Cloudflare Pages Functions                              | Cloudflare Pages                                                                              |
| API server                 | Express 5, Node.js >= 20                                              | Railway / Render / Fly.io                                                                     |
| Database                   | PostgreSQL 16 in current code; MongoDB preferred for future migration | Neon / Supabase / Railway currently; MongoDB Atlas or another low-cost Mongo host to evaluate |

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

## Standalone API Server — Express

### Prerequisites

- Node.js >= 20
- PostgreSQL 16 database for the current Drizzle-backed runtime
- Production architecture note: the owner has stated the current database/API setup is not working for the desired 24/7 chatbot/tools experience and prefers MongoDB for the next data-layer direction. Treat PostgreSQL requirements below as current-code requirements, not the final desired architecture.

### Environment variables

```bash
NODE_ENV=production
PORT=3001
DATABASE_URL=postgresql://user:password@host:5432/dbname
# Future migration placeholder only; current runtime does not read this yet:
MONGODB_URI=mongodb+srv://user:password@cluster.example.mongodb.net/blueprints
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
pnpm --filter db push
node artifacts/api-server/dist/index.cjs
```

Set the start command on your host to `node artifacts/api-server/dist/index.cjs`.

## Database Migrations

Drizzle migration files are under `lib/db/drizzle/`.
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
- Decide whether to migrate from PostgreSQL/Drizzle to MongoDB before adding more DB-backed features.
- Confirm which email, payment/invoicing, contract-signing, and chatbot providers are actually production-active before advertising or relying on those workflows. QuickBooks Online is the likely primary invoicing path; Stripe and Adobe Sign should remain optional until explicitly enabled.

## Support

For deployment questions contact <tea@blueprintsandbookkeeping.com>.
Also review:

- `.env.example`
- `wrangler.toml`
- `functions/api/`
