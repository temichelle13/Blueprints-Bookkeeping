# Chatbot, API, and Site Remediation Plan

Date: 2026-06-09

## Purpose

This plan records the problems found during a repository-level audit of the Aria chatbot, public API setup, deployment wiring, tests, formatting, SEO guardrails, and production-readiness risks. It is intentionally a plan rather than a partial code fix so the full repair can be sequenced safely without breaking existing website, API, database, email, payment, onboarding, and deployment behavior.

## Non-negotiable guardrails

- Preserve the business constraints in `SITE_CONSTRAINTS.md`: do not add, imply, or promote tax services; keep the two core services as Advanced Bookkeeping and Business Plans; keep The Digital Handshake as an add-on only; keep Calendly URLs unchanged.
- Treat `lib/api-spec/openapi.yaml` as the API contract source of truth. Any endpoint shape changes must start there, followed by code generation and synchronized frontend/API updates.
- Do not edit generated clients directly under `lib/api-client-react/src/generated` or `lib/api-zod/src/generated`.
- Keep sensitive routes noindexed in page-level SEO, the `App.tsx` fallback prefixes, robots/sitemap generation, and indexing guard checks.
- Avoid placeholder marketing claims. The trust/press placeholder block must be removed or replaced only with verified claims/assets.
- Preserve current user data. Database changes need additive migrations, backfills where needed, and rollback notes before production deployment.

## Current verification results

| Check                                                                                                                                       | Result | Finding                                                                                                                                |
| ------------------------------------------------------------------------------------------------------------------------------------------- | ------ | -------------------------------------------------------------------------------------------------------------------------------------- |
| `pnpm run check:merge-conflicts`                                                                                                            | Pass   | No merge conflict markers found.                                                                                                       |
| `pnpm run typecheck`                                                                                                                        | Pass   | Workspace TypeScript projects passed, but Cloudflare Pages Functions are not covered by the workspace TypeScript config.               |
| `pnpm --filter @workspace/website run test`                                                                                                 | Pass   | 3 website tests passed.                                                                                                                |
| `pnpm run build`                                                                                                                            | Pass   | Codegen, typecheck, API bundle, sitemap generation, and website production build completed.                                            |
| `pnpm run check:website-deploy`                                                                                                             | Pass   | Merge-conflict, typecheck, indexing-guard, sitemap, and website build gate completed.                                                  |
| `pnpm run lint`                                                                                                                             | Fail   | Prettier reports 57 existing formatting violations across app, generated, config, docs, and lock files.                                |
| `pnpm --filter @workspace/api-server run test`                                                                                              | Fail   | 2 test files fail before assertions because importing API modules imports `@workspace/db`, which throws when `DATABASE_URL` is absent. |
| `pnpm run check:route-references`                                                                                                           | Fail   | The route-reference script treats support modules as route modules and flags `onboarding-workflow.ts` and `openai/guards.ts`.          |
| `pnpm exec tsc --noEmit --ignoreConfig --target ES2022 --module ESNext --moduleResolution Bundler --skipLibCheck functions/api/[[path]].ts` | Fail   | The Cloudflare Pages Function has an uncovered TypeScript error: `getExpectedTurnstileHostname` is referenced but not defined.         |

## Problems found

### P0 — Chat/API deployment has two competing implementations

There are two chatbot/API paths:

1. The React widget calls same-origin `/api` by default, or a build-time `VITE_API_URL` plus `/api` for cross-origin deployments.
2. The standalone Express server mounts all routes under `/api`.
3. Cloudflare Pages routes every `/api/*` request to a catch-all Pages Function.

That means production behavior depends on deployment routing, not just application code. If Cloudflare Pages owns `/api/*`, the catch-all worker handles health, contact, newsletter, feedback, and chat, while admin/contracts/payments/onboarding/document endpoints return 404 unless separately proxied to the Express API. If the website is configured with `VITE_API_URL`, the widget and generated clients can bypass the Pages Function and hit Express directly.

Impact:

- Chat may appear offline when `/api/healthz` is served by a degraded or misconfigured Pages Function.
- Some API features can work in one environment and 404 in another.
- Documentation refers to specific `functions/api/chat.ts` and `functions/api/contact.ts` handlers, but the repo currently contains only a catch-all `functions/api/[[path]].ts` handler.

Fix direction:

- Choose one production API authority for each route group and document it precisely.
- Prefer one of these models:
  - **Model A: Express is canonical API.** Set `VITE_API_URL` to the deployed Express origin, exclude or remove Cloudflare `/api/*` catch-all except intentionally edge-only endpoints, and keep OpenAPI/generated clients aligned to Express.
  - **Model B: Cloudflare Pages Function is canonical for public lightweight routes only.** Narrow `_routes.json` to only the supported public paths and explicitly proxy/redirect all other `/api/*` paths to Express.
- Update `DEPLOYMENT.md`, `.env.example`, Cloudflare Pages settings, and smoke tests together so routing cannot silently drift again.

### P0 — Cloudflare Pages Function has an uncovered runtime-breaking TypeScript error

The catch-all Pages Function defines `getExpectedTurnstileHostnames` and `isExpectedTurnstileHostname`, but `verifyTurnstileOrThrow` calls `getExpectedTurnstileHostname`, which does not exist. Workspace typecheck does not catch this because `functions/` is not included by the root, website, API, or scripts TypeScript projects.

Impact:

- Any contact/newsletter/feedback request that reaches Turnstile hostname verification in the Pages Function can fail at runtime.
- Current CI can pass `pnpm run typecheck` while shipping a broken Pages Function.

Fix direction:

- Correct the function call to use the existing hostname-set helper or implement the missing single-host helper.
- Add a dedicated typecheck/test target for `functions/api/**/*.ts`.
- Add that target to `pnpm run typecheck`, `pnpm run build`, and `pnpm run check:website-deploy`.
- Add focused unit tests for Turnstile success, hostname mismatch, invalid token, missing secret, CORS preflight, and unsupported route behavior.

### P0 — API tests fail without a real `DATABASE_URL`

The API test suite has two failures because tests import modules that transitively import `@workspace/db`; `lib/db/src/index.ts` throws immediately when `DATABASE_URL` is missing. This blocks repeatable local and CI testing unless a real database is provisioned for every test run.

Impact:

- API test failures hide real regressions.
- Simple utility tests are coupled to production database configuration.
- Contributors cannot safely verify fixes without setting up external infrastructure.

Fix direction:

- Split pure helpers from route modules that import the database. For example, move `escapeHtml`, consent allowlists, and email normalization helpers into no-DB utility files.
- Update tests to import no-DB helpers where possible.
- For route/integration tests, inject a database adapter or use a test database URL explicitly.
- Add a documented test profile such as `.env.test.example` and CI service database if integration tests should hit Postgres.

### P0 — Public OpenAI conversation management endpoints are exposed

The OpenAPI contract and Express route expose list, get, delete, and list-messages endpoints for OpenAI conversations. The chat widget only needs create-conversation and send-message. There is no admin-auth middleware on the OpenAI router, so conversation history endpoints appear public if the API is reachable.

Impact:

- Visitors could enumerate or delete chatbot conversations if the routes are publicly exposed.
- Conversation content can include names, emails, phone numbers, and business details.
- This is a privacy and trust risk for a bookkeeping/financial-services site.

Fix direction:

- Keep public unauthenticated access only for create-conversation and send-message, with rate limits and abuse controls.
- Put list/get/delete/list-messages behind `x-admin-token` or remove them from public API entirely.
- Update `lib/api-spec/openapi.yaml` first, regenerate clients/schemas, then update API tests.
- Add regression tests proving unauthenticated users cannot list, read, or delete conversation records.

### P0 — Chat lead-notification email renders unsanitized visitor/assistant content

`checkAndNotifyTea` interpolates `userMessage` and assistant preview directly into HTML. The Pages Function has an `escapeHtml` helper for email rendering, but the Express OpenAI route does not use equivalent escaping in the chat-lead email.

Impact:

- Visitor-provided HTML could be injected into the owner notification email.
- Even though this email is internal, it is still an avoidable HTML-injection risk.

Fix direction:

- Centralize a safe email-template helper that escapes all visitor-controlled and assistant-generated content.
- Add tests for chat-lead email escaping with `<script>`, quotes, ampersands, and apostrophes.
- Consider plain-text alternatives for internal notifications.

### P1 — API startup requires integrations that business constraints mark as optional or still being evaluated

`validateEnv` requires `DATABASE_URL`, `ADMIN_TOKEN`, `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, and `OPENAI_API_KEY` at startup. The constraints mark Stripe as “MAYBE” and contract automation as TBD, while `.env.example` describes several integrations as optional or situational. This can prevent the API from starting even when the failing integration is not needed for the route being tested or deployed.

Impact:

- The API can be perceived as “not fully setup” because unrelated missing secrets block all routes.
- Health checks, contact intake, newsletter, or admin visibility may fail due to Stripe/OpenAI configuration.

Fix direction:

- Separate hard-required core API variables from feature-specific variables.
- Make optional integrations degrade per feature with clear health flags, not process-wide crashes.
- Keep truly required production variables strict: database, admin token, CORS origin, and any route group intentionally enabled.
- Add `/healthz` detail for database, email, OpenAI, Stripe, Adobe Sign, and scheduler status.

### P1 — Chat availability checks can mark the assistant offline for degraded health

The chat widget checks `/api/healthz` and requires an HTTP 200 before sending. Both Express and Pages Function health endpoints can return 503 when the database is missing/degraded. That means the assistant UI disables itself even if the model fallback or contact/email fallback could still guide the visitor.

Impact:

- The chatbot can “glitch” by disabling the input because a dependency unrelated to model generation is degraded.
- Visitors get a generic offline notice instead of a route-specific explanation.

Fix direction:

- Return structured health details and make the widget check the specific capabilities needed for chat: route reachable, conversation persistence, assistant provider, and fallback mode.
- If the assistant provider is missing but persistence works, send the user a clear fallback response through the same chat UI.
- If persistence is missing, offer a direct contact/schedule fallback and an issue-report path.
- Add browser-level tests for 200, 503 degraded, 404, 405, timeout, and 429 behavior.

### P1 — The generated API client pattern is not consistently used by the chat widget

Most public forms are supposed to use generated React Query hooks from `@workspace/api-client-react`, but the chat widget uses ad hoc `fetch` calls for conversation creation, message streaming, and assistant feedback. Streaming may require custom handling, but create-conversation and feedback can still be wrapped consistently.

Impact:

- Base URL normalization, error handling, and contract drift are easier to miss.
- Chat behavior can diverge from OpenAPI changes.

Fix direction:

- Keep custom streaming only where necessary.
- Use generated schemas/types for request and response payloads.
- Add a small chat API wrapper that centralizes base URL, timeout, JSON error parsing, and SSE parsing.

### P1 — Route-reference guard is too broad

`pnpm run check:route-references` fails because the script scans all non-test `.ts` files under `artifacts/api-server/src/routes` and expects each one to be imported directly by `routes/index.ts`. It does not distinguish route modules from support modules such as `onboarding-workflow.ts` or `openai/guards.ts`.

Impact:

- A useful guard currently fails and cannot be relied on in CI.
- Developers may be pushed to import support files incorrectly just to satisfy the check.

Fix direction:

- Update the guard to only require top-level route entry modules or allow an explicit support-module allowlist/pattern.
- Add tests/fixtures for nested route folders and support files.
- Add the route-reference check to the standard deployment gate after it is reliable.

### P1 — Formatting/lint is currently not actionable

`pnpm run lint` fails on 57 files, including generated outputs and lock/config files. A repo-wide Prettier write would create a large unrelated diff, while ignoring the issue means no formatting gate is enforcing consistency.

Impact:

- Formatting failures obscure real changes.
- Future PRs may be forced to mix functional fixes with broad formatting churn.

Fix direction:

- Decide whether generated files and lockfiles should be formatted by Prettier or ignored.
- Run a dedicated formatting-only PR after the functional remediation plan is approved, or narrow Prettier scope to source/docs/config files that should be checked.
- Keep generated files managed by codegen and avoid hand edits.

### P1 — Deployment documentation is stale/inconsistent

`DEPLOYMENT.md` states `wrangler.toml` exists and describes `functions/api/chat.ts` plus `functions/api/contact.ts`, but the repo currently has no `wrangler.toml` and only has `functions/api/[[path]].ts`. It also shows `pnpm --filter db push`, while the workspace package is `@workspace/db`.

Impact:

- Production setup instructions can send deployments to the wrong API route model.
- Operators can miss required bindings such as Cloudflare D1/AI or use invalid package filters.

Fix direction:

- Update deployment docs after deciding the canonical API routing model.
- Document exact Cloudflare Pages bindings, Express host variables, build-time variables, and smoke-test commands.
- Add a deployment checklist that maps each public route to either Cloudflare Pages Function or Express.

### P1 — Trust/press placeholder content is present in source

The `FeaturedInPlaceholder` component contains unverified publication names and a visible placeholder note. The user explicitly requested no placeholder content unless authorized, and financial services trust claims should be verified before display.

Impact:

- If rendered, it could imply press/trust claims that are not substantiated.
- Placeholder copy reduces credibility and can create advertising/compliance risk.

Fix direction:

- Remove this component from rendered pages if it is unused, or replace it with verified, non-placeholder trust signals.
- Add a content QA checklist for credentials, testimonials, press mentions, reviews, guarantees, and service claims.

### P2 — Sitemap generation changes every page `lastmod` to the build date

Running the production build regenerates `artifacts/website/public/sitemap.xml` and updates all `lastmod` values to the current date. This can be acceptable if deliberate, but it can also misrepresent content freshness and create noisy diffs.

Impact:

- Search engines may be told every page changed on every build.
- Builds create working-tree changes even when source content did not change.

Fix direction:

- Determine whether `lastmod` should represent build date or page-content date.
- Prefer deterministic `lastmod` values derived from route/content metadata or Git commit timestamps.
- Make `sitemap:check` fail if the committed sitemap is stale, but avoid non-deterministic changes during unrelated builds.

## Complete remediation sequence

### Phase 1 — Stabilize tests and deployment routing before changing behavior

1. Decide and document the canonical production API routing model.
2. Fix the Pages Function TypeScript error and add a `functions` typecheck target.
3. Make API helper tests independent of `DATABASE_URL` or provide a dedicated test database setup.
4. Fix the route-reference guard so support modules are not treated as missing route registrations.
5. Split Prettier cleanup into a formatting-only change or narrow lint scope.
6. Re-run and require: merge-conflict check, lint, workspace typecheck, functions typecheck, website tests, API tests, route-reference check, build, and website-deploy check.

### Phase 2 — Secure and harden chatbot/API behavior

1. Lock down public OpenAI conversation read/delete/list endpoints.
2. Escape chat lead-notification email content.
3. Add route-level chatbot tests for:
   - create conversation success/failure;
   - send message success/fallback;
   - OpenAI missing;
   - OpenAI streaming errors;
   - invalid conversation IDs;
   - rate limits;
   - message cap;
   - unauthorized conversation management attempts.
4. Add browser/component tests for chat UI health states, streaming, retry, rate-limit messaging, and offline fallback.
5. Normalize OpenAI model defaults across `.env.example`, `DEPLOYMENT.md`, and runtime config.

### Phase 3 — Make integrations feature-gated and observable

1. Refactor environment validation into core-required and feature-required schemas.
2. Add structured `/healthz` checks for database, OpenAI, email, Stripe, Adobe Sign, Turnstile, and schedulers.
3. Add startup logs that identify disabled optional features without leaking secrets.
4. Add smoke scripts for contact, newsletter, chat, feedback, admin, payments webhook signature rejection, and onboarding flows.
5. Verify real production/staging secrets and third-party dashboards: OpenAI key/model access, Resend sender/domain, Turnstile site/secret, Stripe products/webhook, Adobe Sign credentials, database migrations, CORS origins, and proxy trust.

### Phase 4 — Site bug, SEO, mobile, accessibility, and compliance pass

1. Remove or replace placeholder trust/press claims with verified claims only.
2. Audit all pages for the no-tax-services rule and remove any ambiguous phrasing.
3. Run route crawl/smoke checks for all public routes and sensitive noindex routes.
4. Test responsive layouts on mobile and desktop widths, including the chat widget, forms, pricing, onboarding, schedule, and admin views.
5. Run accessibility checks for keyboard navigation, visible focus, labels, color contrast, reduced motion, dialog semantics, and chat widget screen-reader status updates.
6. Improve SEO metadata where needed: unique titles/descriptions, canonical URLs, structured data, sitemap determinism, robots consistency, internal links, and local/Oregon bookkeeping topical coverage.
7. Confirm legal/compliance surfaces: privacy, terms, cookie policy, consent metadata, email unsubscribe, SMS/phone consent language, data retention, security claims, testimonial/press substantiation, and bookkeeping-vs-tax disclaimers.

### Phase 5 — Production rollout without data loss

1. Create a staging deployment that mirrors production routing.
2. Run database backup and migration dry-run before any schema changes.
3. Deploy backend/API changes first if contracts change, then frontend.
4. Run post-deploy smoke tests against staging and production:
   - homepage and core marketing routes;
   - `/api/healthz`;
   - contact;
   - newsletter subscribe/unsubscribe;
   - chat create/send/fallback;
   - feedback;
   - admin stats with `x-admin-token`;
   - onboarding and payment success paths;
   - webhook signature rejection/acceptance where safe.
5. Monitor logs for 24-48 hours: 4xx/5xx rates, chat errors, Turnstile failures, CORS failures, Resend bounces/suppressions, Stripe webhook errors, scheduler errors, and database connection pool usage.

## Recommended acceptance criteria

The remediation is complete only when all of these are true:

- `pnpm run lint` passes or is intentionally scoped with documented exclusions.
- `pnpm run check:merge-conflicts` passes.
- `pnpm run typecheck` includes Cloudflare Pages Functions and passes.
- `pnpm --filter @workspace/website run test` passes.
- `pnpm --filter @workspace/api-server run test` passes without requiring undocumented production secrets.
- `pnpm run check:route-references` passes reliably.
- `pnpm run build` passes with no unexpected working-tree drift.
- `pnpm run check:website-deploy` passes.
- Public conversation-history APIs are protected or removed.
- Chat works in the selected production routing model, with graceful fallback when OpenAI or persistence is unavailable.
- Contact, newsletter, onboarding, feedback, admin, payment, and webhook flows are verified in staging.
- No unauthorized placeholder content, tax-service implication, unsupported guarantee, or unsubstantiated trust claim remains visible.
