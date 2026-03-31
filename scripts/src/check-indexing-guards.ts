import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const PRODUCTION_ORIGIN = "https://blueprintsandbookkeeping.com";
const SENSITIVE_PATH_PATTERNS = [
  "/admin",
  "/onboarding",
  "/welcome",
  "/payment-success",
  "/status",
  "/feedback",
  "/unsubscribe",
  "/marketing-guide",
];

function fail(message: string): never {
  throw new Error(`Indexing guard check failed: ${message}`);
}

function normalizePath(input: string): string {
  const cleaned = input.trim();
  if (!cleaned) return "/";
  return cleaned.endsWith("/") && cleaned !== "/"
    ? cleaned.slice(0, -1)
    : cleaned;
}

function matchesDisallowPath(pathname: string, disallowPath: string): boolean {
  if (disallowPath === "/") return true;
  const normalizedPath = normalizePath(pathname);
  const normalizedDisallow = normalizePath(disallowPath);

  return (
    normalizedPath === normalizedDisallow ||
    normalizedPath.startsWith(`${normalizedDisallow}/`)
  );
}

function main() {
  const websiteRoot = resolve(import.meta.dirname, "../../artifacts/website");
  const robotsPath = resolve(websiteRoot, "public/robots.txt");
  const sitemapPath = resolve(websiteRoot, "public/sitemap.xml");

  const robotsContent = readFileSync(robotsPath, "utf8");
  const sitemapContent = readFileSync(sitemapPath, "utf8");

  const sitemapLine = robotsContent
    .split("\n")
    .map((line) => line.trim())
    .find((line) => line.startsWith("Sitemap:"));

  if (!sitemapLine) {
    fail("robots.txt is missing a Sitemap declaration.");
  }

  const sitemapUrl = sitemapLine.replace("Sitemap:", "").trim();
  const expectedSitemap = `${PRODUCTION_ORIGIN}/sitemap.xml`;
  if (sitemapUrl !== expectedSitemap) {
    fail(
      `robots.txt Sitemap URL must be ${expectedSitemap}, received ${sitemapUrl}.`,
    );
  }

  const robotsLines = robotsContent.split("\n").map((line) => line.trim());
  const groups: { userAgents: string[]; disallowPaths: string[] }[] = [];
  let currentGroup: { userAgents: string[]; disallowPaths: string[] } | null =
    null;

  for (const line of robotsLines) {
    if (!line || line.startsWith("#")) {
      continue;
    }

    if (line.startsWith("User-agent:")) {
      const userAgent = line.replace("User-agent:", "").trim();
      if (!currentGroup || currentGroup.disallowPaths.length > 0) {
        currentGroup = { userAgents: [], disallowPaths: [] };
        groups.push(currentGroup);
      }
      currentGroup.userAgents.push(userAgent);
      continue;
    }

    if (line.startsWith("Disallow:") && currentGroup) {
      const disallowPath = line.replace("Disallow:", "").trim();
      if (disallowPath.length > 0) {
        currentGroup.disallowPaths.push(disallowPath);
      }
    }
  }

  const disallowPaths = groups
    .filter((group) => group.userAgents.includes("*"))
    .flatMap((group) => group.disallowPaths);

  const sitemapLocs = [...sitemapContent.matchAll(/<loc>(.*?)<\/loc>/g)].map(
    (match) => (match[1] ?? "").trim(),
  );

  const sitemapUrls = sitemapLocs.map((loc) => new URL(loc));
  const nonProductionSitemapUrls = sitemapUrls.filter(
    (url) => `${url.protocol}//${url.host}` !== PRODUCTION_ORIGIN,
  );
  if (nonProductionSitemapUrls.length > 0) {
    fail(
      `sitemap.xml contains non-production URLs: ${nonProductionSitemapUrls
        .map((url) => url.toString())
        .join(", ")}`,
    );
  }

  const violatingDisallowPaths = new Set<string>();
  for (const url of sitemapUrls) {
    for (const disallowPath of disallowPaths) {
      if (matchesDisallowPath(url.pathname, disallowPath)) {
        violatingDisallowPaths.add(`${disallowPath} -> ${url.pathname}`);
      }
    }
  }

  if (violatingDisallowPaths.size > 0) {
    fail(
      `Disallow paths must not appear in sitemap.xml: ${Array.from(
        violatingDisallowPaths,
      ).join(", ")}`,
    );
  }

  for (const sensitivePath of SENSITIVE_PATH_PATTERNS) {
    const hasDisallowRule = disallowPaths.some((disallowPath) =>
      matchesDisallowPath(sensitivePath, disallowPath),
    );
    if (!hasDisallowRule) {
      fail(
        `Missing robots Disallow rule for sensitive route prefix "${sensitivePath}".`,
      );
    }

    const isInSitemap = sitemapUrls.some((url) =>
      matchesDisallowPath(url.pathname, sensitivePath),
    );
    if (isInSitemap) {
      fail(`Sensitive route prefix "${sensitivePath}" appears in sitemap.xml.`);
    }
  }

  console.log("✅ Indexing guard checks passed.");
}

main();
