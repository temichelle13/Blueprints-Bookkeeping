import { Link } from "wouter";
import { Mail, Phone, MapPin, Users } from "lucide-react";
import { FooterNewsletterSignup } from "@/components/NewsletterSignup";

export function Footer() {
  return (
    <footer className="relative border-t border-border/50">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-accent/30 to-transparent" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-8">
        <div className="refer-founder-callout glass-card rounded-2xl p-8 mb-12 flex flex-col sm:flex-row items-center gap-6 sm:gap-8">
          <div className="p-3 bg-accent/10 rounded-xl shrink-0">
            <Users size={28} className="text-accent" />
          </div>
          <div className="flex-grow text-center sm:text-left">
            <h3 className="text-lg font-display font-bold mb-1">Know a Founder Who Needs Better Books?</h3>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Refer a fellow founder and you'll both receive a complimentary financial health check. Great bookkeeping grows through word of mouth.
            </p>
          </div>
          <a
            href="mailto:tea@blueprintsandbookkeeping.com?subject=Founder%20Referral&body=Hi%20Tea%2C%0A%0AI'd%20like%20to%20refer%20a%20fellow%20founder%20to%20Blueprints%20%26%20Bookkeeping.%0A%0AReferral%20Name%3A%20%0AReferral%20Email%3A%20%0A%0AThanks!"
            className="shrink-0 px-6 py-3 bg-accent/15 border border-accent/30 text-accent font-semibold rounded-lg hover:bg-accent hover:text-white hover:border-accent transition-all duration-300 text-sm whitespace-nowrap"
          >
            Refer a Founder
          </a>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          <div className="lg:col-span-1">
            <Link href="/" className="inline-block mb-4">
              <span className="font-display font-bold text-2xl tracking-tight">
                <span className="text-foreground">Blueprints &</span><br />
                <span className="text-accent">Bookkeeping</span>
              </span>
            </Link>
            <p className="text-muted-foreground text-sm mb-6 leading-relaxed">
              Your Blueprint to Business Success. We transform financial complexity into scalable growth.
            </p>
            <div className="flex flex-col gap-3 text-sm">
              <a href="mailto:tea@blueprintsandbookkeeping.com" className="flex items-center gap-3 text-muted-foreground hover:text-accent transition-colors">
                <Mail size={15} className="text-accent/60" aria-hidden="true" />
                tea@blueprintsandbookkeeping.com
              </a>
              <a href="tel:+15413198654" className="flex items-center gap-3 text-muted-foreground hover:text-accent transition-colors">
                <Phone size={15} className="text-accent/60" aria-hidden="true" />
                (541) 319-8654
              </a>
              <div className="flex items-center gap-3 text-muted-foreground">
                <MapPin size={15} className="text-accent/60" aria-hidden="true" />
                Roseburg, Oregon (Remote Nationwide)
              </div>
            </div>
          </div>

          <div>
            <h3 className="font-display font-semibold text-sm uppercase tracking-wider text-muted-foreground mb-5">Navigate</h3>
            <ul className="space-y-3">
              {[
                { label: "Services", href: "/services" },
                { label: "Industries", href: "/industries" },
                { label: "About Tea", href: "/about" },
                { label: "Pricing", href: "/pricing" },
                { label: "Portfolio", href: "/portfolio" },
                { label: "Blog", href: "/blog" },
                { label: "Contact", href: "/contact" },
                { label: "Client Results", href: "/results" },
                { label: "FAQ", href: "/faq" },
                { label: "Tax Partner Network", href: "/tax-partners" },
                { label: "Referral Program", href: "/referral" },
                { label: "Book a Call", href: "/schedule" },
              ].map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-muted-foreground hover:text-foreground text-sm transition-colors"
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
              <li><Link href="/business-planning" className="hover:text-foreground transition-colors">Business Plans</Link></li>
              <li>Static Web Design</li>
            </ul>
          </div>

          <div>
            <h3 className="font-display font-semibold text-sm uppercase tracking-wider text-muted-foreground mb-5">Stay in the Loop</h3>
            <p className="text-muted-foreground text-sm mb-4 leading-relaxed">
              Get founder-focused financial tips and updates delivered to your inbox.
            </p>
            <FooterNewsletterSignup />
            <div className="mt-6 pt-6 border-t border-border/50">
              <Link
                href="/schedule"
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
            <Link href="/privacy" className="hover:text-foreground transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-foreground transition-colors">Terms of Service</Link>
            <Link href="/unsubscribe" className="hover:text-foreground transition-colors">Unsubscribe</Link>
            <Link href="/feedback" className="hover:text-foreground transition-colors">Site Feedback</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
