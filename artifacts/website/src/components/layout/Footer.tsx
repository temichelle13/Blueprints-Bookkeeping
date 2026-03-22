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

const BOOKKEEPER_EMAIL = "tea@blueprintsandbookkeeping.com";
const BUSINESS_PHONE = "(541) 319-8654";
const BUSINESS_PHONE_HREF = "tel:+15413198654";
const SCHEDULE_PATH = "/schedule";
const GET_STARTED_PATH = "/get-started";

const contactLinks = [
  {
    label: "Book a discovery call",
    href: SCHEDULE_PATH,
    description: "Use the live calendar to choose a time that works for you.",
    icon: CalendarDays,
    isExternal: false,
  },
  {
    label: "Start the intake",
    href: GET_STARTED_PATH,
    description:
      "Share your business details and we will map out the next steps.",
    icon: ClipboardList,
    isExternal: false,
  },
  {
    label: BOOKKEEPER_EMAIL,
    href: `mailto:${BOOKKEEPER_EMAIL}`,
    description:
      "Email Tea directly for questions about bookkeeping, pricing, or fit.",
    icon: Mail,
    isExternal: true,
  },
  {
    label: BUSINESS_PHONE,
    href: BUSINESS_PHONE_HREF,
    description:
      "Call or text for scheduling help, questions, or client support.",
    icon: Phone,
    isExternal: true,
  },
] as const;

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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          <div className="lg:col-span-1">
            <Link href="/" className="inline-block mb-4">
              <span className="font-display font-bold text-xl tracking-tight">
                <span className="text-foreground">Blueprints &</span>
                <br />
                <span className="text-accent">Bookkeeping</span>
              </span>
            </Link>
            <p className="text-muted-foreground text-sm mb-6 leading-relaxed">
              Advanced bookkeeping and business plans for founders who need
              clean books and a clear path forward. Based in Roseburg, OR —
              serving nationwide.
            </p>
            <div className="flex flex-col gap-3 text-sm">
              <a
                href="mailto:tea@blueprintsandbookkeeping.com"
                className="flex items-center gap-2.5 text-muted-foreground hover:text-accent transition-colors"
              >
                <Mail
                  size={14}
                  className="text-accent/60 shrink-0"
                  aria-hidden="true"
                />
                tea@blueprintsandbookkeeping.com
              </a>
              <a
                href="tel:+15413198654"
                className="flex items-center gap-2.5 text-muted-foreground hover:text-accent transition-colors"
              >
                <Phone
                  size={14}
                  className="text-accent/60 shrink-0"
                  aria-hidden="true"
                />
                (541) 319-8654
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

          <div>
            <h3 className="font-display font-semibold text-sm uppercase tracking-wider text-muted-foreground mb-5">
              Contact
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed mb-5">
              Reach out whichever way feels easiest. We keep the footer simple
              so the rest of the site can do the talking.
            </p>
            <ul className="space-y-3">
              {contactLinks.map((item) => {
                const Icon = item.icon;
                const linkClassName =
                  "group flex items-start gap-3 text-sm text-muted-foreground transition-colors hover:text-foreground";
                const content = (
                  <>
                    <span className="mt-0.5 text-accent/70">
                      <Icon size={15} aria-hidden="true" />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="flex items-center gap-2 font-medium text-foreground/90 group-hover:text-foreground transition-colors">
                        <span>{item.label}</span>
                        <ArrowRight
                          size={12}
                          className="opacity-0 -translate-x-1 transition-all duration-200 group-hover:opacity-100 group-hover:translate-x-0"
                          aria-hidden="true"
                        />
                      </span>
                      <span className="mt-1 block text-xs leading-relaxed text-muted-foreground">
                        {item.description}
                      </span>
                    </span>
                  </>
                );

                return (
                  <li key={item.label}>
                    {item.isExternal ? (
                      <a href={item.href} className={linkClassName}>
                        {content}
                      </a>
                    ) : (
                      <Link href={item.href} className={linkClassName}>
                        {content}
                      </Link>
                    )}
                  </li>
                );
              })}
            </ul>
            <button
              type="button"
              onClick={openCookieConsentPreferences}
              className="mt-6 inline-flex items-center gap-2 rounded-full border border-white/10 px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:border-accent/30 hover:text-foreground"
            >
              Cookie Preferences
            </button>
          </div>

          <div>
            <h3 className="font-display font-semibold text-sm uppercase tracking-wider text-muted-foreground mb-5">
              Pages
            </h3>
            <ul className="space-y-2.5 mb-7">
              {[
                { label: "Services", href: "/services" },
                { label: "Pricing", href: "/pricing" },
                { label: "About Tea", href: "/about" },
                { label: "Industries", href: "/industries" },
                { label: "Blog", href: "/blog" },
                { label: "FAQ", href: "/faq" },
                { label: "Credentials", href: "/about/credentials" },
              ].map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={scrollToTopOnSameRoute(item.href)}
                    className="text-muted-foreground hover:text-accent text-sm transition-colors inline-flex items-center gap-1 group"
                  >
                    {item.label}
                    <ArrowRight
                      size={11}
                      className="opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all"
                    />
                  </Link>
                </li>
              ))}
            </ul>
            <h3 className="font-display font-semibold text-sm uppercase tracking-wider text-muted-foreground mb-3">
              Services
            </h3>
            <ul className="space-y-2.5">
              {[
                {
                  label: "Advanced Bookkeeping",
                  href: "/services/bookkeeping",
                },
                { label: "Business Plans", href: "/services/business-plans" },
                { label: "Tax Partner Network", href: "/tax-partners" },
              ].map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={scrollToTopOnSameRoute(item.href)}
                    className="text-muted-foreground hover:text-accent text-sm transition-colors inline-flex items-center gap-1 group"
                  >
                    {item.label}
                    <ArrowRight
                      size={11}
                      className="opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all"
                    />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-display font-semibold text-sm uppercase tracking-wider text-muted-foreground mb-5">
              Stay in the Loop
            </h3>
            <p className="text-muted-foreground text-sm mb-4 leading-relaxed">
              Founder-focused financial tips and updates — no spam, unsubscribe
              any time.
            </p>
            <FooterNewsletterSignup />
          </div>
        </div>
        <div className="glow-line mb-6" />
        <p className="text-xs text-muted-foreground/60 text-center mb-4 leading-relaxed max-w-3xl mx-auto">
          Blueprints &amp; Bookkeeping LLC is not a licensed CPA firm and does
          not provide tax preparation, tax filing, legal advice, or licensed
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
          <div className="flex items-center gap-4">
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
                  className="shrink-0 hover:scale-110 transition-transform"
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
              className="hover:text-foreground transition-colors"
            >
              Privacy Policy
            </Link>
            <Link
              href="/terms"
              className="hover:text-foreground transition-colors"
            >
              Terms of Service
            </Link>
            <Link
              href="/referral"
              className="hover:text-foreground transition-colors"
            >
              Referral Program
            </Link>
            <Link
              href="/unsubscribe"
              className="hover:text-foreground transition-colors"
            >
              Unsubscribe
            </Link>
            <Link
              href="/feedback"
              className="hover:text-foreground transition-colors"
            >
              Site Feedback
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
