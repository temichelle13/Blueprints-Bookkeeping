import { useEffect } from "react";

interface SEOProps {
  title?: string;
  description?: string;
  path?: string;
  ogImage?: string;
  ogType?: string;
  jsonLd?: Record<string, unknown> | Record<string, unknown>[];
  noindex?: boolean;
}

const BASE_TITLE = "Blueprints & Bookkeeping";
const BASE_URL = "https://blueprintsandbookkeeping.com";
const DEFAULT_OG_IMAGE = `${BASE_URL}/opengraph.jpg`;
const DEFAULT_DESCRIPTION =
  "Your Blueprint to Business Success. Advanced bookkeeping and professional business plans for complex, high-growth businesses.";

const MANAGED_META_TAGS = [
  "description",
  "og:title",
  "og:description",
  "og:url",
  "og:type",
  "og:image",
  "og:site_name",
  "twitter:card",
  "twitter:title",
  "twitter:description",
  "twitter:image",
];

function setMeta(name: string, content: string) {
  const isOg = name.startsWith("og:");
  const attrKey = isOg ? "property" : "name";

  let el = document.querySelector(`meta[${attrKey}="${name}"]`);
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attrKey, name);
    document.head.appendChild(el);
  }
  el.setAttribute("content", content);
}

function removeMeta(name: string) {
  const isOg = name.startsWith("og:");
  const attrKey = isOg ? "property" : "name";
  const el = document.querySelector(`meta[${attrKey}="${name}"]`);
  if (el) el.remove();
}

function setCanonical(url: string) {
  let el = document.querySelector('link[rel="canonical"]');
  if (!el) {
    el = document.createElement("link");
    el.setAttribute("rel", "canonical");
    document.head.appendChild(el);
  }
  el.setAttribute("href", url);
}

function removeCanonical() {
  const el = document.querySelector('link[rel="canonical"]');
  if (el) el.remove();
}

function setJsonLd(data: Record<string, unknown> | Record<string, unknown>[]) {
  const existing = document.querySelector("script[data-seo-jsonld]");
  if (existing) existing.remove();

  const script = document.createElement("script");
  script.setAttribute("type", "application/ld+json");
  script.setAttribute("data-seo-jsonld", "true");

  const payload = Array.isArray(data) ? data : [data];
  const output = payload.length === 1 ? payload[0] : payload;
  script.textContent = JSON.stringify(output);
  document.head.appendChild(script);
}

function removeJsonLd() {
  const existing = document.querySelector("script[data-seo-jsonld]");
  if (existing) existing.remove();
}

function setRobotsMeta(content: string) {
  let el = document.querySelector('meta[name="robots"]');
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute("name", "robots");
    document.head.appendChild(el);
  }
  el.setAttribute("content", content);
}

function restoreRobotsMeta() {
  const el = document.querySelector('meta[name="robots"]');
  if (el) el.setAttribute("content", "index, follow");
}

export function SEO({
  title,
  description,
  path,
  ogImage,
  ogType,
  jsonLd,
  noindex,
}: SEOProps) {
  const fullTitle = title ? `${title} | ${BASE_TITLE}` : BASE_TITLE;
  const url = path ? `${BASE_URL}${path}` : BASE_URL;
  const image = ogImage || DEFAULT_OG_IMAGE;
  const type = ogType || "website";
  const desc = description || DEFAULT_DESCRIPTION;

  useEffect(() => {
    document.title = fullTitle;

    if (noindex) {
      setRobotsMeta("noindex, nofollow");
    } else {
      setRobotsMeta("index, follow");
    }

    setMeta("description", desc);

    setMeta("og:title", fullTitle);
    setMeta("og:description", desc);
    setMeta("og:url", url);
    setMeta("og:type", type);
    setMeta("og:image", image);
    setMeta("og:site_name", BASE_TITLE);

    setMeta("twitter:card", "summary_large_image");
    setMeta("twitter:title", fullTitle);
    setMeta("twitter:description", desc);
    setMeta("twitter:image", image);

    if (!noindex) {
      setCanonical(url);
    }

    if (jsonLd) {
      setJsonLd(jsonLd);
    }

    return () => {
      document.title = BASE_TITLE;
      MANAGED_META_TAGS.forEach(removeMeta);
      restoreRobotsMeta();
      removeCanonical();
      removeJsonLd();
    };
  }, [fullTitle, desc, url, image, type, jsonLd, noindex]);

  return null;
}

export { BASE_URL };
