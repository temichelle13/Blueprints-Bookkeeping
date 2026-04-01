export interface RouteSitemapConfig {
  path: string;
  changefreq: "weekly" | "monthly" | "yearly";
  priority: string;
}

/**
 * Curated, crawlable routes only.
 * Keep this intentionally explicit so private/transactional pages are never auto-included.
 */
export const PUBLIC_ROUTE_ALLOWLIST: RouteSitemapConfig[] = [
  { path: "/", changefreq: "weekly", priority: "1.0" },
  { path: "/about", changefreq: "monthly", priority: "0.8" },
  { path: "/services", changefreq: "monthly", priority: "0.9" },
  { path: "/services/bookkeeping", changefreq: "monthly", priority: "0.9" },
  { path: "/services/business-plans", changefreq: "monthly", priority: "0.9" },
  { path: "/industries", changefreq: "monthly", priority: "0.7" },
  { path: "/pricing", changefreq: "monthly", priority: "0.8" },
  { path: "/about/credentials", changefreq: "monthly", priority: "0.7" },
  { path: "/portfolio", changefreq: "monthly", priority: "0.7" },
  { path: "/results", changefreq: "monthly", priority: "0.7" },
  { path: "/blog", changefreq: "weekly", priority: "0.8" },
  { path: "/faq", changefreq: "monthly", priority: "0.7" },
  { path: "/contact", changefreq: "monthly", priority: "0.9" },
  { path: "/business-planning", changefreq: "monthly", priority: "0.8" },
  { path: "/oregon-bookkeeper", changefreq: "monthly", priority: "0.9" },
  { path: "/schedule", changefreq: "monthly", priority: "0.8" },
  { path: "/get-started", changefreq: "monthly", priority: "0.8" },
  { path: "/tax-partners", changefreq: "monthly", priority: "0.6" },
  { path: "/referral", changefreq: "monthly", priority: "0.5" },
  // Legal + evergreen pages
  { path: "/privacy", changefreq: "yearly", priority: "0.3" },
  { path: "/terms", changefreq: "yearly", priority: "0.3" },
  { path: "/accessibility", changefreq: "yearly", priority: "0.3" },
  { path: "/cookies", changefreq: "yearly", priority: "0.3" },
];

export const BLOG_ROUTE_META: Omit<RouteSitemapConfig, "path"> = {
  changefreq: "monthly",
  priority: "0.6",
};
