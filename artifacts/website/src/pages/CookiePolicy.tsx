import { usePageTitle } from "@/hooks/use-page-title";
import { SEO } from "@/components/SEO";
import { Link } from "wouter";
import { openCookieConsentPreferences } from "@/components/CookieConsent";

export default function CookiePolicy() {
  usePageTitle("Cookie Policy");

  return (
    <div className="pt-24 pb-20">
      <SEO
        path="/cookies"
        description="Learn about how Blueprints & Bookkeeping uses cookies and similar technologies on our website, and how you can manage your preferences."
      />

      <section className="py-16 mb-8 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-accent/5 to-transparent" />
        <div className="relative max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="accent-bar mb-6" />
          <h1 className="text-4xl font-display font-bold text-white mb-4">
            Cookie Policy
          </h1>
          <p className="text-muted-foreground text-sm">
            Last updated: March 2026
          </p>
        </div>
      </section>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <div className="glass-card rounded-2xl p-8 space-y-6 text-[15px] leading-relaxed text-muted-foreground">
          <section>
            <h2 className="text-white font-bold text-lg mb-3">
              What Are Cookies?
            </h2>
            <p>
              Cookies are small text files that are placed on your device
              (computer, smartphone, or tablet) when you visit a website. They
              are widely used to make websites work more efficiently and provide
              information to website owners.
            </p>
          </section>

          <section>
            <h2 className="text-white font-bold text-lg mb-3">
              How We Use Cookies
            </h2>
            <p className="mb-3">Blueprints & Bookkeeping uses cookies to:</p>
            <ul className="list-disc list-inside space-y-1 pl-2">
              <li>Remember your cookie consent preferences</li>
              <li>
                Understand how visitors use our website (when you consent to
                analytics)
              </li>
              <li>Improve our website performance and user experience</li>
              <li>Track the effectiveness of our marketing efforts</li>
            </ul>
            <p className="mt-3">
              We do not use cookies for advertising or tracking you across other
              websites.
            </p>
          </section>

          <section>
            <h2 className="text-white font-bold text-lg mb-3">
              Types of Cookies We Use
            </h2>

            <div className="space-y-4">
              <div className="border-l-2 border-accent/30 pl-4">
                <h3 className="text-white font-semibold mb-1">
                  Essential Cookies (Always Active)
                </h3>
                <p className="mb-2">
                  These cookies are necessary for the website to function and
                  cannot be switched off.
                </p>
                <table className="w-full text-xs border border-white/10 rounded-lg overflow-hidden">
                  <thead className="bg-white/5">
                    <tr>
                      <th className="text-left p-2 border-b border-white/10">
                        Cookie Name
                      </th>
                      <th className="text-left p-2 border-b border-white/10">
                        Purpose
                      </th>
                      <th className="text-left p-2 border-b border-white/10">
                        Duration
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-white/10">
                      <td className="p-2">
                        <code className="bg-white/10 px-1.5 py-0.5 rounded text-xs">
                          bb_cookie_consent
                        </code>
                      </td>
                      <td className="p-2">
                        Stores your cookie preference choice
                      </td>
                      <td className="p-2">Persistent (until cleared)</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className="border-l-2 border-accent/30 pl-4">
                <h3 className="text-white font-semibold mb-1">
                  Analytics Cookies (Optional)
                </h3>
                <p className="mb-2">
                  These cookies help us understand how visitors interact with
                  our website. They are only activated if you consent to
                  analytics.
                </p>
                <table className="w-full text-xs border border-white/10 rounded-lg overflow-hidden">
                  <thead className="bg-white/5">
                    <tr>
                      <th className="text-left p-2 border-b border-white/10">
                        Service
                      </th>
                      <th className="text-left p-2 border-b border-white/10">
                        Purpose
                      </th>
                      <th className="text-left p-2 border-b border-white/10">
                        Data Collected
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-white/10">
                      <td className="p-2">
                        <span className="text-white font-medium">
                          Plausible Analytics
                        </span>
                      </td>
                      <td className="p-2">
                        Privacy-friendly website analytics
                      </td>
                      <td className="p-2">
                        Page views, referrer, device type (no personal data)
                      </td>
                    </tr>
                    <tr className="border-b border-white/10">
                      <td className="p-2">
                        <span className="text-white font-medium">
                          Google Analytics
                        </span>
                      </td>
                      <td className="p-2">
                        Website traffic and behavior analysis
                      </td>
                      <td className="p-2">
                        Page views, session duration, location (anonymized)
                      </td>
                    </tr>
                    <tr className="border-b border-white/10">
                      <td className="p-2">
                        <span className="text-white font-medium">
                          Google Tag Manager
                        </span>
                      </td>
                      <td className="p-2">
                        Manages analytics and tracking tags
                      </td>
                      <td className="p-2">Event triggers, tag management</td>
                    </tr>
                    <tr>
                      <td className="p-2">
                        <span className="text-white font-medium">
                          Apollo.io
                        </span>
                      </td>
                      <td className="p-2">
                        Business analytics and lead intelligence
                      </td>
                      <td className="p-2">Page visits, engagement metrics</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-white font-bold text-lg mb-3">
              Third-Party Services
            </h2>
            <p className="mb-3">
              Our website may include embedded content from third-party
              services. These services may set their own cookies:
            </p>
            <ul className="list-disc list-inside space-y-2 pl-2">
              <li>
                <span className="text-white font-medium">Calendly</span> —
                Scheduling widget for booking appointments
              </li>
              <li>
                <span className="text-white font-medium">Stripe</span> — Secure
                payment processing (does not appear on all pages)
              </li>
            </ul>
            <p className="mt-3">
              We do not control the cookies set by these third-party services.
              Please refer to their respective privacy policies for more
              information.
            </p>
          </section>

          <section>
            <h2 className="text-white font-bold text-lg mb-3">
              Your Cookie Choices
            </h2>
            <p className="mb-4">
              You have full control over whether to accept or decline analytics
              cookies on our website.
            </p>

            <div className="bg-accent/10 border border-accent/20 rounded-xl p-4 mb-4">
              <p className="text-sm mb-3 text-white">
                Update your cookie preferences:
              </p>
              <button
                onClick={openCookieConsentPreferences}
                className="px-4 py-2 bg-accent text-white font-semibold rounded-lg hover:bg-accent/90 transition-colors text-sm"
              >
                Manage Cookie Preferences
              </button>
            </div>

            <p className="mb-3">
              You can also control cookies through your browser settings:
            </p>
            <ul className="list-disc list-inside space-y-1 pl-2">
              <li>
                <a
                  href="https://support.google.com/chrome/answer/95647"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-accent hover:underline"
                >
                  Google Chrome
                </a>
              </li>
              <li>
                <a
                  href="https://support.mozilla.org/en-US/kb/enhanced-tracking-protection-firefox-desktop"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-accent hover:underline"
                >
                  Mozilla Firefox
                </a>
              </li>
              <li>
                <a
                  href="https://support.apple.com/guide/safari/manage-cookies-sfri11471/mac"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-accent hover:underline"
                >
                  Safari
                </a>
              </li>
              <li>
                <a
                  href="https://support.microsoft.com/en-us/microsoft-edge/delete-cookies-in-microsoft-edge-63947406-40ac-c3b8-57b9-2a946a29ae09"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-accent hover:underline"
                >
                  Microsoft Edge
                </a>
              </li>
            </ul>
            <p className="mt-3 text-sm">
              Note: Blocking all cookies may affect your ability to use certain
              features of our website.
            </p>
          </section>

          <section>
            <h2 className="text-white font-bold text-lg mb-3">
              Global Privacy Control (GPC)
            </h2>
            <p className="mb-3">
              We automatically respect the{" "}
              <a
                href="https://globalprivacycontrol.org/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-accent hover:underline"
              >
                Global Privacy Control (GPC)
              </a>{" "}
              signal. If your browser sends a GPC signal, we will:
            </p>
            <ul className="list-disc list-inside space-y-1 pl-2">
              <li>Treat it as a request to opt out of analytics tracking</li>
              <li>Not load any optional analytics cookies on your visit</li>
              <li>
                Honor your preference automatically without showing the cookie
                banner
              </li>
            </ul>
            <p className="mt-3">
              No action is needed beyond enabling GPC in your browser — our site
              automatically detects and honors the signal.
            </p>
          </section>

          <section>
            <h2 className="text-white font-bold text-lg mb-3">Do Not Track</h2>
            <p>
              We respect "Do Not Track" (DNT) browser settings. When DNT is
              enabled, we will not activate analytics cookies, similar to how we
              handle the GPC signal.
            </p>
          </section>

          <section>
            <h2 className="text-white font-bold text-lg mb-3">
              Data Retention
            </h2>
            <p>
              Analytics data collected through cookies is retained according to
              each service's retention policy:
            </p>
            <ul className="list-disc list-inside space-y-1 pl-2 mt-2">
              <li>Plausible Analytics: 12 months</li>
              <li>
                Google Analytics: 14 months (configurable, currently set to
                default)
              </li>
              <li>Apollo.io: Per their data retention policy</li>
            </ul>
            <p className="mt-3">
              Your cookie consent preference is stored locally on your device
              and is not transmitted to our servers.
            </p>
          </section>

          <section>
            <h2 className="text-white font-bold text-lg mb-3">
              Changes to This Cookie Policy
            </h2>
            <p>
              We may update this Cookie Policy from time to time to reflect
              changes in our practices or for other operational, legal, or
              regulatory reasons. The "Last updated" date at the top of this
              policy indicates when it was last revised.
            </p>
          </section>

          <section>
            <h2 className="text-white font-bold text-lg mb-3">Contact Us</h2>
            <p className="mb-3">
              If you have questions about our use of cookies, please contact us:
            </p>
            <div className="mt-3 pl-4 border-l border-accent/30 space-y-1">
              <p className="text-white font-medium">
                Blueprints & Bookkeeping LLC
              </p>
              <p>
                Email:{" "}
                <a
                  href="mailto:tea@blueprintsandbookkeeping.com"
                  className="text-accent hover:underline"
                >
                  tea@blueprintsandbookkeeping.com
                </a>
              </p>
              <p>
                Phone:{" "}
                <a
                  href="tel:+15413198654"
                  className="text-accent hover:underline"
                >
                  (541) 319-8654
                </a>
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-white font-bold text-lg mb-3">
              Related Policies
            </h2>
            <p className="mb-2">
              For more information about how we handle your data, please review:
            </p>
            <ul className="list-disc list-inside space-y-1 pl-2">
              <li>
                <Link href="/privacy" className="text-accent hover:underline">
                  Privacy Policy
                </Link>{" "}
                — How we collect, use, and protect your personal information
              </li>
              <li>
                <Link href="/terms" className="text-accent hover:underline">
                  Terms of Service
                </Link>{" "}
                — The terms governing your use of our website
              </li>
            </ul>
          </section>

          <section className="pt-6 border-t border-white/10">
            <p className="text-xs text-muted-foreground/70">
              This Cookie Policy is part of our commitment to transparency and
              your privacy rights under applicable data protection laws.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
