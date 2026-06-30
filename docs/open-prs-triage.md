# Open PR Triage — April 2026

> Generated during triage session on 2026-04-26.  
> Root-cause fix (api-server typecheck pre-builds lib deps) was applied to master via this PR (`copilot/fix-failing-prs`).

---

## Root Cause: All `codex/*` PRs fail CI with TS6305

The `@workspace/api-server` `typecheck` script ran `tsc -p tsconfig.json --noEmit`, which does **not** build TypeScript project references first. Because `lib/db`, `lib/api-zod`, and `lib/integrations-openai-ai-server` have no compiled `dist/` outputs in CI, every import from those packages triggers:

```
error TS6305: Output file '…/lib/db/dist/index.d.ts' has not been built
```

This causes cascading `TS7006` (implicit `any`) errors for every Drizzle query callback whose return type could not be resolved.

**Fix applied** (commit in this PR):

```diff
- "typecheck": "tsc -p tsconfig.json --noEmit",
+ "typecheck": "tsc -b ../../lib/db ../../lib/api-zod ../../lib/integrations-openai-ai-server && tsc -p tsconfig.json --noEmit",
```

**After merging this fix to master**, each PR in Group A below just needs to be rebased to pass CI.

---

## Group A — Can be fixed by rebasing against master ✅

These PRs have no code-level type errors of their own; all CI failures are the TS6305 cascade described above.

### PR #154 — Consolidate API runtime and add CI guard for unreferenced route modules

- **Branch**: `codex/audit-and-update-api-route-modules`
- **What it does**: Audits all `artifacts/api-server/src/routes/` files; adds a `scripts/src/check-route-references.ts` CI guard that fails if a route module is not imported in `routes/index.ts`; updates `DEPLOYMENT.md` / `README.md`; fixes `functions/api/contact.ts` and `functions/api/chat.ts` placeholder exports.
- **CI failure**: Only TS6305 cascade (no PR-specific type errors).
- **Action**: Rebase onto master after the typecheck fix merges. Should pass CI.

### PR #155 — Align privacy and cookie disclosures with analytics consent

- **Branch**: `codex/update-privacy-policy-and-disclosures`
- **What it does**: Updates `CookiePolicy.tsx`, `Privacy.tsx`, and `CookieConsent.tsx` so the cookie consent banner and privacy page accurately describe consent-gated analytics (currently described as if always active).
- **CI failure**: Only TS6305 cascade (no PR-specific type errors; PR only touches website `.tsx` files).
- **Action**: Rebase onto master after the typecheck fix merges. Should pass CI.

### PR #157 — Fix onboarding Stripe verification ordering and idempotency

- **Branch**: `codex/refactor-onboarding-route-for-stripe-verification`
- **What it does**: Refactors `src/routes/onboarding.ts` to verify the Stripe checkout session **before** inserting a DB record (prevents orphaned rows on failed payments); normalises email to lowercase; adds an idempotency check so duplicate webhook deliveries are handled gracefully. Adds `onboarding.test.ts` and `onboarding-workflow.ts`.
- **CI failure**: Only TS6305 cascade.
- **Action**: Rebase onto master after the typecheck fix merges. Should pass CI.

### PR #158 — Align OpenAI router with documented contract

- **Branch**: `codex/synchronize-openai-api-endpoints-and-tests`
- **What it does**: Adds `GET /openai/conversations` (list all), `DELETE /openai/conversations/:id`, and `GET /openai/conversations/:id/messages` endpoints to match the OpenAPI spec. Regenerates `lib/api-zod` and `lib/api-client-react` generated types. Adds `openai.contract.test.ts`.
- **CI failure**: Only TS6305 cascade (the `(conversation) =>`, `(message) =>`, `(m) =>` implicit-any errors are all downstream of missing `lib/db` types).
- **Action**: Rebase onto master after the typecheck fix merges. Should pass CI.

---

## Group B — Needs typecheck rebase + one additional code fix ⚠️

### PR #156 — Add OpenAI chat guardrails with route limiters and 429 payloads

- **Branch**: `codex/add-rate-limiting-and-logging-features`
- **What it does**: Adds `openai/guards.ts` with rate-limit factories (`createOpenAiConversationLimiter`, `createOpenAiMessageLimiter`), message-length and conversation-cap validation helpers, and anomaly-volume logging. Wraps conversation-create and message-send routes with the new middleware. Updates `ChatWidget.tsx` to display a user-friendly "too many requests" message on HTTP 429.
- **CI failure**: TS6305 cascade + one genuine bug:

  ```
  src/routes/openai/index.ts(214,27): error TS2345:
    Argument of type 'string | string[] | undefined' is not assignable to parameter of type 'string'.
  ```

  When `router.post(path, middleware, handler)` is used instead of `router.post(path, handler)`, TypeScript cannot narrow `req.params` to `ParamsDictionary` for the last handler, so `req.params.id` gets the broader Express param type.

- **Fix required** (on the PR branch, line 214 of `src/routes/openai/index.ts`):

  ```typescript
  // Before:
  const id = parseInt(req.params.id, 10);

  // After:
  const id = parseInt(req.params["id"] as string, 10);
  ```

- **Action**: Rebase onto master (for typecheck fix), then apply the one-line fix above to pass CI.

---

## Group C — PR #160 is the fix itself ✅

### PR #160 — Regenerate lockfile, bump deps and adjust workspace scripts

- **Branch**: `codex/fix-typecheck-errors-in-api-server`
- **What it does**: Contains the exact same typecheck-script fix that this PR applies to master. The branch also attempted a lockfile refresh (many dep bumps), but the merge-conflict resolution commit (`88d5d54`) reverted the lockfile back to master's version, leaving only the `api-server/package.json` and root `package.json` changes.
- **Status**: Branch is clean (diff from master = only the 2 package.json files). GitHub shows `mergeable_state: dirty` but that may be stale — worth re-checking.
- **Action**: Since this task PR (#161) applies the same fix to master, PR #160 can be **closed as superseded** once #161 is merged. Or merge whichever arrives first.

---

## Group D — Close with TODO items 🚫

These PRs cannot be trivially fixed and should be closed. The work they represent is captured as TODO items below.

---

### PR #107 — Implement Cloudflare Pages Functions for /api routes

- **Branch**: `copilot/implement-cloudflare-pages-functions`
- **Base**: `c8ac877c` (very old — many commits behind current master)
- **What it does**: Adds full Cloudflare Pages Functions handlers (`functions/api/contact.ts`, `functions/api/newsletter.ts`, `functions/api/chat.ts`) so that `/api/*` routes work on the Cloudflare Pages deployment. 15 commits, 1664 additions, 14 changed files.
- **Why it cannot be fixed**: Based on a very old master; has accumulated 19 CI run attempts, all failures; has large merge conflicts with current master. The concept (Cloudflare Pages Functions for API proxying) is still valid but the implementation needs to be re-done from the current master.
- **TODO**: Reimplement Cloudflare Pages Functions from current master state. The key endpoints needed are `POST /api/contact`, `POST /api/newsletter/subscribe`, `GET /api/newsletter/unsubscribe`, and `POST /api/openai/conversations` + `/messages`. Use the existing Zod schemas from `lib/api-zod` for validation. Store the new implementation in `functions/api/`.

---

### PR #110 — Harden newsletter subscribe with idempotency, rate limiting, and typed honeypot

- **Branch**: `codex/update-openapi-to-allow-optional-honeypot-ghrjfh`
- **Base**: `c8ac877c` (very old — same old base as #107)
- **What it does**: Updates the OpenAPI spec to add optional `website` (honeypot) field and optional `idempotencyKey` to `POST /newsletter/subscribe`; adds rate limiter (10 req/15 min per IP) to the subscribe route; implements 24-hour in-memory idempotency cache; enhances Resend webhook handling to log newsletter email lifecycle events.
- **Why it cannot be fixed**: Old base with merge conflicts; many files have since diverged. The newsletter schema has been regenerated (lib/api-zod) multiple times since.
- **TODO**: Re-implement newsletter hardening on current master. Key changes:
  1. Add `website` (honeypot) and `idempotencyKey` fields to `/newsletter/subscribe` in `lib/api-spec/openapi.yaml`, then run `pnpm codegen`.
  2. Add `createSubmissionRateLimiter` to the newsletter route (`artifacts/api-server/src/routes/newsletter.ts`) following the pattern in `contact.ts`.
  3. Add idempotency handling (in-memory or DB-backed) for duplicate subscribe requests.
  4. Extend Resend webhook handler to log newsletter welcome email lifecycle.

---

### PR #144 — Update pnpm to v10.33.2 (Renovate)

- **Branch**: `renovate/pnpm-10.x`
- **What it does**: Renovate bot automated pnpm upgrade from the repo's previous pin to v10.33.2.
- **Why it cannot be fixed**: The repo is currently pinned to pnpm `10.33.4` (see `package.json` `engines` and `packageManager` fields). This PR was targeting an older version and is now superseded. Any pnpm upgrade requires updating `pnpm/action-setup` version in CI and verifying the lockfile.
- **TODO**: This PR is superseded by the pnpm `10.33.4` upgrade already on master. Close it. Future pnpm upgrades should be applied via Renovate to the current master, updating `package.json`, `.github/workflows/ci.yml`, and regenerating `pnpm-lock.yaml`.

---

### PR #149 — Fix light mode: text, ghost backgrounds, and borders unreadable

- **Branch**: `copilot/fix-unreadable-text-light-mode`
- **Base**: `a055e77` (one commit behind current master — missing PR #151 merge)
- **What it does**: Adds CSS overrides to `src/index.css` outside any `@layer` so `.light .text-white` maps to `hsl(var(--foreground))` instead of rendering invisible. Covers ~30 opacity variants for ghost backgrounds and borders. Updates `NewsletterSignup.tsx` input to use `text-foreground`.
- **Why it cannot be fixed**: Draft PR; based on slightly old master (conflicts with PR #151 merge). CI fails with pnpm version mismatch (`Got: 9.15.9, Expected: 10.33.4`) because the branch uses the old CI config. Has 9,319 additions (mostly generated CSS).
- **TODO**: Light mode styling should be revisited. The approach (adding per-class CSS overrides outside `@layer`) is valid but the PR is outdated. Specifically:
  1. Re-create the PR from current master.
  2. In `.github/workflows/ci.yml`, ensure `pnpm/action-setup@v3` reads pnpm version from `package.json` (`packageManager: pnpm@10.33.4`).
  3. Review whether a CSS variable redesign is preferable to per-class overrides.

---

### PR #150 — Fix pnpm setup: correct version references, add PATH instructions

- **Branch**: `copilot/setup-pnpm-path`
- **Base**: `a055e77` (one commit behind current master)
- **What it does**: Corrects README pnpm version reference; adds "Installing pnpm" section with Corepack instructions; bumps `pnpm/action-setup` to `@v4` in CI; adds `.npmrc` peer-dependency flags; prepends Corepack setup to `AGENTS.md`.
- **Why it cannot be fixed**: Draft PR based on `a055e77` (conflicts due to PR #151 merge). CI fails with the same TS6305 typecheck errors as all other branches.
- **TODO**: Most of the README and documentation improvements here are still valid. After the typecheck fix merges, re-create a PR from current master with:
  1. README `pnpm` version verification (current pin is `10.33.4`).
  2. "Installing pnpm via Corepack" section.
  3. Any useful `.npmrc` additions.

---

### PR #152 — (vscode settings / misc config)

- **Branch**: `copilot/vscode-mog0t8xl-ddyc`
- **Base**: `a055e77` (one commit behind current master)
- **What it does**: Small VS Code workspace settings changes (18 additions, 12 deletions across 2 files). No PR description.
- **Why it cannot be fixed**: Conflicts with current master; unclear purpose.
- **TODO**: If VS Code settings need to be updated, re-create a focused PR from current master.

---

### PR #153 — Add node_modules to .gitignore, delete duplicates

- **Branch**: `copilot/vscode-mofzmphl-2wnj`
- **Base**: `a055e77` (one commit behind current master)
- **What it does**: 2353 additions / 2352 deletions — almost certainly a lockfile regeneration plus minor `.gitignore` / duplicate-file cleanup.
- **Why it cannot be fixed**: Large merge conflict in `pnpm-lock.yaml`; based on old master.
- **TODO**: If `node_modules` is not already in `.gitignore`, add it in a standalone PR from current master. Lockfile changes should be regenerated fresh.

---

## Group E — Status unknown / investigate

### PR #159 — Format repo files so lint passes

- **Branch**: `codex/fix-prettier-configuration-errors`
- **What it does**: Mass-reformats many files (`.env.example`, workflow YAMLs, `AGENTS.md`, website source, etc.) so that `pnpm lint` (Prettier check) passes. Also touches `.agents/skills/` XSD schemas and VS Code config.
- **CI status**: Only "Website Deploy Guardrails" checks have run (both passed). The CI Build & Test workflow has not run on this branch.
- **Action**: Trigger a CI run to see if the typecheck also passes. If it does (after the fix merges), this can be merged. **Note**: The PR touches `.agents/` files — verify those changes don't break any skill configurations before merging.
