import { Award, Shield, Fingerprint, BrainCircuit, GraduationCap, BadgeCheck, ArrowRight } from "lucide-react";
import { Link } from "wouter";
import { usePageTitle } from "@/hooks/use-page-title";
import { SEO } from "@/components/SEO";
import { CredentialBadgeStrip } from "@/components/TrustSignals";
import { aboutFeaturedBadges, aboutSecurityBadges } from "@/data/credentials";

export default function About() {
  usePageTitle("About Tea Larson-Hetrick");

  return (
    <div className="pt-24 pb-20">
      <SEO
        title="Meet Tea Larson-Hetrick"
        description="Advanced bookkeeping and business plan consulting from a QuickBooks ProAdvisor based in Roseburg, Oregon."
        path="/about"
      />
      <section className="py-16 mb-16 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-accent/5 to-transparent" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="accent-bar mx-auto mb-6" />
          <h1 className="text-4xl md:text-5xl font-display font-bold text-white mb-4">Meet Your Architect</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Where enterprise financial expertise meets cybersecurity rigor.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row justify-center gap-3">
            <Link
              href="/contact"
              className="inline-flex items-center justify-center px-6 py-3 bg-accent text-white font-semibold rounded-xl hover:shadow-xl hover:shadow-accent/20 hover:-translate-y-0.5 transition-all duration-300"
            >
              Work with Tea
            </Link>
            <Link
              href="/about/credentials"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl border border-accent/25 bg-accent/10 text-accent font-semibold hover:bg-accent hover:text-white hover:border-accent transition-all duration-300"
            >
              Review credentials <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="glass-card rounded-2xl p-6 mb-10 border border-accent/15 bg-accent/[0.04]">
            <p className="text-xs uppercase tracking-[0.24em] text-accent/80 mb-2">About / Credentials</p>
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <h2 className="text-xl font-display font-bold text-white">Credentials now live under About</h2>
                <p className="text-sm text-muted-foreground mt-1">
                  Use the dedicated credentials subpage to review public badge verification links, issuer details, and the full credential inventory.
                </p>
              </div>
              <Link
                href="/about/credentials"
                className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-white/[0.04] border border-white/10 text-white font-semibold hover:bg-white/[0.08] transition-colors"
              >
                Open credentials <ArrowRight size={15} />
              </Link>
            </div>
          </div>

          <h2 className="text-3xl font-display font-bold text-white mb-2">Tea Larson-Hetrick</h2>
          <p className="text-accent font-semibold mb-8 text-lg">Founder & Principal Consultant</p>

          <div className="space-y-5 text-foreground leading-relaxed mb-12">
            <p>
              Tea brings a rare intersection of enterprise financial management, software engineering, and cybersecurity to Blueprints &amp; Bookkeeping, LLC.
            </p>
            <p>
              With deep experience in financial operations for complex, multi-entity businesses, Tea understands exactly where standard accounting breaks down. Generalist bookkeepers hit a "complexity ceiling," leaving founders with messy historical data, mismatched records, and a lack of strategic foresight.
            </p>
            <p className="text-muted-foreground border-l-2 border-accent/30 pl-4 italic">
              Standard accounting firms are excellent for annual compliance, but they vanish during the first-quarter tax season. Blueprints &amp; Bookkeeping intentionally excludes in-house tax preparation&mdash;eliminating the seasonal blind spot to remain a proactive, dedicated operational resource 12 months a year.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-12">
            <div className="glass-card rounded-xl p-6 group hover:border-accent/20 transition-all">
              <BrainCircuit className="w-7 h-7 text-accent mb-4" />
              <h3 className="font-bold text-white mb-2 text-[15px]">Technical Depth</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">Comfortably managing crypto-assets, multi-location structures, and complex financial forecasts.</p>
            </div>
            <div className="glass-card rounded-xl p-6 group hover:border-accent/20 transition-all">
              <Fingerprint className="w-7 h-7 text-accent mb-4" />
              <h3 className="font-bold text-white mb-2 text-[15px]">Data Security First</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">As a CEH v12, your sensitive data is protected by enterprise-grade security. No offshore labor, ever.</p>
            </div>
          </div>

          <div className="glass-card rounded-2xl p-8 mb-12">
            <div className="flex items-center gap-3 mb-4">
              <Shield className="w-7 h-7 text-accent" />
              <h3 className="text-xl font-display font-bold text-white">Security First</h3>
            </div>
            <p className="text-muted-foreground leading-relaxed mb-6">
              Our books are managed by a professional trained in IBM-standard cybersecurity and data classification. Your sensitive financial data is protected with the same rigor used in enterprise environments.
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
              {aboutSecurityBadges.map((badge) => (
                <a key={badge.name} href={badge.url} target="_blank" rel="noopener noreferrer" className="flex flex-col items-center text-center group">
                  <div className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${badge.color} border ${badge.border} flex items-center justify-center mb-3 group-hover:scale-105 transition-transform`}>
                    <img src={badge.badge} alt={badge.name} width={56} height={56} loading="lazy" className="w-14 h-14 object-contain" />
                  </div>
                  <span className="text-xs text-muted-foreground font-medium group-hover:text-accent transition-colors">{badge.name}</span>
                  <span className="text-[11px] text-muted-foreground/80">Issued by {badge.issuer}</span>
                </a>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            <div className="glass-card rounded-2xl p-6">
              <h3 className="font-bold text-sm uppercase tracking-wider text-muted-foreground mb-5 flex items-center gap-2">
                <BadgeCheck className="w-4 h-4 text-accent" /> Professional Certifications
              </h3>
              <ul className="space-y-3 text-sm text-foreground">
                <li className="flex items-center gap-3"><Award size={15} className="text-accent shrink-0" /> Certified Ethical Hacker (CEH v12)</li>
                <li className="flex items-center gap-3"><Award size={15} className="text-accent shrink-0" /> QuickBooks ProAdvisor Advanced</li>
                <li className="flex items-center gap-3"><Award size={15} className="text-accent shrink-0" /> Advanced Crypto Accounting Certified</li>
              </ul>
            </div>

            <div className="glass-card rounded-2xl p-6">
              <h3 className="font-bold text-sm uppercase tracking-wider text-muted-foreground mb-5 flex items-center gap-2">
                <GraduationCap className="w-4 h-4 text-accent" /> Education
              </h3>
              <ul className="space-y-3 text-sm text-foreground">
                <li className="flex items-center gap-3"><Award size={15} className="text-accent shrink-0" /> MBA Coursework, Walden University</li>
                <li className="flex items-center gap-3"><Award size={15} className="text-accent shrink-0" /> Business Administration Studies, St. Andrews University</li>
              </ul>
              <p className="text-xs text-muted-foreground mt-4 italic">Plus extensive professional development and continuing education across finance, cybersecurity, and technology.</p>
            </div>
          </div>

          <div className="glass-card rounded-2xl p-8 mb-12">
            <div className="flex items-center justify-between gap-4 mb-6 flex-wrap">
              <div>
                <h3 className="font-bold text-white text-lg">Verified QuickBooks &amp; Intuit badges</h3>
                <p className="text-sm text-muted-foreground mt-1">These badges link directly to the public issuer verification pages for the credentials earned.</p>
              </div>
              <Link
                href="/about/credentials"
                className="inline-flex items-center gap-2 text-sm font-semibold text-accent hover:text-white transition-colors"
              >
                View full credentials <ArrowRight size={15} />
              </Link>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
              {aboutFeaturedBadges.map((badge) => (
                <a key={badge.name} href={badge.url} target="_blank" rel="noopener noreferrer" className="flex flex-col items-center text-center group">
                  <div className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${badge.color} border ${badge.border} flex items-center justify-center mb-3 group-hover:scale-105 transition-transform`}>
                    <img src={badge.badge} alt={badge.name} width={56} height={56} loading="lazy" className="w-14 h-14 object-contain" />
                  </div>
                  <span className="text-xs text-muted-foreground font-medium group-hover:text-accent transition-colors">{badge.name}</span>
                  <span className="text-[11px] text-muted-foreground/80 mt-1">Issued by {badge.issuer}</span>
                </a>
              ))}
            </div>
          </div>
        </div>
      </section>

      <div className="glow-line max-w-5xl mx-auto" />

      <CredentialBadgeStrip />
    </div>
  );
}
