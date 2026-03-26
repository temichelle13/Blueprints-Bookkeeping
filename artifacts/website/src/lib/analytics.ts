const PLAUSIBLE_DOMAIN = import.meta.env.VITE_ANALYTICS_ID as
  | string
  | undefined;
const GA_MEASUREMENT_ID =
  (import.meta.env.VITE_GA_MEASUREMENT_ID as string | undefined) ||
  "G-XYLJ9XZ2SL";
const GTM_CONTAINER_ID =
  (import.meta.env.VITE_GTM_ID as string | undefined) || "GTM-5T5S2TFG";
const APOLLO_APP_ID =
  (import.meta.env.VITE_APOLLO_APP_ID as string | undefined) ||
  "69b73acda386f500112ae77b";

let initialized = false;
let pendingApolloPageUrl: string | null = null;
let webVitalsInitialized = false;

function ensureScript(
  id: string,
  src: string,
  attributes?: Record<string, string>,
): HTMLScriptElement {
  const existing = document.querySelector<HTMLScriptElement>(
    `script[data-analytics-script="${id}"]`,
  );
  if (existing) return existing;

  const script = document.createElement("script");
  script.dataset.analyticsScript = id;
  script.src = src;
  script.async = true;

  if (attributes) {
    Object.entries(attributes).forEach(([key, value]) => {
      script.setAttribute(key, value);
    });
  }

  document.head.appendChild(script);
  return script;
}

function initPlausible(): void {
  if (!PLAUSIBLE_DOMAIN) return;

  ensureScript("plausible", "https://plausible.io/js/script.js", {
    "data-domain": PLAUSIBLE_DOMAIN,
    defer: "true",
  });

  if (!window.plausible) {
    const plausible = ((...args: unknown[]) => {
      plausible.q = plausible.q || [];
      plausible.q.push(args);
    }) as ((...args: unknown[]) => void) & { q?: unknown[][] };

    window.plausible = plausible;
  }
}

function initGoogleAnalytics(): void {
  if (!GA_MEASUREMENT_ID) return;

  window.dataLayer = window.dataLayer || [];
  window.gtag =
    window.gtag ||
    function (...args: unknown[]) {
      window.dataLayer?.push(args);
    };

  ensureScript(
    "google-analytics",
    `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`,
  );

  window.gtag("js", new Date());
  window.gtag("config", GA_MEASUREMENT_ID, { send_page_view: false });
}

function initGoogleTagManager(): void {
  if (!GTM_CONTAINER_ID) return;

  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({
    "gtm.start": Date.now(),
    event: "gtm.js",
  });

  ensureScript(
    "google-tag-manager",
    `https://www.googletagmanager.com/gtm.js?id=${GTM_CONTAINER_ID}`,
  );
}

function flushApolloPageview(): void {
  if (!pendingApolloPageUrl) return;

  window.trackingFunctions?.sendPageVisitEvent?.(pendingApolloPageUrl);
  pendingApolloPageUrl = null;
}

function initApollo(): void {
  if (!APOLLO_APP_ID) return;
  if (window.__bbApolloInitialized) {
    flushApolloPageview();
    return;
  }

  const cacheBust = Math.random().toString(36).slice(2);
  const script = ensureScript(
    "apollo",
    `https://assets.apollo.io/micro/website-tracker/tracker.iife.js?nocache=${cacheBust}`,
    { defer: "true" },
  );

  if (window.__bbApolloInitializing) return;

  window.__bbApolloInitializing = true;
  script.addEventListener(
    "load",
    () => {
      window.trackingFunctions?.onLoad?.({ appId: APOLLO_APP_ID });
      window.__bbApolloInitialized = true;
      window.__bbApolloInitializing = false;
      flushApolloPageview();
    },
    { once: true },
  );
}

export function initAnalytics(): void {
  if (initialized) return;

  initPlausible();
  initGoogleAnalytics();
  initGoogleTagManager();
  initApollo();

  initialized = true;

  // Initialize Web Vitals monitoring after analytics are ready
  initWebVitals();
}

function sendWebVital(metric: Metric): void {
  if (!initialized) return;

  // Send to Google Analytics
  if (typeof window.gtag === 'function') {
    window.gtag('event', metric.name, {
      event_category: 'Web Vitals',
      value: Math.round(metric.name === 'CLS' ? metric.value * 1000 : metric.value),
      event_label: metric.id,
      non_interaction: true,
    });
  }

  // Send to Plausible
  window.plausible?.(metric.name, {
    props: {
      value: Math.round(metric.name === 'CLS' ? metric.value * 1000 : metric.value),
      rating: metric.rating,
    },
  });

  // Log to console in development
  if (import.meta.env.DEV) {
    console.log(`[Web Vitals] ${metric.name}:`, {
      value: metric.value,
      rating: metric.rating,
      id: metric.id,
    });
  }
}

function initWebVitals(): void {
  if (webVitalsInitialized) return;

  // Track Core Web Vitals
  onLCP(sendWebVital); // Largest Contentful Paint
  onINP(sendWebVital); // Interaction to Next Paint
  onCLS(sendWebVital); // Cumulative Layout Shift

  // Track additional metrics
  onFCP(sendWebVital); // First Contentful Paint
  onTTFB(sendWebVital); // Time to First Byte

  webVitalsInitialized = true;
}

export function trackPageview(): void {
  if (!initialized) return;

  const pageUrl = window.location.href;

  window.plausible?.("pageview");

  if (typeof window.gtag === "function") {
    window.gtag("event", "page_view", {
      page_path:
        window.location.pathname +
        window.location.search +
        window.location.hash,
      page_location: pageUrl,
      page_title: document.title,
    });
  }

  if (window.__bbApolloInitialized) {
    window.trackingFunctions?.sendPageVisitEvent?.(pageUrl);
    return;
  }

  pendingApolloPageUrl = pageUrl;
}

export function trackEvent(
  name: string,
  props?: Record<string, string | number | boolean>,
): void {
  if (!initialized) return;

  if (props) {
    window.plausible?.(name, { props });
  } else {
    window.plausible?.(name);
  }
}

export function isAnalyticsInitialized(): boolean {
  return initialized;
}

declare global {
  interface Window {
    __bbApolloInitialized?: boolean;
    __bbApolloInitializing?: boolean;
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
    plausible?: ((...args: unknown[]) => void) & { q?: unknown[][] };
    trackingFunctions?: {
      onLoad?: (options: { appId: string }) => void;
      sendPageVisitEvent?: (page: string) => Promise<void> | void;
    };
  }
}
