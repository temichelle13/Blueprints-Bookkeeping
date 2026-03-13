# Workspace

## Overview

pnpm workspace monorepo using TypeScript. Each package manages its own dependencies.

## Stack

- **Monorepo tool**: pnpm workspaces
- **Node.js version**: 24
- **Package manager**: pnpm
- **TypeScript version**: 5.9
- **API framework**: Express 5
- **Database**: PostgreSQL + Drizzle ORM
- **Validation**: Zod (`zod/v4`), `drizzle-zod`
- **API codegen**: Orval (from OpenAPI spec)
- **Build**: esbuild (CJS bundle)
- **Frontend**: React + Vite + Tailwind CSS + Framer Motion

## Structure

```text
artifacts-monorepo/
├── artifacts/              # Deployable applications
│   ├── api-server/         # Express API server
│   └── website/            # React+Vite frontend — Blueprints & Bookkeeping site
├── lib/                    # Shared libraries
│   ├── api-spec/           # OpenAPI spec + Orval codegen config
│   ├── api-client-react/   # Generated React Query hooks
│   ├── api-zod/            # Generated Zod schemas from OpenAPI
│   └── db/                 # Drizzle ORM schema + DB connection
├── scripts/                # Utility scripts (single workspace package)
│   └── src/                # Individual .ts scripts, run via `pnpm --filter @workspace/scripts run <script>`
├── pnpm-workspace.yaml     # pnpm workspace (artifacts/*, lib/*, lib/integrations/*, scripts)
├── tsconfig.base.json      # Shared TS options (composite, bundler resolution, es2022)
├── tsconfig.json           # Root TS project references
└── package.json            # Root package with hoisted devDeps
```

## Project: Blueprints & Bookkeeping, LLC

Professional website for a remote bookkeeping, business planning, and advisory firm owned by Tea Larson-Hetrick, based in Roseburg, Oregon.

### Brand
- **Primary color (deep navy)**: #1B2A5A
- **Secondary color (periwinkle)**: #5B5EA6
- **Backgrounds**: white (#FFFFFF) and light-grey (#F8F9FA) alternating sections
- **Contact**: tea@blueprintsandbookkeeping.com, 541-319-8654

### Pages (7 total)
1. **Home** — Hero with tagline, trust indicators, service overview cards, scarcity CTA (20-client cap)
2. **About** — Tea's bio, credentials, philosophy (cybersecurity + finance intersection)
3. **Services** — Advanced Bookkeeping, Business Plans, Static Web Design, Advisory, Digital Presence
4. **Industries** — Cannabis, Crypto/Web3, Agriculture, Timber, Tech Startups, Multi-Entity
5. **Pricing** — Three-tier flat-fee pricing (Bookkeeping $500+/mo, Business Plans $2.5k–$5k+, Web Design $1.5k–$3.5k+)
6. **Portfolio** — Demo case study cards (no real client data)
7. **Contact** — Dual-path: Quick Message + Discovery Intake Form

### Important notes
- Does NOT offer tax preparation — never include tax prep content
- Pricing uses "starting at" ranges only
- HTML/CSS designed to be portable for WordPress/Elementor HTML widgets
- Firm is capped at 20 active clients — emphasize scarcity/exclusivity

### Database
- `contact_inquiries` table stores form submissions (name, email, phone, business name, industry, revenue range, services needed, software used, pain points, goals, message, form type)

## TypeScript & Composite Projects

Every package extends `tsconfig.base.json` which sets `composite: true`. The root `tsconfig.json` lists all packages as project references. This means:

- **Always typecheck from the root** — run `pnpm run typecheck` (which runs `tsc --build --emitDeclarationOnly`). This builds the full dependency graph so that cross-package imports resolve correctly. Running `tsc` inside a single package will fail if its dependencies haven't been built yet.
- **`emitDeclarationOnly`** — we only emit `.d.ts` files during typecheck; actual JS bundling is handled by esbuild/tsx/vite...etc, not `tsc`.
- **Project references** — when package A depends on package B, A's `tsconfig.json` must list B in its `references` array. `tsc --build` uses this to determine build order and skip up-to-date packages.

## Root Scripts

- `pnpm run build` — runs `typecheck` first, then recursively runs `build` in all packages that define it
- `pnpm run typecheck` — runs `tsc --build --emitDeclarationOnly` using project references

## Packages

### `artifacts/api-server` (`@workspace/api-server`)

Express 5 API server. Routes live in `src/routes/` and use `@workspace/api-zod` for request and response validation and `@workspace/db` for persistence.

- Entry: `src/index.ts` — reads `PORT`, starts Express
- App setup: `src/app.ts` — mounts CORS, JSON/urlencoded parsing, routes at `/api`
- Routes: `src/routes/index.ts` mounts sub-routers; `src/routes/health.ts` exposes `GET /health`; `src/routes/contact.ts` exposes `POST /contact`
- Depends on: `@workspace/db`, `@workspace/api-zod`
- `pnpm --filter @workspace/api-server run dev` — run the dev server
- `pnpm --filter @workspace/api-server run build` — production esbuild bundle (`dist/index.cjs`)
- Build bundles an allowlist of deps (express, cors, pg, drizzle-orm, zod, etc.) and externalizes the rest

### `artifacts/website` (`@workspace/website`)

React + Vite + Tailwind CSS frontend for Blueprints & Bookkeeping. Uses react-router-dom for client-side routing, react-hook-form + zod for form validation, framer-motion for animations.

- 7 pages: Home, About, Services, Industries, Pricing, Portfolio, Contact
- Contact form posts to `/api/contact` on the API server
- Logo at `public/logo.png`, AI-generated images in `public/images/`

### `lib/db` (`@workspace/db`)

Database layer using Drizzle ORM with PostgreSQL. Exports a Drizzle client instance and schema models.

- `src/index.ts` — creates a `Pool` + Drizzle instance, exports schema
- `src/schema/index.ts` — barrel re-export of all models
- `src/schema/contactInquiries.ts` — contact form submissions table
- `drizzle.config.ts` — Drizzle Kit config (requires `DATABASE_URL`, automatically provided by Replit)
- Exports: `.` (pool, db, schema), `./schema` (schema only)

Production migrations are handled by Replit when publishing. In development, we just use `pnpm --filter @workspace/db run push`, and we fallback to `pnpm --filter @workspace/db run push-force`.

### `lib/api-spec` (`@workspace/api-spec`)

Owns the OpenAPI 3.1 spec (`openapi.yaml`) and the Orval config (`orval.config.ts`). Running codegen produces output into two sibling packages:

1. `lib/api-client-react/src/generated/` — React Query hooks + fetch client
2. `lib/api-zod/src/generated/` — Zod schemas

Run codegen: `pnpm --filter @workspace/api-spec run codegen`

### `lib/api-zod` (`@workspace/api-zod`)

Generated Zod schemas from the OpenAPI spec (e.g. `HealthCheckResponse`, `SubmitContactFormBody`). Used by `api-server` for response validation.

### `lib/api-client-react` (`@workspace/api-client-react`)

Generated React Query hooks and fetch client from the OpenAPI spec (e.g. `useHealthCheck`, `healthCheck`).

### `scripts` (`@workspace/scripts`)

Utility scripts package. Each script is a `.ts` file in `src/` with a corresponding npm script in `package.json`. Run scripts via `pnpm --filter @workspace/scripts run <script>`. Scripts can import any workspace package (e.g., `@workspace/db`) by adding it as a dependency in `scripts/package.json`.
