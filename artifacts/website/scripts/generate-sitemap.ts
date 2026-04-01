import { readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { blogPosts } from "../src/data/blog-posts";
import { BLOG_ROUTE_META, PUBLIC_ROUTE_ALLOWLIST } from "./sitemap-config";

const WEBSITE_ROOT = resolve(import.meta.dirname, "..");
const ROUTER_FILE = resolve(WEBSITE_ROOT, "src/App.tsx");
const ROBOTS_FILE = resolve(WEBSITE_ROOT, "public/robots.txt");
const SITEMAP_FILE = resolve(WEBSITE_ROOT, "public/sitemap.xml");

const BASE_URL = "https://blueprintsandbookkeeping.com";

const args = new Set(process.argv.slice(2));
const checkOnly = args.has("--check");

function toIsoDate(input: string): string {
  return new Date(input).toISOString().slice(0, 10);
}

function extractRouterPaths(): Set<string> {
  const appSource = readFileSync(ROUTER_FILE, "utf8");
  const matches = appSource.matchAll(/<Route\s+path="([^"]+)"/g);

  return new Set(
    Array.from(matches, ([, path]) => path).filter(
      (path) => !path.includes(":"),
    ),
  );
}

function extractDisallowedPaths(): string[] {
  const robotsSource = readFileSync(ROBOTS_FILE, "utf8");

  return robotsSource
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line.startsWith("Disallow:"))
    .map((line) => line.replace("Disallow:", "").trim())
    .filter((path) => path && path !== "/");
}

function isDisallowed(path: string, disallowed: string[]): boolean {
  return disallowed.some((blockedPath) => {
    if (blockedPath.endsWith("/")) {
      return path === blockedPath.slice(0, -1) || path.startsWith(blockedPath);
    }

    return path === blockedPath || path.startsWith(`${blockedPath}/`);
  });
}

function xmlEscape(input: string): string {
  return input.replaceAll("&", "&amp;").replaceAll("<", "&lt;");
}

const buildDate = toIsoDate(new Date().toISOString());
const routerPaths = extractRouterPaths();
const disallowedPaths = extractDisallowedPaths();

for (const route of PUBLIC_ROUTE_ALLOWLIST) {
  if (!routerPaths.has(route.path)) {
    throw new Error(
      `Sitemap allowlist route \"${route.path}\" is missing from src/App.tsx router definitions.`,
    );
  }

  if (isDisallowed(route.path, disallowedPaths)) {
    throw new Error(
      `Sitemap allowlist route \"${route.path}\" is disallowed by robots.txt.`,
    );
  }
}

const urls = [
  ...PUBLIC_ROUTE_ALLOWLIST.map((route) => ({
    loc: `${BASE_URL}${route.path === "/" ? "" : route.path}`,
    lastmod: buildDate,
    changefreq: route.changefreq,
    priority: route.priority,
  })),
  ...blogPosts.map((post) => ({
    loc: `${BASE_URL}/blog/${post.slug}`,
    lastmod: toIsoDate(
      (post as typeof post & { updatedAt?: string }).updatedAt ?? post.date,
    ),
    changefreq: BLOG_ROUTE_META.changefreq,
    priority: BLOG_ROUTE_META.priority,
  })),
];

const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls
  .map(
    ({ loc, lastmod, changefreq, priority }) =>
      `  <url>\n    <loc>${xmlEscape(loc)}</loc>\n    <lastmod>${lastmod}</lastmod>\n    <changefreq>${changefreq}</changefreq>\n    <priority>${priority}</priority>\n  </url>`,
  )
  .join("\n")}\n</urlset>\n`;

const current = readFileSync(SITEMAP_FILE, "utf8");

if (checkOnly) {
  if (current !== xml) {
    throw new Error(
      "sitemap.xml is out of date. Run `pnpm --filter @workspace/website run sitemap:generate` and commit the result.",
    );
  }

  console.log("sitemap.xml is up to date.");
} else {
  writeFileSync(SITEMAP_FILE, xml, "utf8");
  console.log(`Generated ${SITEMAP_FILE}`);
}
