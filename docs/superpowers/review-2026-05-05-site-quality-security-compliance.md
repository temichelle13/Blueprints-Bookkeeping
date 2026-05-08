# Blueprints & Bookkeeping Comprehensive Repository Review (2026-05-05)

## Scope and method

This review covered:
- Repository structure and architecture alignment across website, API server, shared libraries, and scripts.
- Security controls, rate limiting, auth surfaces, and operational hardening.
- Legal/compliance content coverage for a bookkeeping business.
- Accessibility and UX quality opportunities for client-facing flows.
- Production-readiness gaps, including unresolved environment and deployment concerns.

## What appears complete and strong

- Clear monorepo boundaries between frontend (`artifacts/website`), API (`artifacts/api-server`), contracts (`lib/api-spec`), and DB (`lib/db`).
- Strong anti-abuse controls for public submissions and OpenAI routes (rate limiting and guard code paths).
- Required legal pages exist (Privacy, Terms, Cookie Policy, Accessibility) with policy-level coverage already in place.
- Noindex/indexing guard strategy appears intentionally engineered with dedicated verification script and deploy gate.
- Type safety baseline is strong (workspace-wide TypeScript typecheck succeeds).

## Not-finished / needs completion

### 1) API tests are not fully runnable in default dev/test environment
- `@workspace/api-server` tests fail without `DATABASE_URL` because DB module import enforces it eagerly.
- This blocks full CI-like confidence for non-DB unit tests that should be isolated.

**Recommended implementation**
- Refactor DB initialization to lazy-connect where possible (or dependency-inject DB in route/service layers).
- Add test bootstrap (`.env.test` + test DB URL or in-memory adapter strategy).
- Split tests into `unit` (no DB) and `integration` (DB required) commands.

### 2) Legacy/stale migration artifacts remain documented as unapplied
- `DEPLOYMENT.md` explicitly notes two stale `0004` migration files not in journal.

**Recommended implementation**
- Resolve migration drift now: archive/remove stale files or reconcile with current journal via a formal migration cleanup task.
- Add a CI guard that fails if migration folder and journal are inconsistent.

### 3) Adobe Sign region caveat is unresolved
- `.env.example` documents OAuth refresh host hard-coded to `na1` in API code, even when base URL changes.

**Recommended implementation**
- Parameterize OAuth token host based on env region.
- Add integration tests for at least `na1` + one alternate region configuration.

### 4) Legacy Cloudflare Functions path can cause maintenance ambiguity
- `functions/api/*` still exists as legacy placeholders while Express is primary for most routes.

**Recommended implementation**
- Add explicit architecture decision record in `docs/` defining authoritative runtime per endpoint group.
- Add route ownership comments in both layers to avoid accidental dual implementation drift.

## Security hardening opportunities (high impact)

1. **Admin auth upgrade path (without breaking current contract)**
   - Keep `x-admin-token` contract (required by constraints), but add:
   - token rotation runbook,
   - constant-time comparison verification everywhere,
   - per-token metadata (created/rotated/last-used),
   - IP-based allowlist option for admin endpoints.

2. **Security headers verification automation**
   - Add automated check for CSP/HSTS/X-Frame-Options/Referrer-Policy/Permissions-Policy on deployed site.
   - Fail `check:website-deploy` when required headers are missing.

3. **Dependency and secret scanning in CI**
   - Add `pnpm audit` (or SCA equivalent) plus secret scanning gates.
   - Add lockfile policy checks to reduce supply-chain risk.

4. **Webhook verification posture**
   - Ensure all inbound webhooks (Resend/Stripe/booking) enforce signature verification and replay-window checks.
   - Add observability for signature failures and suspicious replay attempts.

## Compliance and legal improvements (bookkeeping-specific)

1. **State/federal disclosure precision**
   - Keep explicit no-tax-service language (already constrained) and add a short, persistent disclosure component on service conversion pages clarifying bookkeeping vs tax practitioner scope.

2. **Record retention schedule transparency**
   - Add customer-facing retention summary aligned with backend retention jobs (inquiry retention/background scheduler behavior).

3. **Consent evidence and auditability**
   - Consent version/source capture is present in patterns; add admin-viewable consent audit timeline export for dispute handling.

4. **Accessibility governance**
   - Add recurring automated accessibility scans (axe/pa11y) in CI and monthly manual keyboard + screen-reader checks.

## UX / feature opportunities to improve client experience

1. **Client readiness wizard before intake submission**
   - Progressive checklist for document readiness, software status, urgency, and business stage; then route to correct intake path.

2. **Transparent service fit estimator**
   - Lightweight interactive “Is this a fit?” module with eligibility and expected next step response times.

3. **Onboarding status tracker**
   - Post-submission status milestones (received → under review → next step scheduled) to reduce uncertainty.

4. **Trust and proof upgrades**
   - Structured case study cards with measurable outcomes, industry tags, and confidence disclaimers.

5. **Accessibility UX upgrades**
   - Add global “skip to main content,” robust visible focus states audit, and reduced-motion variant verification for all animations.

## SEO and information architecture enhancements

1. **Schema markup expansion**
   - Ensure LocalBusiness/ProfessionalService/FAQ/Breadcrumb structured data coverage is consistent on key pages.

2. **Topical authority clusters**
   - Expand bookkeeping niche landing pages around crypto, ag/timber, SaaS, contractors with internal linking to services + contact.

3. **Conversion-aligned technical SEO checks**
   - Extend deploy checks to include canonical tag validation, hreflang policy (if applicable), and orphan-page detection.

4. **Content freshness process**
   - Quarterly review process for pricing language, credentials, and service statements to prevent stale claims.

## Unresolved production environment issues not clearly under active remediation

- API test dependency on `DATABASE_URL` preventing full default test execution confidence.
- Migration drift notes in deployment docs indicating unresolved historical artifacts.
- Adobe Sign OAuth region limitation documented but not eliminated.

## Recommended implementation roadmap

### Phase 1 (1–2 weeks): risk reduction
- Make API tests deterministic in CI with explicit test env + DB strategy.
- Resolve migration drift and add guard checks.
- Add security header and dependency scanning gates.

### Phase 2 (2–4 weeks): compliance and reliability
- Implement consent audit export and retention transparency page section.
- Add webhook replay/signature observability dashboard metrics.
- Complete accessibility automated checks in CI.

### Phase 3 (4–8 weeks): client experience + growth
- Build readiness wizard and onboarding status tracker.
- Add structured case studies and fit estimator.
- Expand schema + niche SEO clusters with measurable KPIs.

## Validation commands run for this review

- `pnpm run check:merge-conflicts` ✅
- `pnpm run typecheck` ✅
- `pnpm --filter @workspace/api-server run test` ⚠️ (fails without `DATABASE_URL`)
- `pnpm --filter @workspace/website run test` ✅
