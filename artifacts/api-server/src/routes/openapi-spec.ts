import { Router, type IRouter } from "express";
import { readFileSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";
import { logger } from "../lib/logger";

const router: IRouter = Router();

// Inlined at build time via esbuild define (__OPENAPI_YAML__).
// Falls back to reading from disk when running under tsx in development.
declare const __OPENAPI_YAML__: string | undefined;

function loadOpenApiYaml(): string {
  if (typeof __OPENAPI_YAML__ !== "undefined") {
    return __OPENAPI_YAML__;
  }
  try {
    const __dirname = dirname(fileURLToPath(import.meta.url));
    return readFileSync(
      resolve(__dirname, "../../../../lib/api-spec/openapi.yaml"),
      "utf-8",
    );
  } catch (err) {
    logger.error(
      "Failed to read openapi.yaml from disk (dev fallback)",
      err instanceof Error ? err : new Error(String(err)),
    );
    return "";
  }
}

const openApiYaml = loadOpenApiYaml();

router.get("/openapi.yaml", (_req, res) => {
  if (!openApiYaml) {
    res.status(500).json({ error: "OpenAPI spec unavailable" });
    return;
  }
  res.setHeader("Content-Type", "application/yaml");
  res.send(openApiYaml);
});

export default router;
