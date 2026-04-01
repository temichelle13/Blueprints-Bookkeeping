import { useEffect, useRef } from "react";
import { useLocation } from "wouter";
import { hasAcceptedCookies } from "@/components/CookieConsent";
import { initAnalytics, trackEvent, trackPageview } from "@/lib/analytics";

type HomeCtaType = "primary" | "secondary";
type HomeCtaPlacement = "hero" | "mid_page" | "closing";

export function trackHomeCtaClick(
  type: HomeCtaType,
  placement: HomeCtaPlacement,
): void {
  if (!hasAcceptedCookies()) return;

  initAnalytics();

  const eventName =
    type === "primary" ? "Home Primary CTA Click" : "Home Secondary CTA Click";
  trackEvent(eventName, {
    cta_type: type,
    cta_placement: placement,
  });
}

export function usePageTracking() {
  const [location] = useLocation();
  const lastTrackedPage = useRef<string | null>(null);

  useEffect(() => {
    if (!hasAcceptedCookies()) return;

    initAnalytics();

    const pageKey = window.location.href;
    if (lastTrackedPage.current === pageKey) return;

    trackPageview();
    lastTrackedPage.current = pageKey;
  }, [location]);

  useEffect(() => {
    const handleConsentChange = () => {
      if (!hasAcceptedCookies()) return;

      initAnalytics();

      const pageKey = window.location.href;
      if (lastTrackedPage.current === pageKey) return;

      trackPageview();
      lastTrackedPage.current = pageKey;
    };

    window.addEventListener("cookie-consent-changed", handleConsentChange);
    return () =>
      window.removeEventListener("cookie-consent-changed", handleConsentChange);
  }, []);
}
