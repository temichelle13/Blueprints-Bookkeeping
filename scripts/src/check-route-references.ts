import fs from "node:fs";
import path from "node:path";

const repoRoot = path.resolve(import.meta.dirname, "../..");
const routesDir = path.join(
  repoRoot,
  "artifacts",
  "api-server",
  "src",
  "routes",
);
const routesIndexPath = path.join(routesDir, "index.ts");

function collectRouteFiles(dir: string): string[] {
  const entries = fs.readdirSync(dir, { withFileTypes: true });

  return entries.flatMap((entry) => {
    const fullPath = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      return collectRouteFiles(fullPath);
    }

    if (!entry.isFile() || !entry.name.endsWith(".ts")) {
      return [];
    }

    if (entry.name.endsWith(".test.ts") || entry.name.endsWith(".d.ts")) {
      return [];
    }

    if (fullPath === routesIndexPath) {
      return [];
    }

    return [fullPath];
  });
}

const routeFiles = collectRouteFiles(routesDir);
const routeFileSet = new Set([routesIndexPath, ...routeFiles]);

function resolveRouteImport(
  importerPath: string,
  importSpecifier: string,
): string | null {
  if (!importSpecifier.startsWith(".")) return null;

  const unresolvedPath = path.resolve(
    path.dirname(importerPath),
    importSpecifier,
  );
  const candidates = importSpecifier.endsWith(".ts")
    ? [unresolvedPath]
    : [
        `${unresolvedPath}.ts`,
        unresolvedPath.replace(/\.js$/, ".ts"),
        path.join(unresolvedPath, "index.ts"),
      ];

  return candidates.find((candidate) => routeFileSet.has(candidate)) ?? null;
}

function collectRouteImports(filePath: string): string[] {
  const content = fs.readFileSync(filePath, "utf8");
  const importPattern =
    /(?:import|export)\s+(?:type\s+)?(?:[^"'`;]*?\s+from\s+)?["']([^"']+)["']/g;
  const imports: string[] = [];

  for (const match of content.matchAll(importPattern)) {
    const specifier = match[1];
    if (!specifier) continue;

    const resolvedPath = resolveRouteImport(filePath, specifier);
    if (resolvedPath) imports.push(resolvedPath);
  }

  return imports;
}

const reachableModules = new Set<string>();
const pendingModules = [routesIndexPath];

while (pendingModules.length > 0) {
  const currentPath = pendingModules.pop();
  if (!currentPath || reachableModules.has(currentPath)) continue;

  reachableModules.add(currentPath);
  pendingModules.push(...collectRouteImports(currentPath));
}

const unreferencedModules = routeFiles
  .filter((filePath) => !reachableModules.has(filePath))
  .map((filePath) => path.relative(routesDir, filePath).replace(/\\/g, "/"));

if (unreferencedModules.length > 0) {
  console.error(
    [
      "[check:route-references] Unreferenced route modules found in artifacts/api-server/src/routes:",
      ...unreferencedModules.map((modulePath) => `  - ${modulePath}`),
      "",
      "Import every route module from the route graph rooted at artifacts/api-server/src/routes/index.ts, or remove it if unused.",
    ].join("\n"),
  );
  process.exit(1);
}

console.log(
  `[check:route-references] OK (${routeFiles.length} route module${routeFiles.length === 1 ? "" : "s"} verified).`,
);
