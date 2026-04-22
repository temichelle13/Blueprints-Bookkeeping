# Deployment Guide for Blueprints & Bookkeeping

This guide explains how to properly deploy the Blueprints & Bookkeeping application to production.

## Current Deployment Architecture

The application is currently configured for **Replit deployment**, not Cloudflare. The repository contains:

- **API Server**: Express backend (`artifacts/api-server`)
- **Website**: React + Vite frontend (`artifacts/website`)
- **Database**: PostgreSQL

## Required Environment Variables

### Backend (API Server)

The following environment variables must be set for the API server:

```bash
# Server Configuration
NODE_ENV=production
PORT=3001

# Database
DATABASE_URL=postgresql://user:password@host:port/dbname

# CORS Configuration (CRITICAL)
# Must include all allowed frontend origins (comma-separated)
CORS_ORIGIN=https://blueprintsandbookkeeping.com,https://www.blueprintsandbookkeeping.com

# Security
ADMIN_TOKEN=<generate-with-openssl-rand-hex-32>

# Reverse Proxy / Client IP Configuration (CRITICAL for rate limiting)
# Set how many trusted proxy hops are in front of the API server.
# Defaults to false (no proxy trust) when unset.
# Replit or a single load balancer/CDN in front of Node: 1
# Multiple proxies (e.g., CDN -> ingress -> Node): set to exact hop count
# Must be set explicitly in production to avoid IP spoofing via X-Forwarded-For
TRUST_PROXY=1

# Email - Resend
RESEND_API_KEY=<your-resend-api-key>
OWNER_EMAIL=tea@blueprintsandbookkeeping.com

# Payment Processing
STRIPE_SECRET_KEY=<your-stripe-secret-key>
STRIPE_WEBHOOK_SECRET=<your-stripe-webhook-secret>

# AI Features
OPENAI_API_KEY=<your-openai-api-key>
OPENAI_CHAT_MODEL=gpt-4.1-mini

# Optional: Adobe Sign, Calendly webhook, Apollo.io
# See .env.example for complete list
```

### Frontend (Website)

The frontend requires **build-time** environment variables:

```bash
# API URL Configuration (CRITICAL)
# Set this to the API server URL if frontend and backend are on different origins
# Leave empty for same-origin deployments (API accessible via /api relative path)
VITE_API_URL=https://api.blueprintsandbookkeeping.com

# OR leave empty if deploying on same domain:
VITE_API_URL=
```

**Important**: `VITE_API_URL` must be set **during the build process**, not at runtime. Vite injects this value into the compiled JavaScript at build time.

## Common Deployment Issues and Solutions

### Issue 1: Forms Not Working

**Symptoms**: Contact forms, intake forms, newsletter signup return errors or fail silently.

**Root Causes**:

1. `VITE_API_URL` not set during website build
2. `CORS_ORIGIN` not configured on backend
3. API server not running or unreachable

**Solution**:

```bash
# During website build:
export VITE_API_URL=https://api.blueprintsandbookkeeping.com
pnpm --filter @workspace/website run build

# On API server:
export CORS_ORIGIN=https://blueprintsandbookkeeping.com
```

### Issue 2: Chat Assistant Not Working

**Symptoms**: Chat widget shows "offline" or returns 405 Method Not Allowed.

**Root Causes**: Same as forms issue - missing `VITE_API_URL` or `CORS_ORIGIN`.

**Solution**: Same as Issue 1.

### Issue 3: Intake Form Reverting to Defaults

**Status**: ✅ FIXED in this PR

**Previous Issue**: Budget selection would revert when user checked "I don't know my budget" then tried to select a budget.

**Fix**: Removed `selectedBudget` from useEffect dependency array in `Contact.tsx` to prevent infinite loop.

### Issue 4: Footer Text Overflow

**Status**: ✅ FIXED in this PR

**Previous Issue**: Contact link descriptions were too long and caused layout issues.

**Fix**: Shortened descriptions in `Footer.tsx` from verbose to concise versions.

### Issue 5: Table Action Columns Text Overflow

**Status**: ✅ FIXED in this PR

**Previous Issue**: Table cells had minimal padding (p-2/8px) causing text to wrap or overflow.

**Fix**: Increased padding to p-4/16px in `table.tsx` component.

### Issue 6: Legitimate users being blocked by contact form rate limits

**Symptoms**: Different users behind a proxy/CDN appear as one IP, causing unexpected 429 responses.

**Root Causes**:

1. `trust proxy` not configured for real deployment proxy depth
2. Proxy chain sends `X-Forwarded-For`, but API is using proxy IP for limiter keys

**Solution**:

- Set `TRUST_PROXY` on the API server to match the number of trusted proxy hops.
- Recommended values:
  - `TRUST_PROXY=1` for one proxy hop (common: Replit proxy, single reverse proxy, or CDN directly in front of the app)
  - `TRUST_PROXY=2` or higher only when you can verify multiple trusted hops
  - Leave unset (or `TRUST_PROXY=false`) only when there is no reverse proxy/CDN; this is the default and prevents IP spoofing
- **Always set `TRUST_PROXY` explicitly in production**; leaving it unset disables proxy trust and rate limits will key on the proxy IP, not the real client IP.
- Keep proxy chain controlled by your infrastructure only; do not trust arbitrary client-supplied forwarding headers.

## Deployment to Cloudflare Pages (Active Configuration)

The site is deployed on Cloudflare Pages. The frontend is built from
`artifacts/website/dist/public` and the API layer is provided by
**Cloudflare Pages Functions** in the `functions/` directory. No separate
Express server needs to be deployed — all `/api/*` routes are handled by
Workers running server-side.

### API Routes Implemented

| Method | Path | Handler |
|--------|------|---------|
| `GET` | `/api/healthz` | `functions/api/healthz.ts` |
| `POST` | `/api/contact` | `functions/api/contact.ts` |
| `POST` | `/api/newsletter/subscribe` | `functions/api/newsletter/subscribe.ts` |
| `GET` | `/api/newsletter/unsubscribe?token=` | `functions/api/newsletter/unsubscribe.ts` |
| `POST` | `/api/newsletter/unsubscribe` | `functions/api/newsletter/unsubscribe.ts` |
| `POST` | `/api/openai/conversations` | `functions/api/openai/conversations.ts` |
| `GET` | `/api/openai/conversations/:id` | `functions/api/openai/conversations/[id].ts` |
| `POST` | `/api/openai/conversations/:id/messages` | `functions/api/openai/conversations/[id]/messages.ts` |

### Cloudflare Pages Dashboard Setup

#### Build Configuration

| Setting | Value |
|---------|-------|
| Build command | `pnpm install --no-frozen-lockfile && pnpm --filter @workspace/website build` |
| Build output directory | `artifacts/website/dist/public` |
| Root directory | *(leave empty — repo root)* |
| Node.js version | 20 or later |

#### Environment Variables

Set these in **Cloudflare Pages → Settings → Environment variables**. Mark
secrets as **Encrypted**.

| Variable | Type | Required | Description |
|----------|------|----------|-------------|
| `RESEND_API_KEY` | Secret | ✅ | Resend API key for sending emails |
| `OPENAI_API_KEY` | Secret | ✅ | OpenAI API key for Aria chat |
| `OWNER_EMAIL` | Plaintext | Optional | Notification recipient (default: `tea@blueprintsandbookkeeping.com`) |
| `SITE_URL` | Plaintext | Optional | Canonical site URL (default: `https://blueprintsandbookkeeping.com`) |
| `OPENAI_CHAT_MODEL` | Plaintext | Optional | OpenAI model ID (default: `gpt-4.1-mini`) |
| `VITE_API_URL` | Plaintext | Optional | Leave **empty** — functions run same-origin |

> **Important**: `VITE_API_URL` must be **empty** (or not set) when using
> Cloudflare Pages Functions so the frontend calls same-origin `/api/*` routes.
> If it is set to an external URL, the Pages Functions are bypassed.

#### Optional: Durable Chat Storage (KV)

By default, chat conversation history is stored in memory per Worker isolate
and is ephemeral (reset on Worker restart). For durable chat history:

1. Create a KV namespace in Cloudflare dashboard: **Workers & Pages → KV**.
2. Bind it to your Pages project: **Pages → Settings → Functions → KV bindings**
   - Variable name: `CHAT_KV`
   - KV namespace: *(select the namespace you created)*

The messages handler automatically detects and uses `CHAT_KV` when bound.

#### Optional: Newsletter Subscriber Database (D1)

Currently, newsletter signups trigger emails only (no persistent subscriber
list). To persist subscribers:

1. Create a D1 database in Cloudflare dashboard.
2. Bind it to your Pages project with variable name `DB`.
3. Update `functions/api/newsletter/subscribe.ts` to insert into D1.

### `wrangler.toml`

A `wrangler.toml` is included at the repo root. Its primary purpose is to
document the configuration. Cloudflare Pages reads build settings from the
dashboard, not from `wrangler.toml`, but the file is useful for local
development with `wrangler pages dev`.

### Local Development with Wrangler

To test Pages Functions locally:

```bash
# Install wrangler globally
npm install -g wrangler

# Build the frontend first
pnpm --filter @workspace/website build

# Start local Pages Functions dev server
wrangler pages dev artifacts/website/dist/public \
  --binding RESEND_API_KEY=re_test_xxx \
  --binding OPENAI_API_KEY=sk-xxx
```

### Known Limitations (Cloudflare Pages vs. Express)

| Feature | Express backend | Cloudflare Pages |
|---------|----------------|-----------------|
| Newsletter subscriber list | PostgreSQL database | Email-only (no DB by default) |
| Chat conversation history | PostgreSQL, fully durable | In-memory per isolate (ephemeral) or KV (durable) |
| Rate limiting | In-process middleware | Not implemented (use Cloudflare WAF rules) |
| IP-based tracking / honeypot | Express middleware | Basic honeypot field only |
| Contact inquiry DB record | PostgreSQL | Not persisted (email only) |

For full feature parity with the Express backend, deploy the Express server
(`artifacts/api-server`) on a Node.js host (Replit, Render, Fly.io) and set
`VITE_API_URL` to that server's origin.

## Deployment Steps

### Replit Deployment (Current)

1. Set environment variables in Replit Secrets:
   - All backend variables from `.env.example`
   - `VITE_API_URL` (if needed)

2. The `.replit` file handles the deployment:

   ```bash
   pnpm install
   pnpm run build
   ```

3. Artifacts are automatically deployed via Replit's artifact system

### Manual Deployment

1. **Install dependencies**:

   ```bash
   pnpm install --frozen-lockfile
   ```

2. **Build the website**:

   ```bash
   export VITE_API_URL=<your-api-url-or-empty>
   pnpm --filter @workspace/website run build
   ```

3. **Build the API server**:

   ```bash
   pnpm --filter @workspace/api-server run build
   ```

4. **Deploy artifacts**:
   - Frontend: `artifacts/website/dist/public` → static hosting
   - Backend: `artifacts/api-server/dist/index.cjs` → Node.js hosting

5. **Set environment variables** on hosting platform

6. **Run database migrations** (if needed):
   ```bash
   pnpm --filter db push
   ```

## Verification Checklist

After deployment, verify:

- [ ] Homepage loads without errors
- [ ] Contact form submission works
- [ ] Newsletter signup works
- [ ] Intake form (bookkeeper form) works
- [ ] Chat assistant appears and works (or shows offline state gracefully)
- [ ] All pages render without blank spaces
- [ ] Table layouts look correct with proper padding
- [ ] Footer displays correctly without text overflow
- [ ] Check browser console for CORS errors
- [ ] Check network tab for failed API requests

## Monthly SEO Monitoring (Google Search Console)

To prevent accidental indexing drift, run this check once per month in Google Search Console for `https://blueprintsandbookkeeping.com`:

1. Open **Pages** report.
2. Filter by reason: **Indexed, though blocked by robots.txt**.
3. Review each URL:
   - If it is an admin or transactional URL (`/admin`, `/onboarding`, `/welcome`, `/payment-success`, `/status`, `/feedback`, `/unsubscribe`, `/marketing-guide`), keep it blocked and verify no internal links are promoting crawl demand.
   - If it is a public marketing URL, fix robots and sitemap consistency before next deployment.
4. Record findings in your monthly ops log with:
   - Date checked
   - Number of affected URLs
   - URLs remediated
5. If anomaly count increases month-over-month, create a production incident ticket and run `pnpm run check:website-deploy` before shipping.

## Troubleshooting

### CORS Errors in Browser Console

```
Access to fetch at 'https://api.example.com/api/...' from origin 'https://example.com' has been blocked by CORS policy
```

**Fix**: Add frontend origin to `CORS_ORIGIN` environment variable on backend.

### 404 Not Found for API Requests

**Symptoms**: All API requests return 404.

**Fix**: Check `VITE_API_URL` is set correctly during build. Rebuild the website if needed.

### Chat Assistant Always Offline

**Symptoms**: Chat widget shows offline message even though API is running.

**Fix**:

1. Check `VITE_API_URL` is set
2. Check `/api/healthz` endpoint is accessible
3. Check CORS configuration

### Forms Return 405 Method Not Allowed

**Symptoms**: POST requests to `/api/contact` or `/api/newsletter/subscribe` return 405.

**Fix**: API server is not receiving requests. Check routing and `VITE_API_URL` configuration.

## Support

For deployment issues, contact Tea at tea@blueprintsandbookkeeping.com or check:

- `.env.example` - List of all environment variables
- `artifacts/website/.replit-artifact/artifact.toml` - Frontend configuration
- `.replit` - Main deployment configuration
