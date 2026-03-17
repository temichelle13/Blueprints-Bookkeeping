import { Link } from "wouter";
import { Mail, Phone, MapPin, ArrowRight, CalendarDays, UserPlus, MessageSquare } from "lucide-react";
import { FooterNewsletterSignup } from "@/components/NewsletterSignup";

export function Footer() {
  return (
    <footer className="relative border-t border-border/50">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-accent/30 to-transparent" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-8">

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">

          <div className="lg:col-span-1">
            <Link href="/" className="inline-block mb-4">
              <span className="font-display font-bold text-xl tracking-tight">
                <span className="text-foreground">Blueprints &</span><br />
                <span className="text-accent">Bookkeeping</span>
              </span>
            </Link>
            <p className="text-muted-foreground text-sm mb-6 leading-relaxed">
              Advanced bookkeeping and business plans for founders who need clean books and a clear path forward. Based in Roseburg, OR — serving nationwide.
            </p>
            <div className="flex flex-col gap-3 text-sm">
              <a href="mailto:tea@blueprintsandbookkeeping.com" className="flex items-center gap-2.5 text-muted-foreground hover:text-accent transition-colors">
                <Mail size={14} className="text-accent/60 shrink-0" aria-hidden="true" />
                tea@blueprintsandbookkeeping.com
              </a>
              <a href="tel:+15413198654" className="flex items-center gap-2.5 text-muted-foreground hover:text-accent transition-colors">
                <Phone size={14} className="text-accent/60 shrink-0" aria-hidden="true" />
                (541) 319-8654
              </a>
              <div className="flex items-center gap-2.5 text-muted-foreground">
                <MapPin size={14} className="text-accent/60 shrink-0" aria-hidden="true" />
                Roseburg, Oregon (Remote Nationwide)
              </div>
            </div>
          </div>

          <div>
            <h3 className="font-display font-semibold text-sm uppercase tracking-wider text-muted-foreground mb-5">Take Action</h3>
            <div className="flex flex-col gap-3">
              <Link
                href="/get-started"
                className="flex items-center gap-3 px-4 py-3 rounded-xl bg-accent text-white font-semibold text-sm hover:shadow-lg hover:shadow-accent/20 hover:-translate-y-0.5 transition-all duration-200"
              >
                <UserPlus size={15} aria-hidden="true" />
                Get Started
                <ArrowRight size={13} className="ml-auto" aria-hidden="true" />
              </Link>
              <a
                href="https://calendly.com/tea-blueprintsandbookkeeping/30min"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 px-4 py-3 rounded-xl bg-accent/10 border border-accent/25 text-accent font-semibold text-sm hover:bg-accent hover:text-white hover:border-accent transition-all duration-200"
              >
                <CalendarDays size={15} aria-hidden="true" />
                Book a Discovery Call
                <ArrowRight size={13} className="ml-auto" aria-hidden="true" />
              </a>
              <Link
                href="/contact"
                className="flex items-center gap-3 px-4 py-3 rounded-xl bg-white/[0.04] border border-white/10 text-muted-foreground font-semibold text-sm hover:bg-white/[0.08] hover:text-white transition-all duration-200"
              >
                <MessageSquare size={15} aria-hidden="true" />
                Send a Message
                <ArrowRight size={13} className="ml-auto" aria-hidden="true" />
              </Link>
            </div>
          </div>

          <div>
            <h3 className="font-display font-semibold text-sm uppercase tracking-wider text-muted-foreground mb-5">Pages</h3>
            <ul className="space-y-2.5 mb-7">
              {[
                { label: "Services", href: "/services" },
                { label: "Pricing", href: "/pricing" },
                { label: "About Tea", href: "/about" },
                { label: "Industries", href: "/industries" },
                { label: "Blog", href: "/blog" },
                { label: "Free Resources", href: "/resources" },
                { label: "FAQ", href: "/faq" },
                { label: "Credentials", href: "/portfolio" },
              ].map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="text-muted-foreground hover:text-accent text-sm transition-colors inline-flex items-center gap-1 group">
                    {item.label}
                    <ArrowRight size={11} className="opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                  </Link>
                </li>
              ))}
            </ul>
            <h3 className="font-display font-semibold text-sm uppercase tracking-wider text-muted-foreground mb-3">Services</h3>
            <ul className="space-y-2.5">
              {[
                { label: "Advanced Bookkeeping", href: "/services/bookkeeping" },
                { label: "Business Plans", href: "/services/business-plans" },
                { label: "Digital Handshake", href: "/services/digital-handshake" },
                { label: "Tax Partner Network", href: "/tax-partners" },
              ].map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="text-muted-foreground hover:text-accent text-sm transition-colors inline-flex items-center gap-1 group">
                    {item.label}
                    <ArrowRight size={11} className="opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-display font-semibold text-sm uppercase tracking-wider text-muted-foreground mb-5">Stay in the Loop</h3>
            <p className="text-muted-foreground text-sm mb-4 leading-relaxed">
              Founder-focused financial tips and updates — no spam, unsubscribe any time.
            </p>
            <FooterNewsletterSignup />
          </div>
        </div>

        <div className="glow-line mb-6" />

        <p className="text-xs text-muted-foreground/60 text-center mb-4 leading-relaxed max-w-3xl mx-auto">
          <span className="font-semibold">Scope notice:</span> Blueprints &amp; Bookkeeping LLC is not a licensed CPA firm and does not provide tax preparation, tax filing, legal advice, or licensed investment counsel. References to tax forms (e.g., Schedule F, Schedule C) describe bookkeeping and record-keeping contexts only — not tax preparation services. All services are bookkeeping and business planning only. For tax and legal matters, please consult a licensed professional.{" "}
          <Link href="/faq" className="underline underline-offset-2 hover:text-muted-foreground transition-colors">Learn more in our FAQ</Link>
          {" "}or review our{" "}
          <Link href="/terms" className="underline underline-offset-2 hover:text-muted-foreground transition-colors">Terms of Service</Link>.
        </p>

        <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-muted-foreground">
          <div className="flex items-center gap-4">
            <p>&copy; {new Date().getFullYear()} Blueprints & Bookkeeping, LLC. All rights reserved.</p>
            <div className="flex items-center gap-2">
              {[
                { src: `${import.meta.env.BASE_URL}images/badge-qb-level2.png`, alt: "QuickBooks ProAdvisor Level 2", url: "https://www.credly.com/badges/76acb9d5-763f-4768-acf5-5d7bdff90313/public_url" },
                { src: `${import.meta.env.BASE_URL}images/badge-qb-payroll.png`, alt: "QuickBooks Payroll Certification", url: "https://www.credly.com/badges/5adba910-e07f-4ad7-ba97-2ffe67a76118/public_url" },
                { src: `${import.meta.env.BASE_URL}images/badge-intuit-bookkeeping.png`, alt: "Intuit Bookkeeping Certification", url: "https://www.credly.com/badges/e2823194-36dc-4ab3-ab1d-155b9189714f/public_url" },
              ].map((badge) => (
                <a key={badge.alt} href={badge.url} target="_blank" rel="noopener noreferrer" className="shrink-0 hover:scale-110 transition-transform">
                  <img src={badge.src} alt={badge.alt} className="w-8 h-8 object-contain" loading="lazy" />
                </a>
              ))}
            </div>
          </div>
          <div className="flex flex-wrap justify-center gap-x-6 gap-y-2">
            <Link href="/privacy" className="hover:text-foreground transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-foreground transition-colors">Terms of Service</Link>
            <Link href="/referral" className="hover:text-foreground transition-colors">Referral Program</Link>
            <Link href="/client-portal" className="hover:text-foreground transition-colors">Client Portal</Link>
            <Link href="/unsubscribe" className="hover:text-foreground transition-colors">Unsubscribe</Link>
            <Link href="/feedback" className="hover:text-foreground transition-colors">Site Feedback</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
