const ANALYTICS_ID = import.meta.env.VITE_ANALYTICS_ID as string | undefined;

let initialized = false;

export function initAnalytics(): void {
  if (initialized || !ANALYTICS_ID) return;

  const script = document.createElement("script");
  script.defer = true;
  script.dataset.domain = ANALYTICS_ID;
  script.src = "https://plausible.io/js/script.js";
  document.head.appendChild(script);

  (window as any).plausible =
    (window as any).plausible ||
    function (...args: any[]) {
      ((window as any).plausible.q = (window as any).plausible.q || []).push(args);
    };

  initialized = true;
}

export function trackPageview(): void {
  if (!initialized) return;
  (window as any).plausible?.("pageview");
}

export function trackEvent(name: string, props?: Record<string, string | number | boolean>): void {
  if (!initialized) return;
  if (props) {
    (window as any).plausible?.(name, { props });
  } else {
    (window as any).plausible?.(name);
  }
}

export function isAnalyticsInitialized(): boolean {
  return initialized;
}
