# Deployment Guide

## Current deployment shape

| Layer           | Current direction                                               | Status                                                       |
| --------------- | --------------------------------------------------------------- | ------------------------------------------------------------ |
| Website         | Cloudflare Pages builds `artifacts/website`                     | Active deployment path                                       |
| Same-origin API | Cloudflare Pages Function in `functions/api/[[path]].ts`        | Viable low-cost path for the routes it implements            |
| Full API        | Express app in `artifacts/api-server`                           | Builds successfully; an always-on host has not been selected |
| Data            | D1 for the Pages Function; legacy PostgreSQL/Drizzle in Express | MongoDB is the intended replacement for Express persistence  |

Railway is not part of the selected deployment plan. Do not point the website at a retired Railway domain. Until another full-API host is selected, keep `VITE_API_URL` empty so browser requests use the same-origin Cloudflare Function.

## Cloudflare Pages

Configure the Pages project from the repository root:

| Setting                | Value                                                                          |
| ---------------------- | ------------------------------------------------------------------------------ |
| Build command          | `pnpm install --frozen-lockfile && pnpm --filter @workspace/website run build` |
| Build output directory | `artifacts/website/dist/public`                                                |
| Node.js                | A version allowed by the root `package.json` engines field                     |

The website's `public/_routes.json` sends `/api/*` requests to `functions/api/[[path]].ts`. The Function currently implements health, contact, newsletter, feedback, and Aria conversation routes. When an endpoint exists in both the Function and Express, keep their public contract aligned.

### Pages variables and bindings

Use the Cloudflare dashboard for secrets. Never commit values.

- Leave `VITE_API_URL` unset or empty for the same-origin Function.
- Bind a D1 database as `DB` for routes that persist data.
- Bind Workers AI as `AI` for the Cloudflare Aria path.
- Set `RESEND_API_KEY`, `OWNER_EMAIL`, and `TURNSTILE_SECRET_KEY` when the corresponding feature is enabled.
- Set any admin or webhook secrets required by the routes you deploy.

If a separate API host is selected later, set `VITE_API_URL` to its public `/api` base URL and verify CORS before deploying the website.

## Standalone Express API

The full Node API is built from `artifacts/api-server/src/index.ts`:

```bash
pnpm install --frozen-lockfile
pnpm --filter @workspace/api-server run build
node artifacts/api-server/dist/index.cjs
```

Any chosen host must support an always-on Node process, HTTPS, environment secrets, and a health check at `/api/healthz`. Required variables are documented in `.env.example`.

The Express app still imports the legacy Drizzle/PostgreSQL data package. `MONGODB_URI` documents the intended destination, but setting that variable alone does not migrate the app. Before calling the Express API MongoDB-backed:

1. Implement the MongoDB connection and typed collections.
2. Move persistent route and scheduler access away from `@workspace/db`.
3. Migrate and reconcile production records separately from application startup.
4. Validate IDs, relationships, consent history, tokens, and duplicate handling.
5. Remove the production dependency on `DATABASE_URL` only after reconciliation passes.

Do not run legacy schema pushes against production as part of an application deploy.

## Required validation

Run these checks from a clean checkout before publishing:

```bash
pnpm install --frozen-lockfile
pnpm run check:merge-conflicts
pnpm run lint
pnpm run typecheck
pnpm --filter @workspace/website run test
pnpm --filter @workspace/api-server run test
pnpm run build
pnpm run check:website-deploy
pnpm run check:route-references
```

After deployment, verify the public website and every enabled flow:

- Homepage and public navigation load without console errors.
- Contact and newsletter submissions succeed.
- Aria either responds or presents the approved fallback.
- The active `/api/healthz` returns HTTP 200.
- Browser requests have no CORS, 404, or 405 errors.
- Admin access still requires the configured `x-admin-token` value.

Passing local checks proves the repository can build; it does not prove dashboard bindings, secrets, DNS, or production data are correct.

## Related files

- `.env.example` — variable names and runtime ownership
- `SITE_CONSTRAINTS.md` — business and content guardrails
- `artifacts/website/public/_routes.json` — Cloudflare Function routing
- `functions/api/[[path]].ts` — low-cost same-origin API implementation
- `artifacts/api-server/src/index.ts` — full Express API entry point
