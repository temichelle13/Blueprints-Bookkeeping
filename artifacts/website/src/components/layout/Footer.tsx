import { Link } from "wouter";
import { Mail, Phone, MapPin } from "lucide-react";
import { FooterNewsletterSignup } from "@/components/NewsletterSignup";

export function Footer() {
  return (
    <footer className="relative border-t border-white/[0.06]">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-accent/30 to-transparent" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          <div className="lg:col-span-1">
            <Link href="/" className="inline-block mb-4">
              <span className="font-display font-bold text-2xl tracking-tight">
                <span className="text-white">Blueprints &</span><br />
                <span className="text-accent">Bookkeeping</span>
              </span>
            </Link>
            <p className="text-muted-foreground text-sm mb-6 leading-relaxed">
              Your Blueprint to Business Success. We transform financial complexity into scalable growth.
            </p>
            <div className="flex flex-col gap-3 text-sm">
              <a href="mailto:tea@blueprintsandbookkeeping.com" className="flex items-center gap-3 text-muted-foreground hover:text-accent transition-colors">
                <Mail size={15} className="text-accent/60" />
                tea@blueprintsandbookkeeping.com
              </a>
              <a href="tel:+15413198654" className="flex items-center gap-3 text-muted-foreground hover:text-accent transition-colors">
                <Phone size={15} className="text-accent/60" />
                (541) 319-8654
              </a>
              <div className="flex items-center gap-3 text-muted-foreground">
                <MapPin size={15} className="text-accent/60" />
                Roseburg, Oregon (Remote Nationwide)
              </div>
            </div>
          </div>

          <div>
            <h3 className="font-display font-semibold text-sm uppercase tracking-wider text-muted-foreground mb-5">Navigate</h3>
            <ul className="space-y-3">
              {[
                { label: "About Tea", href: "/about" },
                { label: "Services", href: "/services" },
                { label: "Industries", href: "/industries" },
                { label: "Pricing", href: "/pricing" },
                { label: "Portfolio", href: "/portfolio" },
                { label: "Blog", href: "/blog" },
              ].map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-muted-foreground hover:text-white text-sm transition-colors"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-display font-semibold text-sm uppercase tracking-wider text-muted-foreground mb-5">Services</h3>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li>Advanced Bookkeeping</li>
              <li>Historical Cleanup</li>
              <li>Lender-Ready Business Plans</li>
              <li>Static Web Design</li>
              <li>Remote Online Notarization</li>
            </ul>
          </div>

          <div>
            <h3 className="font-display font-semibold text-sm uppercase tracking-wider text-muted-foreground mb-5">Stay in the Loop</h3>
            <p className="text-muted-foreground text-sm mb-4 leading-relaxed">
              Get founder-focused financial tips and updates delivered to your inbox.
            </p>
            <FooterNewsletterSignup />
            <div className="mt-6 pt-6 border-t border-white/[0.06]">
              <Link
                href="/contact"
                className="inline-block w-full text-center px-6 py-3 bg-accent/15 border border-accent/30 text-accent font-semibold rounded-lg hover:bg-accent hover:text-white hover:border-accent transition-all duration-300"
              >
                Book a Discovery Call
              </Link>
            </div>
          </div>
        </div>

        <div className="glow-line mb-6" />

        <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} Blueprints & Bookkeeping, LLC. All rights reserved.</p>
          <div className="flex gap-6">
            <Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
            <Link href="/unsubscribe" className="hover:text-white transition-colors">Unsubscribe</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
