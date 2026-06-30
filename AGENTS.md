# AGENTS.md

## Scope

- This repo is a PNPM workspace with two deployable apps in `artifacts/` and shared packages in `lib/`.
- Required read-before-edit: `SITE_CONSTRAINTS.md` for business/content guardrails, `.env.example` for runtime config,
  and `DEPLOYMENT.md` for how frontend/API are actually shipped.
- Required glob search for existing AI instructions returned no repo-owned matches, so this file is the root agent
  guidance.

## Package map

- `artifacts/website`: React 19 + Vite SPA, routed with `wouter`, styled via Tailwind v4 utilities in `src/index.css`.
- `artifacts/api-server`: Express 5 API, bundled by `build.ts` into `dist/index.cjs` for deployment.
- `lib/api-spec/openapi.yaml`: source of truth for API contracts; Orval generates clients/schemas into
  `lib/api-client-react/src/generated` and `lib/api-zod/src/generated`.
- `lib/db`: legacy Drizzle/Postgres schema and DB connection currently used by the API server; MongoDB is the owner-selected production direction and new data work should plan for that migration.
- `lib/integrations-openai-ai-*`: shared OpenAI integration wrappers.
- `scripts/src/check-indexing-guards.ts`: deployment guard that validates `robots.txt` + `sitemap.xml` consistency.
- `functions/api/*`: legacy placeholder files, not the main runtime path.

## Big-picture flow

- Browser code sets API base in `artifacts/website/src/App.tsx`; same-origin defaults to `/api`, cross-origin comes from
  build-time `VITE_API_URL`.
- Most frontend mutations should use the generated React Query hooks from `@workspace/api-client-react` (
  `useSubmitContactForm`, `useSubscribeNewsletter`, etc.), not ad hoc fetches.
- If an endpoint shape changes: update `lib/api-spec/openapi.yaml` first, run `pnpm run codegen`, then adapt both the
  Express route and frontend call sites.
- Current contact/newsletter/onboarding/chat persistence is wired through legacy Drizzle/Postgres tables in `lib/db/src/schema/*`; this is not the desired final database architecture. MongoDB should be treated as the target data store for cleanup and future persistence work.
- API startup also launches background schedulers in `artifacts/api-server/src/index.ts` (contracts, nexus checks,
  inquiry retention, outbound email retries), so changes there affect more than request handling.

## Repo-specific conventions

- Do not change business positioning, navigation order, Calendly URLs, `/admin` token auth, or service claims without
  checking `SITE_CONSTRAINTS.md`.
- Keep professional-scope boundaries accurate: do not imply CPA/accountant/auditor/attorney/investment-adviser credentials, personal income tax preparation, state tax preparation, or unlimited tax representation. Handle these as concise disclaimers where relevant, not as a dominant marketing theme.
- Sensitive website routes must stay noindexed in three places: page-level `<SEO noindex />`, `App.tsx` fallback
  prefixes, and `scripts/src/check-indexing-guards.ts` / `public/robots.txt` / sitemap generation.
- Generated folders under `lib/api-client-react/src/generated` and `lib/api-zod/src/generated` are outputs; edit the
  OpenAPI spec or custom wrapper files instead.
- Website pages commonly use shared visual primitives like `glass-card`, `accent-bar`, `font-display`, and `font-mono`;
  see `artifacts/website/src/index.css` and pages like `src/pages/Home.tsx`.
- Public forms follow the same pattern: client-side Zod + React Hook Form, honeypot field `website`, consent
  version/source metadata, and server-side abuse protection from
  `artifacts/api-server/src/middleware/public-submissions.ts`.
- Admin endpoints are protected only by the `x-admin-token` header via
  `artifacts/api-server/src/middleware/admin-auth.ts`; preserve that contract unless explicitly asked to redesign auth.

## Verified workflows

- Install: `pnpm install --frozen-lockfile`
- Regenerate API clients/schemas after contract edits: `pnpm run codegen`
- Check for merge conflict markers: `pnpm run check:merge-conflicts`
- Typecheck everything: `pnpm run typecheck`
- Build everything: `pnpm run build`
- Website deployment gate: `pnpm run check:website-deploy`
- Frontend dev/build/test: `pnpm --filter @workspace/website run dev|build|test`
- API build/test: `pnpm --filter @workspace/api-server run build|test`
- Legacy Postgres schema push: `pnpm --filter @workspace/db run push` (only for maintaining current Drizzle code until MongoDB migration)

## Change guidance

- Prefer small edits in the app/shared package that owns the concern; this repo already separates UI, API contracts, DB
  schema, and integrations cleanly.
- For website copy/content work, cite concrete files you touched (`src/pages/*`, `src/components/layout/*`) and re-check
  `SITE_CONSTRAINTS.md` before finishing.
- For deployment-affecting website changes, run `pnpm run check:website-deploy`; for API contract changes, always run
  codegen plus the affected package tests.
