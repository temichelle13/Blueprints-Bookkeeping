# Claude Code guidance

Use the repository-wide instructions in `AGENTS.md`. Before editing, also read:

- `SITE_CONSTRAINTS.md` for business, legal, navigation, and content guardrails.
- `.env.example` for runtime configuration names and ownership.
- `DEPLOYMENT.md` for the current Cloudflare Pages Function and standalone Express deployment paths.

Important repository boundaries:

- `lib/api-spec/openapi.yaml` is the API contract source. Run `pnpm run codegen` after contract changes; never hand-edit generated clients or schemas.
- The website uses the Cloudflare Function in `functions/api/[[path]].ts` for same-origin `/api/*` requests when `VITE_API_URL` is empty.
- The fuller Express API starts at `artifacts/api-server/src/index.ts`. It still uses legacy Drizzle/PostgreSQL persistence while MongoDB migration work remains unfinished.
- Preserve the three-part noindex protection described in `AGENTS.md` for sensitive routes.
- Preserve the existing `x-admin-token` contract unless an auth redesign is explicitly requested.

Use the verified commands documented in `AGENTS.md`, including the full validation suite before deployment-affecting changes.
