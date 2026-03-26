import { Link, useLocation } from "wouter";
import { useState, useEffect } from "react";
import { Menu, X, Sun, Moon } from "lucide-react";
import { cn } from "@/lib/utils";
import { useTheme } from "@/hooks/use-theme";

const LOGO_ICON_WEBP_DATA_URI =
  "data:image/webp;base64,UklGRnQFAABXRUJQVlA4WAoAAAAQAAAAIAAAPgAAQUxQSEEDAAABoIVt29kIev8//9hc27Zte2u3Sde2bdu2bdu23bE9Sf73oE3aPdprzyJiAvBfW6gyDVmWQAUN4ctAzb6hQNA7ENhhWQDSh0L3myz7k7yC4aGwwnecv/Pgww7xPuycl8h3V4AsobBJL7/n3ihzhbvZszIkIBT2maG5H5NVdVWeSikJHMdvG6WAxCFkFkcxBL8CkArX83QoiQv4+wbAgdyvbcHOrs629oWW6JYQgJRtw0NNkDdQ//zE6y/9yJ7vfvrxx2/fvPmIhBVZBgJQuJHbonXMntL0P/FwNnvw8hBQIq6PRPPwT4sustBiC57OOw84+sgjjznvqSn+eHA6VQsY2IFnoXnsGxQfxmsDmVQqGQsd/AH/tPZbCkKJffVxaB77FoCBI3hd2DTzlpVPRd/iG+lVIBXO5x5oHvu+vr6+uf543pw+KBvOWDkrkyvoczohjarfZ7vR2mv/UygUCmOcGh7+8+mDkmY2H7qeD0JW41jeAqO1h/57jsrk87mj9WdCYk8OLyZkaw9dXUyttbb5QygRD2/220STcYw9vCskWnuo6dfhVnVN1fhirraDvB1VKM/VN+0SDsQm+pqwUy+PgFEB3hk7MHU2v9x7Iaw2aK8FowKnJPYLvsUbE5l2BPlcCdtxHMeldl3X5nux/QOX6T4rfdCWEp/rpdBaoP8v8rnoxTO8KGaZ8XqcyAha+iefe/75F577nn9+/uWbVyasxB20b4xauVyuC3vyZDSP/rTIIossscgZvOugYw4/9KDEvg9w7qqibDt24hlo7aEmqVlSj7x76p7XzOtzY2Y+VC1MfWBRufbNu1zPQi598FrAQ9ywyNVaaw/tkBfs8T6vz+5RhaVnfqsWrT3U9O/y1/iF/HTjBuA5mlAVoNbprSb+Bupu4wtSohION8ZX0127fc7324WoiNav3z3qDJI3NUGiMiSp/7p5Y0CiIjbfXOV4fVMVIAW8tE93njOr4kOuhWoDJYs0fQ9ujWt5Nwx4FnG8p7en5F/vn1RffTO/bZfSx9+O/el6Sy+9VMnFu5Y5usBPl4SEj0lyfnLWc47kzAWNkPBpXP7OWx989KHnB2/cYS4KSPzLhoB/Q5aplMT/uQBWUDggDAIAABALAJ0BKiEAPwA+bTKTR6QioaElbACADYloHAANwZknsXDlmAsG/47Rb+YD9K/7N7f93b+yl+4CSByAazFmgBcGJrk7KB7qB/qdik4fYRTZ7VPO4mWeZRiABY2H7SK842AA/v86PUSOfzBzEdrWV5h8S923t8QW+qkafcPYbQn6uFca//iYYqGZR852/YJKw0I82tQLLrGZ8EYrh+/vxxEojdsoUUzbrp07RTrHgo13/W2S3+P+P/jvYNb5qvEiZ0I48BnEgUqd54O4KccrnF8zOj0mpgKUuTxnrxWLoDpkK+IbhqCEatBD5RuSBnhpDKVQdAE9kDukEtLXolhy8jmwn89P9zqdhB3A+OF6Ef9wz3G4MQD6tIB/1vZKLHj0PLhuChN2TvtVb/EognsQYN8Ivvah2fo3GZzmWK5JpIK/1XcBApMSvLFaM4zMV+ZZHkudAdlzZvf/NlVKf/NkkyohPYUFBwaGveSnHPsTd5P098rsy+xG/qKxkx1m7tKesWau0dL2Wf2LVb8wodWxjU8XnKlQ5+C7/O9deV3iZCALla436gmOyvjubG+tnBUoBpu+R9Af3gFaaMkZye4KqiENVlmGg8CFPZZnv0YSCTIO/VStjBQSkdOHlOIZN4eUP7RSDs+QZR7dN/uhS3Hbu+/a6+yOeZqx+uckMF/S8OJR7o6aoX7gs+mAAAAA";

const NAV_LINKS = [
  { href: "/services", label: "Services" },
  { href: "/industries", label: "Industries" },
  { href: "/about", label: "About" },
  { href: "/pricing", label: "Pricing" },
  { href: "/blog", label: "Blog" },
  { href: "/contact", label: "Contact" },
];

export function Header() {
  const [location] = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();

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
            ? "bg-background/80 backdrop-blur-xl border-b border-border/50 py-3"
            : "bg-transparent py-5",
        )}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <Link href="/" className="flex items-center gap-3 group shrink-0">
              <img
                src={LOGO_ICON_WEBP_DATA_URI}
                alt="Blueprints & Bookkeeping"
                width={33}
                height={63}
                className={cn(
                  "h-[63px] w-[33px] object-contain transition-transform group-hover:scale-105",
                  theme === "dark" ? "brightness-0 invert" : "",
                )}
              />
              <span className="font-display font-bold text-lg leading-tight tracking-tight">
                <span className="text-foreground">Blueprints &</span>
                <br />
                <span className="text-accent">Bookkeeping</span>
              </span>
            </Link>

            <nav
              className="hidden lg:flex items-center gap-1"
              aria-label="Main navigation"
            >
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300",
                    location === link.href
                      ? "text-accent bg-accent/10"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted/50",
                  )}
                >
                  {link.label}
                </Link>
              ))}
              <button
                onClick={toggleTheme}
                className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-all duration-300 ml-1"
                aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
                aria-pressed={theme === "light"}
              >
                {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
              </button>
              <div className="w-px h-6 bg-border/50 mx-2" />
              <Link
                href="/get-started"
                className="px-5 py-2 rounded-lg bg-accent/15 border border-accent/30 text-accent font-semibold text-sm hover:bg-accent hover:text-white hover:border-accent transition-all duration-300"
              >
                Get Started
              </Link>
            </nav>

            <div className="flex items-center gap-2 lg:hidden">
              <button
                onClick={toggleTheme}
                className="p-2 text-muted-foreground hover:text-foreground transition-colors"
                aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
                aria-pressed={theme === "light"}
              >
                {theme === "dark" ? <Sun size={20} /> : <Moon size={20} />}
              </button>
              <button
                className="p-2 text-muted-foreground hover:text-foreground transition-colors"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
                aria-expanded={mobileMenuOpen}
              >
                {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>

        {mobileMenuOpen && (
          <nav
            className="lg:hidden absolute top-full left-0 right-0 bg-card/95 backdrop-blur-xl border-b border-border/50 py-4 px-4 flex flex-col gap-1"
            aria-label="Mobile navigation"
          >
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "p-3 rounded-lg text-base font-medium transition-colors",
                  location === link.href
                    ? "bg-accent/10 text-accent"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/50",
                )}
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/get-started"
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
