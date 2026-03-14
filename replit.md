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

### Brand & Theme
- **Primary color (deep navy)**: #1B2A5A
- **Secondary color (periwinkle/accent)**: #5B5EA6
- **Theme**: Dark — deep navy-black background, glassmorphism cards, gradient text, glow accents
- **CSS**: Custom `.glass-card` and `.glass-card-hover` in plain CSS (Tailwind v4 compatible). `@layer utilities` for glow-line, glow-dot, text-gradient, accent-bar
- **Font stack**: Display font (Inter bold), JetBrains Mono for tags
- **Contact**: tea@blueprintsandbookkeeping.com, 541-319-8654

### Pages (10 total)
1. **Home** — Hero with tagline, trust indicators, 3 pillars, lead magnet section (Financial Readiness Checklist download gate), scarcity CTA (20-client cap)
2. **About** — Tea's bio, credentials, digital badges. NO portrait image. Degrees listed as "coursework"/"studies" (not completed). Certs: CEH v12, QB ProAdvisor Advanced, Crypto Tax Certified, OR Notary RON
3. **Services** — Advanced Bookkeeping, Business Plans, Digital Handshake (static web), Remote Online Notarization
4. **Industries** — Agriculture/Timber, Crypto, Gig/E-commerce, Multi-Entity, Tech/Startups
5. **Pricing** — Three-tier flat-fee (Bookkeeping $500+/mo, Plans $2.5k–$5k+, Web $1.5k–$3.5k+)
6. **Portfolio** — Demo case study cards (no real client data)
7. **Blog** — Blog listing + individual article pages (/blog/:slug). 4 starter articles in `src/data/blog-posts.ts`
8. **Contact** — Dual-path: Quick Message + Discovery Intake Form
9. **Unsubscribe** — Newsletter unsubscribe page with email input
10. *(Not Found)* — 404 page

### Header
- Shows ONLY the BB icon (`public/logo-icon.png`) — cropped from full logo. No text beside it
- Nav: About, Services, Industries, Pricing, Portfolio, Blog + "Get Started" CTA

### SEO
- `index.html`: meta description, keywords, OG tags, Twitter cards, canonical URL, JSON-LD (ProfessionalService schema)
- `public/robots.txt` and `public/sitemap.xml` (includes all pages + blog post URLs)
- Per-page titles via `usePageTitle()` hook (`src/hooks/use-page-title.ts`)

### Stripe (Task #18 — Pending)
- Stripe payment integration is planned but not yet connected. The Replit Stripe integration was dismissed by the user.
- To proceed: connect the Stripe integration via the Integrations tab, OR provide Stripe Secret Key + Publishable Key as secrets (STRIPE_SECRET_KEY, STRIPE_PUBLISHABLE_KEY).
- `stripe` and `stripe-replit-sync` packages are already installed at the workspace root.

### Important notes
- Does NOT offer tax preparation — never include tax prep content
- Pricing uses "starting at" ranges only
- Firm is capped at 20 active clients — emphasize scarcity/exclusivity
- About page: degrees are COURSEWORK/STUDIES only (not completed). Professional certs ARE earned

### Newsletter & Lead Magnet
- Footer includes newsletter signup form (email + subscribe button) under "Stay in the Loop"
- Home page has a lead magnet section offering "Financial Readiness Checklist" PDF download gated behind email submission
- PDF checklist at `public/downloads/financial-readiness-checklist.pdf` (generated via `scripts/generate-checklist-pdf.mjs`)
- Unsubscribe page at `/unsubscribe` for email opt-out
- Frontend components: `NewsletterSignup.tsx` (footer), `LeadMagnet.tsx` (home page)
- Hook: `use-newsletter.ts` wraps the subscribe mutation

### Database
- `contact_inquiries` table stores form submissions (name, email, phone, business name, industry, revenue range, services needed, software used, pain points, goals, message, form type)
- `newsletter_subscribers` table stores email subscriptions (email unique, signup_source, active status, subscribed_at)

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
- Routes: `src/routes/index.ts` mounts sub-routers; `src/routes/health.ts` exposes `GET /health`; `src/routes/contact.ts` exposes `POST /contact`; `src/routes/newsletter.ts` exposes `POST /newsletter/subscribe` and `POST /newsletter/unsubscribe`
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
- `src/schema/newsletterSubscribers.ts` — newsletter subscribers table (email, signup_source, active, subscribed_at)
- `drizzle.config.ts` — Drizzle Kit config (requires `DATABASE_URL`, automatically provided by Replit)
- Exports: `.` (pool, db, schema), `./schema` (schema only)

Production migrations are handled by Replit when publishing. In development, we just use `pnpm --filter @workspace/db run push`, and we fallback to `pnpm --filter @workspace/db run push-force`.

### `lib/api-spec` (`@workspace/api-spec`)

Owns the OpenAPI 3.1 spec (`openapi.yaml`) and the Orval config (`orval.config.ts`). Running codegen produces output into two sibling packages:

1. `lib/api-client-react/src/generated/` — React Query hooks + fetch client
2. `lib/api-zod/src/generated/` — Zod schemas

Run codegen: `pnpm --filter @workspace/api-spec run codegen`

### `lib/api-zod` (`@workspace/api-zod`)

Generated Zod schemas from the OpenAPI spec (e.g. `HealthCheckResponse`, `SubmitContactFormBody`, `SubscribeNewsletterBody`, `UnsubscribeNewsletterBody`). Used by `api-server` for request validation.

### `lib/api-client-react` (`@workspace/api-client-react`)

Generated React Query hooks and fetch client from the OpenAPI spec (e.g. `useHealthCheck`, `healthCheck`, `useSubscribeNewsletter`, `useUnsubscribeNewsletter`).

### `scripts` (`@workspace/scripts`)

Utility scripts package. Each script is a `.ts` file in `src/` with a corresponding npm script in `package.json`. Run scripts via `pnpm --filter @workspace/scripts run <script>`. Scripts can import any workspace package (e.g., `@workspace/db`) by adding it as a dependency in `scripts/package.json`.
