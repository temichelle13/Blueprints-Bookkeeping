import { Award, Shield, Fingerprint, BrainCircuit, GraduationCap, BadgeCheck } from "lucide-react";
import { Link } from "wouter";
import { usePageTitle } from "@/hooks/use-page-title";
import { SEO } from "@/components/SEO";
import { CredentialBadgeStrip } from "@/components/TrustSignals";

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
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-display font-bold text-white mb-2">Tea Larson-Hetrick</h2>
          <p className="text-accent font-semibold mb-8 text-lg">Founder & Principal Consultant</p>

          <div className="space-y-5 text-foreground leading-relaxed mb-12">
            <p>
              Tea brings a rare intersection of enterprise financial management, software engineering, and cybersecurity to Blueprints & Bookkeeping, LLC.
            </p>
            <p>
              With deep experience in financial operations for complex, multi-entity businesses, Tea understands exactly where standard accounting breaks down. Generalist bookkeepers hit a "complexity ceiling," leaving founders with messy historical data, mismatched records, and a lack of strategic foresight.
            </p>
            <p className="text-muted-foreground border-l-2 border-accent/30 pl-4 italic">
              Standard accounting firms are excellent for annual compliance, but they vanish during the first-quarter tax season. Blueprints & Bookkeeping intentionally excludes in-house tax preparation&mdash;eliminating the seasonal blind spot to remain a proactive, dedicated operational resource 12 months a year.
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
              {[
                { name: "Cybersecurity Fundamentals", issuer: "IBM", img: `${import.meta.env.BASE_URL}images/badge-ibm-cybersecurity.png`, url: "https://www.credly.com/badges/44179f58-1ad3-4b02-9f5d-6bf2258a3c49/public_url" },
                { name: "Cybersecurity with Capstone", issuer: "IBM", img: `${import.meta.env.BASE_URL}images/badge-ibm-cybersecurity-capstone.png`, url: "https://www.credly.com/badges/abc7661b-7147-4ccf-8fce-926ac6d32572/public_url" },
                { name: "IBM Granite Data Classification", issuer: "IBM", img: `${import.meta.env.BASE_URL}images/badge-ibm-granite.png`, url: "https://www.credly.com/badges/e428bd41-b6fa-4a0e-9c90-4a6cbbc2d128/public_url" },
                { name: "Google AI Essentials", issuer: "Google", img: `${import.meta.env.BASE_URL}images/badge-google-ai.png`, url: "https://www.credly.com/badges/97b2b906-189e-4921-ba7c-30f4f3334c8f/public_url" },
              ].map((badge) => (
                <a key={badge.name} href={badge.url} target="_blank" rel="noopener noreferrer" className="flex flex-col items-center text-center group">
                  <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-600/20 to-blue-800/20 border border-white/[0.06] flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
                    <img src={badge.img} alt={badge.name} width={56} height={56} loading="lazy" className="w-14 h-14 object-contain" />
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
            <h3 className="font-bold text-white mb-6 text-lg">Verified Digital Badges</h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
              {[
                {
                  name: "QuickBooks ProAdvisor Gold",
                  issuer: "Intuit",
                  img: "/images/proadvisor-gold-badge.png",
                  fallbackColor: "from-green-600/20 to-green-800/20",
                  verificationNote: "Verification available on request"
                },
                {
                  name: "CEH v12 Certified",
                  issuer: "EC-Council",
                  img: "",
                  fallbackColor: "from-red-600/20 to-red-800/20",
                  verificationNote: "Verification available on request"
                },
                {
<<<<<<< codex/update-about.tsx-credential-information
                  name: "Advanced Crypto Accounting Certified",
=======
                  name: "Crypto Accounting Certified",
                  issuer: "Crypto Accounting Academy",
>>>>>>> master
                  img: "",
                  fallbackColor: "from-orange-600/20 to-orange-800/20",
                  verificationNote: "Verification available on request"
                },
              ].map((badge, i) => (
                <div key={i} className="flex flex-col items-center text-center group">
                  <div className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${badge.fallbackColor} border border-white/[0.06] flex items-center justify-center mb-3 group-hover:scale-105 transition-transform`}>
                    {badge.img ? (
                      <img src={badge.img} alt={badge.name} width={56} height={56} loading="lazy" className="w-14 h-14 object-contain" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; (e.target as HTMLImageElement).nextElementSibling && ((e.target as HTMLImageElement).nextElementSibling as HTMLElement).classList.remove('hidden'); }} />
                    ) : null}
                    <Shield className={`w-8 h-8 text-accent ${badge.img ? 'hidden' : ''}`} />
                  </div>
                  <span className="text-xs text-muted-foreground font-medium group-hover:text-accent transition-colors">{badge.name}</span>
<<<<<<< codex/update-about.tsx-credential-information
                  <span className="text-[11px] text-muted-foreground/80 mt-1">{badge.verificationNote}</span>
                </div>
=======
                  <span className="text-[11px] text-muted-foreground/80">Issued by {badge.issuer}</span>
                </a>
>>>>>>> master
              ))}
            </div>
          </div>

          <Link
            href="/contact"
            className="inline-block px-8 py-4 bg-accent text-white font-semibold rounded-xl hover:shadow-xl hover:shadow-accent/20 hover:-translate-y-0.5 transition-all duration-300"
          >
            Work with Tea
          </Link>
        </div>
      </section>

      <div className="glow-line max-w-5xl mx-auto" />

      <CredentialBadgeStrip />
    </div>
  );
}
