import { useState, useEffect } from "react";
import { Cookie, X } from "lucide-react";
import { initAnalytics, trackPageview } from "@/lib/analytics";

const CONSENT_KEY = "bb_cookie_consent";

export type ConsentValue = "accepted" | "declined" | null;

export function getCookieConsent(): ConsentValue {
  const val = localStorage.getItem(CONSENT_KEY);
  if (val === "accepted" || val === "declined") return val;
  return null;
}

export function hasAcceptedCookies(): boolean {
  return getCookieConsent() === "accepted";
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
    <div
      role="dialog"
      aria-label="Cookie consent"
      className="fixed bottom-0 left-0 right-0 z-[60] p-4 sm:p-6"
    >
      <div className="max-w-3xl mx-auto glass-card rounded-2xl border border-white/[0.08] p-5 sm:p-6 shadow-2xl">
        <div className="flex items-start gap-4">
          <div className="p-2 rounded-lg bg-accent/10 text-accent shrink-0 mt-0.5" aria-hidden="true">
            <Cookie size={20} />
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="text-white font-semibold text-sm mb-1">We value your privacy</h2>
            <p className="text-muted-foreground text-sm leading-relaxed">
              We use privacy-friendly analytics to understand how visitors use our site and optional cookies for our AI chatbot assistant.
              No personal data is shared with third parties.
              Essential cookies required for site functionality are always active.
              You can change your preference at any time.{" "}
              <a href={`${import.meta.env.BASE_URL}privacy`} className="text-accent hover:underline">
                Privacy Policy
              </a>
            </p>
          </div>
          <button
            onClick={handleDecline}
            className="shrink-0 p-1.5 text-muted-foreground hover:text-white transition-colors rounded-lg"
            aria-label="Dismiss cookie banner"
          >
            <X size={16} />
          </button>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 mt-4 sm:ml-12">
          <button
            onClick={handleAccept}
            className="px-5 py-2.5 bg-accent text-white font-semibold text-sm rounded-lg hover:shadow-lg hover:shadow-accent/20 transition-all"
          >
            Accept All
          </button>
          <button
            onClick={handleDecline}
            className="px-5 py-2.5 bg-white/[0.04] border border-white/10 text-muted-foreground font-medium text-sm rounded-lg hover:text-white hover:bg-white/[0.08] transition-all"
          >
            Decline Optional
          </button>
        </div>
      </div>
    </div>
  );
}
