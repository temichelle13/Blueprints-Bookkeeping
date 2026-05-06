import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";

function getDocumentedOpenaiRoutesFromSpec(): Set<string> {
  const specPath = path.resolve(
    process.cwd(),
    "../../lib/api-spec/openapi.yaml",
  );
  const spec = fs.readFileSync(specPath, "utf8");
  const lines = spec.split("\n");

  const documented = new Set<string>();
  let currentPath: string | null = null;

  for (const line of lines) {
    const pathMatch = line.match(/^  (\/openai\/[^:]+):$/);
    if (pathMatch) {
      currentPath = pathMatch[1] ?? null;
      continue;
    }

    const leavesPathBlock = /^  \//.test(line) || /^components:/.test(line);
    if (leavesPathBlock && !pathMatch) {
      currentPath = null;
    }

    if (!currentPath) continue;

    const methodMatch = line.match(/^    (get|post|put|patch|delete):$/);
    if (!methodMatch) continue;

    const method = methodMatch[1]?.toUpperCase();
    if (!method) continue;

    documented.add(`${method} ${currentPath}`);
  }

  return documented;
}

function normalizeExpressPath(routePath: string): string {
  return routePath.replace(/:([A-Za-z0-9_]+)/g, "{$1}");
}

function getWiredOpenaiRoutes(): Set<string> {
  const wired = new Set<string>();
  const routerPath = path.resolve(process.cwd(), "src/routes/openai/index.ts");
  const source = fs.readFileSync(routerPath, "utf8");

  const routeRegex =
    /router\.(get|post|put|patch|delete)\(\s*["'`](\/openai\/[^"'`]+)["'`]/g;

  for (const match of source.matchAll(routeRegex)) {
    const method = match[1]?.toUpperCase();
    const routePath = match[2];
    if (!method || !routePath) continue;
    wired.add(`${method} ${normalizeExpressPath(routePath)}`);
  }

  return wired;
}

test("all documented OpenAI endpoints are wired in the OpenAI router", () => {
  const documented = getDocumentedOpenaiRoutesFromSpec();
  const wired = getWiredOpenaiRoutes();

  const missing = [...documented].filter((endpoint) => !wired.has(endpoint));

  assert.deepEqual(
    missing,
    [],
    `Documented OpenAI endpoints missing from router: ${missing.join(", ")}`,
  );
});
