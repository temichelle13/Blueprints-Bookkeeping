import React from "react";
import { Link, useLocation } from "wouter";
import {
  Mail,
  Phone,
  MapPin,
  ArrowRight,
  CalendarDays,
  ClipboardList,
} from "lucide-react";
import { FooterNewsletterSignup } from "@/components/NewsletterSignup";
import { openCookieConsentPreferences } from "@/components/CookieConsent";
import { footerCredentialBadges } from "@/data/credentials";
import { trackEvent } from "@/lib/analytics";

const BOOKKEEPER_EMAIL = "tea@blueprintsandbookkeeping.com";
const BUSINESS_PHONE = "(541) 319-8654";
const BUSINESS_PHONE_HREF = "tel:+15413198654";
const SCHEDULE_PATH = "/schedule";
const GET_STARTED_PATH = "/get-started";
const EMERGENCY_REQUEST_URL =
  "mailto:tea@blueprintsandbookkeeping.com?subject=Emergency%20%2F%20Expedited%20Request&body=Hi%20Tea%2C%0A%0AI%20need%20an%20urgent%20bookkeeping%20review%20due%20to%20deadline%20pressure%20(tax%2C%20lender%2C%20or%20filing).%20Please%20contact%20me%20as%20soon%20as%20possible.%0A%0AName%3A%0ABusiness%3A%0ABest%20phone%20number%3A";

interface ContactLink {
  label: string;
  href: string;
  description: string;
  icon: typeof CalendarDays;
  isExternal: boolean;
  newTab?: boolean;
  analyticsEvent?: string;
}

const contactLinks: ContactLink[] = [
  {
    label: "Book a call",
    href: SCHEDULE_PATH,
    description: "Choose a time that works for you.",
    icon: CalendarDays,
    isExternal: false,
  },
  {
    label: "Start intake",
    href: GET_STARTED_PATH,
    description: "Share your details and get started.",
    icon: ClipboardList,
    isExternal: false,
  },
  {
    label: BOOKKEEPER_EMAIL,
    href: `mailto:${BOOKKEEPER_EMAIL}`,
    description: "Email for questions about services.",
    icon: Mail,
    isExternal: true,
  },
];

type FooterBucketLink = { label: string; href: string };
type FooterBucket = {
  title: string;
  links: ReadonlyArray<FooterBucketLink>;
  showCookiePreferences?: boolean;
};

const footerBuckets: FooterBucket[] = [
  {
    title: "Services",
    links: [
      { label: "Advanced Bookkeeping", href: "/services/bookkeeping" },
      { label: "Business Plans", href: "/services/business-plans" },
      { label: "Tax Partner Network", href: "/tax-partners" },
      { label: "Pricing", href: "/pricing" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About Tea", href: "/about" },
      { label: "Credentials", href: "/about/credentials" },
      { label: "Industries", href: "/industries" },
      { label: "Referral Program", href: "/referral" },
    ],
  },
  {
    title: "Resources",
    links: [
      { label: "Blog", href: "/blog" },
      { label: "FAQ", href: "/faq" },
      { label: "Accessibility", href: "/accessibility" },
      { label: "Site Feedback", href: "/feedback" },
    ],
  },
  {
    title: "Legal & Support",
    showCookiePreferences: true,
    links: [
      { label: "Privacy Policy", href: "/privacy" },
      { label: "Terms of Service", href: "/terms" },
      { label: "Cookie Policy", href: "/cookies" },
    ],
  },
];

export function Footer() {
  const [location] = useLocation();

  const scrollToTopOnSameRoute =
    (href: string) => (event: React.MouseEvent<HTMLAnchorElement>) => {
      if (location === href) {
        event.preventDefault();
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    };

  return (
    <footer className="relative border-t border-border/50">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-accent/30 to-transparent" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 mb-12">
          <div className="lg:col-span-4 space-y-6">
            <div>
              <Link href="/" className="inline-block mb-4">
                <span className="font-display font-bold text-xl tracking-tight">
                  <span className="text-foreground">Blueprints &</span>
                  <br />
                  <span className="text-accent">Bookkeeping</span>
                </span>
              </Link>
              <p className="text-muted-foreground text-sm mb-6 leading-relaxed max-w-md">
                Advanced bookkeeping and business plans for founders who need
                clean books and a clear path forward. Based in Roseburg, OR —
                serving nationwide.
              </p>
              <div className="flex flex-col gap-3 text-sm">
                <a
                  href={`mailto:${BOOKKEEPER_EMAIL}`}
                  className="flex items-center gap-2.5 rounded-sm text-muted-foreground hover:text-accent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/60 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                >
                  <Mail
                    size={14}
                    className="text-accent/60 shrink-0"
                    aria-hidden="true"
                  />
                  {BOOKKEEPER_EMAIL}
                </a>
                <a
                  href={BUSINESS_PHONE_HREF}
                  className="flex items-center gap-2.5 rounded-sm text-muted-foreground hover:text-accent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/60 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                >
                  <Phone
                    size={14}
                    className="text-accent/60 shrink-0"
                    aria-hidden="true"
                  />
                  {BUSINESS_PHONE}
                </a>
                <div className="flex items-center gap-2.5 text-muted-foreground">
                  <MapPin
                    size={14}
                    className="text-accent/60 shrink-0"
                    aria-hidden="true"
                  />
                  Roseburg, Oregon (Remote Nationwide)
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-10">
            {footerBuckets.map((bucket) => (
              <div key={bucket.title}>
                <h3 className="font-display font-semibold text-sm uppercase tracking-wider text-muted-foreground mb-5">
                  {bucket.title}
                </h3>
                <ul className="space-y-2.5">
                  {bucket.links.map((item) => (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        onClick={scrollToTopOnSameRoute(item.href)}
                        className="text-muted-foreground hover:text-accent text-sm transition-colors inline-flex items-center gap-1 group rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/60 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                      >
                        {item.label}
                        <ArrowRight
                          size={11}
                          className="opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all"
                          aria-hidden="true"
                          focusable="false"
                        />
                      </Link>
                    </li>
                  ))}
                </ul>
                {bucket.showCookiePreferences && (
                  <button
                    type="button"
                    onClick={openCookieConsentPreferences}
                    className="mt-2.5 text-muted-foreground hover:text-accent text-sm transition-colors inline-flex items-center gap-1 group rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/60 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                  >
                    Cookie Preferences
                    <ArrowRight
                      size={11}
                      className="opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all"
                      aria-hidden="true"
                      focusable="false"
                    />
                  </button>
                )}
              </div>
            ))}
            <div className="md:col-span-2 lg:col-span-4 pt-2">
              <h3 className="font-display font-semibold text-sm uppercase tracking-wider text-muted-foreground mb-4">
                Stay in the Loop
              </h3>
              <p className="text-muted-foreground text-sm mb-4 leading-relaxed max-w-2xl">
                Founder-focused financial tips and updates — no spam,
                unsubscribe any time.
              </p>
              <FooterNewsletterSignup />
            </div>
          </div>
        </div>
        <div className="glow-line mb-6" />
        <p className="text-xs text-muted-foreground/60 text-center mb-4 leading-relaxed max-w-3xl mx-auto">
          Blueprints & Bookkeeping LLC is not a licensed CPA firm and does not
          provide tax preparation, tax filing, legal advice, or licensed
          investment counsel. References to tax forms describe bookkeeping
          contexts only. For tax and legal matters, please consult a licensed
          professional.{" "}
          <Link
            href="/faq"
            className="underline underline-offset-2 hover:text-muted-foreground transition-colors"
          >
            Learn more in our FAQ
          </Link>{" "}
          or review our{" "}
          <Link
            href="/terms"
            className="underline underline-offset-2 hover:text-muted-foreground transition-colors"
          >
            Terms of Service
          </Link>
          .
        </p>
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-muted-foreground">
          <div className="flex flex-wrap justify-center md:justify-start items-center gap-4">
            <p>
              &copy; {new Date().getFullYear()} Blueprints & Bookkeeping, LLC.
              All rights reserved.
            </p>
            <div className="flex items-center gap-2">
              {footerCredentialBadges.map((badge) => (
                <a
                  key={badge.name}
                  href={badge.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="shrink-0 rounded-sm hover:scale-110 transition-transform focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/60 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                >
                  <img
                    src={badge.badge}
                    alt={badge.name}
                    className="w-8 h-8 object-contain"
                    loading="lazy"
                  />
                </a>
              ))}
            </div>
          </div>
          <div className="flex flex-wrap justify-center gap-x-6 gap-y-2">
            <Link
              href="/privacy"
              className="hover:text-foreground transition-colors rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/60 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            >
              Privacy
            </Link>
            <Link
              href="/terms"
              className="hover:text-foreground transition-colors rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/60 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            >
              Terms of Service
            </Link>
            <Link
              href="/accessibility"
              className="hover:text-foreground transition-colors rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/60 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            >
              Accessibility
            </Link>
            <Link
              href="/cookies"
              className="hover:text-foreground transition-colors rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/60 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            >
              Cookies
            </Link>
            <Link
              href="/compliance-security"
              className="hover:text-foreground transition-colors rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/60 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            >
              Compliance & Security
            </Link>
            <Link
              href="/referral"
              className="hover:text-foreground transition-colors rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/60 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            >
              Referral Program
            </Link>
            <Link
              href="/feedback"
              className="hover:text-foreground transition-colors rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/60 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            >
              Site Feedback
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
