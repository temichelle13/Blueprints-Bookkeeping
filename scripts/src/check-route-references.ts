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
const ignoredRouteModules = new Set([
  "onboarding-workflow.ts",
  "openai/guards.ts",
]);

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
const routesIndexContent = fs.readFileSync(routesIndexPath, "utf8");

const unreferencedModules = routeFiles
  .map((filePath) => path.relative(routesDir, filePath).replace(/\\/g, "/"))
  .filter((relativePath) => !ignoredRouteModules.has(relativePath))
  .filter((relativePath) => {
    const importBase = `./${relativePath.replace(/\.ts$/, "")}`;

    return !(
      routesIndexContent.includes(`from \"${importBase}\"`) ||
      routesIndexContent.includes(`from '${importBase}'`) ||
      routesIndexContent.includes(`from \"${importBase}.ts\"`) ||
      routesIndexContent.includes(`from '${importBase}.ts'`)
    );
  });

if (unreferencedModules.length > 0) {
  console.error(
    [
      "[check:route-references] Unreferenced route modules found in artifacts/api-server/src/routes:",
      ...unreferencedModules.map((modulePath) => `  - ${modulePath}`),
      "",
      "Import every route module in artifacts/api-server/src/routes/index.ts or remove it if unused.",
    ].join("\n"),
  );
  process.exit(1);
}

console.log(
  `[check:route-references] OK (${routeFiles.length} route module${routeFiles.length === 1 ? "" : "s"} verified).`,
);
