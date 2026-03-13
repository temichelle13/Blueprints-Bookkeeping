import { useEffect } from "react";

interface SEOProps {
  title?: string;
  description?: string;
  path?: string;
}

const BASE_TITLE = "Blueprints & Bookkeeping";
const BASE_URL = "https://blueprintsandbookkeeping.com";

function setMeta(name: string, content: string) {
  let el = document.querySelector(`meta[name="${name}"]`) || document.querySelector(`meta[property="${name}"]`);
  if (!el) {
    el = document.createElement("meta");
    if (name.startsWith("og:") || name.startsWith("twitter:")) {
      el.setAttribute("property", name);
    } else {
      el.setAttribute("name", name);
    }
    document.head.appendChild(el);
  }
  el.setAttribute("content", content);
}

export function SEO({ title, description, path }: SEOProps) {
  const fullTitle = title ? `${title} | ${BASE_TITLE}` : BASE_TITLE;
  const url = path ? `${BASE_URL}${path}` : BASE_URL;

  useEffect(() => {
    document.title = fullTitle;

    if (description) {
      setMeta("description", description);
      setMeta("og:description", description);
      setMeta("twitter:description", description);
    }

    setMeta("og:title", fullTitle);
    setMeta("og:url", url);
    setMeta("og:type", "website");
    setMeta("twitter:card", "summary");
    setMeta("twitter:title", fullTitle);

    return () => {
      document.title = BASE_TITLE;
    };
  }, [fullTitle, description, url]);

  return null;
}