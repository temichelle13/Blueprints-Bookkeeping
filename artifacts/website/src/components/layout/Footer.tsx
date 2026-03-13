import { Link } from "wouter";
import { Mail, Phone, MapPin, ArrowRight } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-primary text-primary-foreground pt-16 pb-8 border-t border-primary/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* Brand Col */}
          <div className="lg:col-span-1">
            <Link href="/" className="flex items-center gap-3 mb-4 inline-block">
              {/* Note: In a real environment, you might use a white version of the logo here */}
              <span className="font-display font-bold text-2xl tracking-tight text-white">
                Blueprints &<br />Bookkeeping
              </span>
            </Link>
            <p className="text-primary-foreground/70 text-sm mb-6">
              Your Blueprint to Business Success. We transform financial complexity into scalable growth.
            </p>
            <div className="flex flex-col gap-3 text-sm text-primary-foreground/80">
              <a href="mailto:tea@blueprintsandbookkeeping.com" className="flex items-center gap-2 hover:text-white transition-colors">
                <Mail size={16} className="text-accent" />
                tea@blueprintsandbookkeeping.com
              </a>
              <a href="tel:+15413198654" className="flex items-center gap-2 hover:text-white transition-colors">
                <Phone size={16} className="text-accent" />
                (541) 319-8654
              </a>
              <div className="flex items-center gap-2">
                <MapPin size={16} className="text-accent" />
                Roseburg, Oregon (Remote Nationwide)
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-display font-semibold text-lg mb-4 text-white">Quick Links</h3>
            <ul className="space-y-3">
              {["Home", "About", "Services", "Industries", "Pricing", "Portfolio"].map((item) => (
                <li key={item}>
                  <Link 
                    href={item === "Home" ? "/" : `/${item.toLowerCase()}`}
                    className="text-primary-foreground/70 hover:text-accent flex items-center gap-2 text-sm transition-colors group"
                  >
                    <ArrowRight size={14} className="opacity-0 -ml-4 group-hover:opacity-100 group-hover:ml-0 transition-all duration-300" />
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="font-display font-semibold text-lg mb-4 text-white">Our Services</h3>
            <ul className="space-y-3 text-sm text-primary-foreground/70">
              <li className="hover:text-white transition-colors cursor-default">Advanced Bookkeeping</li>
              <li className="hover:text-white transition-colors cursor-default">Historical Cleanup</li>
              <li className="hover:text-white transition-colors cursor-default">Lender-Ready Business Plans</li>
              <li className="hover:text-white transition-colors cursor-default">Static Web Design</li>
              <li className="hover:text-white transition-colors cursor-default">Remote Online Notarization</li>
            </ul>
          </div>

          {/* CTA / Newsletter (Placeholder) */}
          <div>
            <h3 className="font-display font-semibold text-lg mb-4 text-white">Ready to Scale?</h3>
            <p className="text-primary-foreground/70 text-sm mb-4">
              We limit our active roster to ensure executive-level quality. Reach out today to secure your spot.
            </p>
            <Link 
              href="/contact"
              className="inline-block w-full text-center px-6 py-3 bg-accent text-white font-medium rounded-lg hover:bg-accent/90 transition-colors shadow-lg shadow-accent/20"
            >
              Book a Discovery Call
            </Link>
          </div>
        </div>

        <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-primary-foreground/50">
          <p>© {new Date().getFullYear()} Blueprints & Bookkeeping, LLC. All rights reserved.</p>
          <div className="flex gap-4">
            <Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
