# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Required reading before making changes

- `SITE_CONSTRAINTS.md` — business/content guardrails (locked copy, navigation, Calendly URLs, pricing language, credential labels, the "no tax services" rule). Treat these as non-negotiable; stop and ask if a change might violate one.
- `.env.example` — full environment variable reference.
- `DEPLOYMENT.md` — how the frontend and API are actually shipped (Cloudflare Pages + standalone Express server), and the legacy `functions/api/` Pages Functions that duplicate `/api/chat` and `/api/contact` at the edge.

## Commands

```bash
pnpm install --frozen-lockfile          # install (pnpm only — preinstall hook blocks npm/yarn)
pnpm run dev                            # start API server (tsx watch on artifacts/api-server/src/index.ts)
pnpm --filter @workspace/website dev    # start Vite dev server for the frontend

pnpm run build                          # codegen -> typecheck -> build all packages (production build)
pnpm --filter @workspace/website build  # build frontend only
pnpm --filter @workspace/api-server build  # bundle API to artifacts/api-server/dist/index.cjs (esbuild via build.ts)

pnpm run typecheck                      # typecheck libs first (project references), then artifacts/ and scripts/
pnpm run lint                           # prettier --check .
pnpm run format                         # prettier --write .

pnpm run codegen                        # regenerate API clients/schemas from lib/api-spec/openapi.yaml (Orval)
pnpm run check:merge-conflicts          # scan repo for unresolved <<<<<<< / ======= / >>>>>>> markers
pnpm run check:route-references         # fail if an Express route module isn't wired into routes/index.ts
pnpm run check:website-deploy           # merge-conflict check -> typecheck -> indexing guards -> website build (run before every deploy)

pnpm --filter @workspace/db push        # push Drizzle schema to DATABASE_URL
pnpm --filter @workspace/db generate    # generate a new Drizzle migration from schema changes
```

### Tests

Tests use Node's built-in test runner via `tsx --test`, colocated as `*.test.ts` next to the source file.

```bash
pnpm --filter @workspace/api-server test                          # all api-server tests
pnpm --filter @workspace/api-server exec tsx --test src/routes/contact.test.ts   # a single file
pnpm --filter @workspace/website test                              # all website tests (src/**/*.test.ts)
```

## Architecture

This is a pnpm monorepo (workspaces: `artifacts/*`, `lib/*`, `lib/integrations/*`, `scripts`). **The only production API runtime path is `artifacts/api-server/src/index.ts`**, bundled to `artifacts/api-server/dist/index.cjs`. `functions/api/[[path]].ts` is a Cloudflare Pages Functions edge shim that exists only to handle `/api/chat` and `/api/contact` at the edge per `DEPLOYMENT.md` — it is not where most route logic lives.

### Contract-first API flow

`lib/api-spec/openapi.yaml` is the source of truth for every endpoint shape. Orval generates:

- `lib/api-client-react/src/generated` — React Query hooks consumed by the frontend (e.g. `useSubmitContactForm`, `useSubscribeNewsletter`).
- `lib/api-zod/src/generated` — Zod schemas shared by client and server validation.

**Never hand-edit generated output.** When an endpoint shape changes: update `openapi.yaml` first, run `pnpm run codegen`, then update both the Express route in `artifacts/api-server/src/routes/` and the frontend call site. Frontend mutations should go through the generated hooks, not ad hoc `fetch` calls — same-origin requests default to `/api`, cross-origin uses build-time `VITE_API_URL` (set in `artifacts/website/src/App.tsx`).

### API server (`artifacts/api-server`)

- `src/index.ts` — entrypoint: validates env via `config/env.ts`, starts the Express app, then kicks off background interval schedulers (contract status sync + reminders hourly, nexus check daily at 8am Pacific, inquiry retention daily, outbound email retry every minute). Changes here affect more than request handling.
- `src/app.ts` — Express app assembly (Helmet, CORS, rate limiting, route mounting).
- `src/routes/index.ts` — mounts every route module; `pnpm run check:route-references` enforces that every non-test route file under `src/routes/` is actually wired in here.
- `src/routes/openai/` — the Aria chatbot; streams SSE responses, persists to `conversations`/`messages` tables.
- `src/middleware/admin-auth.ts` — admin endpoints are protected only by an `x-admin-token` header check; preserve this contract unless explicitly asked to redesign auth.
- `src/middleware/public-submissions.ts` — shared abuse protection (rate limiting, honeypot validation) for public-facing forms.
- `src/lib/` — business logic: Stripe, Resend email, Adobe Sign (`adobe-sign.ts`, `contract-service.ts`, `adobe-cc-storage.ts`), nexus rules, inquiry retention, scheduler health tracking.

### Frontend (`artifacts/website`)

React 19 + Vite 8, routed with `wouter`, styled with Tailwind v4 utilities defined in `src/index.css`. Shared visual primitives (`glass-card`, `accent-bar`, `font-display`, `font-mono`) are used across `src/pages/*` — check `src/index.css` and `src/pages/Home.tsx` for the established patterns before introducing new ones. Path aliases: `@` → `src/`, `@assets` → asset dir (see `vite.config.ts`).

Public forms follow one pattern throughout: client-side Zod + React Hook Form, a `website` honeypot field, consent version/source metadata for TCPA tracking, submitted through the generated React Query hooks, validated server-side by `public-submissions.ts`.

### Data layer (`lib/db`)

Drizzle ORM + PostgreSQL. Schema lives in `lib/db/src/schema/*` — one file per table (`contactInquiries`, `newsletterSubscribers`, `bookings`, `subscriptions`, `contracts`, `conversations`/`messages`, `stateNexus`, `emailSuppressionList`, `outboundEmailEvents`, `clientDocuments`). Migrations are under `lib/db/drizzle/`; the applied journal is `lib/db/drizzle/meta/_journal.json`. Two migration files predate the journal and are stale/unapplied — see the note in `DEPLOYMENT.md` before assuming all `.sql` files under that directory are live.

### Indexing / SEO guards

Sensitive routes (e.g. `/admin`) must stay noindexed in three places kept in sync manually: page-level `<SEO noindex />`, the `App.tsx` fallback prefix list, and `scripts/src/check-indexing-guards.ts` (which also checks `public/robots.txt` and sitemap generation). `check:website-deploy` runs this guard automatically.

## Repo-specific conventions

- Business rules in `SITE_CONSTRAINTS.md` override generic best practice for this site: no tax-service language ever, Calendly only (no scheduling substitutions), exact credential/certification labels, "starting at" pricing only, 20-client cap mentioned subtly at most, and a fixed nav order (Services, Industries, About, Pricing, Portfolio, Blog, Resources, Contact). The Aria system prompt's Get Started paths must stay in sync with the actual `/get-started` page.
- TypeScript is strict across the monorepo (`tsconfig.base.json`: `strict`, `noUncheckedIndexedAccess`, `exactOptionalPropertyTypes`, `verbatimModuleSyntax`). Packages typecheck via project references, which is why `pnpm run typecheck` runs `typecheck:libs` before the app-level check.
- `pnpm` is enforced at install time — a `preinstall` script removes stray `package-lock.json`/`yarn.lock` and exits non-zero if invoked via npm/yarn.
