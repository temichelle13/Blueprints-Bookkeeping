import { Link, useLocation } from "wouter";
import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/services", label: "Services" },
  { href: "/industries", label: "Industries" },
  { href: "/pricing", label: "Pricing" },
  { href: "/portfolio", label: "Portfolio" },
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

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location]);

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b",
        isScrolled
          ? "bg-white/90 backdrop-blur-md border-border shadow-sm py-3"
          : "bg-white border-transparent py-5"
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <img 
              src={`${import.meta.env.BASE_URL}logo.png`} 
              alt="Blueprints & Bookkeeping Logo" 
              className="h-10 w-auto object-contain transition-transform group-hover:scale-105"
            />
            <span className="font-display font-bold text-xl text-primary hidden sm:block tracking-tight">
              Blueprints & Bookkeeping
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "text-sm font-medium transition-colors hover:text-accent relative",
                  location === link.href ? "text-accent" : "text-foreground/80"
                )}
              >
                {link.label}
                {location === link.href && (
                  <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-accent rounded-full" />
                )}
              </Link>
            ))}
            <Link
              href="/contact"
              className="px-5 py-2.5 rounded-full bg-primary text-primary-foreground font-medium text-sm hover:bg-primary/90 hover:shadow-lg hover:shadow-primary/20 transition-all active:scale-95"
            >
              Contact Us
            </Link>
          </nav>

          {/* Mobile Menu Toggle */}
          <button
            className="md:hidden p-2 text-foreground"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Nav */}
      {mobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-white border-b border-border shadow-xl py-4 px-4 flex flex-col gap-4 animate-in slide-in-from-top-2">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "p-3 rounded-lg text-base font-medium",
                location === link.href ? "bg-muted text-accent" : "text-foreground"
              )}
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="/contact"
            className="w-full mt-2 p-3 text-center rounded-lg bg-primary text-primary-foreground font-medium"
          >
            Contact Us
          </Link>
        </div>
      )}
    </header>
  );
}
