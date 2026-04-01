# Cloudflare Pages Deployment Configuration

This directory contains the necessary configuration files for deploying the Blueprints & Bookkeeping website to Cloudflare Pages.

## Files Created

### 1. `wrangler.toml` (Root Directory)
Cloudflare Pages build configuration that specifies:
- Build command
- Output directory location
- Compatibility date

### 2. `_redirects` (artifacts/website/public/)
SPA routing configuration that redirects all routes to `index.html` with a 200 status code. This is **critical** for client-side routing to work properly on Cloudflare Pages.

```
/*    /index.html   200
```

Without this file, navigating to routes like `/about`, `/services`, etc. would return 404 errors.

### 3. `_headers` (artifacts/website/public/)
Security headers and caching configuration:
- Security headers (X-Frame-Options, X-Content-Type-Options, etc.)
- Cache-Control for static assets (1 year immutable cache)

## Deployment Instructions

1. **Connect Repository to Cloudflare Pages**:
   - Log in to Cloudflare Dashboard
   - Go to Pages
   - Click "Create a project" → "Connect to Git"
   - Select the `temichelle13/Blueprints-Bookkeeping` repository
   - Choose the branch to deploy (e.g., `master`)

2. **Build Settings** (auto-detected from `wrangler.toml`):
   - Framework preset: None
   - Build command: `pnpm install && pnpm --filter @workspace/website run build`
   - Build output directory: `artifacts/website/dist/public`
   - Root directory: (leave empty)

3. **Environment Variables** (set in Cloudflare Pages dashboard):
   - `VITE_API_URL` - Your API backend URL
     - Example: `https://api.blueprintsandbookkeeping.com`
     - **Important**: Must be set at build time, not runtime

4. **Deploy**:
   - Click "Save and Deploy"
   - Cloudflare will build and deploy your site
   - Your site will be available at `https://blueprints-bookkeeping.pages.dev`

## Custom Domain Setup

After initial deployment, add a custom domain:

1. Go to your Pages project → Custom domains
2. Add your domain (e.g., `blueprintsandbookkeeping.com`)
3. Follow DNS configuration instructions
4. SSL will be automatically provisioned

## Backend API Configuration

The frontend needs to communicate with your API backend:

1. Deploy the API server separately (Cloudflare Workers, Cloud Run, etc.)
2. Set `VITE_API_URL` to your API URL in Cloudflare Pages
3. Configure CORS on your API server:
   ```env
   CORS_ORIGIN=https://blueprints-bookkeeping.pages.dev,https://blueprintsandbookkeeping.com
   ```

## Troubleshooting

### Routes Return 404
- Verify `_redirects` file is in the build output
- Check build logs to ensure files are copied correctly

### API Requests Fail
- Verify `VITE_API_URL` is set in Cloudflare Pages environment variables
- Check API server CORS configuration includes your Cloudflare Pages URL
- Use browser DevTools Network tab to inspect failed requests

### Blank Screen on Load
- Check browser console for errors
- Verify all environment variables are set
- Ensure ErrorBoundary is catching and displaying errors

## Build Verification

To verify the build locally:

```bash
pnpm run check:website-deploy
```

This will:
1. Check for merge conflicts
2. Typecheck all libraries
3. Build the website
4. Verify build output includes all necessary files

## Files Included in Build Output

After running the build, `artifacts/website/dist/public/` will contain:
- `index.html` - Main HTML file
- `_redirects` - SPA routing configuration
- `_headers` - Security headers
- `assets/` - JavaScript, CSS, and other static assets
- `images/` - Image assets
- `.well-known/` - Security and configuration files
- Various favicon files and manifests
