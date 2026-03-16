import { Link, useLocation } from "wouter";
import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";

const NAV_LINKS = [
  { href: "/services", label: "Services" },
  { href: "/industries", label: "Industries" },
  { href: "/about", label: "About" },
  { href: "/pricing", label: "Pricing" },
  { href: "/portfolio", label: "Portfolio" },
  { href: "/blog", label: "Blog" },
  { href: "/contact", label: "Contact" },
];

export function Header() {
  const [location] = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location]);

  return (
    <>
    <a href="#main-content" className="skip-nav">
      Skip to main content
    </a>
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-500",
        isScrolled
          ? "bg-background/80 backdrop-blur-xl border-b border-white/[0.06] py-3"
          : "bg-transparent py-5"
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          <Link href="/" className="flex items-center gap-3 group shrink-0">
            <img
              src={`${import.meta.env.BASE_URL}logo-icon.png`}
              alt="Blueprints & Bookkeeping"
              className="h-9 w-auto object-contain brightness-0 invert transition-transform group-hover:scale-105"
            />
            <span className="font-display font-bold text-lg leading-tight tracking-tight">
              <span className="text-white">Blueprints &</span><br />
              <span className="text-accent">Bookkeeping</span>
            </span>
          </Link>

          <nav className="hidden lg:flex items-center gap-1" aria-label="Main navigation">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300",
                  location === link.href
                    ? "text-accent bg-accent/10"
                    : "text-muted-foreground hover:text-white hover:bg-white/[0.04]"
                )}
              >
                {link.label}
              </Link>
            ))}
            <div className="w-px h-6 bg-white/10 mx-2" />
            <Link
              href="/contact"
              className="px-5 py-2 rounded-lg bg-accent/15 border border-accent/30 text-accent font-semibold text-sm hover:bg-accent hover:text-white hover:border-accent transition-all duration-300"
            >
              Get Started
            </Link>
          </nav>

          <button
            className="lg:hidden p-2 text-muted-foreground hover:text-white transition-colors"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {mobileMenuOpen && (
        <nav className="lg:hidden absolute top-full left-0 right-0 bg-card/95 backdrop-blur-xl border-b border-white/[0.06] py-4 px-4 flex flex-col gap-1" aria-label="Mobile navigation">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "p-3 rounded-lg text-base font-medium transition-colors",
                location === link.href ? "bg-accent/10 text-accent" : "text-muted-foreground hover:text-white hover:bg-white/[0.04]"
              )}
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="/contact"
            className="w-full mt-2 p-3 text-center rounded-lg bg-accent text-white font-semibold"
          >
            Get Started
          </Link>
        </nav>
      )}
    </header>
    </>
  );
}
