import { useState, useEffect } from "react";
import { Cookie } from "lucide-react";
import { initAnalytics, trackPageview } from "@/lib/analytics";

const CONSENT_KEY = "bb_cookie_consent";
const OPEN_CONSENT_EVENT = "open-cookie-consent";

export type ConsentValue = "accepted" | "declined" | null;

export function getCookieConsent(): ConsentValue {
  const val = localStorage.getItem(CONSENT_KEY);
  if (val === "accepted" || val === "declined") return val;
  return null;
}

export function hasAcceptedCookies(): boolean {
  return getCookieConsent() === "accepted";
}

export function openCookieConsentPreferences() {
  window.dispatchEvent(new Event(OPEN_CONSENT_EVENT));
}

export default function CookieConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const consent = getCookieConsent();
    if (consent === "accepted") {
      initAnalytics();
      trackPageview();
      return undefined;
    }

    if (!consent) {
      const timer = setTimeout(() => setVisible(true), 1000);
      return () => clearTimeout(timer);
    }

    return undefined;
  }, []);

  useEffect(() => {
    const handleOpenPreferences = () => setVisible(true);
    window.addEventListener(OPEN_CONSENT_EVENT, handleOpenPreferences);
    return () => window.removeEventListener(OPEN_CONSENT_EVENT, handleOpenPreferences);
  }, []);

  const handleAccept = () => {
    localStorage.setItem(CONSENT_KEY, "accepted");
    initAnalytics();
    trackPageview();
    setVisible(false);
    window.dispatchEvent(new Event("cookie-consent-changed"));
  };

  const handleDecline = () => {
    localStorage.setItem(CONSENT_KEY, "declined");
    setVisible(false);
    window.dispatchEvent(new Event("cookie-consent-changed"));
  };

  if (!visible) return null;

  return (
    <>
      <div aria-hidden="true" className="h-40 sm:h-32 lg:h-0" />
      <div
        role="dialog"
        aria-label="Cookie consent"
        aria-modal="false"
        data-cookie-banner
        className="cookie-banner pointer-events-none fixed inset-x-0 bottom-0 z-[45] px-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] sm:px-4 md:px-6"
      >
        <div className="mx-auto max-w-md lg:mx-6 lg:max-w-lg lg:ml-auto">
          <div className="pointer-events-auto glass-card rounded-2xl border border-white/[0.08] p-4 shadow-2xl shadow-black/30 sm:p-5">
            <div className="flex items-start gap-3">
              <div className="mt-0.5 shrink-0 rounded-xl bg-accent/12 p-2 text-accent" aria-hidden="true">
                <Cookie size={18} />
              </div>
              <div className="min-w-0 flex-1">
                <h2 className="mb-1 text-sm font-semibold text-white">Cookies, kept simple</h2>
                <p className="text-sm leading-6 text-muted-foreground">
                  Allow analytics and chat cookies, or keep only essential site cookies. You can update this anytime in our{" "}
                  <a href={`${import.meta.env.BASE_URL}privacy`} className="text-accent hover:underline">
                    Privacy Policy
                  </a>
                  .
                </p>
              </div>
            </div>

            <div className="mt-4 grid gap-2.5 sm:grid-cols-2">
              <button
                onClick={handleAccept}
                className="min-h-11 rounded-xl bg-[#4F46E5] px-4 py-3 text-sm font-semibold text-white transition-all hover:-translate-y-0.5 hover:bg-[#5B53F6] hover:shadow-lg hover:shadow-accent/25"
              >
                Accept analytics & chat
              </button>
              <button
                onClick={handleDecline}
                className="min-h-11 rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm font-medium text-muted-foreground transition-all hover:border-white/20 hover:bg-white/[0.08] hover:text-white"
              >
                Essential only
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
