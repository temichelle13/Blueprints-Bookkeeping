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

# Email - Resend
RESEND_API_KEY=<your-resend-api-key>
OWNER_EMAIL=tea@blueprintsandbookkeeping.com

# Payment Processing
STRIPE_SECRET_KEY=<your-stripe-secret-key>
STRIPE_WEBHOOK_SECRET=<your-stripe-webhook-secret>

# AI Features
OPENAI_API_KEY=<your-openai-api-key>
OPENAI_CHAT_MODEL=gpt-4.1-mini

# Optional: Adobe Sign, Cal.com, Apollo.io
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

## Deployment to Cloudflare Pages

The repository now includes Cloudflare Pages configuration files for easy deployment:

### Configuration Files (Already Created)

1. **`wrangler.toml`** (root directory) - Cloudflare Pages build configuration
2. **`artifacts/website/public/_redirects`** - SPA routing configuration (redirects all routes to index.html)
3. **`artifacts/website/public/_headers`** - Security headers and caching rules

### Deployment Steps

1. **Connect to Cloudflare Pages**:
   - Go to Cloudflare Dashboard → Pages
   - Connect your GitHub repository
   - Select the branch to deploy (e.g., `master`)

2. **Configure Build Settings** (should auto-detect from `wrangler.toml`):
   - Build command: `pnpm install && pnpm --filter @workspace/website run build`
   - Build output directory: `artifacts/website/dist/public`
   - Root directory: Leave empty (monorepo setup)

3. **Set Environment Variables** in Cloudflare Pages dashboard:
   - `VITE_API_URL` - Your API backend URL (e.g., `https://api.blueprintsandbookkeeping.com`)
   - **Important**: This must be set during build, not runtime (Vite bakes it into the bundle)

4. **Deploy API Server Separately**:
   - Deploy backend to Cloudflare Workers, Cloud Run, or other Node.js hosting
   - Ensure API server is accessible at the URL specified in `VITE_API_URL`

5. **Configure CORS** on the API server:
   - Add Cloudflare Pages URL to `CORS_ORIGIN` environment variable
   - Example: `CORS_ORIGIN=https://blueprints-bookkeeping.pages.dev,https://www.blueprintsandbookkeeping.com`

### What Gets Deployed

- Static website files from `artifacts/website/dist/public/`
- `_redirects` file ensures all routes work (SPA routing)
- `_headers` file adds security headers and caching
- All assets properly cached with immutable headers

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
