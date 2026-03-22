import React from "react";
import { Link, useLocation } from "wouter";
import {
  Mail,
  Phone,
  MapPin,
  ArrowRight,
  MessageSquare,
  CalendarDays,
  Video,
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

const takeActionItems = [
  {
    label: "Book a call",
    href: SCHEDULE_PATH,
    description:
      "Use the live calendar to grab a free discovery call time that works for you.",
    icon: CalendarDays,
    isExternal: false,
  },
  {
    label: "Video chat",
    href: SCHEDULE_PATH,
    description:
      "Prefer Zoom-style face time? Use the same calendar and choose a slot for a video conversation.",
    icon: Video,
    isExternal: false,
  },
  {
    label: "Text message me",
    href: BUSINESS_PHONE_HREF,
    description: `${BUSINESS_PHONE} — if Tea is unavailable and you do not have a scheduled call, our receptionist will help route your message. Voicemails are welcome, and we aim to reply the same day or early the next business day.`,
    icon: MessageSquare,
    isExternal: true,
  },
  {
    label: "Add me as your bookkeeper",
    href: GET_STARTED_PATH,
    description:
      "Start with the short intake. After you submit it, we send your details through the next-step flow and show the firm ID, accountant email, and QuickBooks add-an-accountant instructions so you can invite us correctly. Estimates go out as soon as possible, and questions are always welcome.",
    icon: ClipboardList,
    isExternal: false,
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
            <h3 className="font-display font-semibold text-white mb-6">
              Take Action
            </h3>
            <div className="space-y-3">
              {takeActionItems.map((item) => {
                const Icon = item.icon;
                const cardClassName =
                  "group flex items-start gap-3 rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-left transition-all duration-200 hover:border-accent/30 hover:bg-white/[0.08]";
                const content = (
                  <>
                    <div className="mt-0.5 rounded-lg border border-accent/15 bg-accent/[0.08] p-2 text-accent">
                      <Icon size={15} aria-hidden="true" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 text-sm font-semibold text-white">
                        <span>{item.label}</span>
                        <ArrowRight
                          size={13}
                          className="opacity-60 transition-transform duration-200 group-hover:translate-x-0.5"
                          aria-hidden="true"
                        />
                      </div>
                      <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                        {item.description}
                      </p>
                    </div>
                  </>
                );

                if (item.isExternal) {
                  return (
                    <a
                      key={item.label}
                      href={item.href}
                      className={cardClassName}
                    >
                      {content}
                    </a>
                  );
                }

                return (
                  <Link
                    key={item.label}
                    href={item.href}
                    className={cardClassName}
                  >
                    {content}
                  </Link>
                );
              })}
            </div>
            <div className="mt-6 rounded-xl border border-accent/15 bg-accent/[0.05] p-4">
              <h4 className="text-sm font-semibold text-white mb-2">
                QuickBooks accountant access, the right way
              </h4>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Start with the short intake first. Once we receive it, we will
                share the next-step details — including the firm ID, the
                accountant email{" "}
                <span className="text-white font-medium select-all">
                  {BOOKKEEPER_EMAIL}
                </span>
                , and directions for adding an accountant inside QuickBooks — so
                your setup stays orderly and your estimate can go out as quickly
                as possible.
              </p>
            </div>
            <button
              type="button"
              onClick={openCookieConsentPreferences}
              className="flex items-center gap-3 px-4 py-3 rounded-xl bg-white/[0.04] border border-white/10 text-muted-foreground font-semibold text-sm hover:bg-white/[0.08] hover:text-white transition-all duration-200 text-left mt-4 w-full"
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
